import React from 'react'
import Head from 'next/head'
import './index.less'

const Layout = ({ siteTitle, children, className }) => {
  return (
    <div>
      <Head>
        <title>{siteTitle || 'pomodoro'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

export default Layout
