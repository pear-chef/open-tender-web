import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { OrderCard, OrderCardGroup } from '../..'

const OrdersListView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem -1rem;
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
`
const OrdersListItem = styled('div')`
    flex: 0 0 36rem;
    max-width: 20%;
    padding: 0 1rem;
    margin: 0 0 2rem;

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
      flex: 0 0 25%;
      max-width: 25%;
    }
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      flex: 0 0 33.33333%;
      max-width: 33.33333%;
    }
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      flex: 0 0 50%;
      max-width: 50%;
    }
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
`

const OrdersList = ({ orders, isGroup = false }) => {
  return (
    <OrdersListView>
      {orders.map((order) => {
        return (
          <OrdersListItem key={order.order_id || order.token}>
            {isGroup ? (
              <OrderCardGroup order={order} />
            ) : (
              <OrderCard order={order} />
            )}
          </OrdersListItem>
        )
      })}
    </OrdersListView>
  )
}

OrdersList.displayName = 'OrdersList'
OrdersList.propTypes = {
  orders: propTypes.array,
  delay: propTypes.number,
}

export default OrdersList
