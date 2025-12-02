import { useState } from 'react';

const SearchFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        location: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        fuelType: ''
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        // Pass the filter object back to Home.jsx
        onFilter(filters);
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <input name="location" placeholder="City" onChange={handleChange} className="border p-2 rounded"/>
            <input name="brand" placeholder="Brand" onChange={handleChange} className="border p-2 rounded"/>
            <input name="minPrice" type="number" placeholder="Min Price" onChange={handleChange} className="border p-2 rounded"/>
            <input name="maxPrice" type="number" placeholder="Max Price" onChange={handleChange} className="border p-2 rounded"/>
            <select name="fuelType" onChange={handleChange} className="border p-2 rounded">
                <option value="">Any Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
            </select>
            <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded md:col-span-5 font-bold">
                Apply Filters
            </button>
        </div>
    );
};

export default SearchFilter;