import App from "./App.jsx"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import axios from 'axios';
import './index.css'

// Global Axios Configuration for Production & Local Development
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

