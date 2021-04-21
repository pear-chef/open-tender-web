import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import { fetchRevenueCenters, selectRevenueCenters } from '@open-tender/redux'

import { selectBrand, selectConfig } from '../../../slices'
import { Account, Deals as DealsButton } from '../../buttons'
import {
  Content,
  Header,
  HeaderLogo,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageTitle,
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

const checkMatch = (value, revenueCenter) => {
  if (!revenueCenter) return false
  let { name, address } = revenueCenter
  name = name.toLowerCase()
  let street = address ? address.street || '' : ''
  street = street ? street.toLowerCase() : ''
  const lower = value.toLowerCase()
  return name.includes(lower) || street.includes(lower)
}

const Buildings = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [filtered, setFiltered] = useState(null)
  const brand = useSelector(selectBrand)
  const { revenueCenters: config } = useSelector(selectConfig)
  const { has_deals } = brand
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const displayed = filtered || revenueCenters || []
  console.log(filtered)

  useEffect(() => {
    dispatch(fetchRevenueCenters({ type: 'OLO' }))
  }, [dispatch])

  // useEffect(() => {
  //   if (loading === 'idle' && !filtered) {
  //     setFiltered(revenueCenters)
  //   }
  // }, [loading, revenueCenters, filtered, setFiltered])

  useEffect(() => {
    console.log(value)
    if (value) {
      const matching = revenueCenters.filter((i) => checkMatch(value, i))
      setFiltered(matching)
    } else {
      setFiltered(null)
    }
  }, [value, revenueCenters, setFiltered])

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
          <PageContainer style={{ maxWidth: '100%' }}>
            <PageTitle {...config}>
              <BuildingsInput value={value} setValue={setValue} />
            </PageTitle>
            {displayed.length > 0 ? (
              <BuildingsView>
                {displayed.map((revenueCenter) => (
                  <Building
                    key={revenueCenter.revenue_center_id}
                    revenueCenter={revenueCenter}
                  />
                ))}
              </BuildingsView>
            ) : loading === 'pending' ? (
              <PageContent>
                <Loading text="Retrieving nearest locations..." />
              </PageContent>
            ) : null}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Buildings
