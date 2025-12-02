import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="p-10 text-center">Please Login</div>;

    return (
        <div className="container mx-auto p-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">My Profile 👤</h1>
            <div className="bg-white p-8 rounded shadow-lg border">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.username}</h2>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm uppercase font-bold text-gray-700">
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-500 text-sm">Email Address</label>
                        <p className="text-lg font-medium">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-500 text-sm">Account ID</label>
                        <p className="text-gray-400 font-mono text-sm">{user.id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;