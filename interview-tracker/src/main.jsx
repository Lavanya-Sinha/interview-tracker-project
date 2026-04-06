import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import "./index.css"
import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider >
      <AuthProvider>
        <App />
    </AuthProvider>
    </ToastProvider>

  </StrictMode>,
)
