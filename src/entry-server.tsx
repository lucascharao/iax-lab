import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { setSsrData, type SsrData } from './lib/ssr-data'

export function render(url: string, data: SsrData | null = null) {
  setSsrData(data)
  try {
    return renderToString(
      <StrictMode>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </StrictMode>,
    )
  } finally {
    setSsrData(null)
  }
}
