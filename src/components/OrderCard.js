import React from 'react'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  setOrderServiceType,
  setAddress,
  reorderPastOrder,
  // editOrder,
} from '@open-tender/redux'
import {
  timezoneMap,
  isoToDateStr,
  isoToDate,
  makeOrderAddress,
  makeOrderTypeName,
} from '@open-tender/js'
import { ButtonStyled, DeliveryLink } from '@open-tender/components'

import iconMap from './iconMap'
import { Card, OrderImages, OrderTag } from '.'

const OrderCard = ({ order, isLast }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    order_id,
    status,
    service_type,
    order_type,
    revenue_center,
    requested_at,
    timezone,
    cart,
    address,
    totals,
    delivery,
  } = order
  const isOpen = status === 'OPEN'
  const isMerch = order_type === 'MERCH'
  const orderTypeName = makeOrderTypeName(order_type, service_type)
  const tz = timezoneMap[timezone]
  const requestedAt = isoToDateStr(requested_at, tz, 'MMMM d, yyyy @ h:mma')
  const isUpcoming = isoToDate(requested_at) > new Date()
  const streetAddress = makeOrderAddress(address)
  const trackingUrl = isOpen && delivery && delivery.tracking_url
  const itemImages = cart
    .map((i) =>
      i.images
        .filter((m) => m.type === 'SMALL_IMAGE' && m.url)
        .map((image) => ({ title: i.name, imageUrl: image.url }))
    )
    .flat()
  const itemNames = cart.map((i) => i.name).join(', ')

  const handleReorder = () => {
    const { revenue_center_id: revenueCenterId } = revenue_center
    const serviceType = service_type
    dispatch(setOrderServiceType(order_type, service_type))
    dispatch(setAddress(address || null))
    dispatch(reorderPastOrder({ revenueCenterId, serviceType, items: cart }))
  }

  return (
    <Card
      tag={<OrderTag isUpcoming={isUpcoming} status={status} />}
      preface={isLast ? 'Your Last Order' : `Order #${order_id}`}
      title={`${orderTypeName} from ${revenue_center.name}`}
      subtitle={
        <>
          {isUpcoming && trackingUrl && (
            <DeliveryLink
              text="Track your delivery"
              trackingUrl={trackingUrl}
              newWindowIcon={iconMap.ExternalLink}
            />
          )}
        </>
      }
      content={
        <>
          <p>
            {requestedAt} &nbsp;|&nbsp; ${totals.total}
          </p>
          <p>{streetAddress}</p>
          <OrderImages images={itemImages} names={itemNames} />
        </>
      }
      footer={
        <>
          {/* {order.is_editable && (
            <ButtonStyled
              icon={iconMap.Edit}
              onClick={() => dispatch(editOrder(order))}
              size="small"
            >
              Edit
            </ButtonStyled>
          )} */}
          {!isMerch && (
            <ButtonStyled
              icon={iconMap.RefreshCw}
              onClick={handleReorder}
              size="small"
              color="primary"
            >
              Reorder
            </ButtonStyled>
          )}
          <ButtonStyled
            icon={iconMap.FileText}
            onClick={() => history.push(`/orders/${order_id}`)}
            size="small"
            color="secondary"
          >
            Details
          </ButtonStyled>
        </>
      }
    />
  )
}

OrderCard.displayName = 'OrderCard'
OrderCard.propTypes = {
  order: propTypes.object,
  isLast: propTypes.bool,
}

export default OrderCard
