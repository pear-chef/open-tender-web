import React from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrder, selectCustomerPoints } from '@open-tender/redux'
import { formatQuantity } from '@open-tender/js'
import { ButtonStyled } from '@open-tender/components'

import { openModal } from '../../slices'
import iconMap from '../iconMap'
import styled from '@emotion/styled'

const PointsTitle = styled('span')`
  // font-family: ${(props) => props.theme.fonts.headings.family};
  // font-weight: ${(props) => props.theme.fonts.headings.weight};
  // font-size: ${(props) => props.theme.buttons.sizes.header.fontSize};
`

const PointsIcon = styled('span')`
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  margin: 0 0 0 0.4rem;
`

const defaultStyle = { paddingTop: '0', paddingBottom: '0', height: '3.2rem' }

const Points = ({ color = 'cart', size = 'small', style = defaultStyle }) => {
  const dispatch = useDispatch()
  const order = useSelector(selectOrder)
  const loyaltyPoints = useSelector(selectCustomerPoints(order.orderType))
  const { name, points } = loyaltyPoints || {}

  const onClick = () => {
    dispatch(openModal({ type: 'points' }))
  }

  return points ? (
    <ButtonStyled
      onClick={onClick}
      label={`${name} balance`}
      icon={null}
      color={color}
      size={size}
      style={style}
    >
      <PointsTitle>{formatQuantity(points)}</PointsTitle>
      <PointsIcon>{iconMap.Star}</PointsIcon>
    </ButtonStyled>
  ) : null
}

Points.displayName = 'Points'
Points.propTypes = {
  color: propTypes.string,
  size: propTypes.string,
  style: propTypes.object,
}

export default Points
