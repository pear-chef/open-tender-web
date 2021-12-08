import React, { useCallback } from 'react'
import propTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { updateCustomerOrderRating } from '@open-tender/redux'
import { OrderRatingForm } from '@open-tender/components'
import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '..'
import iconMap from '../iconMap'

const OrderRating = ({ orderId, orderRating }) => {
  const dispatch = useDispatch()
  const updateRating = useCallback(
    (orderId, data) => dispatch(updateCustomerOrderRating(orderId, data)),
    [dispatch]
  )
  const callback = useCallback(() => dispatch(closeModal()), [dispatch])

  return (
    <ModalView>
      <ModalContent
        title="Rate your order"
        subtitle={
          <p>Please add a rating and an any additional comments below</p>
        }
      >
        <OrderRatingForm
          orderId={orderId}
          orderRating={orderRating}
          icon={iconMap.Star}
          updateRating={updateRating}
          callback={callback}
        />
      </ModalContent>
    </ModalView>
  )
}

OrderRating.displayName = 'OrderRating'
OrderRating.propTypes = {
  orderId: propTypes.number,
  orderRating: propTypes.object,
}

export default OrderRating
