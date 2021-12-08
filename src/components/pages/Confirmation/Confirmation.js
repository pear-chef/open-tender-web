import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import {
  selectCustomer,
  selectConfirmationOrder,
  resetConfirmation,
  resetGroupOrder,
  resetOrderFulfillment,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig, selectOptIns } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  Main,
  Order,
  OrderFulfillment,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'
import ConfirmationProfile from './ConfirmationProfile'
import ConfirmationLinks from './ConfirmationLinks'

const Confirmation = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { confirmation: config } = useSelector(selectConfig)
  const brand = useSelector(selectBrand)
  const order = useSelector(selectConfirmationOrder)
  const { order_fulfillment, order_id, revenue_center, service_type } =
    order || {}
  const { auth, profile } = useSelector(selectCustomer)
  const isNew = auth && profile && profile.order_notifications === 'NEW'
  const optIns = useSelector(selectOptIns)
  const { accepts_marketing, order_notifications } = optIns
  const showOptIns = isNew && (accepts_marketing || order_notifications)
  const hasFulfillment =
    brand.fulfillment &&
    revenue_center &&
    revenue_center.has_order_fulfillment &&
    service_type === 'PICKUP'
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!order) history.push('/')
    dispatch(resetGroupOrder())
    return () => {
      dispatch(resetConfirmation())
    }
  }, [order, auth, dispatch, history])

  useEffect(() => {
    if (!hasFulfillment) dispatch(resetOrderFulfillment())
  }, [hasFulfillment, dispatch])

  return (
    <>
      <Helmet>
        <title>Confirmation | {brand.title}</title>
      </Helmet>
      <Content>
        <HeaderDefault isLogo={false} />
        <Main>
          <PageContainer>
            <PageTitle {...config}>
              <ConfirmationLinks auth={auth} brand={brand} />
            </PageTitle>
            <PageContent style={{ margin: '2.5rem auto' }}>
              {showOptIns && <ConfirmationProfile />}
              {hasFulfillment && (
                <OrderFulfillment
                  orderId={order_id}
                  order_fulfillment={order_fulfillment}
                />
              )}
            </PageContent>
            <Order order={order} isConfirmation={true} />
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Confirmation.displayName = 'Confirmation'
export default Confirmation
