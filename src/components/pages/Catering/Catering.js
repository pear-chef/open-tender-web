import React, { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import { Helmet } from 'react-helmet'
import {
  selectOrder,
  setServiceType,
  setRequestedAt,
  resetOrder,
  setOrderServiceType,
  fetchValidTimes,
  selectValidTimes,
} from '@open-tender/redux'
import {
  isoToDate,
  dateToIso,
  timezoneMap,
  getUserTimezone,
  time24ToDate,
  makeLocalDate,
  makeLocalDateStr,
  todayDate,
  makeWeekdayIndices,
  getMinutesfromDate,
  makeRequestedAtStr,
} from '@open-tender/js'
import {
  ButtonLink,
  ButtonStyled,
  RequestedAtPicker,
  Text,
} from '@open-tender/components'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import { AppContext } from '../../../App'
import iconMap from '../../iconMap'
import { Content, Header, Loading, Main, PageTitle } from '../..'
import { Account, StartOver } from '../../buttons'
import styled from '@emotion/styled'

const CateringView = styled('div')`
  width: 100%;
  flex-grow: 1;
  min-height: 50rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    display: block;
    padding: 0;
  }
`

const CateringContent = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 108rem;
  max-width: 100%;
  padding: 4.5rem;
  margin: ${(props) => props.theme.layout.margin} auto;
  background-color: ${(props) => props.theme.overlay.light};
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    flex-direction: column;
    background-color: ${(props) => props.theme.bgColors.primary};
    padding: ${(props) => props.theme.layout.paddingMobile};
    // margin: ${(props) => props.theme.layout.marginMobile} auto;
    margin: 0;
  }
`
const CateringMessage = styled('div')`
  flex: 1 1 auto;
  padding: 0 3rem 0 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    padding: 0;
  }

  div:first-of-type {
    text-align: left;
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      text-align: center;
    }
  }
`

const CateringCalendar = styled('div')`
  flex-grow: 0;
  flex-shrink: 0;
  width: 37rem;
  min-height: 43rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    width: 100%;
    min-height: 0;
  }
`

const CateringCalendarSelected = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.125s forwards;
  margin: 5rem 0 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    margin: 0;
  }
`

const CateringCalendarDatepicker = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.125s forwards;
`

const CateringError = styled('div')`
  padding: 0 3rem;
  text-align: center;

  p:first-of-type {
    color: ${(props) => props.theme.colors.error};
    margin: 0 0 2rem;
  }
`

const RequestedAtMessage = styled('p')`
  width: 100%;
  margin: 2rem 0;
  text-align: center;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  line-height: ${(props) => props.theme.lineHeight};

  span,
  button {
    font-weight: ${(props) => props.theme.boldWeight};
  }
`

const CateringButtons = styled('div')`
  margin: -1rem -0.5rem 0;
  text-align: center;

  button {
    margin: 1rem 0.5rem 0;
  }
`

const CateringPolicy = styled('div')`
  margin: 3rem 0;

  h2 {
    font-size: ${(props) => props.theme.fonts.sizes.h4};
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      width: 100%;
      text-align: center;
    }
  }

  // h2 + p {
  //   margin: 0.5rem 0 2rem;
  //   // font-size: ${(props) => props.theme.fonts.sizes.main};
  // }

  // div {
  //   text-align: left;
  // }

  div p {
    margin: 1em 0;
    font-size: ${(props) => props.theme.fonts.sizes.small};
    line-height: ${(props) => props.theme.lineHeight};
  }
`

const CateringDesktop = styled('div')`
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    display: none;
  }
`

const CateringMobile = styled('div')`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    display: block;
    text-align: center;
    margin: 0 auto 3rem;
  }
