import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import { fetchRevenueCenters, selectRevenueCenters } from '@open-tender/redux'
import { useGeolocation } from '@open-tender/components'

import {
  selectBrand,
  selectConfig,
  selectTheme,
  setGeoLatLng,
  setGeoError,
  setGeoLoading,
} from '../../../slices'
import { Account, Deals as DealsButton } from '../../buttons'
import {
  BackgroundImage,
  Content,
  Header,
  HeaderLogo,
  Loading,
  Main,
  PageContainer,
  PageContent,
} from '../..'
import Building from './Bulding'
import BuildingsInput from './BuildingsInput'

const BuildingsView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -1.5rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0;
  }
`

const BuildingsHero = styled('div')`
  position: relative;
  width: 100%;
  // min-height: 48rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: center;
  background-color: ${(props) => props.theme.bgColors.dark};
  padding: 6rem ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 3rem ${(props) => props.theme.layout.paddingMobile};
  }
`

const BuildingsHeroImage = styled('div')`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`

const BuildingsHeroContent = styled('div')`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 72rem;
`

const BuildingsHeroHeader = styled('div')`
  margin: 0 auto 3rem;
  text-align: center;

  h1 {
    line-height: 1;
    color: ${(props) => props.theme.colors.light};
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.h2};
    }
  }

  & > p {
    margin: 1rem 0 0;
    line-height: ${(props) => props.theme.lineHeight};
    // font-weight: ${(props) => props.theme.boldWeight};
    color: ${(props) => props.theme.colors.light};
    font-size: ${(props) => props.theme.fonts.sizes.big};
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      margin: 0.5rem 0 0;
      font-size: ${(props) => props.theme.fonts.sizes.main};
    }
  }
`

const checkMatch = (value, revenueCenter) => {
  if (!revenueCenter) return false
  let { name, address } = revenueCenter
  name = name.toLowerCase()
  let street = address ? address.street || '' : ''
  let postal_code = address ? address.postal_code || '' : ''
  street = street ? street.toLowerCase() : ''
  const lower = value.toLowerCase()
  return (
    name.includes(lower) ||
    street.includes(lower) ||
    postal_code.includes(lower)
  )
}

const Buildings = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(null)
  const [filtered, setFiltered] = useState(null)
  const theme = useSelector(selectTheme)
  const brand = useSelector(selectBrand)
  const { revenueCenters: config } = useSelector(selectConfig)
  const { title, subtitle, background } = config
  const { has_deals } = brand
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const { geoLatLng, geoError } = useGeolocation()
  const noMatches = value && filtered && filtered.length === 0
  const matching = useMemo(
    () => (open ? open.filter((i) => checkMatch(value, i)) : null),
    [open, value]
  )
  const displayed = filtered || open || []

  useEffect(() => {
    dispatch(fetchRevenueCenters({ type: 'OLO' }))
  }, [dispatch])

  useEffect(() => {
    if (loading === 'idle' && !open) {
      const exclude = ['CLOSED', 'HIDDEN']
      const openRcs = revenueCenters.filter((i) => !exclude.includes(i.status))
      setOpen(openRcs)
    }
  }, [loading, revenueCenters, open, setOpen])

  // useEffect(() => {
  //   if (value) {
  //     setFiltered([])
  //     setTimeout(() => {
  //       const matching = open.filter((i) => checkMatch(value, i))
  //       setFiltered(matching)
  //     }, 250)
  //     // const matching = open.filter((i) => checkMatch(value, i))
  //     // setFiltered(matching)
  //   } else {
  //     setFiltered(null)
  //   }
  // }, [value, open, setFiltered])

  useEffect(() => {
    if (matching) {
      setFiltered([])
      setTimeout(() => {
        setFiltered(matching)
      }, 250)
    } else {
      setFiltered(null)
    }
  }, [matching])

  useEffect(() => {
    dispatch(setGeoLoading())
  }, [dispatch])

  useEffect(() => {
    if (geoLatLng) {
      dispatch(setGeoLatLng(geoLatLng))
    } else if (geoError) {
      dispatch(setGeoError(geoError))
    }
  }, [geoLatLng, geoError, dispatch])

  return (
    <>
      <Helmet>
        <title>Find Your Building | {brand.title}</title>
      </Helmet>
      <Content>
        <Header
          left={<HeaderLogo />}
          right={
            <>
              {isBrowser && has_deals && <DealsButton />}
              <Account />
            </>
          }
        />
        <Main>
          <BuildingsHero>
            <BuildingsHeroImage>
              <BackgroundImage
                imageUrl={background}
                loaderColor={theme.bgColors.tertiary}
              />
            </BuildingsHeroImage>
            <BuildingsHeroContent>
              <BuildingsHeroHeader>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </BuildingsHeroHeader>
              <BuildingsInput value={value} setValue={setValue} />
            </BuildingsHeroContent>
          </BuildingsHero>
          <PageContainer style={{ maxWidth: '140rem', minHeight: '136rem' }}>
            {!open && loading === 'pending' ? (
              <PageContent>
                <Loading text="Retrieving nearest locations..." />
              </PageContent>
            ) : null}
            {noMatches ? (
              <PageContent>
                <p>There are no buildings matching your search.</p>
              </PageContent>
            ) : null}
            <BuildingsView>
              {/* <TransitionGroup component={null}>
                {displayed.map((revenueCenter) => (
                  <CSSTransition
                    key={revenueCenter.revenue_center_id}
                    classNames="fade-scale"
                    timeout={500}
                  >
                    <Building revenueCenter={revenueCenter} />
                  </CSSTransition>
                ))}
              </TransitionGroup> */}
              {displayed.map((revenueCenter) => (
                <Building
                  key={revenueCenter.revenue_center_id}
                  revenueCenter={revenueCenter}
                />
              ))}
            </BuildingsView>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Buildings
