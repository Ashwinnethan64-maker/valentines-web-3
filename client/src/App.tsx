import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Wizard from './components/wizard/Wizard';
import LovePage from './components/love-page/LovePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create" element={<Wizard />} />
                <Route path="/love/:slug" element={<LovePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
