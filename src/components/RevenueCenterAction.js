import React from 'react'
import propTypes from 'prop-types'

import iconMap from './iconMap'
import styled from '@emotion/styled'

const RevenueCenterActionView = styled('div')`
  display: flex;
  align-items: center;
  margin: 1.5rem 0 0;
`

const RevenueCenterActionIcon = styled('div')`
  position: relative;
  top: 0.1rem;
  width: 1.4rem;
  height: 1.5rem;
  color: ${(props) => props.theme.fonts.body.color};
`

const RevenueCenterActionArrow = styled(RevenueCenterActionIcon)`
  transition: all 0.15s ease;
  transform: translateX(0);

  a:hover &,
  button:hover & {
    transform: translateX(0.5rem);
  }
`

const RevenueCenterActionArrowText = styled('div')`
  width: 100%;
  padding: 0 1rem;

  p {
    color: ${(props) => props.theme.fonts.body.color};
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const RevenueCenterAction = ({ icon, text, arrow = 'ArrowRight' }) => {
  const iconArrow = arrow === null ? ' ' : iconMap[arrow]
  return (
    <RevenueCenterActionView>
      <RevenueCenterActionIcon>{icon}</RevenueCenterActionIcon>
      <RevenueCenterActionArrowText>
        <p>{text}</p>
      </RevenueCenterActionArrowText>
      <RevenueCenterActionArrow>{iconArrow}</RevenueCenterActionArrow>
    </RevenueCenterActionView>
  )
}

RevenueCenterAction.displayName = 'RevenueCenterAction'
RevenueCenterAction.propTypes = {
  icon: propTypes.element,
  iconClass: propTypes.string,
  text: propTypes.string,
  arrow: propTypes.string,
}

export default RevenueCenterAction
