import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { selectCustomer, selectDeals, fetchDeals } from '@open-tender/redux'

import { Deals, Loading, PageSection } from '.'
import { selectBrand, selectConfig } from '../slices'

const DealsSection = ({ title = null, subtitle = null, limit = 4 }) => {
  const dispatch = useDispatch()
  const { has_deals } = useSelector(selectBrand)
  const { deals: config } = useSelector(selectConfig)
  const { profile } = useSelector(selectCustomer)
  const { customer_id } = profile || {}
  const { entities: deals, loading, error } = useSelector(selectDeals)
  const hasDeals = deals.length > 0 && !error
  const displayed = limit ? deals.slice(0, limit) : deals
  const isMore = deals.length > displayed.length

  useEffect(() => {
    if (has_deals) {
      dispatch(fetchDeals())
    }
  }, [has_deals, customer_id, dispatch])

  return (
    <PageSection
      title={title || config.title}
      subtitle={subtitle || config.subtitle}
      to={isMore ? '/deals' : null}
    >
      {loading === 'pending' ? (
        <Loading text="Checking for deals..." />
      ) : hasDeals ? (
        <Deals deals={displayed} />
      ) : (
        <p>We're not featuring any deals today. Please check back soon!</p>
      )}
    </PageSection>
  )
}

DealsSection.displayName = 'DealsSection'
DealsSection.propTypes = {
  title: propTypes.string,
  subtitle: propTypes.string,
  limit: propTypes.number,
}

export default DealsSection
