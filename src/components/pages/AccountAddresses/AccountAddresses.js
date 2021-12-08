import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  fetchCustomerAddresses,
  selectCustomerAddresses,
} from '@open-tender/redux'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import Addresses from './Addresses'
import {
  AccountBack,
  Content,
  HeaderUser,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageTitle,
} from '../..'
import { AppContext } from '../../../App'
import AccountTabs from '../Account/AccountTabs'

const AccountAddresses = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { title: siteTitle } = useSelector(selectBrand)
  const { addresses: config } = useSelector(selectConfig)
  const { auth } = useSelector(selectCustomer)
  const { entities, loading } = useSelector(selectCustomerAddresses)
  const isLoading = loading === 'pending'
  const limit = 50
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchCustomerAddresses(limit))
  }, [dispatch])

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
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle {...config} preface={<AccountBack />} />
            {entities.length ? (
              <>
                <Addresses addresses={entities} isLoading={isLoading} />
                <PageContent>
                  <AccountBack />
                </PageContent>
              </>
            ) : (
              <PageContent>
                {isLoading ? (
                  <Loading text="Retrieving your order history..." />
                ) : (
                  <p>
                    Looks like you haven't added any addresses yet. Please place
                    an order to add one.
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

AccountAddresses.displayName = 'AccountAddresses'
export default AccountAddresses
