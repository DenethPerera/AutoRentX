import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Key, ArrowRight, Phone, Car } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '', 
        role: 'client' 
    });
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateSLPhone = (phone) => {
        const cleanPhone = phone.replace(/[^0-9+]/g, ''); 
        const slPhoneRegex = /^(?:0|94|\+94)?(7[0-9]{8})$/;
        return slPhoneRegex.test(cleanPhone);
    };

    const formatPhoneNumber = (phone) => {
        let clean = phone.replace(/[^0-9]/g, ''); 
        
        if (clean.startsWith('0')) {
            clean = clean.substring(1);
        }
        if (clean.startsWith('94')) {
            clean = clean.substring(2);
        }

       
        return `+94 ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        if (!validateSLPhone(formData.phone)) {
            return toast.error("Invalid Sri Lankan number. Use 07x... or +947x...");
        }

        
        const formattedPhone = formatPhoneNumber(formData.phone);

        setIsLoading(true);
        try {
            await register(
                formData.username, 
                formData.email, 
                formData.password, 
                formData.role, 
                formattedPhone 
            );
            toast.success('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration Failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row">
                
                <div className="w-full md:w-3/5 p-8 md:p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                        <p className="text-gray-500 mt-2">Join us to rent cars or list your own vehicle.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div 
                                onClick={() => setFormData({...formData, role: 'client'})}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${formData.role === 'client' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                                <User className={`w-8 h-8 mb-2 ${formData.role === 'client' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className={`font-bold ${formData.role === 'client' ? 'text-blue-900' : 'text-gray-500'}`}>Renter</span>
                            </div>
                            <div 
                                onClick={() => setFormData({...formData, role: 'owner'})}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${formData.role === 'owner' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                                <Key className={`w-8 h-8 mb-2 ${formData.role === 'owner' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className={`font-bold ${formData.role === 'owner' ? 'text-blue-900' : 'text-gray-500'}`}>Car Owner</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input name="username" placeholder="Full Name" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                name="phone" 
                                type="tel" 
                                placeholder="07x xxxxxxx" 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input name="password" type="password" placeholder="Create Password" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition transform active:scale-95 shadow-lg flex justify-center items-center gap-2">
                            {isLoading ? 'Creating Account...' : 'Get Started'}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-700 font-bold hover:underline">Log In</Link>
                    </p>
                </div>

                <div className="w-full md:w-2/5 bg-blue-900 relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-800 to-blue-950 opacity-90"></div>
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                    <div className="relative z-10 text-center text-white space-y-6">
                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 inline-block mb-4">
                            <Car className="w-16 h-16 text-blue-200 mx-auto" />
                        </div>
                        <h3 className="text-3xl font-bold">Join Our Community</h3>
                        <p className="text-blue-200">Start your journey today.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;