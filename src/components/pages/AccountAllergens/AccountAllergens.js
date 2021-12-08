import React, { useEffect, useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import {
  fetchAllergens,
  selectAllergens,
  selectCustomer,
  selectCustomerAllergens,
  setSelectedAllergens,
  updateCustomerAllergens,
} from '@open-tender/redux'
import { AllergenForm, FormWrapper } from '@open-tender/components'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import { AppContext } from '../../../App'
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
import styled from '@emotion/styled'
import AccountTabs from '../Account/AccountTabs'

const AllergenFormView = styled('div')`
  label {
    padding: 1.25rem 0 1rem !important;

    & > span > span:last-of-type {
      text-align: right;
      line-height: 1;
    }
  }
`

const AccountAllergens = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { title: siteTitle } = useSelector(selectBrand)
  const { auth } = useSelector(selectCustomer)
  const { allergens: config } = useSelector(selectConfig)
  const brandAllergens = useSelector(selectAllergens)
  const customerAllergens = useSelector(selectCustomerAllergens)
  const isLoading =
    brandAllergens.loading === 'pending' ||
    customerAllergens.loading === 'pending'
  const error = brandAllergens.error || customerAllergens.error
  const setAllergens = useCallback(
    (data) => dispatch(setSelectedAllergens(data)),
    [dispatch]
  )
  const updateAllergens = useCallback(
    (data) => dispatch(updateCustomerAllergens(data)),
    [dispatch]
  )
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    dispatch(fetchAllergens())
  }, [dispatch])

  return (
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
            <PageContent>
              {brandAllergens.entities.length ? (
                <>
                  <FormWrapper>
                    <AllergenFormView>
                      <AllergenForm
                        allergens={brandAllergens.entities}
                        selectedAllergens={customerAllergens.entities}
                        isLoading={isLoading}
                        error={error}
                        setAllergens={setAllergens}
                        updateAllergens={updateAllergens}
                      />
                    </AllergenFormView>
                  </FormWrapper>
                  <AccountBack />
                </>
              ) : isLoading ? (
                <Loading text="Retrieving your order history..." />
              ) : (
                <p>Allergens aren't currently listed on our menu.</p>
              )}
            </PageContent>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

AccountAllergens.displayName = 'AccountAllergens'
export default AccountAllergens
