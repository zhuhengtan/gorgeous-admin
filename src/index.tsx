import React from 'react'
import './index.less'
import { createRoot } from 'react-dom/client'

import App from './app'

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(<App />)
