import renderPreact from 'preact-render-to-string'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import { GTMId, version } from '../siteInfo.js'
import type { PageContextCustom } from './_default.page.client'

export const render = async (pageContext: PageContextCustom) => {
	const { Page, pageProps } = pageContext
	const viewHtml = renderPreact(<Page {...pageProps} />)

	return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="application-name" content="hello.nrfcloud.com" />
        <title>
        hello.nrfcloud.com
        </title>
        <meta
          name="description"
          content="hello.nrfcloud.com · Retrieve real-time data from your long-range Nordic Semiconductor Development Kit within seconds."
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="/node_modules/maplibre-gl/dist/maplibre-gl.css?v=${version}"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Libre+Barcode+128&display=swap" rel="stylesheet">
        <link rel="shortcut icon" href="/static/images/logo.svg?v=${version}" />
        <meta name="version" content="${version}" />
        ${GTMScript()}
      </head>
      <body>
        ${GTMNoScript()}
        <div id="page-view">${dangerouslySkipEscape(viewHtml)}</div>
        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
    `
}

const isDevelopment = import.meta.env.MODE === 'development'
const GTMScript = () => {
	if (isDevelopment)
		return escapeInject`<!-- Google Tag Manager disabled during development -->`
	if (GTMId === undefined)
		return escapeInject`<!-- Google Tag Manager disabled (no ID defined) -->`
	return escapeInject`
  <!-- Cookie Consent -->
  <script id="CookieConsent" src="https://policy.app.cookieinformation.com/uc.js" data-culture="EN" type="text/javascript"></script>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push(
  {'gtm.start': new Date().getTime(),event:'gtm.js'}
  );var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTMId}');</script>
  <!-- End Google Tag Manager -->`
}
const GTMNoScript = () => {
	if (isDevelopment)
		return escapeInject`<!-- Google Tag Manager (noscript) disabled during development -->`
	if (GTMId === undefined)
		return escapeInject`<!-- Google Tag Manager disabled (no ID defined) -->`
	return escapeInject`<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src=https://www.googletagmanager.com/ns.html?id=${GTMId}
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`
}

export const passToClient = ['pageProps']
