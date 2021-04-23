import React from 'react'
import propTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { selectOrder, selectAutoSelect } from '@open-tender/redux'

import iconMap from '../iconMap'
import { ButtonBoth } from '.'

const RevenueCenter = ({
  icon = iconMap.MapPin,
  style = null,
  useButton = false,
}) => {
  const history = useHistory()
  const { revenueCenter } = useSelector(selectOrder)
  const autoSelect = useSelector(selectAutoSelect)

  const change = () => {
    history.push(`/locations/${revenueCenter.slug}`)
  }

  if (!revenueCenter || autoSelect) return null

  return (
    <ButtonBoth
      text={revenueCenter.name}
      icon={icon}
      onClick={change}
      style={style}
      useButton={useButton}
    />
  )
}

RevenueCenter.displayName = 'RevenueCenter'
RevenueCenter.propTypes = {
  icon: propTypes.element,
  style: propTypes.object,
  useButton: propTypes.bool,
}

export default RevenueCenter
