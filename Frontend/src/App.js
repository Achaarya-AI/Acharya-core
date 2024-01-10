import './index.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { AppStateProvider } from './AppStateContext';

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
