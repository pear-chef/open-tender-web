import { useSelector } from 'react-redux'

import { selectBrand, selectConfig } from '../../../slices'
import { DealsSection } from '../..'

const AccountDeals = () => {
  const { has_deals } = useSelector(selectBrand)
  const { account: config } = useSelector(selectConfig)
  const { title, subtitle } = config.deals

  return has_deals ? <DealsSection title={title} subtitle={subtitle} /> : null
}

AccountDeals.displayName = 'AccountDeals'
export default AccountDeals
