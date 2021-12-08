import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { BackgroundImage, BackgroundLoading, Slider } from '.'
import { isBrowser } from 'react-device-detect'

const PageHeroView = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    ${(props) =>
      props.hasImage
        ? `
    min-height: 100vh;
    min-height: -webkit-fill-available;`
        : ''}
  }
`

const PageHeroContent = styled('div')`
  flex: 1 0 auto;
  position: relative;
  display: flex;
  height: 50vh;
  min-height: 44rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: auto;
    min-height: 32rem;
  }
`

const PageHeroGreeting = styled('div')`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin: ${(props) => props.theme.layout.margin} 0;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: ${(props) => props.theme.layout.marginMobile} 0;
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const makeImageUrl = (images, isBrowser) => {
  return images.find(
    (i) => i.type === (isBrowser ? 'FEATURED_IMAGE' : 'SECONDARY_IMAGE')
  ).url
}

const makeSlides = (items) => {
  if (!items || !items.length) return null
  return items.map((i) => ({
    ...i,
    imageUrl: makeImageUrl(i.images, isBrowser),
  }))
}

const PageHero = ({ announcements, imageUrl, showHero, style, children }) => {
  const { settings, entities, loading, error } = announcements || {}
  const slides = error ? null : makeSlides(entities)
  const isLoading = loading === 'pending'
  // const isLoading = true
  const hasHero = imageUrl && showHero
  const hasImage = slides || hasHero

  return (
    <PageHeroView style={style} hasImage={hasImage}>
      {hasImage && (
        <PageHeroContent>
          {isLoading ? (
            <BackgroundLoading />
          ) : slides ? (
            <Slider settings={settings} slides={slides} />
          ) : hasHero ? (
            <BackgroundImage imageUrl={imageUrl} />
          ) : null}
        </PageHeroContent>
      )}
      {children && <PageHeroGreeting>{children}</PageHeroGreeting>}
    </PageHeroView>
  )
}

PageHero.displayName = 'PageHero'
PageHero.propTypes = {
  imageUrl: propTypes.string,
  announcements: propTypes.object,
  showHero: propTypes.bool,
  maxHeight: propTypes.string,
  style: propTypes.object,
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]),
}

export default PageHero
