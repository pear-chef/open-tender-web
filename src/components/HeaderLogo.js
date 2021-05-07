import React from 'react'
import { useSelector } from 'react-redux'

import { selectBrand } from '../slices'
import styled from '@emotion/styled'
import { isMobile } from 'react-device-detect'

const HeaderLogoLink = styled('a')`
  display: block;
  max-width: 12rem;
  margin: 0.4rem 0 0;
  margin-left: ${(props) => (props.isMobile ? '1.5rem' : '0')};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 12rem;
  }

  img {
    pointer-events: none;
  }
`

const HeaderLogo = ({ useLight = false }) => {
  const brand = useSelector(selectBrand)
  // const logoUrl = useLight ? brand.logoLight : brand.logo

  return (
    <HeaderLogoLink
      isMobile={isMobile}
      href={brand.url}
      rel="noopener noreferrer"
    >
      <img src={brand.logoLight} alt="logo" />
    </HeaderLogoLink>
  )
}

HeaderLogo.displayName = 'HeaderLogo'

export default HeaderLogo
