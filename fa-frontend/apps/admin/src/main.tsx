import {Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, useRoutes,} from 'react-router-dom'


import './index.less'

import routes from '~react-pages'
import {PageLoading} from "@/components/antd-pro";

// fontawesome icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

// eslint-disable-next-line no-console
// console.log(routes)

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      {useRoutes(routes)}
    </Suspense>
  )
}

const app = createRoot(document.getElementById('app')!)

app.render(
  <Router>
    <App />
  </Router>,
)
