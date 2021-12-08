import React, { useEffect, useState, useCallback } from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isMobileOnly } from 'react-device-detect'
import {
  selectOrder,
  setRevenueCenter,
  selectAutoSelect,
  resetOrderType,
  fetchRevenueCenters,
  selectRevenueCenters,
  resetCheckout,
} from '@open-tender/redux'
import { makeDisplayedRevenueCenters, renameLocation } from '@open-tender/js'
import { ButtonLink, ButtonStyled, Preface } from '@open-tender/components'

import { selectConfig, selectSettings, selectGeoLatLng } from '../../../slices'
import {
  Container,
  Loading,
  PageContent,
  PageTitle,
  RevenueCenter,
} from '../..'
import styled from '@emotion/styled'
import iconMap from '../../iconMap'

const RevenueCentersSelectView = styled('div')`
  position: relative;
  z-index: 1;
  flex-grow: 1;
  background-color: ${(props) => props.theme.bgColors.primary};
  // padding: ${(props) => props.theme.layout.padding} 0;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 44rem 0 0;
    padding: 3rem 0 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 7.2rem 0 ${(props) => (props.showMap ? '25rem' : '0')};
    padding: 1rem 0 0;
    transition: all 0.25s ease;
    transform: translateY(${(props) => (props.showMap ? '25rem' : '0')});
  }
`

const RevenueCentersSelectShowMap = styled('div')`
  display: none;
  width: 100%;
  margin: 0.5rem 0 1rem;
  text-align: center;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: block;
  }

  button {
    display: inline-block;
    padding: 0.5rem 0;
  }

  span {
    pointer-events: none;
    display: block;
    line-height: 1;
    color: ${(props) => props.theme.links.primary.color};
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const RevenueCentersSelectList = styled('ul')`
  margin: 0 0 ${(props) => props.theme.layout.margin};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0 0 ${(props) => props.theme.layout.marginMobile};
  }

  & > li {
    margin: ${(props) => props.theme.layout.padding} 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: ${(props) => props.theme.layout.paddingMobile} 0 0;
    }
  }
`

const RevenueCentersSelect = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [showMap, setShowMap] = useState(false)
  const { revenueCenters: rcConfig } = useSelector(selectConfig)
  const { maxDistance, locationName } = useSelector(selectSettings)
  const geoLatLng = useSelector(selectGeoLatLng)
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const { serviceType, orderType, isOutpost, address, requestedAt } =
    useSelector(selectOrder)
  const coords = address || geoLatLng
  const autoSelect = useSelector(selectAutoSelect)
  const [title, setTitle] = useState(rcConfig.title)
  const [msg, setMsg] = useState(rcConfig.subtitle)
  const [error, setError] = useState(null)
  const [displayedRevenueCenters, setDisplayedRevenueCenters] = useState([])
  const isLoading = loading === 'pending'
  const missingAddress = serviceType === 'DELIVERY' && !address
  const hasCount = displayedRevenueCenters && displayedRevenueCenters.length > 0
  const showRevenueCenters = hasCount && !isLoading && !error && !missingAddress
  const names = locationName[isOutpost ? 'OUTPOST' : serviceType]
  const renamedTitle = renameLocation(title, names)
  const renamedError = renameLocation(error, names)
  const renamedMsg = renameLocation(msg, names)

  useEffect(() => {
    if (orderType) {
      let params = { type: orderType }
      if (isOutpost) params = { ...params, is_outpost: true }
      if (coords) params = { ...params, lat: coords.lat, lng: coords.lng }
      if (orderType === 'CATERING' && requestedAt) {
        params = { ...params, requestedAt }
      }
      dispatch(fetchRevenueCenters(params))
    }
  }, [orderType, isOutpost, coords, requestedAt, dispatch])

  const autoRouteCallack = useCallback(
    (revenueCenter) => {
      dispatch(setRevenueCenter(revenueCenter))
      return history.push(`/menu/${revenueCenter.slug}`)
    },
    [dispatch, history]
  )

  useEffect(() => {
    const { title, msg, error, displayed } = makeDisplayedRevenueCenters(
      revenueCenters,
      serviceType,
      address,
      geoLatLng,
      maxDistance
    )
    const count = displayed ? displayed.length : 0
    if (count && autoSelect && !error && !missingAddress) {
      autoRouteCallack(displayed[0])
    } else {
      setTitle(title)
      setMsg(msg)
      setError(error)
      setDisplayedRevenueCenters(displayed)
    }
  }, [
    revenueCenters,
    serviceType,
    address,
    geoLatLng,
    maxDistance,
    autoSelect,
    autoRouteCallack,
    missingAddress,
  ])

  const handleStartOver = () => {
    dispatch(resetOrderType())
    dispatch(resetCheckout())
    history.push(`/`)
  }

  return (
    <RevenueCentersSelectView showMap={showMap}>
      <Container>
        {isLoading ? (
          <PageContent>
            <Loading text="Retrieving nearest locations..." />
          </PageContent>
        ) : (
          <>
            <PageTitle>
              <RevenueCentersSelectShowMap>
                <ButtonLink onClick={() => setShowMap(!showMap)}>
                  <Preface>{showMap ? 'Hide Map' : 'Show Map'}</Preface>
                </ButtonLink>
              </RevenueCentersSelectShowMap>
              <h2>{renamedTitle}</h2>
              <p>{renamedError || renamedMsg}</p>
            </PageTitle>
            {showRevenueCenters ? (
              <RevenueCentersSelectList>
                {displayedRevenueCenters.map((revenueCenter) => (
                  <li
                    id={revenueCenter.slug}
                    key={revenueCenter.revenue_center_id}
                  >
                    <RevenueCenter
                      revenueCenter={revenueCenter}
                      showImage={!isMobileOnly}
                    />
                  </li>
                ))}
              </RevenueCentersSelectList>
            ) : (
              <div style={{ margin: '3rem auto 0', textAlign: 'center' }}>
                <ButtonStyled
                  icon={iconMap.RefreshCw}
                  onClick={handleStartOver}
                >
                  Start Over
                </ButtonStyled>
              </div>
            )}
          </>
        )}
      </Container>
    </RevenueCentersSelectView>
  )
}

RevenueCentersSelect.displayName = 'RevenueCentersSelect'
RevenueCentersSelect.propTypes = {
  revenueCenters: propTypes.array,
  setCenter: propTypes.func,
  maps: propTypes.object,
  map: propTypes.object,
  sessionToken: propTypes.object,
  autocomplete: propTypes.object,
}
export default RevenueCentersSelect
