import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCustomer } from '@open-tender/redux'

import { Account, Guest } from '..'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const history = useHistory()
  const { auth } = useSelector(selectCustomer)

  useEffect(() => {
    if (!auth) return history.push('/buildings')
  }, [auth, history])

  return auth ? <Account /> : <Guest />
}

Home.displayName = 'Home'
export default Home
