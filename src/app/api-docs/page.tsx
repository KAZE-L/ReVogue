'use client'

import { useEffect } from 'react'

export default function ApiDocs() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js'
    script.async = true
    script.onload = () => {
      // @ts-ignore
      window.SwaggerUIBundle({
        url: '/api/swagger',
        dom_id: '#swagger-ui',
      })
    }
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist/swagger-ui.css'
    document.head.appendChild(link)

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return <div id="swagger-ui" />
}