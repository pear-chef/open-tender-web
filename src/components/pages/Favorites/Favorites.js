import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  selectCustomerFavorites,
  fetchCustomerFavorites,
  selectCustomerOrders,
  fetchMenuItems,
} from '@open-tender/redux'
import { getLastOrder, makeDisplayItem } from '@open-tender/js'

import { maybeRefreshVersion } from '../../../app/version'
import { selectConfig, selectBrand } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  ItemCards,
  HeaderUser,
  Loading,
  Main,
  OrderCardItem,
  PageTitle,
  PageError,
  PageContainer,
  PageContent,
} from '../..'
import AccountTabs from '../Account/AccountTabs'

const Favorites = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { entities, loading, error } = useSelector(selectCustomerFavorites)
  const { entities: orders } = useSelector(selectCustomerOrders)
  const lastOrder = useMemo(() => getLastOrder(orders), [orders])
  const [favorites, setFavorites] = useState(entities)
  const { title: siteTitle } = useSelector(selectBrand)
  const { favorites: config } = useSelector(selectConfig)
  const { auth } = useSelector(selectCustomer)
  const isLoading = loading === 'pending'
  const items = favorites.map((i) => ({ ...i.item }))
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    if (error) windowRef.current.scrollTop = 0
  }, [error, windowRef])

  useEffect(() => {
    dispatch(fetchCustomerFavorites())
  }, [dispatch])

  useEffect(() => {
    const favs = entities.map((i) => ({ ...i, item: makeDisplayItem(i.item) }))
    setFavorites(favs)
  }, [entities])

  useEffect(() => {
    if (lastOrder) {
      const { revenue_center, service_type: serviceType } = lastOrder
      const { revenue_center_id: revenueCenterId } = revenue_center
      dispatch(fetchMenuItems({ revenueCenterId, serviceType }))
    }
  }, [lastOrder, dispatch])

  return auth ? (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderUser />
        <Main>
          {!isBrowser && <AccountTabs />}
          <PageContainer style={{ maxWidth: '100%' }}>
            <PageTitle {...config} />
            <PageError error={error} />
            {items.length ? (
              <ItemCards
                items={items}
                delay={0}
                sequential={false}
                renderItem={(props) => <OrderCardItem {...props} />}
              />
            ) : (
              <PageContent>
                {isLoading ? (
                  <Loading text="Retrieving your favorites..." />
                ) : (
                  <p>
                    Looks like you don't have any favorites yet. Please visit
                    the Recent Orders page to add some.
                  </p>
                )}
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  ) : null
}

Favorites.displayName = 'Favorites'
export default Favorites
