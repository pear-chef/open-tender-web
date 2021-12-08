import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import {
  fetchCustomerThanx,
  resetCustomerThanx,
  selectCustomerThanx,
  logoutCustomer,
  addMessage,
} from '@open-tender/redux'
import { Box, Heading } from '@open-tender/components'

import { Loading, PageSection, ProgressCircle, Rewards } from '../..'

const ThanxProgressView = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ThanxProgressContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.layout.padding};
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: ${(props) => props.theme.layout.paddingMobile};
    margin: 0 auto;
  }

  & > div {
    margin: ${(props) => props.theme.layout.paddingMobile};
  }

  & > p:last-of-type {
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const ThanxProgress = ({ progress, threshold }) => {
  const { percentage = 0, towards = null } = progress || {}
  const currentProgress = parseInt(percentage)
  const remaining = threshold
    ? ((parseFloat(threshold) * (100 - currentProgress)) / 100).toFixed(2)
    : null
  return (
    <ThanxProgressView>
      <ThanxProgressContent>
        <Heading as="p">Current Progress</Heading>
        <ProgressCircle progress={currentProgress} />
        {currentProgress ? (
          <p>
            {remaining
              ? `You're ${remaining} away from your next ${towards}`
              : `You're on your way to your next ${towards}`}
          </p>
        ) : (
          <p>Make your first purchase to start earning rewards!</p>
        )}
      </ThanxProgressContent>
    </ThanxProgressView>
  )
}

ThanxProgress.displayName = 'ThanxProgress'
ThanxProgress.propTypes = {
  progress: propTypes.object,
  threshold: propTypes.number,
}

const ThanxRewardView = styled(Box)`
  position: relative;
  height: 100%;
  min-height: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
`

const ThanxRewardDescription = styled('p')`
  margin: 0.3rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const ThanxReward = ({ item }) => {
  const { name, description } = item || {}
  if (!name) return null
  return (
    <ThanxRewardView>
      <p>
        <Heading>{name}</Heading>
      </p>
      {description && (
        <ThanxRewardDescription>{description}</ThanxRewardDescription>
      )}
    </ThanxRewardView>
  )
}

ThanxReward.displayName = 'ThanxReward'
ThanxReward.propTypes = {
  reward: propTypes.object,
}

const ThanxLoyalty = () => {
  const dispatch = useDispatch()
  const { thanx, loading, error } = useSelector(selectCustomerThanx)
  const isLoading = loading === 'pending'
  const { progress, rewards } = thanx || {}
  const thanxRewards =
    rewards &&
    rewards.map((i) => ({
      ...i,
      discount_id: i.ext_id,
    }))

  useEffect(() => {
    dispatch(fetchCustomerThanx())
    return () => dispatch(resetCustomerThanx())
  }, [dispatch])

  useEffect(() => {
    if (error === 'This customer does not have a connected Thanx account') {
      dispatch(logoutCustomer())
      dispatch(resetCustomerThanx())
      dispatch(addMessage('Please login to reauthenticate your account'))
    }
  }, [error, dispatch])

  return (
    <>
      {thanx ? (
        <>
          <ThanxProgress progress={progress} />
          {thanxRewards.length > 0 && (
            <PageSection
              title="Your Rewards"
              subtitle="These can be applied from the checkout page once you start an order"
            >
              <Rewards rewards={thanxRewards} renderItem={ThanxReward} />
            </PageSection>
          )}
        </>
      ) : isLoading ? (
        <Loading text="Retrieving your rewards..." />
      ) : error ? (
        <p>
          Something appears to have gone wrong. Please try logging out and
          logging back in again.
        </p>
      ) : (
        <p>Looks like you don't have any rewards yet.</p>
      )}
    </>
  )
}

ThanxLoyalty.displayName = 'ThanxLoyalty'
export default ThanxLoyalty
