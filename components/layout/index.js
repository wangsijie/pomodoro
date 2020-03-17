import React from 'react'
import Head from 'next/head'
import './index.less'

const Layout = ({ siteTitle, children, className }) => {
  return (
    <div>
      <Head>
        <title>{siteTitle || 'Pomodoro'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

export default Layout
