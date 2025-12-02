import { useEffect, useState } from 'react';
import api from '../utils/api';
import SearchFilter from '../components/SearchFilter';
import CarCard from '../components/CarCard';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async (filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/cars/all?${params}`);
            setCars(res.data);
        } catch (err) {
            console.error("Error fetching cars:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Inventory...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Our Vehicle Fleet 🚙</h1>
                <p className="text-gray-600">Browse and filter to find the perfect match</p>
            </div>

            {/* The Search Filter lives here now */}
            <SearchFilter onFilter={fetchCars} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {cars.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        <p className="text-xl">No cars found matching your criteria.</p>
                    </div>
                ) : (
                    cars.map(car => <CarCard key={car._id} car={car} />)
                )}
            </div>
        </div>
    );
};

export default Cars;