import React from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import {
  selectCustomer,
  selectCustomerFavorites,
  setOrderServiceType,
  setAddress,
  reorderPastOrder,
  // editOrder,
} from '@open-tender/redux'
import {
  makeOrderTypeName,
  makeDisplayItem,
  isEmpty,
  isoToDate,
} from '@open-tender/js'
import {
  Box,
  ButtonStyled,
  CartItem,
  Check,
  Preface,
} from '@open-tender/components'

import { openModal, selectDisplaySettings } from '../../slices'
import iconMap from '../iconMap'
import { Loading } from '..'
import OrderAddress from '../OrderAddress'
import OrderQuantity from '../OrderQuantity'
import OrderRating from './OrderRating'
import OrderRequestedAt from './OrderRequestedAt'
import OrderRevenueCenter from './OrderRevenueCenter'
import OrderSection from './OrderSection'

const OrderView = styled(Box)`
  margin: 4rem auto;
  max-width: ${(props) => props.theme.breakpoints.tablet};
  padding: ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: ${(props) => props.theme.layout.paddingMobile};
    margin: 3rem auto;
  }

  h1 {
    line-height: 1;
    margin: 0.5rem 0;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.h3};
    }
  }
`

const OrderButtons = styled(`div`)`
  margin: 3rem 0;

  button + button {
    margin-left: 1rem;
  }
`

const OrderSectionHeader = styled('h2')`
  margin: 4rem 0 1rem -0.1rem;
  line-height: 1;
  font-size: ${(props) => props.theme.fonts.sizes.h3};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.fonts.sizes.h4};
  }
`

const OrderCentered = styled('div')`
  display: flex;
  justify-content: center;
  max-width: ${(props) => props.theme.breakpoints.tablet};
  margin: 4rem auto;
  text-align: center;
`

const handleOrderError = (error) => {
  switch (error) {
    case 'The requested object does not exist.':
      return "We couldn't find this order. Please double check your order ID and give it another try."
    default:
      return error
  }
}

const Order = ({ order, loading, error, isConfirmation }) => {
  const {
    order_id,
    status,
    service_type,
    order_type,
    revenue_center,
    is_asap,
    requested_at,
    requested_time,
    estimated_at,
    timezone,
    delivery,
    address,
    cart,
    gift_cards,
    surcharges,
    discounts,
    taxes,
    totals,
    details,
    tenders,
    rating,
  } = order || {}
  const dispatch = useDispatch()
  const isLoading = loading === 'pending'
  const isMerch = order_type === 'MERCH'
  const errMsg = handleOrderError(error)
  const orderTypeName = makeOrderTypeName(order_type, service_type)
  const isUpcoming = isoToDate(requested_at) > new Date()
  const displayedItems = cart ? cart.map((i) => makeDisplayItem(i)) : []
  const { lookup = {} } = useSelector(selectCustomerFavorites)
  const { auth } = useSelector(selectCustomer)
  const displaySettings = useSelector(selectDisplaySettings)
  const check = { gift_cards, surcharges, discounts, taxes, totals, details }
  const {
    eating_utensils,
    serving_utensils,
    person_count,
    notes,
    tax_exempt_id,
  } = details || {}
  const hasDetails =
    eating_utensils || serving_utensils || person_count || tax_exempt_id
  const orderTitle = revenue_center
    ? `${orderTypeName} from ${revenue_center.name}`
    : ''

  const handleReorder = () => {
    const { revenue_center_id: revenueCenterId } = revenue_center
    const serviceType = service_type
    dispatch(setOrderServiceType(order_type, service_type))
    dispatch(setAddress(address || null))
    dispatch(reorderPastOrder({ revenueCenterId, serviceType, items: cart }))
  }

  const updateRating = () => {
    const args = { orderId: order_id, orderRating: rating || {} }
    dispatch(openModal({ type: 'rating', args }))
  }

  return !isEmpty(order) ? (
    <OrderView>
      <div>
        <Preface>Order #{order_id}</Preface>
        {isConfirmation ? <h2>{orderTitle}</h2> : <h1>{orderTitle}</h1>}
        {!isMerch && (
          <OrderButtons>
            {/* {auth && order.is_editable && (
              <ButtonStyled
                icon={iconMap.Edit}
                onClick={() => dispatch(editOrder(order))}
                size="small"
              >
                Edit
              </ButtonStyled>
            )} */}
            <ButtonStyled
              icon={iconMap.RefreshCw}
              onClick={handleReorder}
              size="small"
            >
              Reorder
            </ButtonStyled>
            {!isUpcoming && (
              <ButtonStyled
                icon={iconMap.Star}
                onClick={updateRating}
                size="small"
              >
                {rating ? 'Update Rating' : 'Add Rating'}
              </ButtonStyled>
            )}
          </OrderButtons>
        )}
      </div>
      <div>
        <OrderSection label="Location">
          <OrderRevenueCenter revenueCenter={revenue_center} />
        </OrderSection>
        <OrderSection label="Requested Time">
          <OrderRequestedAt
            estimated_at={estimated_at || requested_at}
            requested_time={requested_time}
            timezone={timezone}
            is_asap={is_asap}
            status={status}
          />
        </OrderSection>
        {service_type === 'DELIVERY' && address && (
          <OrderSection label="Delivery Address">
            <OrderAddress
              address={address}
              delivery={delivery}
              status={status}
            />
          </OrderSection>
        )}
        {notes && notes.length ? (
          <OrderSection label="Notes" noTitle={true}>
            <p>{notes}</p>
          </OrderSection>
        ) : null}
        {hasDetails && (
          <OrderSection label="Other Details" noTitle={true}>
            {eating_utensils ? (
              <p>
                Eating utensils included
                {person_count && ` for ${person_count} people`}
              </p>
            ) : (
              person_count && <p>30 people to be accommodated</p>
            )}
            {serving_utensils && <p>Serving utensils included</p>}
            {tax_exempt_id && <p>Tax exempt ID of {tax_exempt_id}</p>}
          </OrderSection>
        )}
        {rating ? (
          <OrderSection label="Rating">
            <OrderRating {...rating} />
          </OrderSection>
        ) : null}
      </div>
      {displayedItems.length > 0 && (
        <>
          <OrderSectionHeader>Items in Your Order</OrderSectionHeader>
          <ul>
            {displayedItems.map((item, index) => {
              const favoriteId = lookup ? lookup[item.signature] || null : null
              return (
                <li key={`${item.id}-${index}`}>
                  <CartItem
                    item={item}
                    showModifiers={true}
                    displaySettings={displaySettings}
                  >
                    <OrderQuantity
                      item={item}
                      show={auth && lookup ? true : false}
                      favoriteId={favoriteId}
                    />
                  </CartItem>
                </li>
              )
            })}
          </ul>
        </>
      )}
      <OrderSectionHeader>Your Receipt</OrderSectionHeader>
      <Check check={check} tenders={tenders} />
    </OrderView>
  ) : isLoading ? (
    <OrderCentered>
      <Loading text="Retrieving your order..." />
    </OrderCentered>
  ) : error ? (
    <OrderCentered>
      <p>{errMsg}</p>
    </OrderCentered>
  ) : null
}

Order.displayName = 'Order'
Order.propTypes = {
  order: propTypes.object,
  loading: propTypes.string,
  error: propTypes.string,
  goToAccount: propTypes.func,
}

export default Order
