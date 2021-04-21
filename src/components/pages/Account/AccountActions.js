import React, { useEffect, useMemo } from 'react'
import propTypes from 'prop-types'
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
  fetchMenuItems,
  setServiceType,
} from '@open-tender/redux'
import { getLastOrder, makeOrderTypeName } from '@open-tender/js'
import { ButtonStyled, ButtonLink } from '@open-tender/components'

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

const ContinueButtons = ({
  currentOrder,
  revenueCenter,
  buttonSize,
  continueCurrent,
  changeOrderType,
  // startNew,
  change,
}) => {
  const { orderType, serviceType } = currentOrder
  const { service_types } = revenueCenter.settings
  const orderTypeName = makeOrderTypeName(orderType, serviceType)
  const orderTypeIcon = makeOrderTypeIcon(orderType, serviceType)
  const otherServiceType = serviceType === 'DELIVERY' ? 'PICKUP' : 'DELIVERY'
  const otherTypeName = makeOrderTypeName(orderType, otherServiceType)
  const otherTypeIcon = makeOrderTypeIcon(orderType, otherServiceType)
  return (
    <>
      <p>
        You're currently ordering {orderTypeName} from {revenueCenter.name}.
      </p>
      <PageButtons>
        <ButtonStyled
          icon={orderTypeIcon}
          onClick={continueCurrent}
          size={buttonSize}
        >
          Continue {orderTypeName} Order
        </ButtonStyled>
        {service_types.includes(otherServiceType) && (
          <ButtonStyled
            icon={otherTypeIcon}
            onClick={() => changeOrderType(otherServiceType, revenueCenter)}
            size={buttonSize}
            color="secondary"
          >
            Order {otherTypeName} Instead
          </ButtonStyled>
        )}
        {/* <ButtonStyled
          icon={iconMap.RefreshCw}
          onClick={startNew}
          size={buttonSize}
          color="secondary"
        >
          {isBrowser && 'Start A '}New Order
        </ButtonStyled> */}
      </PageButtons>
      <p>
        <ButtonLink onClick={change}>
          Order from a different building.
        </ButtonLink>
      </p>
    </>
  )
}

ContinueButtons.displayName = 'ContinueButtons'
ContinueButtons.propTypes = {
  currentOrder: propTypes.object,
  revenueCenter: propTypes.object,
  buttonSize: propTypes.string,
  continueCurrent: propTypes.func,
  changeOrderType: propTypes.func,
  change: propTypes.func,
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

LastOrderButtons.displayName = 'LastOrderButtons'
LastOrderButtons.propTypes = {
  lastOrder: propTypes.object,
  revenueCenter: propTypes.object,
  buttonSize: propTypes.string,
  reorder: propTypes.func,
  change: propTypes.func,
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
  const { revenueCenter, serviceType, cart } = currentOrder
  const { entities: orders, loading } = useSelector(selectCustomerOrders)
  const isCurrentOrder = revenueCenter && serviceType && cart.length > 0
  const lastOrder = useMemo(() => getLastOrder(orders), [orders])
  const reloadLast = lastOrder && !isCurrentOrder
  const isLoading = loading === 'pending' && !isCurrentOrder
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
      dispatch(fetchRevenueCenter(revenueCenterId))
      dispatch(setOrderServiceType(order_type, serviceType, is_outpost))
      dispatch(setAddress(address || null))
      dispatch(fetchMenuItems({ revenueCenterId, serviceType }))
    }
  }, [reloadLast, lastOrder, dispatch])

  const startNew = () => {
    dispatch(resetOrderType())
    history.push(`/locations/${revenueCenter.slug}`)
  }

  const continueCurrent = () => {
    history.push(`/menu/${revenueCenter.slug}`)
  }

  const reorder = (serviceType, revenueCenter) => {
    dispatch(setServiceType(serviceType))
    history.push(`/menu/${revenueCenter.slug}`)
  }

  const change = () => {
    dispatch(resetOrder())
    history.push(`/buildings`)
  }

  return isLoading ? (
    <Loading text="Retrieving your account info..." />
  ) : isCurrentOrder ? (
    <AccountActionsView>
      <ContinueButtons
        currentOrder={currentOrder}
        revenueCenter={revenueCenter}
        buttonSize={buttonSize}
        continueCurrent={continueCurrent}
        startNew={startNew}
        changeOrderType={reorder}
        change={change}
      />
    </AccountActionsView>
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
    <ButtonStyled icon={iconMap.ShoppingBag} onClick={change} size={buttonSize}>
      Start a New Order
    </ButtonStyled>
  )
}

AccountActions.displayName = 'AccountActions'

export default AccountActions
