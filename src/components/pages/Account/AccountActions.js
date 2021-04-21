import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import {
  resetOrderType,
  resetOrder,
  selectOrder,
  fetchCustomerOrders,
  selectCustomerOrders,
  fetchCustomerFavorites,
  fetchRevenueCenter,
  setOrderServiceType,
  setAddress,
  selectCartQuantity,
  fetchMenuItems,
  setServiceType,
} from '@open-tender/redux'
import { getLastOrder, makeOrderTypeName } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'

import iconMap from '../../iconMap'
import { Loading, PageButtons } from '../..'
import styled from '@emotion/styled'

const AccountActionsView = styled('div')`
  margin: -2rem auto 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: -1rem auto 0;
  }

  p {
    line-height: ${(props) => props.theme.lineHeight};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }
  }

  p + p {
    margin: 2rem 0 0;
  }
`

const Continue = ({ size, icon, current, startNew }) => {
  return (
    <>
      <ButtonStyled icon={icon} onClick={current} size={size}>
        Continue Order
      </ButtonStyled>
      <ButtonStyled
        icon={iconMap.RefreshCw}
        onClick={startNew}
        size={size}
        color="secondary"
      >
        New Order
      </ButtonStyled>
    </>
  )
}

const LastOrderButtons = ({
  lastOrder,
  revenueCenter,
  buttonSize,
  reorder,
  change,
}) => {
  const { order_type, service_type } = lastOrder
  const { service_types } = revenueCenter.settings
  const orderTypeName = makeOrderTypeName(order_type, service_type)
  const orderTypeIcon = makeOrderTypeIcon(order_type, service_type)
  const otherServiceType = service_type === 'DELIVERY' ? 'PICKUP' : 'DELIVERY'
  const otherTypeName = makeOrderTypeName(order_type, otherServiceType)
  const otherTypeIcon = makeOrderTypeIcon(order_type, otherServiceType)
  if (service_types.includes(service_type)) {
    return (
      <>
        <p>
          You ordered {orderTypeName} from {revenueCenter.name} last time.
        </p>
        <PageButtons>
          <ButtonStyled
            icon={orderTypeIcon}
            onClick={() => reorder(service_type, revenueCenter)}
            size={buttonSize}
          >
            Order {orderTypeName}
            {isBrowser && ' Again'}
          </ButtonStyled>
          {service_types.includes(otherServiceType) && (
            <ButtonStyled
              icon={otherTypeIcon}
              onClick={() => reorder(otherServiceType, revenueCenter)}
              size={buttonSize}
              color="secondary"
            >
              Order {otherTypeName} Instead
            </ButtonStyled>
          )}
        </PageButtons>
        <p>
          <Link to="/buildings">Order from a different building.</Link>
        </p>
      </>
    )
  }
  if (service_types.includes(otherServiceType)) {
    return (
      <>
        <p>
          You ordered {orderTypeName} from {revenueCenter.name} last time, but
          this order type is no longer available.
        </p>
        <PageButtons>
          <ButtonStyled
            icon={otherTypeIcon}
            onClick={() => reorder(otherServiceType)}
            size={buttonSize}
          >
            Order {otherTypeName} Instead
          </ButtonStyled>
        </PageButtons>
        <p>
          <Link to="/buildings">
            Or start an order from a different building.
          </Link>
        </p>
      </>
    )
  } else {
    return (
      <>
        <p>
          You ordered {orderTypeName} from {revenueCenter.name} last time, but
          this building is no longer offering {orderTypeName} or {otherTypeName}
          .
        </p>
        <p>
          {/* <Link to="/buildings">Start an order from a different building.</Link> */}
          <ButtonStyled onClick={change} size={buttonSize}>
            Try A Different Building
          </ButtonStyled>
        </p>
      </>
    )
  }
}

const makeOrderTypeIcon = (orderType, serviceType) => {
  return orderType === 'CATERING'
    ? iconMap.Users
    : serviceType === 'DELIVERY'
    ? iconMap.Truck
    : iconMap.ShoppingBag
}

const AccountActions = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectOrder)
  const { revenueCenter, orderType, serviceType, cart } = currentOrder
  const { entities: orders, loading } = useSelector(selectCustomerOrders)
  const cartQuantity = useSelector(selectCartQuantity)
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0
  const lastOrder = useMemo(() => getLastOrder(orders), [orders])
  let orderTypeName = null
  let orderTypeIcon = iconMap.ShoppingBag
  if (isCurrentOrder) {
    orderTypeIcon = makeOrderTypeIcon(orderType, serviceType)
  } else if (lastOrder) {
    const { order_type, service_type } = lastOrder
    orderTypeName = makeOrderTypeName(order_type, service_type)
    orderTypeIcon = makeOrderTypeIcon(order_type, service_type)
  }
  const reloadLast = lastOrder && !isCurrentOrder
  const isLoading = loading === 'pending' && !isCurrentOrder && !lastOrder
  const buttonSize = isBrowser ? 'default' : 'small'

  useEffect(() => {
    dispatch(fetchCustomerOrders(20))
    dispatch(fetchCustomerFavorites())
  }, [dispatch])

  useEffect(() => {
    if (reloadLast) {
      const {
        revenue_center,
        service_type: serviceType,
        order_type,
        address,
      } = lastOrder
      const { revenue_center_id: revenueCenterId, is_outpost } = revenue_center
      if (!cartQuantity) {
        dispatch(fetchRevenueCenter(revenueCenterId))
        dispatch(setOrderServiceType(order_type, serviceType, is_outpost))
        dispatch(setAddress(address || null))
      }
      dispatch(fetchMenuItems({ revenueCenterId, serviceType }))
    }
  }, [reloadLast, lastOrder, cartQuantity, dispatch])

  const startNewOrder = () => {
    dispatch(resetOrder())
    history.push(`/order-type`)
  }

  const continueCurrent = () => {
    history.push(revenueCenter ? `/menu/${revenueCenter.slug}` : '/order-type')
  }

  const change = () => {
    dispatch(resetOrder())
    history.push(`/buildings`)
  }

  const reorder = (serviceType, revenueCenter) => {
    dispatch(setServiceType(serviceType))
    history.push(`/menu/${revenueCenter.slug}`)
  }

  return isLoading ? (
    <Loading text="Retrieving your account info..." />
  ) : isCurrentOrder && revenueCenter ? (
    <Continue
      icon={orderTypeIcon}
      size={buttonSize}
      current={continueCurrent}
      startNew={startNewOrder}
    />
  ) : lastOrder && revenueCenter ? (
    <AccountActionsView>
      <LastOrderButtons
        lastOrder={lastOrder}
        revenueCenter={revenueCenter}
        buttonSize={buttonSize}
        reorder={reorder}
        change={change}
      />
    </AccountActionsView>
  ) : (
    <ButtonStyled
      icon={iconMap.ShoppingBag}
      onClick={startNewOrder}
      size={buttonSize}
    >
      Start a New Order
    </ButtonStyled>
  )
}

AccountActions.displayName = 'AccountActions'

export default AccountActions
