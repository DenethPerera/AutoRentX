import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';
import ChatWidget from '../components/ChatWidget';
import { ArrowLeft, MapPin, Gauge, Fuel, Users, Calendar, Star } from 'lucide-react'; 
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const CarDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    const rating = car?.rating || 4.8; 
    const reviewCount = car?.numReviews || 12;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/cars/${id}`);
                setCar(res.data);
            } catch (err) {
                console.error("Error fetching car:", err);
                toast.error("Failed to load car details");
            }
        };
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (car && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                setTotalPrice(diffDays * car.pricePerDay);
            } else {
                setTotalPrice(0);
            }
        }
    }, [car, startDate, endDate]);

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login to book a car");
            return navigate('/login');
        }
        if (!startDate || !endDate) {
            return toast.error("Please select valid dates");
        }

        const confirmBooking = window.confirm(`Confirm booking for $${totalPrice}?`);
        
        if (confirmBooking) {
            try {
                await api.post('/bookings/create', {
                    carId: car._id,
                    startDate,
                    endDate
                });
                toast.success('Booking Request Sent Successfully! 🚀');
                navigate('/my-bookings');
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Booking failed';
                toast.error(errorMsg);
            }
        }
    };

    if (!car) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <Link to="/cars" className="flex items-center text-gray-500 hover:text-blue-600 transition w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-2">
                            <img 
                                src={car.imageUrl || "https://via.placeholder.com/800x500"} 
                                alt={car.model} 
                                className="w-full h-[400px] object-contain bg-gray-100 rounded-xl"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900">{car.brand} {car.model}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center text-gray-900 font-bold">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                            {rating}
                                        </div>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500 underline cursor-pointer hover:text-blue-600">{reviewCount} reviews</span>
                                        <span className="text-gray-400">•</span>
                                        <div className="flex items-center text-gray-500">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{car.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-sm font-bold border ${car.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {car.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <Gauge className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-gray-500 text-sm">Transmission</span>
                                    <span className="font-bold text-gray-800">{car.transmission}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <Fuel className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-gray-500 text-sm">Fuel Type</span>
                                    <span className="font-bold text-gray-800">{car.fuelType}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-gray-500 text-sm">Capacity</span>
                                    <span className="font-bold text-gray-800">{car.capacity} People</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">About this car</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {car.description || "Experience premium comfort and performance with this vehicle."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
                            <h3 className="text-xl font-bold mb-4">Pickup Location</h3>
                            {car.coordinates && isLoaded ? (
                                <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={car.coordinates}
                                        zoom={14}
                                        options={{ disableDefaultUI: true, zoomControl: true }}
                                    >
                                        <Marker position={car.coordinates} />
                                    </GoogleMap>
                                </div>
                            ) : (
                                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    {isLoaded ? "Location not provided" : "Loading Map..."}
                                </div>
                            )}
                        </div>

                        <ReviewSection carId={id} />
                    </div>

                    <div className="relative">
                        <div className="sticky top-10 space-y-6">
                            
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
                                    <div>
                                        <span className="text-3xl font-bold text-gray-900">LKR {car.pricePerDay}</span>
                                        <span className="text-gray-500"> / day</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>{rating}</span>
                                        <span className="text-gray-400 font-normal">({reviewCount})</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Trip Start</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input type="date" className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-600" onChange={(e) => setStartDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Trip End</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input type="date" className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-600" onChange={(e) => setEndDate(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {totalPrice > 0 && (
                                    <div className="mt-6 bg-blue-50 p-4 rounded-xl">
                                        <div className="flex justify-between text-blue-900 mb-1">
                                            <span>LKR {car.pricePerDay} x {totalPrice/car.pricePerDay} days</span>
                                            <span>LKR {totalPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-blue-900 font-bold text-lg border-t border-blue-200 pt-2 mt-2">
                                            <span>Total</span>
                                            <span>LKR {totalPrice}</span>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={handleBooking}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Reserve Now
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
                            </div>

                            {car.owner && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                            {car.owner.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{car.owner.username}</p>
                                            <p className="text-xs text-gray-500">Vehicle Owner</p>
                                        </div>
                                    </div>
                                    <ChatWidget receiverId={car.owner._id} receiverName={car.owner.username} />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;