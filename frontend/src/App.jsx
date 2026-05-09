import { Routes, Route } from 'react-router-dom';
import LeadDashboard from './components/LeadDashboard';
import Login from './authPages/Login/Login';
import SignUp from './authPages/signup/SignUp';
import Verify from './authPages/verify/Verify';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<ProtectedRoute><LeadDashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
}

export default App;
