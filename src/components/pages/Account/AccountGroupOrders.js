import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  selectCustomerGroupOrders,
  fetchCustomerGroupOrders,
} from '@open-tender/redux'

import { selectConfig } from '../../../slices'
import { Loading, OrderCardGroup, PageContent, PageSection } from '../..'

const GroupOrdersView = styled('div')`
  margin: -1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: -0.5rem;
    justify-content: center;
  }
`

const GroupOrder = styled('div')`
  width: 33.33333%;
  padding: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 50%;
    padding: 0.5rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0.5rem;
  }
`

const AccountGroupOrders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectCustomerGroupOrders)
  const { account } = useSelector(selectConfig)
  const { entities: groupOrders, loading, error } = orders
  const hasOrders = groupOrders.length > 0 && !error
  const displayed = groupOrders.slice(0, 5)
  const isMore = groupOrders.length > displayed.length
  const isLoading = loading === 'pending'

  useEffect(() => {
    dispatch(fetchCustomerGroupOrders())
  }, [dispatch])

  if (!displayed.length || error) return null

  return (
    <PageSection {...account.groupOrders} to={isMore ? '/orders' : null}>
      {isLoading ? (
        <PageContent style={{ margin: '0 auto' }}>
          <Loading text="Retrieving your recent orders..." />
        </PageContent>
      ) : hasOrders ? (
        <GroupOrdersView>
          {displayed.map((order) => (
            <GroupOrder key={order.cart_id}>
              <OrderCardGroup order={order} />
            </GroupOrder>
          ))}
        </GroupOrdersView>
      ) : null}
    </PageSection>
  )
}

AccountGroupOrders.displayName = 'AccountGroupOrders'

export default AccountGroupOrders
