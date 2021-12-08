import propTypes from 'prop-types'
import styled from '@emotion/styled'
import {
  BuilderBody,
  BuilderFooter,
  BuilderHeader,
  BuilderOption,
  useBuilder,
} from '@open-tender/components'

import iconMap from '../../iconMap'

const footerHeight = '8rem'
const footerHeightMobile = '7rem'

const menuItemsIconMap = {
  plus: iconMap.Plus,
  minus: iconMap.Minus,
}

const MenuItemBuilderView = styled('form')`
  position: relative;
  display: block;
  width: 100%;
  padding: 0 0 ${footerHeight};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 0 ${footerHeightMobile};
  }
`

const MenuItemBuilderContent = styled('div')``

const MenuItemBuilderFooterContainer = styled('div')`
  position: fixed;
  z-index: 1;
  bottom: 0;
  right: 0;
  width: 64rem;
  background-color: ${(props) => props.theme.bgColors.primary};
  height: ${footerHeight};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    height: ${footerHeightMobile};
  }

  & > div {
    height: 100%;
    box-shadow: 1.5rem -0.3rem 1.5rem rgba(0, 0, 0, 0.1);
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      box-shadow: 0 -0.3rem 1.5rem rgba(0, 0, 0, 0.1);
    }
  }
`

const MenuItemBuilder = ({
  menuItem,
  addItemToCart,
  cancel,
  soldOut,
  allergenAlerts,
  displaySettings,
  cartId,
  hasPoints,
}) => {
  const {
    item,
    increment,
    decrement,
    setQuantity,
    setMadeFor,
    setNotes,
    toggleOption,
    incrementOption,
    decrementOption,
    setOptionQuantity,
  } = useBuilder(menuItem, soldOut, hasPoints)
  const headerDisplaySettings = { ...displaySettings, builderImages: false }
  return (
    <MenuItemBuilderView>
      <MenuItemBuilderContent>
        <BuilderHeader
          item={item}
          displaySettings={headerDisplaySettings}
          pointsIcon={hasPoints ? iconMap.Star : null}
        />
        <BuilderBody
          allergens={allergenAlerts}
          renderOption={(props) => <BuilderOption {...props} />}
          iconMap={menuItemsIconMap}
          displaySettings={displaySettings}
          cartId={cartId}
          item={item}
          setMadeFor={setMadeFor}
          setNotes={setNotes}
          toggleOption={toggleOption}
          incrementOption={incrementOption}
          decrementOption={decrementOption}
          setOptionQuantity={setOptionQuantity}
        />
      </MenuItemBuilderContent>
      <MenuItemBuilderFooterContainer>
        <BuilderFooter
          item={item}
          iconMap={menuItemsIconMap}
          addItemToCart={addItemToCart}
          setQuantity={setQuantity}
          increment={increment}
          decrement={decrement}
          pointsIcon={hasPoints ? iconMap.Star : null}
        />
      </MenuItemBuilderFooterContainer>
    </MenuItemBuilderView>
  )
}

MenuItemBuilder.displayName = 'MenuItemBuilder'
MenuItemBuilder.propTypes = {
  menuItem: propTypes.object,
  addItemToCart: propTypes.func,
  cancel: propTypes.func,
  soldOut: propTypes.array,
  allergenAlerts: propTypes.array,
  displaySettings: propTypes.object,
  cartId: propTypes.number,
  hasPoints: propTypes.bool,
}

export default MenuItemBuilder
