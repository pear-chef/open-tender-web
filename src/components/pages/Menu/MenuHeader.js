import React from 'react'
import propTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  selectGroupOrder,
  selectOrder,
  selectCustomer,
} from '@open-tender/redux'
import { serviceTypeNamesMap } from '@open-tender/js'
import { Preface, Heading } from '@open-tender/components'

import { Header } from '../..'
import {
  Account,
  Allergens,
  CancelEdit,
  GroupGuest,
  GroupOrder,
  Home,
  LeaveGroup,
  Points,
  RequestedAt,
  RevenueCenter,
  ServiceType,
} from '../../buttons'
import iconMap from '../../iconMap'

const MenuHeaderTitleServiceType = styled(Preface)`
  display: block;
  line-height: 1;
  margin: 0.5rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const MenuHeaderTitleRevenueCenter = styled('button')`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.4rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.big};

  > span {
    display: inline-block;

    &:first-of-type {
      margin: 0.3rem 0.4rem 0 0;
      width: 1.6rem;
      height: 1.6rem;
    }

    &:last-of-type {
      margin: 0.2rem 0 0 0.5rem;
      width: 1.6rem;
      height: 1.6rem;
      color: ${(props) => props.theme.fonts.headings.color};
    }
  }
`

const MenuHeaderName = styled('span')`
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MenuHeaderTitle = ({
  serviceType,
  revenueCenter,
  showMenu,
  setShowMenu,
}) => {
  const serviceTypeName = serviceTypeNamesMap[serviceType]
  const orderTypeName =
    revenueCenter && revenueCenter.revenue_center_type === 'CATERING'
      ? ' Catering '
      : ''

  const toggle = (evt) => {
    evt.preventDefault()
    setShowMenu(!showMenu)
  }

  return revenueCenter ? (
    <>
      <MenuHeaderTitleServiceType>
        Ordering {orderTypeName}
        {serviceTypeName}
      </MenuHeaderTitleServiceType>
      <MenuHeaderTitleRevenueCenter onClick={toggle}>
        <span>&nbsp;</span>
        <MenuHeaderName>
          <Heading>{revenueCenter.name}</Heading>
        </MenuHeaderName>
        <span>{showMenu ? iconMap.ChevronUp : iconMap.ChevronDown}</span>
      </MenuHeaderTitleRevenueCenter>
    </>
  ) : null
}

const MenuHeader = ({
  maxWidth = '100%',
  bgColor,
  borderColor,
  showMenu,
  setShowMenu,
}) => {
  const { auth } = useSelector(selectCustomer)
  const order = useSelector(selectOrder)
  const { cartGuest } = useSelector(selectGroupOrder)
  const left = cartGuest ? <LeaveGroup /> : <Home />

  return (
    <Header
      title={
        isBrowser ? null : (
          <MenuHeaderTitle
            {...order}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
        )
      }
      maxWidth={maxWidth}
      bgColor={bgColor}
      borderColor={showMenu ? 'secondary' : borderColor}
      left={left}
      right={
        <>
          {isBrowser ? (
            <>
              {cartGuest ? (
                <>
                  <Allergens />
                  <GroupGuest />
                </>
              ) : (
                <>
                  {auth ? <Points /> : <Account />}
                  <RevenueCenter />
                  <ServiceType />
                  <RequestedAt />
                  <Allergens />
                  <GroupOrder />
                  <CancelEdit />
                </>
              )}
            </>
          ) : (
            <Allergens />
          )}
        </>
      }
    />
  )
}

MenuHeader.displayName = 'MenuHeader'
MenuHeader.propTypes = {
  maxWidth: propTypes.string,
  bgColor: propTypes.string,
  borderColor: propTypes.string,
  showMenu: propTypes.bool,
  setShowMenu: propTypes.func,
}

export default MenuHeader
