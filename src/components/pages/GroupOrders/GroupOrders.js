import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  selectCustomerGroupOrders,
  fetchCustomerGroupOrders,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectAccountConfig, selectBrand } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Container,
  Content,
  HeaderUser,
  Loading,
  Main,
  PageContent,
  PageError,
  PageTitle,
} from '../..'
import OrdersList from '../Orders/OrdersList'
import AccountTabs from '../Account/AccountTabs'

const GroupOrders = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const orders = useSelector(selectCustomerGroupOrders)
  const { entities: groupOrders, loading, error } = orders
  const { title: siteTitle } = useSelector(selectBrand)
  const config = useSelector(selectAccountConfig)
  const { auth } = useSelector(selectCustomer)
  const isLoading = loading === 'pending'
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchCustomerGroupOrders())
  }, [dispatch])

  if (!auth) return null

  return (
    <>
      <Helmet>
        <title>Order History | {siteTitle}</title>
      </Helmet>
      <Content>
        <HeaderUser />
        <Main bgColor="secondary">
          {!isBrowser && <AccountTabs />}
          <Container>
            <PageTitle {...config.groupOrders} />
            <PageContent>
              <PageError error={error} />
              {groupOrders.length ? (
                <OrdersList orders={groupOrders} isGroup={true} />
              ) : isLoading ? (
                <Loading text="Retrieving your group orders..." />
              ) : (
                <p>Looks like you don't have any group orders yet</p>
              )}
            </PageContent>
          </Container>
        </Main>
      </Content>
    </>
  )
}

GroupOrders.displayName = 'GroupOrders'
export default GroupOrders
