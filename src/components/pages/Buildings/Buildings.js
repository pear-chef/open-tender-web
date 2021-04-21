import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import { fetchRevenueCenters, selectRevenueCenters } from '@open-tender/redux'

import { selectBrand, selectConfig, selectTheme } from '../../../slices'
import { Account, Deals as DealsButton } from '../../buttons'
import {
  BackgroundImage,
  Content,
  Header,
  HeaderLogo,
  Loading,
  Main,
  PageContainer,
  PageContent,
} from '../..'
import Building from './Bulding'
import BuildingsInput from './BuildingsInput'

const BuildingsView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -1.5rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0;
  }
`

const BuildingsHero = styled('div')`
  position: relative;
  width: 100%;
  // min-height: 48rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: center;
  background-color: ${(props) => props.theme.bgColors.dark};
  padding: 6rem ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 3rem ${(props) => props.theme.layout.paddingMobile};
  }
`

const BuildingsHeroImage = styled('div')`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`

const BuildingsHeroContent = styled('div')`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 64rem;
`

const BuildingsHeroHeader = styled('div')`
  margin: 0 auto 3rem;
  text-align: center;

  h1 {
    line-height: 1;
    color: ${(props) => props.theme.colors.light};
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.h2};
    }
  }

  & > p {
    margin: 1rem 0 0;
    line-height: ${(props) => props.theme.lineHeight};
    // font-weight: ${(props) => props.theme.boldWeight};
    color: ${(props) => props.theme.colors.light};
    font-size: ${(props) => props.theme.fonts.sizes.big};
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      margin: 0.5rem 0 0;
      font-size: ${(props) => props.theme.fonts.sizes.main};
    }
  }
`

const checkMatch = (value, revenueCenter) => {
  if (!revenueCenter) return false
  let { name, address } = revenueCenter
  name = name.toLowerCase()
  let street = address ? address.street || '' : ''
  street = street ? street.toLowerCase() : ''
  const lower = value.toLowerCase()
  return name.includes(lower) || street.includes(lower)
}

const Buildings = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [filtered, setFiltered] = useState(null)
  const theme = useSelector(selectTheme)
  const brand = useSelector(selectBrand)
  const { revenueCenters: config } = useSelector(selectConfig)
  const { title, subtitle, background } = config
  const { has_deals } = brand
  const { revenueCenters, loading } = useSelector(selectRevenueCenters)
  const displayed = filtered || revenueCenters || []
  // console.log(filtered)

  useEffect(() => {
    dispatch(fetchRevenueCenters({ type: 'OLO' }))
  }, [dispatch])

  // useEffect(() => {
  //   if (loading === 'idle' && !filtered) {
  //     setFiltered(revenueCenters)
  //   }
  // }, [loading, revenueCenters, filtered, setFiltered])

  useEffect(() => {
    if (value) {
      const matching = revenueCenters.filter((i) => checkMatch(value, i))
      setFiltered(matching)
    } else {
      setFiltered(null)
    }
  }, [value, revenueCenters, setFiltered])

  return (
    <>
      <Helmet>
        <title>Find Your Building | {brand.title}</title>
      </Helmet>
      <Content>
        <Header
          left={<HeaderLogo />}
          right={
            <>
              {isBrowser && has_deals && <DealsButton />}
              <Account />
            </>
          }
        />
        <Main>
          <BuildingsHero>
            <BuildingsHeroImage>
              <BackgroundImage
                imageUrl={background}
                loaderColor={theme.bgColors.tertiary}
              />
            </BuildingsHeroImage>
            <BuildingsHeroContent>
              <BuildingsHeroHeader>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </BuildingsHeroHeader>
              <BuildingsInput value={value} setValue={setValue} />
            </BuildingsHeroContent>
          </BuildingsHero>
          <PageContainer style={{ maxWidth: '100%' }}>
            {/* <PageTitle {...config}>
              <BuildingsInput value={value} setValue={setValue} />
            </PageTitle> */}
            {displayed.length > 0 ? (
              <BuildingsView>
                {displayed.map((revenueCenter) => (
                  <Building
                    key={revenueCenter.revenue_center_id}
                    revenueCenter={revenueCenter}
                  />
                ))}
              </BuildingsView>
            ) : loading === 'pending' ? (
              <PageContent>
                <Loading text="Retrieving nearest locations..." />
              </PageContent>
            ) : null}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Buildings
