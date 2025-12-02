import { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalCars: 0, totalBookings: 0 });

    useEffect(() => {
        api.get('/admin/stats')
           .then(res => setStats(res.data))
           .catch(err => console.error("Not an admin"));
    }, []);

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard 🛡️</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-100 p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold">Total Users</h2>
                    <p className="text-5xl text-blue-600 mt-4">{stats.totalUsers}</p>
                </div>
                <div className="bg-green-100 p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold">Total Cars</h2>
                    <p className="text-5xl text-green-600 mt-4">{stats.totalCars}</p>
                </div>
                <div className="bg-purple-100 p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold">Total Bookings</h2>
                    <p className="text-5xl text-purple-600 mt-4">{stats.totalBookings}</p>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;