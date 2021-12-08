import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  fetchCustomerCreditCards,
  selectCustomerCreditCards,
} from '@open-tender/redux'
import { ButtonStyled, Message } from '@open-tender/components'
import { Helmet } from 'react-helmet'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, openModal, selectConfig } from '../../../slices'
import {
  AccountBack,
  Content,
  HeaderUser,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageSection,
  PageTitle,
  PageTitleButtons,
} from '../..'
import { AppContext } from '../../../App'
import CreditCards from './CreditCards'
import AccountTabs from '../Account/AccountTabs'
import styled from '@emotion/styled'

const CreditCardMessage = styled('div')`
  text-align: center;
  margin: ${(props) => props.theme.layout.padding} auto;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: ${(props) => props.theme.layout.paddingMobile} auto;
  }
`

const AccountCreditCards = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { windowRef } = useContext(AppContext)
  const { title: siteTitle, applePayMerchantId } = useSelector(selectBrand)
  const { auth } = useSelector(selectCustomer)
  const { creditCards: config } = useSelector(selectConfig)
  const { entities, loading } = useSelector(selectCustomerCreditCards)
  const isLoading = loading === 'pending'
  const savedCards = entities.filter((i) => i.has_profile)
  const linkedCards = entities.filter((i) => !i.has_profile)
  const hasLinkedCards = !!applePayMerchantId || linkedCards.length > 0

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    const includeLinked = true
    dispatch(fetchCustomerCreditCards(includeLinked))
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
            <PageTitle {...config} preface={<AccountBack />}>
              <PageTitleButtons>
                <ButtonStyled
                  onClick={() => dispatch(openModal({ type: 'creditCard' }))}
                >
                  Add a New Credit Card
                </ButtonStyled>
              </PageTitleButtons>
            </PageTitle>
            {savedCards.length > 0 && (
              <CreditCards creditCards={savedCards} isLoading={isLoading} />
            )}
            {hasLinkedCards && (
              <PageSection
                title="Linked Cards"
                subtitle="These are cards you have saved in either Apple Pay or
                        Google Pay that have been linked with your account for
                        loyalty recognition at the point of sale in our
                        restaurants."
              >
                <PageTitleButtons>
                  <ButtonStyled
                    onClick={() =>
                      dispatch(openModal({ type: 'creditCardLinked' }))
                    }
                  >
                    Add a New Linked Card
                  </ButtonStyled>
                </PageTitleButtons>
                {linkedCards.length > 0 && (
                  <CreditCardMessage>
                    <Message color="alert" size="small" as="div">
                      PLEASE NOTE: To pay with these cards ONLINE, use the Apple
                      Pay or Google Pay option on the checkout page.
                    </Message>
                  </CreditCardMessage>
                )}
                <CreditCards
                  creditCards={linkedCards}
                  isLoading={isLoading}
                  showDefault={false}
                />
              </PageSection>
            )}
            {entities.length === 0 ? (
              <PageContent>
                {isLoading ? (
                  <Loading text="Retrieving your cards on file..." />
                ) : (
                  <p>Looks like you haven't added any credit cards yet.</p>
                )}
              </PageContent>
            ) : (
              <PageContent>
                <AccountBack />
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

AccountCreditCards.displayName = 'AccountCreditCards'
export default AccountCreditCards
