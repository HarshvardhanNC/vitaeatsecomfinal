import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

if (window.location.hostname !== 'localhost') {
  axios.defaults.baseURL = 'https://vitaeatsbackend.onrender.com';
} else {
  axios.defaults.baseURL = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
