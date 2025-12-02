import { useState, useContext } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusSquare, 
  Car, 
  CalendarRange, 
  CarFront, 
  UploadCloud, 
  Loader2,
  X,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import LocationPicker from '../components/LocationPicker'; // Ensure this component exists

const AddCar = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // 1. Form State
    const [formData, setFormData] = useState({
        brand: '', model: '', year: '', pricePerDay: '',
        capacity: '', transmission: 'Automatic', fuelType: 'Petrol',
        location: '', description: ''
    });
    
    // 2. Location State (Default: Colombo)
    const [coordinates, setCoordinates] = useState({ lat: 6.9271, lng: 79.8612 });
    
    // 3. Image State
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handle Text Inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image) return toast.error("Please upload a car image");

        setLoading(true);
        const data = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        // Append Coordinates (Crucial Step)
        data.append('lat', coordinates.lat);
        data.append('lng', coordinates.lng);
        
        // Append Image File
        data.append('image', image);

        try {
            await api.post('/cars/add', data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success('Car Listed Successfully!');
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to add car');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
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

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/add-car" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold shadow-sm ring-1 ring-blue-100">
                        <PlusSquare className="w-5 h-5" />
                        Add New Car
                    </Link>
                    <button onClick={() => navigate('/dashboard')} className="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium">
                        <Car className="w-5 h-5" />
                        My Fleet
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
                        <p className="text-gray-500">List a new car to your fleet and start earning.</p>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: Car Details */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Basic Info Card */}
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Vehicle Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Car Brand</label>
                                        <input name="brand" placeholder="e.g. Toyota" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                        <input name="model" placeholder="e.g. Corolla" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                        <input name="year" type="number" placeholder="2024" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                                        <input name="capacity" type="number" placeholder="5" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Daily Price ($)</label>
                                        <input name="pricePerDay" type="number" placeholder="50" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                                        <select name="transmission" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                                        <select name="fuelType" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea name="description" placeholder="Tell renters about your car..." onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                            </div>

                            {/* Location Map Card */}
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" /> Pickup Location
                                </h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address / City Name</label>
                                    <input name="location" placeholder="e.g. Colombo 03" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pin Exact Location (Click Map)</label>
                                    <LocationPicker onLocationSelect={setCoordinates} />
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Image & Actions */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Vehicle Image</h2>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {preview ? (
                                        <div className="relative">
                                            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); setPreview(null); setImage(null); }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 py-4">
                                            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                                <UploadCloud className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 3MB)</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                        {loading ? 'Listing Vehicle...' : 'Publish Listing'}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center mt-4">
                                        By publishing, you agree to our Terms of Service.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddCar;