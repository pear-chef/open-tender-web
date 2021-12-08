import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  selectCurrentItem,
  setCurrentItem,
  addItemToCart,
  selectSoldOut,
  selectSelectedAllergenNames,
  showNotification,
  selectGroupOrder,
} from '@open-tender/redux'
import { Builder, BuilderOption, BuilderHeader } from '@open-tender/components'

import { toggleSidebarModal, selectDisplaySettings } from '../../../slices'

import iconMap from '../../iconMap'
import { ImageSpinner } from '../..'
import SidebarModalClose from '../../SidebarModal/SidebarModalClose'
import { isMobile } from 'react-device-detect'

const menuItemsIconMap = {
  plus: iconMap.Plus,
  minus: iconMap.Minus,
}

const BuilderView = styled('aside')`
  position: fixed;
  z-index: 18;
  top: 0;
  bottom: 0;
  right: 0;
  width: 64rem;
  max-width: 100%;
  background-color: ${(props) => props.theme.bgColors.primary};

  > div {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`

const MenuItem = React.forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const item = useSelector(selectCurrentItem)
  const soldOut = useSelector(selectSoldOut)
  const allergens = useSelector(selectSelectedAllergenNames)
  const displaySettings = useSelector(selectDisplaySettings)
  const { cartId } = useSelector(selectGroupOrder)

  useEffect(() => {
    return () => dispatch(setCurrentItem(null))
  }, [dispatch])

  const cancel = () => {
    dispatch(toggleSidebarModal())
    setTimeout(() => {
      dispatch(setCurrentItem(null))
    }, 275)
  }

  const addItem = (item) => {
    dispatch(addItemToCart(item))
    dispatch(showNotification(`${item.name} added to cart`))
    dispatch(toggleSidebarModal())
    setTimeout(() => {
      dispatch(setCurrentItem(null))
    }, 275)
  }

  return (
    <BuilderView ref={ref}>
      <div>
        <SidebarModalClose
          label="Cancel"
          onClick={cancel}
          isButton={isMobile}
        />
        {item && (
          <Builder
            menuItem={item}
            soldOut={soldOut}
            allergens={allergens}
            addItemToCart={addItem}
            renderHeader={(props) => <BuilderHeader {...props} />}
            renderOption={(props) => <BuilderOption {...props} />}
            showImage={true}
            displaySettings={displaySettings}
            iconMap={menuItemsIconMap}
            closeModal={cancel}
            cartId={cartId}
            spinner={<ImageSpinner />}
          />
        )}
      </div>
    </BuilderView>
  )
})

MenuItem.displayName = 'MenuItem'

export default MenuItem
