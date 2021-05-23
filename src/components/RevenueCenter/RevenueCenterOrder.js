import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  makeRevenueCenterMsg,
  makeReadableDateStrFromIso,
  timezoneMap,
  capitalize,
  todayDate,
} from '@open-tender/js'
import {
  selectOrder,
  selectGroupOrder,
  setServiceType,
} from '@open-tender/redux'
import { ButtonStyled, Message, Text } from '@open-tender/components'

import { openModal, selectConfig } from '../../slices'
import iconMap from '../iconMap'
import RevenueCenterButtons from './RevenueCenterButtons'

const RevenueCenterOrderView = styled('div')`
  margin: 1rem 0 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 1rem 0 0;
  }

  button {
    margin: 0 1rem 1rem 0;
    &:last-child {
      margin: 0;
    }
  }
`

const RevenueCenterOrderMessage = styled('div')`
  line-height: ${(props) => props.theme.lineHeight};

  + div {
    margin-top: 1.5rem;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin-top: 1rem;
    }
  }

  p {
  }
`

const RevenueCenterOrderMessageMessage = styled('p')`
  span {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      display: inline-block;
    }
  }
`

export const makeServiceTypesToday = (firstTimes) => {
  if (!firstTimes) return null
  const today = todayDate()
  const serviceTypesToday = Object.entries(firstTimes).reduce(
    (arr, [key, value]) => {
      return value.date === today ? [...arr, key] : arr
    },
    []
  )
  if (!serviceTypesToday.length) {
    return Object.keys(firstTimes)
  } else {
    return serviceTypesToday
  }
}

export const RevenueCenterOrder = ({ revenueCenter, isMenu, isLanding }) => {
  const dispatch = useDispatch()
  const { serviceType, requestedAt } = useSelector(selectOrder)
  const { cartId } = useSelector(selectGroupOrder)
  const { revenueCenters: rcConfig } = useSelector(selectConfig)
  const { statusMessages } = rcConfig || {}
  const hasGroupOrdering =
    revenueCenter && revenueCenter.settings.group_ordering
  const tz = revenueCenter ? timezoneMap[revenueCenter.timezone] : null
  const orderTime =
    requestedAt && tz ? makeReadableDateStrFromIso(requestedAt, tz, true) : null
  const { first_times } = revenueCenter ? revenueCenter.settings : {}
  const serviceTypesToday = isLanding
    ? makeServiceTypesToday(first_times)
    : null
  const msg = makeRevenueCenterMsg(
    revenueCenter,
    serviceType,
    requestedAt,
    statusMessages
  )
  const missingServiceType =
    serviceTypesToday && !serviceTypesToday.includes(serviceType)
  const firstServiceType = serviceTypesToday ? serviceTypesToday[0] : null

  useEffect(() => {
    if (
      missingServiceType &&
      firstServiceType &&
      firstServiceType !== serviceType
    ) {
      dispatch(setServiceType(firstServiceType))
    }
  }, [serviceType, missingServiceType, firstServiceType, dispatch])

  return (
    <RevenueCenterOrderView>
      {cartId && !hasGroupOrdering ? (
        <RevenueCenterOrderMessage>
          <RevenueCenterOrderMessageMessage>
            <Message color="alert" size="small">
              This location does not offer group ordering.
            </Message>
          </RevenueCenterOrderMessageMessage>
        </RevenueCenterOrderMessage>
      ) : isMenu ? (
        <div>
          {orderTime && (
            <p style={{ margin: '0 0 2rem' }}>
              <Message
                size="small"
                color="success"
                style={{ borderRadius: '0.3rem' }}
              >
                <Text bold={true}>
                  Your current {serviceType.toLowerCase()} time is {orderTime}
                </Text>
                {msg.message ? ` and ${msg.message.toLowerCase()}` : ''}.
              </Message>
            </p>
          )}
          <ButtonStyled
            icon={iconMap.RefreshCw}
            onClick={() => dispatch(openModal({ type: 'requestedAt' }))}
          >
            Change {capitalize(serviceType)} Time
          </ButtonStyled>
        </div>
      ) : (
        <>
          {msg.message && (
            <RevenueCenterOrderMessage>
              <p>
                <Message
                  size="small"
                  color={msg.color}
                  style={{ borderRadius: '0.3rem' }}
                >
                  {msg.message}
                </Message>
              </p>
            </RevenueCenterOrderMessage>
          )}
          <div>
            <RevenueCenterButtons
              revenueCenter={revenueCenter}
              isLanding={isLanding}
            />
          </div>
        </>
      )}
    </RevenueCenterOrderView>
  )
}

RevenueCenterOrder.displayName = 'RevenueCenterOrder'
RevenueCenterOrder.propTypes = {
  revenueCenter: propTypes.object,
  isMenu: propTypes.bool,
  isOrder: propTypes.bool,
}

export default RevenueCenterOrder
