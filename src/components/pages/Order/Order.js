import React, { useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCustomer,
  fetchCustomerOrder,
  selectCustomerOrder,
} from '@open-tender/redux'
import { isMobile } from 'react-device-detect'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  HeaderUser,
  LinkIcon,
  Main,
  Order as OrderSummary,
  PageContainer,
  PageTitle,
} from '../..'
import AccountTabs from '../Account/AccountTabs'
import iconMap from '../../iconMap'

const Order = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { id: orderId } = useParams()
  const { title: siteTitle } = useSelector(selectBrand)
  const { auth } = useSelector(selectCustomer)
  const customerOrder = useSelector(selectCustomerOrder)
  const title = `Order #${orderId}`
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchCustomerOrder(orderId))
  }, [dispatch, orderId])

  return (
    <>
      <Helmet>
        <title>
          {title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderUser />
        <Main>
          {isMobile && <AccountTabs />}
          <PageContainer>
            <PageTitle>
              <LinkIcon
                to="/orders"
                icon={iconMap.ArrowLeft}
                text="Back to all orders"
                isBefore={true}
              />
            </PageTitle>
            <OrderSummary {...customerOrder} />
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Order.displayName = 'Order'
export default Order
