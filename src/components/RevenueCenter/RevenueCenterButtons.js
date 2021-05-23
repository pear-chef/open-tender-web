import React from 'react'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectServiceType,
  setOrderServiceType,
  setAddress,
  setRevenueCenter,
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'

import iconMap from '../iconMap'
import { makeServiceTypesToday } from './RevenueCenterOrder'

const hasServiceType = (
  serviceType,
  firstTimes,
  orderTimes,
  serviceTypes,
  todayServiceTypes
) => {
  let hasService =
    ((firstTimes && firstTimes[serviceType]) ||
      (orderTimes && orderTimes[serviceType])) &&
    serviceTypes.includes(serviceType)
  if (hasService && todayServiceTypes) {
    hasService = todayServiceTypes.includes(serviceType)
  }
  return hasService
}

export const RevenueCenterButtons = ({ revenueCenter, isLanding }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    name,
    slug,
    settings,
    revenue_center_type: rcType,
    is_outpost: isOutpost,
    address,
  } = revenueCenter
  const { first_times: ft, order_times: ot } = settings
  const menuSlug = `/menu/${slug}`
  const serviceType = useSelector(selectServiceType)
  const st = isLanding || isOutpost ? ['PICKUP', 'DELIVERY'] : [serviceType]
  const stToday = isLanding ? makeServiceTypesToday(ft) : null
  const hasWalkin = false
  const hasPickup = hasServiceType('PICKUP', ft, ot, st, stToday)
  const hasDelivery = hasServiceType('DELIVERY', ft, ot, st, stToday)
  const pickupMinutes = hasPickup ? ft.PICKUP.minutes : 0
  const isDinner = pickupMinutes > 14 * 60

  const handleWalkin = () => {
    dispatch(setOrderServiceType(rcType, 'WALKIN', false))
    dispatch(setRevenueCenter(revenueCenter))
    history.push(menuSlug)
  }

  const handlePickup = () => {
    dispatch(setOrderServiceType(rcType, 'PICKUP', isOutpost))
    dispatch(setAddress(address))
    dispatch(setRevenueCenter(revenueCenter))
    history.push(menuSlug)
  }

  const handleDelivery = () => {
    dispatch(setOrderServiceType(rcType, 'DELIVERY', isOutpost))
    dispatch(setAddress(address))
    dispatch(setRevenueCenter(revenueCenter))
    history.push(menuSlug)
  }

  return (
    <>
      {hasWalkin && (
        <ButtonStyled
          label={`Order Dine-in from ${name}`}
          icon={iconMap.Coffee}
          onClick={handleWalkin}
        >
          Order {hasDelivery ? 'Dine-in' : 'Here'}
        </ButtonStyled>
      )}
      {hasPickup && (
        <ButtonStyled
          label={`Order Pickup from ${name}`}
          icon={isDinner ? iconMap.ShoppingBag : iconMap.Coffee}
          onClick={handlePickup}
        >
          {isDinner ? 'Pick Up In Lobby' : 'Pick Up'}
        </ButtonStyled>
      )}
      {hasDelivery && (
        <ButtonStyled
          label={`Order Delivery from ${name}`}
          icon={iconMap.Truck}
          onClick={handleDelivery}
        >
          Deliver
        </ButtonStyled>
      )}
    </>
  )
}

RevenueCenterButtons.displayName = 'RevenueCenterButtons'
RevenueCenterButtons.propTypes = {
  revenueCenter: propTypes.object,
  isLanding: propTypes.bool,
}

export default RevenueCenterButtons
