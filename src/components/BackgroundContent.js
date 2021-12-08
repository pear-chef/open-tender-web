import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { Heading } from '@open-tender/components'

const BackgroundContentView = styled('div')`
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 5rem ${(props) => props.theme.layout.padding};
  // padding: 5rem;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  text-align: ${(props) => props.textAlign};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 2.5rem ${(props) => props.theme.layout.paddingMobile} 3.5rem;
    justify-content: center;
    align-items: flex-end;
    text-align: center;
  }
`

const BackgroundContentText = styled('div')`
  max-width: 108rem;

  p {
    color: ${(props) => props.color || props.theme.colors.light};
    // text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  }

  p:first-of-type {
    line-height: 0.9;
    font-size: ${(props) => props.theme.fonts.sizes.mega};
    color: ${(props) => props.color || props.theme.colors.light};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.h1};
    }
  }

  p + p {
    max-width: 64rem;
    margin: 2rem auto 0;
    line-height: 1.2;
    font-size: ${(props) => props.theme.fonts.sizes.h3};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: 1rem 0 0;
      font-size: ${(props) => props.theme.fonts.sizes.big};
    }
  }
`

const makeAlignment = (alignment) => {
  switch (alignment) {
    case 'TOP':
    case 'LEFT':
      return 'flex-start'
    case 'BOTTOM':
    case 'RIGHT':
      return 'flex-end'
    default:
      return 'center'
  }
}

const BackgroundContent = ({
  title,
  subtitle,
  title_color = 'ffffff',
  subtitle_color = 'ffffff',
  vertical = 'BOTTOM',
  horizontal = 'CENTER',
  hide_text = false,
}) => {
  if (!title && !subtitle) return null
  const justifyContent = makeAlignment(horizontal)
  const alignItems = makeAlignment(vertical)

  return hide_text ? null : (
    <BackgroundContentView
      justifyContent={justifyContent}
      alignItems={alignItems}
      textAlign={horizontal}
    >
      <BackgroundContentText>
        {title && (
          <Heading as="p" style={{ color: `#${title_color}` }}>
            {title}
          </Heading>
        )}
        {subtitle && <p style={{ color: `#${subtitle_color}` }}>{subtitle}</p>}
      </BackgroundContentText>
    </BackgroundContentView>
  )
}

BackgroundContent.displayName = 'BackgroundContent'
BackgroundContent.propTypes = {
  title: propTypes.string,
  subtitle: propTypes.string,
  title_color: propTypes.string,
  subtitle_color: propTypes.string,
  vertical: propTypes.string,
  horizontal: propTypes.string,
}

export default BackgroundContent
