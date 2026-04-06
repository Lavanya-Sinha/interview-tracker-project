import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const Layout = ({ children }) => {
  const navigate = useNavigate()
  const { user, token } = useAuth(); 

const getInitials = (email) => {
  if (!email) return "";

  const namePart = email.split("@")[0]; 
  const parts = namePart.split(/[._]/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return namePart.slice(0, 2).toUpperCase();
};
const initials = getInitials(user);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-6">
      
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">
            Interview Tracker
          </h1>

          <nav className="flex gap-6 text-sm">
            <Link to="/" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
             <button
           onClick={() => navigate("/analytics")}
             className="text-slate-300 hover:text-white"
                >
                 Analytics
                </button>
             {token && (
  <div className="bg-slate-700 text-slate-200 px-2 py-0 rounded-full text-sm font-medium">
    {initials}
  </div>
)}
           {!token && (
  <>
    <Link to="/login" className="text-slate-300 hover:text-white">
      Log In
    </Link>
    <Link to="/sign-up" className="text-slate-300 hover:text-white">
      Sign Up
    </Link>
  </>
)}
          </nav>
        </div>

        {children}

      </div>

    </div>
  );
};

export default Layout;