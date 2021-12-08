import React from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
  timezoneMap,
  makeRequestedAtStr,
  makeEstimatedTime,
  serviceTypeNamesMap,
} from '@open-tender/js'
import {
  selectOrder,
  setRequestedAt,
  showNotification,
} from '@open-tender/redux'
import {
  ButtonStyled,
  RequestedAtCalendar,
  RequestedAtTimes,
} from '@open-tender/components'

import { closeModal, toggleSidebar } from '../../slices'
import { ModalContent } from '..'
import styled from '@emotion/styled'
import ModalView from '../Modal/ModalView'

const RequestedAtModalView = styled(ModalView)`
  width: ${(props) => props.width};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-width: 100%;
    min-height: 100%;
    margin: 0;
    border-radius: 0;
  }

  & > div {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding: 3rem ${(props) => props.theme.layout.paddingMobile};
    }
  }
`

const RequestedAtMessage = styled('p')`
  margin: 0 0 1.5rem;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  line-height: ${(props) => props.theme.lineHeight};
  // color: ${(props) => props.theme.colors.alert};

  span {
    font-weight: 600;
  }
`

const RequestedAtPickerButtons = styled('div')`
  display: flex;
  align-items: center;
  margin: 0 -0.5rem 1.5rem;

  div {
    width: 50%;
    padding: 0 0.5rem;

    button {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }
  }
`

const RequestedAt = ({
  forcedUpdate = false,
  openSidebar = false,
  onCloseAction,
}) => {
  const dispatch = useDispatch()
  const { requestedAt, serviceType, revenueCenter } = useSelector(selectOrder)
  const { settings } = revenueCenter || {}
  const { first_times, order_times } = settings || {}
  const st = serviceType === 'WALKIN' ? 'PICKUP' : serviceType
  const firstTimes = first_times ? first_times[st] : null
  const orderTimes = order_times ? order_times[st] : null
  const hasAsap = firstTimes && firstTimes.has_asap ? true : false
  if (!revenueCenter) return null
  const tz = timezoneMap[revenueCenter.timezone]
  const estimatedTime = makeEstimatedTime(
    requestedAt,
    revenueCenter,
    serviceType
  )
  const requestedAtText = makeRequestedAtStr(requestedAt, tz, true)
  const requestedTime = `${requestedAtText}${
    estimatedTime ? ` (${estimatedTime})` : ''
  }`
  const serviceTypeName = serviceTypeNamesMap[serviceType].toLowerCase()

  const handleRequestedAt = (requestedAt) => {
    dispatch(closeModal())
    dispatch(setRequestedAt(requestedAt))
    dispatch(showNotification('Requested time updated!'))
    if (onCloseAction) dispatch(onCloseAction())
    if (openSidebar) dispatch(toggleSidebar())
  }

  const handleKeepCurrent = () => {
    dispatch(closeModal())
    dispatch(setRequestedAt(requestedAt))
    if (onCloseAction) dispatch(onCloseAction())
    if (openSidebar) dispatch(toggleSidebar())
  }

  return (
    <RequestedAtModalView width={firstTimes ? '44rem' : '56rem'}>
      {firstTimes ? (
        <ModalContent
          title={
            forcedUpdate
              ? 'Order date & time updated'
              : 'Choose an order date & time'
          }
        >
          {forcedUpdate ? (
            <RequestedAtMessage>
              Your previous order time is no longer available and has been
              updated to <span>{requestedTime}</span>.
            </RequestedAtMessage>
          ) : (
            <RequestedAtMessage>
              Your current order time is <span>{requestedTime}</span>.
            </RequestedAtMessage>
          )}
          <RequestedAtPickerButtons>
            <div>
              <ButtonStyled onClick={handleKeepCurrent}>
                Keep This Time
              </ButtonStyled>
            </div>
            {hasAsap && requestedAt !== 'asap' && (
              <div>
                <ButtonStyled
                  onClick={() => handleRequestedAt('asap')}
                  color="secondary"
                >
                  Switch to ASAP
                </ButtonStyled>
              </div>
            )}
          </RequestedAtPickerButtons>
          <RequestedAtMessage>
            Or use the calendar below to choose a different time.
          </RequestedAtMessage>
          <RequestedAtCalendar
            serviceType={serviceType}
            revenueCenter={revenueCenter}
            setRequestedAt={handleRequestedAt}
          />
        </ModalContent>
      ) : orderTimes ? (
        <ModalContent
          title="Choose an order date & time"
          subtitle={
            <p>
              Please select from the available {serviceTypeName} times below
            </p>
          }
        >
          <RequestedAtTimes
            orderTimes={orderTimes}
            revenueCenter={revenueCenter}
            requestedAt={requestedAt}
            setRequestedAt={handleRequestedAt}
          />
        </ModalContent>
      ) : null}
    </RequestedAtModalView>
  )
}

RequestedAt.displayName = 'RequestedAt'
RequestedAt.propTypes = {
  forcedUpdate: propTypes.bool,
  openSidebar: propTypes.bool,
  onCloseAction: propTypes.func,
}

export default RequestedAt
