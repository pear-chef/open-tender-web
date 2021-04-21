import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import {
  selectOrder,
  setRevenueCenter,
  resetOrderType,
  fetchRevenueCenters,
  selectRevenueCenters,
  resetCheckout,
} from '@open-tender/redux'

import { selectBrand, selectConfig } from '../../../slices'
import { Account, Deals as DealsButton } from '../../buttons'
import {
  Container,
  Content,
  Header,
  HeaderLogo,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageTitle,
  RevenueCenter,
} from '../..'
import Building from './Bulding'

const BuildingsView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -1.5rem;
`

const Buildings = () => {
  const dispatch = useDispatch()
  const brand = useSelector(selectBrand)
  const { revenueCenters: config } = useSelector(selectConfig)
  const { has_deals } = brand
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const showRevenueCenters = revenueCenters.length > 0

  useEffect(() => {
    dispatch(fetchRevenueCenters({ type: 'OLO' }))
  }, [dispatch])

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
            <PageTitle {...config} />
            {showRevenueCenters ? (
              <BuildingsView>
                {revenueCenters.map((revenueCenter) => (
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
