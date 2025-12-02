import React, { useState, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, PlusSquare, Car, CalendarRange, CarFront, ClipboardList, 
  AlertTriangle, CheckCircle2, Sparkles, Loader2, X, Check, 
  ArrowRight, Eye, EyeOff, Trash2 
} from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  
  // State
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState({ totalCars: 0, totalBookings: 0, pending: 0, confirmed: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  // --- 🔒 HELPER: SAFE ID COMPARE ---
  // This fixes the issue where "123" !== ObjectId("123")
  const isOwner = (car, userId) => {
      try {
          if (!car || !userId) return false;
          // If car.owner is an object (populated), get _id. If string, use directly.
          const ownerId = car.owner?._id ? car.owner._id.toString() : car.owner?.toString();
          return ownerId === userId.toString();
      } catch (e) {
          return false;
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Stop if no user
      if (!user) { setLoading(false); return; }

      try {
        const bookingRes = await api.get('/bookings/owner-bookings');
        const allBookings = bookingRes.data;

        const carRes = await api.get('/cars/my-cars'); 
        const myCars = carRes.data; // No filtering needed! The backend did it.

        const revenue = allBookings.reduce((sum, b) => 
            (b.status === 'approved' || b.status === 'completed' ? sum + b.totalPrice : sum), 0
        );

        setStats({
          totalCars: myCars.length,
          totalBookings: allBookings.length,
          pending: allBookings.filter(b => b.status === 'pending').length,
          confirmed: allBookings.filter(b => b.status === 'approved' || b.status === 'completed').length,
          revenue
        });

        setBookings(allBookings);
        setRecentBookings(allBookings.slice(0, 5));
        setMyCars(myCars); 
        
      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatus = async (id, status) => {
      try {
          await api.put(`/bookings/${id}/status`, { status });
          const updatedBookings = bookings.map(b => b._id === id ? { ...b, status } : b);
          setBookings(updatedBookings);
          setRecentBookings(updatedBookings.slice(0, 5));
          toast.success(`Booking ${status}`);
      } catch (err) {
          toast.error("Failed to update status");
      }
  };

  const handleToggleVisibility = async (carId) => {
      try {
          const res = await api.put(`/cars/status/${carId}`);
          const updatedCars = myCars.map(car => 
              car._id === carId ? { ...car, available: res.data.car.available } : car
          );
          setMyCars(updatedCars);
          toast.success(res.data.car.available ? "Car Visible" : "Car Hidden");
      } catch (err) {
          toast.error("Failed to toggle visibility");
      }
  };

  const handleDeleteCar = async (carId) => {
      if(!window.confirm("Delete this car permanently?")) return;
      try {
          await api.delete(`/cars/delete/${carId}`);
          setMyCars(myCars.filter(car => car._id !== carId));
          setStats(prev => ({ ...prev, totalCars: prev.totalCars - 1 }));
          toast.success("Car removed");
      } catch (err) {
          toast.error("Failed to delete");
      }
  };

  const generateAIInsights = async () => {
    setLoadingAI(true);
    setAiInsight('');
    const apiKey = "YOUR_GEMINI_API_KEY_HERE"; 
    
    if (!apiKey || apiKey.includes("YOUR_")) {
        setAiInsight("Please configure your Gemini API Key in the code.");
        setLoadingAI(false);
        return;
    }

    let prompt = "";
    if (currentView === 'dashboard') prompt = `Analyze my car rental business: ${stats.totalCars} cars, ${stats.totalBookings} bookings, $${stats.revenue} revenue. Give 1 strategic tip.`;
    else if (currentView === 'bookings') prompt = `Analyze bookings: ${bookings.length} total. ${stats.pending} pending. Advice on managing requests?`;
    else if (currentView === 'cars') prompt = `Analyze my fleet of ${myCars.length} cars. Suggest how to optimize pricing or descriptions.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );
        const data = await response.json();
        setAiInsight(data.candidates?.[0]?.content?.parts?.[0]?.text || "No insight available.");
    } catch (e) {
        setAiInsight("AI Service Unavailable");
    } finally {
        setLoadingAI(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans flex">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 hidden md:flex flex-col flex-shrink-0 fixed h-full bg-white z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <CarFront className="w-8 h-8" />
            <span>RentMyRide</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-sm mb-3 flex items-center justify-center text-3xl font-bold text-blue-600">
             {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-gray-900">{user?.username}</h3>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <Link to="/add-car" className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium"><PlusSquare className="w-5 h-5" /> Add car</Link>
          <button onClick={() => setCurrentView('cars')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'cars' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Car className="w-5 h-5" /> Manage Cars
          </button>
          <button onClick={() => setCurrentView('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <CalendarRange className="w-5 h-5" /> Manage Bookings
          </button>
        </nav>
      </aside>

      
      <main className="flex-1 bg-gray-50/50 md:ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Owner Panel</h1>
          <div className="text-sm text-gray-500">Welcome, {user?.username}</div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
           
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentView === 'dashboard' ? 'Dashboard Overview' : currentView === 'bookings' ? 'Manage Bookings' : 'Manage Fleet'}
                    </h2>
                </div>
                <button onClick={generateAIInsights} disabled={loadingAI} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-70">
                    {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loadingAI ? 'Analyzing...' : 'Ask AI'}
                </button>
            </div>

            {aiInsight && (
                <div className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-indigo-800">{aiInsight}</p>
                </div>
            )}

            
            {currentView === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Cars" value={stats.totalCars} icon={CarFront} />
                    <StatCard label="Total Bookings" value={stats.totalBookings} icon={ClipboardList} />
                    <StatCard label="Pending" value={stats.pending} icon={AlertTriangle} />
                    <StatCard label="Revenue" value={`$${stats.revenue}`} icon={CheckCircle2} />
                </div>
            )}

          
            {currentView === 'cars' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Car</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Specs</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Visibility</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myCars.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No cars found.</td></tr>}
                                {myCars.map((car) => (
                                    <tr key={car._id} className={`transition-colors ${car.available ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-75'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <img src={car.imageUrl || "https://via.placeholder.com/50"} alt={car.model} className="w-12 h-10 object-cover rounded shadow-sm" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{car.brand} {car.model}</div>
                                                    <div className="text-xs text-gray-500">{car.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{car.capacity} Seats • {car.transmission}</td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-900">LKR {car.pricePerDay}/day</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${car.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {car.available ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleToggleVisibility(car._id)} className={`p-2 rounded-full transition-colors ${car.available ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                                                    {car.available ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                                <button onClick={() => handleDeleteCar(car._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* BOOKINGS VIEW */}
            {currentView === 'bookings' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Car</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Dates</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Total</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-400">No bookings yet.</td></tr>}
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img src={booking.car.imageUrl || "https://via.placeholder.com/50"} className="w-10 h-8 object-cover rounded shadow-sm" />
                                                <span className="text-sm font-medium text-gray-900">{booking.car.brand} {booking.car.model}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 flex items-center gap-2">
                                            {new Date(booking.startDate).toLocaleDateString()} <ArrowRight className="w-3 h-3" /> {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-900">${booking.totalPrice}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${booking.status === 'approved' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {booking.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatus(booking._id, 'approved')} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => handleStatus(booking._id, 'rejected')} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><X className="w-4 h-4" /></button>
                                                </div>
                                            ) : <span className="text-xs text-gray-400">Processed</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}