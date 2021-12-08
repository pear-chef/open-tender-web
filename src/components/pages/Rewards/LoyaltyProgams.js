import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { animateScroll as scroll } from 'react-scroll'
import { ButtonLink } from '@open-tender/components'
import { fetchCustomerLoyalty, selectCustomerLoyalty } from '@open-tender/redux'

import {
  Loading,
  LoyaltyProgram,
  PageContent,
  PageError,
  PageSection,
} from '../..'
import styled from '@emotion/styled'
import { AppContext } from '../../../App'
import { useTheme } from '@emotion/react'
import { isMobile } from 'react-device-detect'

const LoyaltyProgamsIntro = styled('div')`
  max-width: ${(props) => props.theme.layout.maxWidth};
  margin: -3rem auto 4rem;
  text-align: center;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: -1rem auto 3rem;
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const LoyaltyProgamsView = styled('div')`
  & > div + div {
    margin: 3rem auto 0;
  }
`

const LoyaltyPrograms = ({ hasRewards = false }) => {
  const dispatch = useDispatch()
  const { entities, loading, error } = useSelector(selectCustomerLoyalty)
  const isLoading = loading === 'pending'
  const { windowRef } = useContext(AppContext)
  const theme = useTheme()
  const offsetRem = isMobile
    ? theme.layout.navHeightMobile
    : theme.layout.navHeight
  const offset = offsetRem ? parseFloat(offsetRem.replace('rem')) * 10 : 60

  useEffect(() => {
    dispatch(fetchCustomerLoyalty())
  }, [dispatch])

  const goToRewards = () => {
    const element = document.getElementById('rewards')
    const position = element.offsetTop - 30 - offset
    scroll.scrollTo(position, {
      container: windowRef.current,
      duration: 500,
      smooth: true,
      offset: 0,
    })
  }

  return (
    <>
      {error ? (
        <PageError error={error} />
      ) : entities.length ? (
        <PageSection>
          {hasRewards && (
            <LoyaltyProgamsIntro>
              You've got rewards!{' '}
              <ButtonLink onClick={goToRewards}>
                Scroll down to review.
              </ButtonLink>
            </LoyaltyProgamsIntro>
          )}
          <LoyaltyProgamsView>
            {entities.map((program) => {
              return (
                <LoyaltyProgram
                  key={program.name}
                  program={program}
                  isLoading={isLoading}
                />
              )
            })}
          </LoyaltyProgamsView>
        </PageSection>
      ) : (
        <PageContent>
          {isLoading ? (
            <Loading text="Retrieving your rewards..." />
          ) : (
            <p>Looks like you don't have any reward programs yet.</p>
          )}
        </PageContent>
      )}
    </>
  )
}

LoyaltyPrograms.displayName = 'LoyaltyPrograms'

export default LoyaltyPrograms
