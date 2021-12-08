import React, { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Minus, Plus } from 'react-feather'
import { Link } from 'react-router-dom'
import { GiftCardsForm, FormWrapper } from '@open-tender/components'
import {
  selectGiftCards,
  resetGiftCards,
  purchaseGiftCards,
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

const iconMap = {
  plus: <Plus size={null} />,
  minus: <Minus size={null} />,
}

const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY

const GiftCards = () => {
  const dispatch = useDispatch()
  const { giftCards: config } = useSelector(selectConfig)
  const { giftCards: includeRecaptcha } = useSelector(selectRecaptcha)
  const { title } = useSelector(selectBrand)
  const { profile: customer } = useSelector(selectCustomer) || {}
  const creditCards = useSelector(selectCustomerCreditCardsForPayment)
  const { success, loading, error, giftCards } = useSelector(selectGiftCards)
  const purchase = useCallback(
    (data, callback) => dispatch(purchaseGiftCards(data, callback)),
    [dispatch]
  )
  const reset = useCallback(() => dispatch(resetGiftCards()), [dispatch])
  const showAlert = useCallback((obj) => dispatch(setAlert(obj)), [dispatch])
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    dispatch(fetchCustomerCreditCards())
  }, [dispatch, customer])

  useEffect(() => {
    return () => dispatch(resetGiftCards())
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {title}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle {...config} />
            <FormWrapper>
              <GiftCardsForm
                customer={customer}
                creditCards={creditCards}
                purchase={purchase}
                setAlert={showAlert}
                reset={reset}
                success={success}
                purchasedCards={giftCards}
                loading={loading}
                error={error}
                iconMap={iconMap}
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

GiftCards.displayName = 'GiftCards'
export default GiftCards
