import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isMobile } from 'react-device-detect'
import { animateScroll as scroll } from 'react-scroll'
import {
  selectOrder,
  selectMenuVars,
  selectGroupOrderClosed,
  selectGroupOrder,
  selectMenu,
  selectSelectedAllergenNames,
  selectCustomer,
  selectDeals,
  resetRevenueCenter,
  fetchRevenueCenter,
  fetchMenu,
  fetchAllergens,
  fetchDeals,
  fetchAnnouncementPage,
  selectAnnouncementsPage,
  fetchCustomerLoyalty,
  selectCustomerPointsProgram,
} from '@open-tender/redux'
import { makeValidDeals } from '@open-tender/js'

import { maybeRefreshVersion } from '../../../app/version'
import {
  selectBrand,
  selectConfig,
  selectTopOffset,
  setTopOffset,
} from '../../../slices'
import { AppContext } from '../../../App'
import { Content, Main, ScreenreaderTitle } from '../..'
import MenuContent from './MenuContent'
import MenuHeader from './MenuHeader'
import MenuMobileMenu from './MenuMobileMenu'

export const MenuContext = createContext(null)

const MenuPage = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { windowRef } = useContext(AppContext)
  const topOffset = useSelector(selectTopOffset)
  const [init, setInit] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const { title: siteTitle, has_deals } = useSelector(selectBrand)
  const { menu: menuConfig } = useSelector(selectConfig)
  const { loadingMessage } = menuConfig
  const announcements = useSelector(selectAnnouncementsPage('MENU'))
  const order = useSelector(selectOrder)
  const { orderType, revenueCenter } = order
  const pointsProgram = useSelector(selectCustomerPointsProgram(orderType))
  const { revenueCenterId, serviceType, requestedAt } =
    useSelector(selectMenuVars)
  let { revenueCenters, categories, soldOut, error, loading } =
    useSelector(selectMenu)
  const isLoading = loading === 'pending'
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const groupOrderClosed = useSelector(selectGroupOrderClosed)
  const { cartGuest } = useSelector(selectGroupOrder)
  const { profile } = useSelector(selectCustomer)
  const { customer_id } = profile || {}
  const { entities } = useSelector(selectDeals)
  const deals = has_deals && entities.length ? entities : null
  const validDeals = useMemo(
    () => makeValidDeals(deals, orderType, serviceType, revenueCenterId),
    [deals, orderType, serviceType, revenueCenterId]
  )

  useEffect(() => {
    if (init) {
      // windowRef.current.scrollTop = topOffset || 0
      scroll.scrollTo(topOffset || 0, {
        container: windowRef.current,
        duration: 0,
        smooth: false,
      })
    }
    maybeRefreshVersion()
  }, [windowRef, topOffset, init])

  useEffect(() => {
    if (!revenueCenterId) {
      return history.push('/locations')
    } else if (groupOrderClosed) {
      return history.push('/review')
    } else if (topOffset) {
      dispatch(setTopOffset(null))
      setInit(false)
    } else if (init) {
      dispatch(fetchAllergens())
      dispatch(fetchRevenueCenter(revenueCenterId))
      dispatch(fetchMenu({ revenueCenterId, serviceType, requestedAt }))
      dispatch(fetchAnnouncementPage('MENU'))
    }
  }, [
    revenueCenterId,
    orderType,
    serviceType,
    requestedAt,
    dispatch,
    history,
    groupOrderClosed,
    topOffset,
    init,
  ])

  useEffect(() => {
    if (has_deals && !isLoading && !cartGuest) {
      dispatch(fetchDeals())
    }
  }, [has_deals, customer_id, isLoading, dispatch, cartGuest])

  useEffect(() => {
    if (init && !topOffset && customer_id) {
      dispatch(fetchCustomerLoyalty())
    }
  }, [init, topOffset, customer_id, dispatch])

  const changeRevenueCenter = () => {
    dispatch(resetRevenueCenter())
  }

  return (
    <>
      <Helmet>
        <title>Menu | {siteTitle}</title>
      </Helmet>
      <Content>
        <MenuHeader showMenu={showMenu} setShowMenu={setShowMenu} />
        <Main>
          <MenuContext.Provider
            value={{
              menuConfig,
              revenueCenter,
              categories,
              revenueCenters,
              changeRevenueCenter,
              soldOut,
              allergenAlerts,
              isLoading,
              loadingMessage,
              error,
              deals: validDeals,
              announcements,
              pointsProgram,
            }}
          >
            {isMobile && (
              <MenuMobileMenu
                order={order}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
              />
            )}
            <ScreenreaderTitle>Menu</ScreenreaderTitle>
            <MenuContent />
          </MenuContext.Provider>
        </Main>
      </Content>
    </>
  )
}

MenuPage.displayName = 'MenuPage'
export default MenuPage
