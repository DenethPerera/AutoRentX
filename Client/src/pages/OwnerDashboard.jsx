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
  
  // View State
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'bookings' | 'cars'
  
  // Data State
  const [stats, setStats] = useState({ totalCars: 0, totalBookings: 0, pending: 0, confirmed: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI State
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  // 1. Fetch Real Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) { setLoading(false); return; }

      try {
        const bookingRes = await api.get('/bookings/owner-bookings');
        const allBookings = bookingRes.data;

        const carRes = await api.get('/cars/my-cars'); 
        const myCars = carRes.data; 

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

  // 2. Handlers
  const handleStatus = async (id, status) => {
      try {
          await api.put(`/bookings/${id}/status`, { status });
          const updatedBookings = bookings.map(b => b._id === id ? { ...b, status } : b);
          setBookings(updatedBookings);
          setRecentBookings(updatedBookings.slice(0, 5));
          toast.success(`Booking ${status}`);
      } catch (err) { toast.error("Failed to update status"); }
  };

  const handleToggleVisibility = async (carId) => {
      try {
          const res = await api.put(`/cars/status/${carId}`);
          const updatedCars = myCars.map(car => car._id === carId ? { ...car, available: res.data.car.available } : car);
          setMyCars(updatedCars);
          toast.success(res.data.car.available ? "Car Visible" : "Car Hidden");
      } catch (err) { toast.error("Failed to toggle visibility"); }
  };

  const handleDeleteCar = async (carId) => {
      if(!window.confirm("Delete this car permanently?")) return;
      try {
          await api.delete(`/cars/delete/${carId}`);
          setMyCars(myCars.filter(car => car._id !== carId));
          setStats(prev => ({ ...prev, totalCars: prev.totalCars - 1 }));
          toast.success("Car removed");
      } catch (err) { toast.error("Failed to delete"); }
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
    const prompt = `Analyze my car rental business: ${stats.totalCars} cars, ${stats.totalBookings} bookings, $${stats.revenue} revenue. Give 1 strategic tip.`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        setAiInsight(data.candidates?.[0]?.content?.parts?.[0]?.text || "No insight available.");
    } catch (e) { setAiInsight("AI Service Unavailable"); } 
    finally { setLoadingAI(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col md:flex-row">
      
      {/* ================= DESKTOP SIDEBAR (Hidden on Mobile) ================= */}
      <aside className="w-64 border-r border-gray-100 hidden md:flex flex-col flex-shrink-0 fixed h-full bg-white z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <CarFront className="w-8 h-8" /> <span>RentMyRide</span>
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
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <Link to="/add-car" className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
            <PlusSquare className="w-5 h-5" /> Add car
          </Link>
          <NavItem icon={Car} label="Manage Cars" active={currentView === 'cars'} onClick={() => setCurrentView('cars')} />
          <NavItem icon={CalendarRange} label="Manage Bookings" active={currentView === 'bookings'} onClick={() => setCurrentView('bookings')} />
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      {/* Added pb-24 to prevent bottom nav from covering content on mobile */}
      <main className="flex-1 bg-gray-50/50 md:ml-64 min-h-screen pb-24 md:pb-8">
        
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-gray-800">Owner Panel</h1>
          <div className="text-sm text-gray-500 hidden sm:block">Welcome, {user?.username}</div>
          {/* Mobile User Icon */}
          <div className="md:hidden w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            
            {/* Header + AI Button */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        {currentView === 'dashboard' ? 'Overview' : currentView === 'bookings' ? 'Bookings' : 'My Fleet'}
                    </h2>
                </div>
                <button onClick={generateAIInsights} disabled={loadingAI} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-70 text-sm">
                    {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loadingAI ? 'Thinking...' : 'Ask AI'}
                </button>
            </div>

            {aiInsight && (
                <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                    <p className="text-indigo-800 text-sm leading-relaxed">{aiInsight}</p>
                </div>
            )}

            {/* DASHBOARD VIEW */}
            {currentView === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <StatCard label="Total Cars" value={stats.totalCars} icon={CarFront} />
                        <StatCard label="Total Bookings" value={stats.totalBookings} icon={ClipboardList} />
                        <StatCard label="Pending" value={stats.pending} icon={AlertTriangle} />
                        <StatCard label="Revenue" value={`$${stats.revenue}`} icon={CheckCircle2} />
                    </div>
                    {/* Recent Activity List (Reused from previous code logic) */}
                </>
            )}

            {/* CARS VIEW */}
            {currentView === 'cars' && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]"> {/* min-w forces scroll on mobile */}
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Car</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myCars.map((car) => (
                                    <tr key={car._id}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img src={car.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                <span className="font-medium text-gray-900">{car.brand} {car.model}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">${car.pricePerDay}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${car.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {car.available ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleToggleVisibility(car._id)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                                    {car.available ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                                                </button>
                                                <button onClick={() => handleDeleteCar(car._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full">
                                                    <Trash2 className="w-4 h-4" />
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
                <div className="space-y-4">
                    {/* Mobile Card View for Bookings */}
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={booking.car?.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{booking.car?.brand} {booking.car?.model}</h4>
                                        <p className="text-xs text-gray-500">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize 
                                    ${booking.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                                <span className="font-bold text-gray-900">${booking.totalPrice}</span>
                                {booking.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatus(booking._id, 'approved')} className="bg-green-500 text-white p-2 rounded-lg"><Check className="w-4 h-4"/></button>
                                        <button onClick={() => handleStatus(booking._id, 'rejected')} className="bg-red-500 text-white p-2 rounded-lg"><X className="w-4 h-4"/></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon={LayoutDashboard} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
        <MobileNavItem icon={Car} label="Fleet" active={currentView === 'cars'} onClick={() => setCurrentView('cars')} />
        
        {/* Floating Add Button */}
        <div className="-mt-8">
            <Link to="/add-car" className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <PlusSquare className="w-7 h-7" />
            </Link>
        </div>

        <MobileNavItem icon={CalendarRange} label="Bookings" active={currentView === 'bookings'} onClick={() => setCurrentView('bookings')} />
        <Link to="/profile" className="flex flex-col items-center text-gray-400">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                <span className="text-xs font-bold text-gray-600 flex justify-center items-center h-full">{user?.username?.charAt(0)}</span>
            </div>
            <span className="text-[10px] mt-1">Profile</span>
        </Link>
      </div>

    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Icon className="w-5 h-5" /> {label}
            {active && <div className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></div>}
        </button>
    );
}

function MobileNavItem({ icon: Icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}