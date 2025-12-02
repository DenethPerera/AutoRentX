import { Link, useLocation } from 'react-router-dom'; // <--- Import useLocation
import { 
  CarFront, Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation(); // Get current route

  // List of pages where the footer should be HIDDEN
  const hideFooterOn = ['/dashboard', '/add-car', '/admin'];

  // If the current URL matches any of the hidden pages, return null (don't render)
  if (hideFooterOn.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <CarFront className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">RentMyRide</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:support@rentmyride.com" className="text-gray-400 hover:text-red-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-blue-600 text-sm transition-colors block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-500 hover:text-blue-600 text-sm transition-colors block">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/add-car" className="text-gray-500 hover:text-blue-600 text-sm transition-colors block">
                  List Your Car
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-500 hover:text-blue-600 text-sm transition-colors block">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-3">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Insurance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm">
                  123 Galle Road<br />
                  Colombo 03, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-500 text-sm">+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Send className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-500 text-sm">support@rentmyride.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} RentMyRide. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;