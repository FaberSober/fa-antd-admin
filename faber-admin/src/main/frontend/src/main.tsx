import {Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, useRoutes,} from 'react-router-dom'


import './index.less'

import routes from '~react-pages'
import {PageLoading} from "@/components/antd-pro";

// eslint-disable-next-line no-console
console.log(routes)

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      {useRoutes(routes)}
    </Suspense>
  )
}

const app = createRoot(document.getElementById('root')!)

app.render(
  <Router>
    <App />
  </Router>,
)
