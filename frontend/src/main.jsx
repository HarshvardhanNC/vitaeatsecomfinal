import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://vitaeatsecomfinal.onrender.com';
} else {
  axios.defaults.baseURL = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
