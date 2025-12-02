import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { Search, CalendarCheck, CarFront, ArrowRight, ShieldCheck, Headset, Loader2 } from 'lucide-react';
import carImg from '../assets/deneth.png';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/cars/all");
        setFeaturedCars(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white overflow-hidden font-sans">
      
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 lg:gap-16">
            
            <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <SparklesIcon className="w-3.5 h-3.5" /> Premium Car Rental
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Elevate Your Journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900">RentMyRide</span>
              </h1>
              
              <p className="text-lg text-gray-600 md:max-w-lg leading-relaxed">
                Discover the freedom of the open road. From sleek city cruisers to spacious family SUVs, we have the perfect vehicle.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                <button
                  onClick={() => navigate("/cars")}
                  className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Browse Fleet <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-blue-900 border-2 border-blue-100 px-6 py-3 rounded-xl font-bold text-base hover:bg-blue-50 transition-all"
                >
                  Sign Up Free
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-gray-600 font-medium text-sm">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Verified Owners
                </div>
                <div className="flex items-center gap-1.5">
                  <Headset className="w-4 h-4 text-blue-500" /> 24/7 Support
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img
                src={carImg}
                alt="Luxury Car Banner"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>


      <section className="py-12 bg-white relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10"> 
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-600">Get on the road in just 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <Search className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Browse & Select</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Find the vehicle that matches your style and needs.</p>
            </div>

            <div className="flex flex-col items-center text-center group relative">
               <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-blue-100 -z-10"></div>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <CalendarCheck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Book Your Dates</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Choose pickup dates. Quick and secure booking.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <CarFront className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Hit the Road</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Pick up your car and enjoy your journey.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-6">
          
          <div className="flex justify-between items-end mb-8"> 
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Featured Vehicles
              </h2>
              <p className="text-gray-600 text-sm">
                Top-rated choices from our collection.
              </p>
            </div>
            <button
              onClick={() => navigate("/cars")}
              className="hidden md:flex items-center gap-1 text-blue-700 font-bold hover:text-blue-900 transition text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading fleet...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.length > 0 ? (
                featuredCars.map((car) => <CarCard key={car._id} car={car} />)
              ) : (
                <div className="col-span-4 text-center py-12 bg-white rounded-3xl border border-gray-100">
                    <CarFront className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No cars available.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => navigate("/cars")}
              className="bg-white text-blue-900 border border-blue-200 px-6 py-3 rounded-lg font-bold w-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              View All Fleet <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5zm8.25-3.75a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-2.25v2.25a.75.75 0 01-1.5 0v-2.25H7.5a.75.75 0 010-1.5h2.25V7.5a.75.75 0 01.75-.75z" clipRule="evenodd" /><path d="M19.05 4.95a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06zM15 9a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06z" /></svg>
  );
}

export default Home;