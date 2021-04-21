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
  const serviceTypes =
    isLanding || isOutpost ? ['PICKUP', 'DELIVERY'] : [serviceType]
  const hasPickup =
    ((ft && ft.PICKUP) || (ot && ot.PICKUP)) && serviceTypes.includes('PICKUP')
  const hasWalkin =
    ((ft && ft.PICKUP) || (ot && ot.PICKUP)) && serviceTypes.includes('WALKIN')
  const hasDelivery =
    ((ft && ft.DELIVERY) || (ot && ot.DELIVERY)) &&
    serviceTypes.includes('DELIVERY')

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
          icon={iconMap.ShoppingBag}
          onClick={handlePickup}
        >
          Leave In The Lobby
        </ButtonStyled>
      )}
      {hasDelivery && (
        <ButtonStyled
          label={`Order Delivery from ${name}`}
          icon={iconMap.Truck}
          onClick={handleDelivery}
        >
          Deliver To My Unit
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
