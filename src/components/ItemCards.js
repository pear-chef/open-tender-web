import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

const ItemCardsView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -0.5rem;
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
`
const ItemCardsItem = styled('div')`
    flex: 0 0 30rem;
    max-width: 12.5%;
    padding: 0 0.5rem;
    margin: 0 0 1rem;

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
      flex: 0 0 16.66667%;
      max-width: 16.66667%;
    }
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      flex: 0 0 25%;
      max-width: 25%;
    }
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      flex: 0 0 33.33333%;
      max-width: 33.33333%
    }
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      flex: 0 0 50%;
      max-width: 50%
    }
  }
`

const ItemCards = ({ items, renderItem }) => {
  return (
    <ItemCardsView>
      {items.map((item, index) => {
        return (
          <ItemCardsItem key={`${item.id}-${index}`}>
            {renderItem({ item })}
          </ItemCardsItem>
        )
      })}
    </ItemCardsView>
  )
}

ItemCards.displayName = 'ItemCards'
ItemCards.propTypes = {
  items: propTypes.array,
  delay: propTypes.number,
  sequential: propTypes.bool,
  renderItem: propTypes.func,
}

export default ItemCards
