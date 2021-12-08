import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCustomerLoyalty,
  selectCustomerLoyaltyProgram,
} from '@open-tender/redux'

import { Loading, LoyaltyProgram, PageSection } from '../..'
import { selectConfig } from '../../../slices'

const AccountLoyaltyProgram = ({ showTitle = true }) => {
  const dispatch = useDispatch()
  const { account } = useSelector(selectConfig)
  const { program, loading } = useSelector(selectCustomerLoyaltyProgram)
  const { title, subtitle } = account.loyalty

  useEffect(() => {
    dispatch(fetchCustomerLoyalty())
  }, [dispatch])

  if (!program) return null

  return (
    <PageSection
      title={showTitle ? title : null}
      subtitle={showTitle ? subtitle : null}
      to="/rewards"
    >
      {loading === 'pending' ? (
        <Loading text="Retrieving your loyalty status..." />
      ) : (
        <LoyaltyProgram program={program} />
      )}
    </PageSection>
  )
}

AccountLoyaltyProgram.displayName = 'AccountLoyaltyProgram'

export default AccountLoyaltyProgram