`

const CateringContentSection = ({ policy, startOver }) => {
  return (
    <>
      <CateringPolicy>
        {policy.title && <h2>{policy.title}</h2>}
        {/* {policy.subtitle && <p>{policy.subtitle}</p>} */}
        {policy.content.length > 0 && (
          <div>
            {policy.content.map((i, index) => (
              <p key={index}>{i}</p>
            ))}
          </div>
        )}
      </CateringPolicy>
      <div>
        <ButtonLink onClick={startOver}>
          Switch to a regular Pickup or Delivery order
        </ButtonLink>
      </div>
    </>
  )
}

const CateringPage = () => {
  const { windowRef } = useContext(AppContext)
  const history = useHistory()
  const dispatch = useDispatch()
  const { title: siteTitle } = useSelector(selectBrand)
  const { catering: config } = useSelector(selectConfig)
  const { title, subtitle, background, policy } = config
  const { orderType, serviceType, requestedAt, revenueCenter } =
    useSelector(selectOrder)
  const hasTypes = orderType && serviceType
  const { timezone } = revenueCenter || {}
  const tz = timezone ? timezoneMap[timezone] : getUserTimezone()
  const [date, setDate] = useState(null)
  const [minTime, setMinTime] = useState(new Date())
  const [settings, setSettings] = useState(null)
  const { entity: validTimes, loading, error } = useSelector(selectValidTimes)
  const isLoading = loading === 'pending'
  const requestedTime = requestedAt
    ? makeRequestedAtStr(requestedAt, tz, true)
    : null

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (!hasTypes) {
      dispatch(setOrderServiceType('CATERING', 'DELIVERY'))
    }
    dispatch(fetchValidTimes('CATERING'))
  }, [hasTypes, dispatch])

  // useEffect(() => {
  //   const requestedAtDate =
  //     !requestedAt || requestedAt === 'asap' ? null : isoToDate(requestedAt, tz)
  //   if (validTimes) {
  //     const {
  //       first_time,
  //       holidays,
  //       hours,
  //       interval,
  //       closed_weekdays,
  //     } = validTimes
  //     if (!first_time) {
  //       setDate(requestedAtDate)
  //     } else {
  //       const firstDate = isoToDate(first_time.utc, tz)
  //       const newDate =
  //         !requestedAtDate || firstDate > requestedAtDate
  //           ? firstDate
  //           : requestedAtDate
  //       setDate(newDate)
  //       const closedWeekdays = makeWeekdayIndices(closed_weekdays)
  //       const isClosed = (date) => {
  //         return !closedWeekdays.includes(date.getDay())
  //       }
  //       const newSettings = {
  //         minDate: firstDate,
  //         minTime: time24ToDate(hours.open),
  //         maxTime: time24ToDate(hours.close),
  //         excludeDates: holidays.map((i) => makeLocalDate(i)),
  //         interval: interval,
  //         isClosed: isClosed,
  //       }
  //       setSettings(newSettings)
  //     }
  //   } else {
  //     setDate(requestedAtDate)
  //   }
  // }, [validTimes, requestedAt, tz])

  useEffect(() => {
    if (validTimes) {
      const { first_time, holidays, hours, interval, closed_weekdays } =
        validTimes
      const firstDate = isoToDate(first_time.utc, tz)
      const closedWeekdays = makeWeekdayIndices(closed_weekdays)
      const isClosed = (date) => {
        return !closedWeekdays.includes(date.getDay())
      }
      const newSettings = {
        minDate: firstDate,
        minTime: time24ToDate(hours.open),
        maxTime: time24ToDate(hours.close),
        excludeDates: holidays.map((i) => makeLocalDate(i)),
        interval: interval,
        isClosed: isClosed,
      }
      setSettings(newSettings)
    }
  }, [validTimes, requestedAt, tz])

  useEffect(() => {
    if (settings && date) {
      const dateStr = makeLocalDateStr(date)
      if (dateStr === todayDate()) {
        const newMinTime =
          settings.minDate > settings.minTime
            ? settings.minDate
            : settings.minTime
        setMinTime(newMinTime)
      } else {
        setMinTime(settings.minTime)
      }
    }
  }, [date, settings])

  const resetTime = () => {
    dispatch(setRequestedAt(null))
  }

  const chooseServiceType = (serviceType) => {
    dispatch(setServiceType(serviceType))
    history.push('/locations')
  }

  const startOver = () => {
    dispatch(resetOrder())
    history.push(`/order-type`)
  }

  const selectTime = (time) => {
    setDate(null)
    setTimeout(() => {
      const reqestedAtIso = time ? dateToIso(time, tz) : 'asap'
      dispatch(setRequestedAt(reqestedAtIso))
    }, 300)
  }

  const startMin = getMinutesfromDate(minTime || settings.minTime)
  const endMin = settings ? getMinutesfromDate(settings.maxTime) : null

  return (
    <>
      <Helmet>
        <title>
          {title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <Header left={<StartOver />} right={<Account />} />
        <Main
          imageUrl={isBrowser ? background : null}
          // style={{ backgroundPosition: 'center top' }}
        >
          <CateringView>
            <CateringContent>
              <CateringMessage>
                <PageTitle title={title} subtitle={subtitle} />
                <CateringDesktop>
                  <CateringContentSection
                    policy={policy}
                    startOver={startOver}
                  />
                </CateringDesktop>
              </CateringMessage>
              <CateringCalendar>
                {error ? (
                  <CateringError>
                    <p>{error}</p>
                    <ButtonStyled icon={iconMap.RefreshCw} onClick={startOver}>
                      Start Over
                    </ButtonStyled>
                  </CateringError>
                ) : isLoading ? (
                  <Loading type="Clip" size={50} />
                ) : settings ? (
                  <>
                    {requestedTime ? (
                      <CateringCalendarSelected>
                        <RequestedAtMessage>
                          Your selected order time is{' '}
                          <span>{requestedTime}</span>. Choose an order type to
                          proceed.
                        </RequestedAtMessage>
                        <CateringButtons>
                          <ButtonStyled
                            icon={iconMap.ShoppingBag}
                            onClick={() => chooseServiceType('PICKUP')}
                            disabled={!requestedTime}
                          >
                            Order Pickup
                          </ButtonStyled>
                          <ButtonStyled
                            icon={iconMap.Truck}
                            onClick={() => chooseServiceType('DELIVERY')}
                            disabled={!requestedTime}
                          >
                            Order Delivery
                          </ButtonStyled>
                        </CateringButtons>
                        <RequestedAtMessage>
                          <ButtonLink onClick={resetTime}>
                            Click here to choose a different time.
                          </ButtonLink>
                        </RequestedAtMessage>
                      </CateringCalendarSelected>
                    ) : (
                      <CateringCalendarDatepicker>
                        <RequestedAtMessage>
                          <Text>
                            Please choose a date & time to get started.
                          </Text>
                        </RequestedAtMessage>
                        <RequestedAtPicker
                          date={date}
                          setDate={(date) => setDate(date)}
                          selectTime={selectTime}
                          minDate={settings.minDate}
                          maxDate={null}
                          excludeDates={settings.excludeDates}
                          filterDate={settings.isClosed}
                          interval={settings.interval || 15}
                          excludeTimes={[]}
                          minTime={startMin}
                          maxTime={endMin}
                        />
                      </CateringCalendarDatepicker>
                    )}
                  </>
                ) : (
                  <CateringError>
                    <p>This order type isn't currently available</p>
                    <ButtonStyled icon={iconMap.RefreshCw} onClick={startOver}>
                      Start Over
                    </ButtonStyled>
                  </CateringError>
                )}
              </CateringCalendar>
              <CateringMobile>
                <CateringContentSection policy={policy} startOver={startOver} />
              </CateringMobile>
            </CateringContent>
          </CateringView>
        </Main>
      </Content>
    </>
  )
}

CateringPage.displayName = 'CateringPage'
export default CateringPage
