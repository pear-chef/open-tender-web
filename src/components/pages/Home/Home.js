import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCustomer } from '@open-tender/redux'
import { useGeolocation } from '@open-tender/components'

import { Account, Guest } from '..'
import { setGeoLatLng, setGeoError, setGeoLoading } from '../../../slices'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { auth } = useSelector(selectCustomer)
  const { geoLatLng, geoError } = useGeolocation()

  useEffect(() => {
    dispatch(setGeoLoading())
  }, [dispatch])

  useEffect(() => {
    if (geoLatLng) {
      dispatch(setGeoLatLng(geoLatLng))
    } else if (geoError) {
      dispatch(setGeoError(geoError))
    }
  }, [geoLatLng, geoError, dispatch])

  useEffect(() => {
    if (!auth) return history.push('/buildings')
  }, [auth, history])

  return auth ? <Account /> : <Guest />
}

Home.displayName = 'Home'
export default Home
