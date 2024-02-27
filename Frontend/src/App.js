import './index.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Login from './pages/Login'
import { AppStateProvider } from './AppStateContext';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const clientIdKey = process.env.REACT_APP_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientIdKey}>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />} >

              <Route index element={<Home />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/login" element={<Login />} />

          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </GoogleOAuthProvider >
  );
}

export default App;
