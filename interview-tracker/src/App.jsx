import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
  const Dashboard = lazy(()=>import('./pages/Dashboard'))
  const Login = lazy(()=>import('./pages/Login'))
  const SignUp = lazy(()=>import('./pages/SignUp'))
  const Analytics = lazy(()=>import('./pages/Analytics'))
  
function App() {
  return (
     <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-6">
        <div className="max-w-5xl mx-auto">
              <BrowserRouter>
      <Suspense fallback={<div>LOADING....</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Suspense>
     </BrowserRouter>
      </div>
    </div>
  );
}

export default App;