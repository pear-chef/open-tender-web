import React from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { selectCustomer } from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'

import { openModal } from '../../slices'
import iconMap from '../iconMap'
import { NavMenu } from '.'

const Login = ({
  text = 'Log In / Sign Up',
  color = 'primary',
  size = 'small',
  style = null,
  useButton = false,
  callback = null,
}) => {
  const dispatch = useDispatch()
  const { auth } = useSelector(selectCustomer)

  const login = () => {
    dispatch(openModal({ type: 'login', args: { callback } }))
  }

  return auth ? null : isMobile ? (
    <NavMenu />
  ) : (
    <ButtonStyled
      onClick={login}
      label="Log into your account"
      icon={iconMap.UserPlus}
      color={color}
      size={size}
      style={style}
      useButton={useButton}
    >
      {text}
    </ButtonStyled>
  )
}

Login.displayName = 'Login'
Login.propTypes = {
  color: propTypes.string,
  size: propTypes.string,
  style: propTypes.object,
  useButton: propTypes.bool,
}

export default Login
