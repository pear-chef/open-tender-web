import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { stripTags } from '@open-tender/js'
import { Box, ButtonStyled } from '@open-tender/components'

import RevenueCenterAction from '../../RevenueCenter/RevenueCenterAction'
import iconMap from '../../iconMap'
import { BackgroundImage } from '../..'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../../slices'

const BuildingWrapper = styled('div')`
  flex: 1 0 50%;
  min-width: 64rem;
  max-width: 72rem;
  padding: 0 1.5rem 3rem;
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0s forwards;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex: 1 0 100%;
    max-width: 100%;
    min-width: 0;
    padding: 0 0 3rem;
  }
`

const BuildingView = styled(Box)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 20rem;
  background-color: ${(props) => props.theme.bgColors.primary};
  // box-shadow: 0px 6px 24px 0px rgb(211, 212, 213, 1);
`

const BuildingImage = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 24rem;
  display: flex;
  background-color: ${(props) => props.theme.bgColors.tertiary};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

const BuildingContent = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 24rem 0 0;
  padding: 1.5rem 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 1.5rem 1.5rem;
    margin: 0;
  }

  > div:first-of-type {
    flex-grow: 1;
  }

  > div:last-of-type {
    flex-grow: 0;
    margin: 1rem 0 0.2rem;
  }
`

const BuildingHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-bottom: 1rem;
  }

  & > * {
    display: block;
  }

  h2 {
    font-size: ${(props) => props.theme.fonts.sizes.h4};
  }

  p {
    padding-top: 0.4rem;
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const BuildingActions = styled('div')`
  a,
  button {
    display: block;
    width: 100%;
    text-align: left;
  }
`

const BuildingFooter = styled('div')`
  button:disabled {
    background-color: ${(props) => props.theme.bgColors.dark};
    opacity: 1;
  }
`

const Building = ({ revenueCenter }) => {
  const history = useHistory()
  const theme = useSelector(selectTheme)
  const {
    name,
    slug,
    address,
    images,
    hours,
    is_outpost,
    status,
  } = revenueCenter
  const smallImg = images.find((i) => i.type === 'SMALL_IMAGE')
  const largeImg = images.find((i) => i.type === 'SMALL_IMAGE')
  const imageUrl = smallImg.url || largeImg.url
  const hoursDesc = hours.description ? stripTags(hours.description) : null
  const hoursDescIcon = is_outpost ? iconMap.AlertCircle : iconMap.Clock
  const isComingSoon = status === 'COMING_SOON'
  const { street, city, postal_code, state } = address
  const fullAddress = `${street}, ${city}, ${state} ${postal_code}`

  const onClick = () => {
    history.push(`/locations/${slug}`)
  }

  return (
    <BuildingWrapper>
      <BuildingView>
        <BuildingImage>
          <BackgroundImage
            imageUrl={imageUrl}
            loaderColor={theme.bgColors.tertiary}
          />
        </BuildingImage>
        <BuildingContent>
          <div>
            <BuildingHeader>
              <h2>{name}</h2>
            </BuildingHeader>
            <BuildingActions>
              <a
                href={revenueCenter.directions_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <RevenueCenterAction
                  icon={iconMap.MapPin}
                  // text={address.street}
                  text={fullAddress}
                />
              </a>
              {hoursDesc && (
                <RevenueCenterAction
                  icon={hoursDescIcon}
                  text={hoursDesc}
                  arrow={null}
                />
              )}
            </BuildingActions>
          </div>
          <BuildingFooter>
            <ButtonStyled onClick={onClick} disabled={isComingSoon}>
              {isComingSoon ? 'Coming Soon!' : 'Order Here'}
            </ButtonStyled>
          </BuildingFooter>
        </BuildingContent>
      </BuildingView>
    </BuildingWrapper>
  )
}

Building.displayName = 'Building'
Building.propTypes = {
  revenueCenter: propTypes.object,
}

export default Building
