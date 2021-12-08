import React, { useContext, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { selectToken } from '@open-tender/redux'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Content,
  Main,
  PageContainer,
  PageContent,
  PageTitle,
  HeaderDefault,
} from '../..'

const NotFound = () => {
  const history = useHistory()
  const { title: siteTitle } = useSelector(selectBrand)
  const { notFound: config } = useSelector(selectConfig)
  const token = useSelector(selectToken)
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (token) return history.push('/')
  }, [token, history])

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer>
            <PageTitle {...config} />
            <PageContent>
              <Link to="/">{config.back}</Link>
            </PageContent>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

NotFound.displayName = 'NotFound'
export default NotFound
