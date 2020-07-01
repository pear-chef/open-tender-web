import React, { useEffect } from 'react'
// import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderServiceType } from '../slices/orderSlice'
import { selectConfig } from '../slices/configSlice'
import OrderTypeButton from './OrderTypeButton'
import { Preface, Subtitle } from './styled'
// import { setOrderType } from '../reducers/testOrder'
// import { fetchRevenueCenters } from '../reducers/testRevenueCenters'
import { fetchRevenueCenters } from 'open-tender-redux'

// const Preface = styled.p`
//   color: ${(props) => props.theme.colors.secondary};
//   font-size: ${(props) => props.theme.fontSizes.small};
// `

const OrderType = () => {
  const { home: homeConfig } = useSelector(selectConfig)
  const { title, subtitle, content, buttons } = homeConfig
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchRevenueCenters({ revenue_center_type: 'OLO' }))
  }, [dispatch])

  const handleOutpost = (evt) => {
    evt.preventDefault()
    dispatch(setOrderServiceType(['OLO', 'PICKUP', true]))
    evt.target.blur()
  }

  const handlePickup = (evt) => {
    evt.preventDefault()
    dispatch(setOrderServiceType(['OLO', 'PICKUP']))
    evt.target.blur()
  }

  const handleDelivery = (evt) => {
    evt.preventDefault()
    dispatch(setOrderServiceType(['OLO', 'DELIVERY']))
    evt.target.blur()
  }

  const handleCatering = (evt) => {
    evt.preventDefault()
    dispatch(setOrderServiceType(['CATERING', 'DELIVERY']))
    evt.target.blur()
  }

  const handleMerch = (evt) => {
    evt.preventDefault()
    dispatch(setOrderServiceType(['MERCH', 'DELIVERY']))
    evt.target.blur()
  }

  const handler = {
    outpost: handleOutpost,
    pickup: handlePickup,
    delivery: handleDelivery,
    catering: handleCatering,
    merch: handleMerch,
  }

  return (
    <div className="card overlay border-radius slide-up">
      <div className="card__header">
        {/* <p className="preface font-size-small secondary-color">{subtitle}</p> */}
        <Preface className="preface">{subtitle}</Preface>
        <h1 className="ot-font-size-h3">{title}</h1>
        {/* <p className="secondary-color">{content}</p> */}
        <Subtitle>{content}</Subtitle>
      </div>
      <div className="card__content">
        {buttons.map((i) => (
          <OrderTypeButton key={i.type} {...i} handler={handler[i.type]} />
        ))}
      </div>
    </div>
  )
}

OrderType.displayName = 'OrderType'
export default OrderType
