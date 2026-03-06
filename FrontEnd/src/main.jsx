import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { EvaluationProvider } from './context/EvaluationContext.jsx'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <EvaluationProvider>
        <App />
      </EvaluationProvider>
    </BrowserRouter>
  </StrictMode>,
)
