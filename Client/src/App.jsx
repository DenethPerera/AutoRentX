import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddCar from "./pages/AddCar";
import CarDetails from "./pages/CarDetails"; // <--- NEW
import MyBookings from "./pages/MyBookings"; // <--- NEW
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Profile from "./pages/Profile";
import Cars from "./pages/Cars";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/car/:id" element={<CarDetails />} /> {/* <--- NEW */}
          <Route path="/my-bookings" element={<MyBookings />} />{" "}
          {/* <--- NEW */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
