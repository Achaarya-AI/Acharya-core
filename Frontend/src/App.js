import './index.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import LandingPg from './pages/LandingPg';
import Login from './pages/Login'
import { AppStateProvider } from './AppStateContext';
import { GoogleOAuthProvider } from '@react-oauth/google'
import Loginv2 from './pages/LoginV2';
import HomeV2 from './pages/HomeV2';

function App() {
  const clientIdKey = process.env.REACT_APP_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientIdKey}>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Layout />} >

              <Route index element={<Home />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/login" element={<Login />} /> */}
            <Route path='/' element={<HomeV2 />} />
            <Route path="/getStarted" element={<LandingPg />} />
            <Route path="/loginv2" element={<Loginv2 />} />

          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </GoogleOAuthProvider >
  );
}

export default App;
