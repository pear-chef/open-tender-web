import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import {
  selectAnnouncementsPage,
  fetchAnnouncementPage,
} from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectConfig, closeModal, selectBrand } from '../../../slices'
import { AppContext } from '../../../App'
import { Account, Deals as DealsButton, OrderNow } from '../../buttons'
import {
  Content,
  DealsSection,
  Greeting,
  HeaderLogo,
  Header,
  Main,
  PageContainer,
  PageHero,
} from '../..'
import GuestActions from './GuestActions'

const GuestContent = styled('div')`
  line-height: ${(props) => props.theme.lineHeight};
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  margin: 2.5rem 0;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 2rem 0;
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
    text-align: center;
  }

  p {
    margin: 0.5em 0;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`

// const GuestLinks = () => (
//   <p>
//     <Link to="/gift-cards">Purchase gift cards</Link> |{' '}
//     <Link to="/donations">make a donation</Link>
//     {/* <Link to="/contact">get in touch</Link> */}
//   </p>
// )

const Guest = () => {
  const dispatch = useDispatch()
  const { windowRef } = useContext(AppContext)
  const announcements = useSelector(selectAnnouncementsPage('HOME'))
  const brand = useSelector(selectBrand)
  const { has_deals } = brand
  const { home } = useSelector(selectConfig)
  const { background, mobile, content, title, subtitle, showHero } = home
  // const footnote = "Hint: you don't need an account to place an order."
  const hasContent = !!(content && content.length && content[0].length)
  const hasPageContent = hasContent || has_deals

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
    dispatch(closeModal())
  }, [windowRef, dispatch])

  useEffect(() => {
    dispatch(fetchAnnouncementPage('HOME'))
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>{brand.title}</title>
      </Helmet>
      <Content>
        <Header
          left={<HeaderLogo />}
          right={
            <>
              {isBrowser && has_deals && <DealsButton />}
              <Account />
              {isBrowser && <OrderNow />}
            </>
          }
        />
        <Main>
          <PageHero
            announcements={announcements}
            imageUrl={isBrowser ? background : mobile}
            showHero={showHero}
          >
            <Greeting
              title={title}
              subtitle={subtitle}
              actions={<GuestActions />}
              // footnote={footnote}
            >
              {/* <GuestLinks /> */}
            </Greeting>
          </PageHero>
          {hasPageContent && (
            <PageContainer style={{ marginTop: '0' }}>
              {has_deals && <DealsSection />}
              {hasContent && (
                <GuestContent
                  hasDeals={has_deals}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </PageContainer>
          )}
        </Main>
      </Content>
    </>
  )
}

Guest.displayName = 'Guest'
export default Guest
