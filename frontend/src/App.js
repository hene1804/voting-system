import Login from "./pages/login/Login";
import ValidateLogin from "./pages/validateLogin/ValidateLogin";
import Register from "./pages/register/Register";
import VerifyEmailPhone from "./pages/verifyEmailPhone/VerifyEmailPhone";
import Home from "./pages/home/Home";
import SecurityInformation from "./pages/securityInformation/SecurityInformation";
import ElectionCalendar from "./pages/electionCalendar/ElectionCalendar";
import ElectionDetails from './pages/electionDetails/ElectionDetails';
import ElectionResult from './pages/electionResult/ElectionResult';
import MyVotesHistory from './pages/myVotesHistory/MyVotesHistory';
import Profile from './pages/profile/Profile';

// Import admin components
import AdminPanel from './components/admin/AdminPanel';
import AdminCandidateForm from './components/admin/AdminCandidateForm';
import ManageCandidates from './components/admin/ManageCandidates';

import { useAuth } from './AuthContext';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Admin route protection component
const AdminRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const { isAuthenticated } = useAuth();
  
  // Check if user is authenticated and is an admin
  if (!isAuthenticated() || !storedUser || storedUser.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login/>}/>
            <Route path="validateLogin" element={<ValidateLogin/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="verifyEmailPhone" element={<VerifyEmailPhone/>}/>
            <Route path="home" element={
              (isAuthenticated()) ? <Home/> : <Navigate to="/" replace />
            }/>
            <Route path="security" element={
              (isAuthenticated()) ? <SecurityInformation/> : <Navigate to="/" replace />
            }/>
            <Route path="calendar" element={
              (isAuthenticated()) ? <ElectionCalendar/> : <Navigate to="/" replace />
            }/>
            <Route path="/elections/:id" element={
              (isAuthenticated()) ? <ElectionDetails/> : <Navigate to="/" replace />
            }/>
            <Route path="/electionsResult/:id" element={
              (isAuthenticated()) ? <ElectionResult/> : <Navigate to="/" replace />
            }/>
            <Route path="/history" element={
              (isAuthenticated()) ? <MyVotesHistory/> : <Navigate to="/" replace />
            }/>
            <Route path="/profile" element={
              (isAuthenticated()) ? <Profile/> : <Navigate to="/" replace />
            }/>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }/>
            <Route path="/admin/candidates/add" element={
              <AdminRoute>
                <AdminCandidateForm />
              </AdminRoute>
            }/>
            <Route path="/admin/elections/:electionId/candidates" element={
              <AdminRoute>
                <ManageCandidates />
              </AdminRoute>
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;