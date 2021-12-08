import React from 'react'
import { useSelector } from 'react-redux'

import { selectBrand, selectConfig } from '../../../slices'
import { PageSection } from '../..'
import AccountLoyaltyProgram from './AccountLoyaltyProgram'
import ThanxLoyalty from '../Rewards/ThanxLoyalty'
import LevelUpLoyalty from '../Rewards/LevelUpLoyalty'

const AccountLoyalty = ({ showTitle = true }) => {
  const { has_rewards, has_thanx, has_levelup } = useSelector(selectBrand)
  const { account } = useSelector(selectConfig)

  return has_rewards ? (
    <AccountLoyaltyProgram showTitle={showTitle} />
  ) : has_thanx ? (
    <>
      <PageSection {...account.loyalty} style={{ marginBottom: '2.5rem' }} />
      <ThanxLoyalty />
    </>
  ) : has_levelup ? (
    <LevelUpLoyalty />
  ) : null
}

AccountLoyalty.displayName = 'AccountLoyalty'

export default AccountLoyalty
