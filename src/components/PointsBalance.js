import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { formatQuantity } from '@open-tender/js'
import { Heading } from '@open-tender/components'

import iconMap from './iconMap'

const PointsBalanceView = styled('div')`
  text-align: center;
`

const PointsBalancePoints = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    display: block;
    font-size: ${(props) => props.theme.fonts.sizes.h1};
    margin: 0;
    // line-height: 1;
  }

  span {
    display: block;
    width: 3rem;
    height: 3rem;
    margin: 0 0 0 0.5rem;
    line-height: 0;
    color: ${(props) => props.theme.colors.primary};
  }
`

const PointsBalance = ({ name, points }) => {
  return (
    <PointsBalanceView>
      <PointsBalancePoints>
        <Heading as="p">{formatQuantity(points)}</Heading>
        <span>{iconMap.Star}</span>
      </PointsBalancePoints>
      <p>{name} Balance</p>
    </PointsBalanceView>
  )
}

PointsBalance.displayName = 'PointsBalance'
PointsBalance.propTypes = {
  name: propTypes.string,
  points: propTypes.number,
}

export default PointsBalance
