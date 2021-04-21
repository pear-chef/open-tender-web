import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import { Helmet } from 'react-helmet'
import {
  selectCustomer,
  fetchCustomer,
  fetchCustomerCreditCards,
  selectAnnouncementsPage,
  fetchAnnouncementPage,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig, closeModal } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  Greeting,
  HeaderLogo,
  Header,
  Main,
  PageContainer,
  PageHero,
} from '../..'
import { Logout, OrderNow } from '../../buttons'
import AccountActions from './AccountActions'
import AccountScan from './AccountScan'
import AccountTabs from './AccountTabs'
import AccountOrders from './AccountOrders'
import AccountLoyalty from './AccountLoyalty'
import AccountGroupOrders from './AccountGroupOrders'
import AccountDeals from './AccountDeals'
import { useTheme } from '@emotion/react'

// const AccountLinks = () => (
//   <p>
//     <Link to="/gift-cards">Purchase gift cards</Link> |{' '}
//     <Link to="/donations">make a donation</Link>
//     {/* <Link to="/contact">get in touch</Link> */}
//   </p>
// )

const Account = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const theme = useTheme()
  const { navHeightMobile } = theme.layout
  const announcements = useSelector(selectAnnouncementsPage('ACCOUNT'))
  const { title: siteTitle } = useSelector(selectBrand)
  const { account: accountConfig } = useSelector(selectConfig)
  const { background, mobile, title, showHero } = accountConfig
  const { auth, profile } = useSelector(selectCustomer)
  const pageTitle = profile ? `${title}, ${profile.first_name}` : ''
  const token = auth ? auth.access_token : null
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
    dispatch(closeModal())
  }, [windowRef, dispatch])

  useEffect(() => {
    if (!token) return history.push('/')
    dispatch(fetchAnnouncementPage('ACCOUNT'))
    dispatch(fetchCustomer())
    dispatch(fetchCustomerCreditCards(true))
  }, [token, dispatch, history])

  return profile ? (
    <>
      <Helmet>
        <title>Welcome Back | {siteTitle}</title>
      </Helmet>
      <Content>
        <Header
          left={<HeaderLogo />}
          right={
            isBrowser ? (
              <>
                <AccountTabs />
                <OrderNow />
              </>
            ) : (
              <>
                <AccountScan />
                <OrderNow />
                <Logout />
              </>
            )
          }
        />
        <Main>
          {!isBrowser && <AccountTabs />}
          <PageHero
            announcements={announcements}
            imageUrl={isBrowser ? background : mobile}
            showHero={showHero}
            style={isBrowser ? null : { paddingBottom: navHeightMobile }}
          >
            <Greeting
              title={pageTitle}
              // subtitle={subtitle}
              actions={<AccountActions />}
            >
              {/* <AccountLinks /> */}
            </Greeting>
          </PageHero>
          <PageContainer
            style={
              isBrowser
                ? { marginTop: '0' }
                : { marginTop: `-${navHeightMobile}` }
            }
          >
            <AccountLoyalty />
            <AccountGroupOrders />
            <AccountOrders />
            <AccountDeals />
          </PageContainer>
        </Main>
      </Content>
    </>
  ) : null
}

Account.displayName = 'Account'
export default Account
