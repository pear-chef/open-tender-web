import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { Reward } from '.'

const RewardsView = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  max-width: ${(props) => props.theme.layout.maxWidth};
  margin: 0 auto;
`

const RewardsContainer = styled('div')`
  margin: -1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    margin: -0.5rem;
    justify-content: center;
  }
`

const RewardView = styled('div')`
  width: 50%;
  padding: 0.5rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 0.5rem;
  }
`

const Rewards = ({ rewards, renderItem = Reward }) => {
  return (
    <RewardsView>
      <RewardsContainer>
        {rewards.map((reward) => (
          <RewardView key={reward.discount_id}>
            {/* <Reward item={reward} /> */}
            {renderItem({ item: reward })}
          </RewardView>
        ))}
      </RewardsContainer>
    </RewardsView>
  )
}

Rewards.displayName = 'Rewards'
Rewards.propTypes = {
  rewards: propTypes.array,
}

export default Rewards
