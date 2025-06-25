import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/seals/Monkz_logo.png" />
        <link rel="apple-touch-icon" href="/images/seals/Monkz_logo.png" />
        <meta name="theme-color" content="#f5f5f5" />
        <meta property="og:image" content="/images/seals/Monkz_logo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="824" />
        <meta property="og:image:height" content="609" />
        <meta property="og:image:alt" content="Monkz logo" />
        <meta name="twitter:image" content="/images/seals/Monkz_logo.png" />
        <meta name="twitter:image:alt" content="Monkz logo" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 