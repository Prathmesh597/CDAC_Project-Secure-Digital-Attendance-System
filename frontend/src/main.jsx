import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// IMPORT BOOTSTRAP HERE
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap App in BrowserRouter to enable navigation */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)