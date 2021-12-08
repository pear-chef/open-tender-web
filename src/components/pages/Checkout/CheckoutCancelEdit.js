import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { selectOrder, resetOrder, resetCheckout } from '@open-tender/redux'
import { ButtonLink } from '@open-tender/components'

const CheckoutCancelView = styled('div')`
  margin: 3rem 0 0;

  p {
    line-height: ${(props) => props.theme.lineHeight};
  }
`

const CheckoutCancelEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { orderId } = useSelector(selectOrder)

  const handleCancelEdit = () => {
    dispatch(resetOrder())
    dispatch(resetCheckout())
    history.push(`/`)
  }

  return orderId ? (
    <CheckoutCancelView>
      <p>
        You're currently editing order #{orderId}.{' '}
        <ButtonLink onClick={handleCancelEdit}>
          Click here to cancel this edit.
        </ButtonLink>
      </p>
    </CheckoutCancelView>
  ) : null
}

CheckoutCancelEdit.displayName = 'CheckoutCancelEdit'

export default CheckoutCancelEdit
