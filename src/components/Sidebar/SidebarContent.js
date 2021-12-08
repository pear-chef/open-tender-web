import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartQuantity,
  selectCartTotal,
  selectMenuSlug,
  selectCanOrder,
  selectGroupOrder,
  selectOrder,
  selectOrderLimits,
  setCart,
  closeGroupOrder,
  checkout,
} from '@open-tender/redux'
import { displayPrice } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'

import { toggleSidebar } from '../../slices'
import Cart from '../Cart'
import SidebarClose from './SidebarClose'
import styled from '@emotion/styled'

const SidebarView = styled('aside')`
  position: fixed;
  z-index: 17;
  top: 0;
  bottom: 0;
  right: 0;
  width: 48rem;
  max-width: 100%;
  background-color: ${(props) => props.theme.bgColors.primary};

  > div {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`

const SidebarHeader = styled('div')`
  width: 100%;
  padding: 2rem;
  background-color: ${(props) => props.theme.bgColors.primary};

  h2 {
    margin: 0 0 1rem;
    font-size: ${(props) => props.theme.fonts.sizes.h3};
  }

  p {
    font-size: ${(props) => props.theme.fonts.sizes.small};

    span {
      padding: 0 0.2rem;
      color: ${(props) => props.theme.fonts.headings.color};
      font-weight: ${(props) => props.theme.boldWeight};
    }
  }

  div {
    margin: 2rem auto 0;

    p {
      color: ${(props) => props.theme.colors.alert};
    }
  }
`

const SidebarCart = styled('div')`
  width: 100%;
  flex-grow: 1;
  overflow-y: scroll;
  padding: 0rem 2rem 1rem;
`

const SidebarFooter = styled('div')`
  flex-shrink: 0;
  width: 100%;
  height: 7rem;
  background-color: ${(props) => props.theme.bgColors.primary};

  button {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
`

const SidebarButtons = styled('div')`
  width: 100%;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SidebarBack = styled('div')`
  width: 50%;
  padding: 0 0.5rem 0 2rem;
`

const SidebarCheckout = styled('div')`
  width: 50%;
  padding: 0 2rem 0 0.5rem;
`

const Sidebar = React.forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { pathname } = useLocation()
  const { orderId, cart } = useSelector(selectOrder)
  const groupOrder = useSelector(selectGroupOrder)
  const { cartId, cartGuest, isCartOwner, spendingLimit } = groupOrder
  const cartCount = useSelector(selectCartQuantity)
  const cartTotal = useSelector(selectCartTotal)
  const menuSlug = useSelector(selectMenuSlug)
  const canOrder = useSelector(selectCanOrder)
  const { orderMinimum, orderMaximum } = useSelector(selectOrderLimits)
  const isMenu = pathname.includes('menu')
  const isCheckout = pathname.includes('checkout')
  const isReview = pathname.includes('review')
  const belowMinimum = orderMinimum && cartTotal < orderMinimum
  const aboveMaximum = orderMaximum && cartTotal > orderMaximum
  const notEmpty = cartCount !== 0 || (isCartOwner && isMenu)
  const canCheckout = canOrder && !belowMinimum && !aboveMaximum && notEmpty
  const showReview = cartGuest || (isMenu && isCartOwner)
  const orderMaxType =
    cartGuest && spendingLimit ? 'spending limit' : 'order maximum'

  const handleBack = () => {
    dispatch(toggleSidebar())
    if (!isMenu) history.push(menuSlug)
  }

  const handleReview = () => {
    dispatch(toggleSidebar())
    if (!isReview) history.push(`/review`)
  }

  const handleCheckout = () => {
    dispatch(toggleSidebar())
    if (!isCheckout) {
      dispatch(checkout())
      history.push(`/checkout`)
    }
  }

  const handleReopen = () => {
    const customerCart = cart.filter((i) => i.customer_id)
    dispatch(setCart(customerCart))
    dispatch(toggleSidebar())
    dispatch(closeGroupOrder(cartId, false)).then(() => {
      history.push('/review')
    })
  }

  return (
    <SidebarView ref={ref}>
      <div>
        <SidebarClose />
        <SidebarHeader>
          <h2>{orderId ? `Editing Order ${orderId}` : 'Your Order'}</h2>
          {!notEmpty ? (
            <p>Your cart is currently empty. Please add some items.</p>
          ) : (
            <p>
              <span>{cartCount} items</span> for a total of{' '}
              <span>${cartTotal.toFixed(2)}</span> before tax
            </p>
          )}
          {cartCount !== 0 && belowMinimum && (
            <div>
              <p>
                Your cart total is below the order minimum of $
                {displayPrice(orderMinimum)}. Please add some items.
              </p>
            </div>
          )}
          {aboveMaximum && (
            <div>
              <p>
                Your cart total is above the {orderMaxType} of $
                {displayPrice(orderMaximum)}. Please edit or remove one or more
                items before submitting your order.
              </p>
            </div>
          )}
        </SidebarHeader>
        <SidebarCart>
          <Cart />
        </SidebarCart>
        <SidebarFooter>
          <SidebarButtons>
            <SidebarBack>
              {isCheckout && cartId ? (
                <ButtonStyled
                  onClick={handleReopen}
                  size="big"
                  color="secondary"
                >
                  Reopen
                </ButtonStyled>
              ) : (
                <ButtonStyled
                  onClick={handleBack}
                  size="big"
                  color="secondary"
                  disabled={!canOrder}
                  label={
                    !notEmpty
                      ? 'Your cart is currently empty. Please add some items.'
                      : null
                  }
                >
                  Menu
                </ButtonStyled>
              )}
            </SidebarBack>
            <SidebarCheckout>
              {showReview ? (
                <ButtonStyled
                  onClick={handleReview}
                  size="big"
                  color="primary"
                  disabled={!canCheckout}
                >
                  {isReview
                    ? 'Close'
                    : isCartOwner
                    ? 'Review All Orders'
                    : 'Submit Order'}
                </ButtonStyled>
              ) : (
                <ButtonStyled
                  onClick={handleCheckout}
                  size="big"
                  color="primary"
                  disabled={!canCheckout}
                >
                  {isCheckout ? 'Close' : 'Checkout'}
                </ButtonStyled>
              )}
            </SidebarCheckout>
          </SidebarButtons>
        </SidebarFooter>
      </div>
    </SidebarView>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
