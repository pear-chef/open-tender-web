import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  selectCurrentItem,
  setCurrentItem,
  addItemToCart,
  selectSoldOut,
  selectSelectedAllergenNames,
  selectGroupOrder,
  selectMenuSlug,
  showNotification,
  selectOrder,
  selectCustomerPointsProgram,
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'

import { maybeRefreshVersion } from '../../../app/version'
import { selectDisplaySettings } from '../../../slices'
import { AppContext } from '../../../App'
import { BackgroundImage, Content, Main, ScreenreaderTitle } from '../..'
import MenuItemBuilder from './MenuItemBuilder'
import iconMap from '../../iconMap'
import MenuItemClose from './MenuItemClose'

const MenuItemView = styled('div')`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
`

const MenuItemBuilderView = styled('div')`
  width: 64rem;
  background-color: ${(props) => props.theme.bgColors.primary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin: 24rem 0 0;
  }
`

const MenuItemImage = styled('div')`
  position: fixed;
  display: flex;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 64rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    right: 0;
    bottom: auto;
    height: 24rem;
  }
`

const MenuItemBack = styled('div')`
  position: fixed;
  z-index: 5;
  top: 0;
  display: flex;
  align-items: center;
  left: ${(props) => props.theme.layout.padding};
  height: ${(props) => props.theme.layout.navHeight};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }

  button {
    color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.bgColors.primary};

    &:hover,
    &:active,
    &:focus {
      color: ${(props) => props.theme.colors.primary};
      background-color: ${(props) => props.theme.bgColors.secondary};
    }
  }
`

const MenuItem = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { windowRef } = useContext(AppContext)
  const menuSlug = useSelector(selectMenuSlug)
  const item = useSelector(selectCurrentItem)
  const soldOut = useSelector(selectSoldOut)
  const allergens = useSelector(selectSelectedAllergenNames)
  const displaySettings = useSelector(selectDisplaySettings)
  const { orderType } = useSelector(selectOrder)
  const pointsProgram = useSelector(selectCustomerPointsProgram(orderType))
  const { cartId } = useSelector(selectGroupOrder)
  const imageUrl = item
    ? item.large_image_url ||
      item.small_image_url ||
      item.app_image_url ||
      item.imageUrl
    : null

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!item) history.push(menuSlug)
  }, [item, history, menuSlug])

  const cancel = () => {
    dispatch(setCurrentItem(null))
  }

  const addItem = (item) => {
    dispatch(addItemToCart(item))
    dispatch(showNotification(`${item.name} added to cart`))
    dispatch(setCurrentItem(null))
    // if (item.index) dispatch(toggleSidebar())
  }

  if (!item) return null

  return (
    <>
      <Helmet>
        <title>Menu | {item.name}</title>
      </Helmet>
      <Content hasFooter={false}>
        {isBrowser && (
          <MenuItemBack>
            <ButtonStyled
              onClick={cancel}
              icon={iconMap.ArrowLeft}
              color="header"
              size="small"
            >
              Back to Menu
            </ButtonStyled>
          </MenuItemBack>
        )}
        <Main style={{ padding: '0' }}>
          <ScreenreaderTitle>{item.name}</ScreenreaderTitle>
          <MenuItemImage>
            <BackgroundImage imageUrl={imageUrl} />
          </MenuItemImage>
          <MenuItemView>
            <MenuItemClose onClick={cancel} isButton={!isBrowser} />
            <MenuItemBuilderView>
              <MenuItemBuilder
                menuItem={item}
                addItemToCart={addItem}
                cancel={cancel}
                soldOut={soldOut}
                allergenAlerts={allergens}
                displaySettings={displaySettings}
                cartId={cartId}
                hasPoints={!!pointsProgram}
              />
            </MenuItemBuilderView>
          </MenuItemView>
        </Main>
      </Content>
    </>
  )
}

MenuItem.displayName = 'MenuItem'
export default MenuItem
