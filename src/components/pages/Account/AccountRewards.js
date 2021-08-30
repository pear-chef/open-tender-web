import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { fetchCustomerRewards, selectCustomerRewards } from '@open-tender/redux'
import { useDispatch, useSelector } from 'react-redux'

import { Loading, PageSection, Rewards } from '../..'
import { selectConfig } from '../../../slices'

const AccountRewards = ({ limit = 3 }) => {
  const dispatch = useDispatch()
  const { account } = useSelector(selectConfig)
  const {
    entities: rewards,
    loading,
    error,
  } = useSelector(selectCustomerRewards)
  const hasRewards = rewards.length > 0 && !error
  const displayed = limit ? rewards.slice(0, limit) : rewards
  const isMore = rewards.length > displayed.length

  useEffect(() => {
    dispatch(fetchCustomerRewards())
  }, [dispatch])

  return hasRewards ? (
    <PageSection {...account.rewards} to={isMore ? '/rewards' : null}>
      {loading === 'pending' ? (
        <Loading text="Checking for rewards..." />
      ) : hasRewards ? (
        <Rewards rewards={displayed} />
      ) : null}
    </PageSection>
  ) : null
}

AccountRewards.displayName = 'AccountRewards'
AccountRewards.propTypes = {
  limit: propTypes.number,
}

export default AccountRewards
