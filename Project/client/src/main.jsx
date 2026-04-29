import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (window.self !== window.top) {
document.body.innerHTML = "<h2>Access Denied: Clickjacking Attempt Detected</h2>";
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
