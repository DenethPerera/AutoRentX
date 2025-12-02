import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets"; // Make sure this path is correct

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-950 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2"
          onClick={() => setShowMobileMenu(false)}
        >
          RentMyRide
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 font-medium">
            Home
          </Link>
          <Link to="/cars" className="hover:text-blue-200 font-medium">
            Cars
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-bold leading-none">
                    {user.username}
                  </p>
                  <p className="text-blue-200 text-[10px] uppercase font-semibold leading-none mt-1">
                    {user.role}
                  </p>
                </div>
              </Link>

              {user.role === "owner" && (
                <>
                  <Link
                    to="/add-car"
                    className="hover:text-green-300 font-medium"
                  >
                    List Car
                  </Link>
                  <Link
                    to="/dashboard"
                    className="hover:text-yellow-300 font-medium"
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-purple-700 px-3 py-1 rounded hover:bg-purple-600"
                >
                  Admin
                </Link>
              )}

              <Link
                to="/my-bookings"
                className="hover:text-blue-200 font-medium"
              >
                My Trips
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1.5 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <img
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            src={showMobileMenu ? assets.close_icon : assets.menu_icon}
            alt="Menu"
            className="w-8 h-8 cursor-pointer invert brightness-0 filter"
          />
        </div>
      </div>

      <div
        className={`md:hidden bg-blue-900 transition-all duration-300 ease-in-out overflow-hidden ${
          showMobileMenu ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            className="hover:text-blue-200 w-full py-2"
          >
            Home
          </Link>
          <Link
            to="/cars"
            onClick={() => setShowMobileMenu(false)}
            className="hover:text-blue-200 w-full py-2"
          >
            Cars
          </Link>

          {user ? (
            <>
              {user.role === "owner" && (
                <>
                  <Link
                    to="/add-car"
                    onClick={() => setShowMobileMenu(false)}
                    className="hover:text-green-300 w-full py-2"
                  >
                    List Car
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="hover:text-yellow-300 w-full py-2"
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-purple-300 font-bold w-full py-2"
                >
                  Admin Panel
                </Link>
              )}

              <Link
                to="/my-bookings"
                onClick={() => setShowMobileMenu(false)}
                className="hover:text-blue-200 w-full py-2"
              >
                My Trips
              </Link>

              <div className="border-t border-blue-500 w-3/4 my-2"></div>

              <span className="text-blue-300 text-sm">
                Signed in as {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-400 font-bold hover:text-red-300 w-full py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-blue-500 w-3/4 my-2"></div>
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="hover:text-blue-200 w-full py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setShowMobileMenu(false)}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
