import React, { useContext, useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { AppContext } from '../App'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTheme } from '@emotion/react'

const HeaderView = styled('div')`
  position: fixed;
  z-index: 14;
  top: 0;
  right: 0;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  height: ${(props) => props.theme.layout.navHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;
  background-color: ${(props) => props.theme.bgColors[props.bgColor]};
  box-shadow: ${(props) =>
    props.stuck ? '0px 2px 24px 0px rgba(0, 0, 0, 0.09)' : 'none'};
  border: 0;
  border-bottom-width: 0.1rem;
  border-style: solid;
  border-color: ${(props) => props.theme.bgColors[props.borderColor]};
  padding: ${(props) => (props.isMobile ? '0' : props.theme.layout.padding)};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: ${(props) => props.theme.layout.navHeightMobile};
    padding: ${(props) =>
      props.isMobile ? '0' : props.theme.layout.paddingMobile};
  }
`

const HeaderTitle = styled('div')`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  > span {
    display: block;
    max-width: 26rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: ${(props) => props.theme.fonts.headings.family};
    font-weight: ${(props) => props.theme.fonts.headings.weight};
    letter-spacing: ${(props) => props.theme.fonts.headings.letterSpacing};
    text-transform: ${(props) => props.theme.fonts.headings.textTransform};
    -webkit-font-smoothing: ${(props) =>
      props.theme.fonts.headings.fontSmoothing};
    color: ${(props) => props.theme.fonts.headings.color};
    font-size: ${(props) => props.theme.fonts.sizes.xBig};
  }
`

const HeaderNav = styled('div')`
  position: relative;
  z-index: 2;

  ${(props) =>
    props.isBrowser
      ? `
    button {
    margin: 0 0 0 ${props.theme.layout.padding};

    &:first-of-type {
      margin: 0
    }
    }
  `
      : `display: flex; align-items: center;`}
`

const Header = ({
  left,
  title,
  right,
  bgColor = 'primary',
  borderColor = 'primary',
  maxWidth = '100%',
  style = null,
}) => {
  const header = useRef(null)
  const theme = useTheme()
  const { navHeight, navHeightMobile } = theme.layout
  const height = isBrowser ? navHeight : navHeightMobile
  const [stuck, setStuck] = useState(false)
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    const winRef = windowRef.current
    const handleScroll = () => {
      if (header.current) {
        setStuck(header.current.getBoundingClientRect().top < 0)
      }
    }
    winRef.addEventListener('scroll', handleScroll)
    return () => {
      winRef.removeEventListener('scroll', () => handleScroll)
    }
  }, [windowRef])

  const adjustedBorderColor =
    borderColor === 'primary' && stuck ? 'secondary' : borderColor

  return (
    <nav ref={header} role="navigation" aria-label="Primary Navigation">
      <HeaderView
        height={height}
        stuck={stuck}
        bgColor={bgColor}
        borderColor={adjustedBorderColor}
        maxWidth={maxWidth}
        isMobile={isMobile}
        style={style}
      >
        <HeaderNav>{left}</HeaderNav>
        {title && (
          <HeaderTitle>
            <span>{title}</span>
          </HeaderTitle>
        )}
        <HeaderNav isBrowser={isBrowser}>{right}</HeaderNav>
      </HeaderView>
    </nav>
  )
}

Header.displayName = 'Header'
Header.propTypes = {
  left: propTypes.element,
  title: propTypes.oneOfType([propTypes.string, propTypes.element]),
  right: propTypes.element,
  bgColor: propTypes.string,
  borderColor: propTypes.string,
  maxWidth: propTypes.string,
}

export default Header
