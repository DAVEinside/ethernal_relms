import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (error) {
  console.error('Rendering error:', error)
  root.render(
    <div className="p-4">
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  )
}