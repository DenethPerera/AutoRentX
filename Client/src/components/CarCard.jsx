import React from "react";
import { assets } from "../assets/assets"; 
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/car/${car._id}`)} 
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-white border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.imageUrl || assets.car_image1} 
          alt={car.model}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.available && (
          <p className="absolute top-4 left-4 bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-baseline">
          <span className="font-bold text-lg">LKR {car.pricePerDay}</span>
          <span className="text-sm text-gray-300 ml-1">/day</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-500 text-sm mb-4 font-medium">
          {car.year} • {car.transmission}
        </p>

        <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600 border-t pt-4">
          
          <div className="flex items-center gap-2">
            <img src={assets.users_icon} className="h-4 w-4 object-contain opacity-70" alt="seats" />
            <span>{car.capacity} Seats</span> 
          </div>

         
          <div className="flex items-center gap-2">
            <img src={assets.fuel_icon} className="h-4 w-4 object-contain opacity-70" alt="fuel" />
            <span>{car.fuelType}</span> 
          </div>

          
          <div className="flex items-center gap-2">
            <img src={assets.car_icon} className="h-4 w-4 object-contain opacity-70" alt="transmission" />
            <span>{car.transmission}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CarCard;