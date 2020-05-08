import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCurrentItem,
  incrementItemInCart,
  decrementItemInCart,
  selectCart,
} from '../slices/orderSlice'
import {} from '../slices/orderSlice'
import { openModal } from '../slices/modalSlice'
import { BuilderOptionWrapper, BuilderQuantity } from './packages'

const Cart = () => {
  const dispatch = useDispatch()
  const cart = useSelector(selectCart)

  const handleClick = (evt, item) => {
    evt.preventDefault()
    dispatch(setCurrentItem(item))
    dispatch(openModal('item'))
    evt.target.blur()
  }

  return cart.length ? (
    <ul className="cart bg-color border-radius">
      {cart.map((item, index) => {
        return (
          <li key={`${item.id}-${index}`}>
            <BuilderOptionWrapper
              option={item}
              editItem={(evt) => handleClick(evt, item)}
            >
              <BuilderQuantity
                item={item}
                adjust={null}
                increment={() => dispatch(incrementItemInCart(index))}
                decrement={() => dispatch(decrementItemInCart(index))}
                incrementDisabled={item.quantity === item.max}
                decrementDisabled={false}
                classes={null}
              />
            </BuilderOptionWrapper>
          </li>
        )
      })}
    </ul>
  ) : null
}

Cart.displayName = 'Cart'

export default Cart
