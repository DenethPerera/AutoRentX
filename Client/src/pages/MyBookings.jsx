import { useEffect, useState } from 'react';
import api from '../utils/api';
import { MessageCircle, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my-bookings');
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center py-20">Loading your trips...</div>;

    if (bookings.length === 0) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">No trips booked yet</h2>
            <p className="text-gray-500 mb-6">Time to start your engine!</p>
            <a href="/cars" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Browse Cars</a>
        </div>
    );

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Trips</h1>
            
            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        
                        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                            <img 
                                src={booking.car.imageUrl} 
                                alt={booking.car.model} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm
                                    ${booking.status === 'approved' ? 'bg-green-500 text-white' : 
                                      booking.status === 'pending' ? 'bg-yellow-500 text-white' : 
                                      'bg-red-500 text-white'}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{booking.car.brand} {booking.car.model}</h2>
                                    <span className="text-xl font-bold text-blue-600">LKR {booking.totalPrice}</span>
                                </div>
                                
                                <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {booking.car.location}
                                    </div>
                                </div>
                            </div>

                            {booking.status === 'approved' ? (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Owner Contact & Pickup</p>
                                    <div className="flex flex-wrap gap-3">
                                        
                                        <button 
                                            onClick={() => setActiveChat(booking.owner._id)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Chat
                                        </button>

                                        <a 
                                            href={`tel:${booking.owner.phone}`}
                                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <Phone className="w-4 h-4" /> Call
                                        </a>

                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.car.location)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <MapPin className="w-4 h-4" /> Get Directions
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                    <p className="text-sm">Contact details will be revealed once the owner approves your booking.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {activeChat && (
                <div className="fixed bottom-0 right-0 z-50">
                    <ChatWidget 
                        receiverId={activeChat} 
                        receiverName="Owner" 
                    />
                    <button 
                        className="fixed top-4 right-4 bg-gray-800 text-white rounded-full p-2 z-50"
                        onClick={() => setActiveChat(null)}
                    >
                        ✕ Close Chat
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;