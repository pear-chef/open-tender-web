import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import {
  selectOrder,
  selectGroupOrder,
  resetGroupOrder,
  updateGroupOrder,
  reloadGuestOrder,
  resetOrder,
  selectMenuSlug,
} from '@open-tender/redux'
import { Message, CartItem, ButtonStyled } from '@open-tender/components'

import { selectConfig, selectDisplaySettings } from '../../../slices'
import iconMap from '../../iconMap'
import {
  Content,
  Header,
  Loading,
  Main,
  OrderQuantity,
  PageTitle,
  PageContainer,
  PageContent,
} from '../..'
import { Menu, StartOver } from '../../buttons'
import { GroupOrderCartView } from './GroupOrderReview'

const makeSubtitle = (error, cart, firstName, config) => {
  if (!error) {
    return config.subtitle
  } else {
    if (cart.length) {
      return 'This group order is now closed for editing, but the items below have been added.'
    } else {
      return `We're sorry, but this group order is already closed. Please contact ${firstName} to see if they can reopen it.`
    }
  }
}

const GroupOrderReviewGuest = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { groupOrders: config } = useSelector(selectConfig)
  const menuSlug = useSelector(selectMenuSlug)
  const { cart } = useSelector(selectOrder)
  const displaySettings = useSelector(selectDisplaySettings)
  const groupOrder = useSelector(selectGroupOrder)
  const {
    loading,
    error,
    cartOwner,
    cart: groupCart,
    cartGuest,
    closed,
  } = groupOrder
  const { cartGuestId } = cartGuest || {}
  const firstName = cartOwner ? cartOwner.first_name : ''
  const isLoading = loading === 'pending'
  const subtitle = makeSubtitle(error, groupCart, firstName, config)

  useEffect(() => {
    error ? dispatch(reloadGuestOrder()) : dispatch(updateGroupOrder())
  }, [dispatch, error, cartGuestId])

  const startOver = () => {
    dispatch(resetGroupOrder())
    dispatch(resetOrder())
    history.push('/')
  }

  return (
    <>
      <Content>
        <Header
          left={closed || error ? <StartOver /> : <Menu />}
          right={null}
        />
        <Main>
          <PageContainer>
            <PageTitle title={config.title} subtitle={subtitle}>
              {isLoading && (
                <Loading text="Submitting your order to the group..." />
              )}
            </PageTitle>
            {!isLoading && (
              <>
                <PageContent style={{ margin: '3rem auto' }}>
                  {!error ? (
                    <p>
                      <Link to={menuSlug}>
                        Click here to head back to the menu and make changes to
                        your order.
                      </Link>
                    </p>
                  ) : cart.length ? (
                    <Message color="alert">
                      This group order was closed while you were making updates
                      on the menu page, but the items you previously submitted
                      are listed below. Please contact {firstName} if you need
                      to make any changes.
                    </Message>
                  ) : null}
                  <p>
                    Want to start a new order just for you? Use the button
                    below.
                  </p>
                  <p>
                    <ButtonStyled icon={iconMap.RefreshCw} onClick={startOver}>
                      Start A New Order
                    </ButtonStyled>
                  </p>
                </PageContent>
                {cart.length > 0 && (
                  <GroupOrderCartView>
                    <h2>Items submitted to {firstName}'s group order</h2>
                    <ul>
                      {cart.map((item, index) => {
                        return (
                          <li key={`${item.id}-${index}`}>
                            <CartItem
                              item={item}
                              showModifiers={true}
                              displaySettings={displaySettings}
                            >
                              <OrderQuantity item={item} show={false} />
                            </CartItem>
                          </li>
                        )
                      })}
                    </ul>
                  </GroupOrderCartView>
                )}
              </>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

GroupOrderReviewGuest.displayName = 'GroupOrderReviewGuest'
export default GroupOrderReviewGuest
