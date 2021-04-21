import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrder } from '@open-tender/redux'
import { serviceTypeNamesMap } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'

import { closeModal } from '../../slices'
import { ModalContent, ModalView } from '..'

const OrderType = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { serviceType, revenueCenter } = useSelector(selectOrder)
  const serviceTypeName = serviceTypeNamesMap[serviceType]

  const changeOrderType = () => {
    dispatch(closeModal())
    history.push(revenueCenter ? `/locations/${revenueCenter.slug}` : '/')
  }

  const cancel = () => {
    dispatch(closeModal())
  }

  return (
    <ModalView>
      <ModalContent
        title="Change your order type"
        footer={
          <div>
            <ButtonStyled onClick={cancel} color="cart">
              Keep {serviceTypeName}
            </ButtonStyled>
            <ButtonStyled onClick={changeOrderType}>
              Change Order Type
            </ButtonStyled>
          </div>
        }
      >
        <div>
          <p>Are you sure you want to change your order type?</p>
          <p>
            This will start you over at the beginning, but the items in your
            cart will not be affected.
          </p>
        </div>
      </ModalContent>
    </ModalView>
  )
}

OrderType.displayName = 'OrderType'

export default OrderType
