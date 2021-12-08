import React from 'react'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  updateCustomerAddress,
  removeCustomerAddress,
  setAddress,
} from '@open-tender/redux'
import { ButtonLink, ButtonStyled, Preface } from '@open-tender/components'

import { openModal } from '../../../slices'
import { LinkSeparator, OrderAddress, Row } from '../..'
import iconMap from '../../iconMap'

const Addresses = ({ addresses, isLoading }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleEdit = (address) => {
    dispatch(openModal({ type: 'address', args: { address } }))
  }

  const handleDefault = (address) => {
    const data = { ...address, is_default: true }
    const addressId = address.customer_address_id
    delete data.customer_address_id
    delete data.created_at
    delete data.last_used_at
    dispatch(updateCustomerAddress(addressId, data))
  }

  const handleDelete = (address) => {
    const addressId = address.customer_address_id
    dispatch(removeCustomerAddress(addressId))
  }

  const handleReorder = (address) => {
    dispatch(setAddress(address))
    history.push('/locations')
  }

  return (
    <div>
      {addresses.map((address) => (
        <Row
          key={address.customer_address_id}
          content={
            <>
              {address.is_default && (
                <Preface
                  size="xSmall"
                  style={{ display: 'inline-block', margin: '0 0 0.3rem' }}
                >
                  Primary
                </Preface>
              )}
              <OrderAddress address={address}>
                <p>
                  <ButtonLink
                    onClick={() => handleEdit(address)}
                    disabled={isLoading}
                  >
                    edit
                  </ButtonLink>
                  <LinkSeparator />
                  <ButtonLink
                    onClick={() => handleDefault(address)}
                    disabled={address.is_default || isLoading}
                  >
                    make primay
                  </ButtonLink>
                  <LinkSeparator />
                  <ButtonLink
                    onClick={() => handleDelete(address)}
                    disabled={isLoading}
                  >
                    remove
                  </ButtonLink>
                </p>
              </OrderAddress>
            </>
          }
          actions={
            <ButtonStyled
              onClick={() => handleReorder(address)}
              icon={iconMap.RefreshCw}
              size="small"
              disabled={isLoading}
            >
              Order from here
            </ButtonStyled>
          }
        />
      ))}
    </div>
  )
}

Addresses.displayName = 'Addresses'
Addresses.propTypes = {
  addresses: propTypes.array,
  isLoading: propTypes.bool,
}
export default Addresses
