import React from 'react'
import propTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { addCustomerFavorite, removeCustomerFavorite } from '@open-tender/redux'
import { makeSimpleCart } from '@open-tender/js'

import iconMap from '../iconMap'
import styled from '@emotion/styled'

const FavoriteView = styled('button')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  text-align: center;
  width: ${(props) => props.theme.favorite.size};
  height: ${(props) => props.theme.favorite.size};
  border-radius: ${(props) => props.theme.favorite.size};
  color: ${(props) => props.theme.buttons.colors[props.color].color};
  background-color: ${(props) =>
    props.theme.buttons.colors[props.color].bgColor};

  &:hover,
  &:active,
  &:focus {
    color: ${(props) =>
      props.theme.buttons.colors[`${props.color}Hover`].color};
    background-color: ${(props) =>
      props.theme.buttons.colors[`${props.color}Hover`].bgColor};
  }
`

const FavoriteIcon = styled('span')`
  display: block;
  line-height: 0;
  width: ${(props) => props.theme.favorite.iconSize};
  height: ${(props) => props.theme.favorite.iconSize};
`

const Favorite = ({ item, favoriteId }) => {
  const dispatch = useDispatch()

  const handleAdd = (evt) => {
    evt.preventDefault()
    const cart = makeSimpleCart([item])[0]
    delete cart.quantity
    const data = { cart }
    dispatch(addCustomerFavorite(data))
  }

  const handleRemove = (evt) => {
    evt.preventDefault()
    dispatch(removeCustomerFavorite(favoriteId))
  }

  return (
    <FavoriteView
      onClick={favoriteId ? handleRemove : handleAdd}
      color={favoriteId ? 'secondary' : 'primary'}
      aria-label={favoriteId ? 'Remove favorite' : 'Add favorite'}
    >
      <FavoriteIcon>{iconMap.Heart}</FavoriteIcon>
    </FavoriteView>
  )
}

Favorite.displayName = 'Favorite'
Favorite.propTypes = {
  item: propTypes.object,
  favoriteId: propTypes.number,
  classes: propTypes.string,
}

export default Favorite
