import React, { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { DonationForm, FormWrapper } from '@open-tender/components'
import {
  selectDonation,
  resetDonation,
  purchaseDonation,
  selectCustomer,
  fetchCustomerCreditCards,
  selectCustomerCreditCardsForPayment,
  setAlert,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig, selectRecaptcha } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  Main,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'

const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY

const Donations = () => {
  const dispatch = useDispatch()
  const { donations: config } = useSelector(selectConfig)
  const { donations: includeRecaptcha } = useSelector(selectRecaptcha)
  const { title: siteTitle } = useSelector(selectBrand)
  const { profile: customer } = useSelector(selectCustomer) || {}
  const creditCards = useSelector(selectCustomerCreditCardsForPayment)
  const { success, loading, error, donation } = useSelector(selectDonation)
  const { windowRef } = useContext(AppContext)
  const purchase = useCallback(
    (data, callback) => dispatch(purchaseDonation(data, callback)),
    [dispatch]
  )
  const reset = useCallback(() => dispatch(resetDonation()), [dispatch])
  const showAlert = useCallback((obj) => dispatch(setAlert(obj)), [dispatch])

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
    return () => dispatch(resetDonation())
  }, [windowRef, dispatch])

  useEffect(() => {
    dispatch(fetchCustomerCreditCards())
  }, [dispatch, customer])

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle {...config} />
            <FormWrapper>
              <DonationForm
                customer={customer}
                creditCards={creditCards}
                purchase={purchase}
                reset={reset}
                setAlert={showAlert}
                success={success}
                donation={donation}
                loading={loading}
                error={error}
                windowRef={windowRef}
                recaptchaKey={includeRecaptcha ? recaptchaKey : null}
              />
            </FormWrapper>
            {success && (
              <PageContent>
                <p>
                  {customer ? (
                    <Link to="/">Head back to your account page</Link>
                  ) : (
                    <Link to="/">
                      Head back to the home page to start an order
                    </Link>
                  )}
                </p>
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Donations.displayName = 'Donations'
export default Donations
