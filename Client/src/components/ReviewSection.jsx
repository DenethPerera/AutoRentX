import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReviewSection = ({ carId }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/${carId}`);
                setReviews(res.data);
            } catch (err) {
                console.error("No reviews yet");
            }
        };
        fetchReviews();
    }, [carId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error("Login to write a review");

        try {
            const res = await api.post('/reviews/add', { carId, rating, comment });
            setReviews([res.data, ...reviews]); 
            setComment("");
            toast.success("Review Added!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add review");
        }
    };

    return (
        <div className="mt-10 bg-white p-6 rounded shadow">
            <h3 className="text-2xl font-bold mb-4">Reviews & Ratings ⭐</h3>

            {user && (
                <form onSubmit={handleSubmit} className="mb-8 border-b pb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <label className="font-bold">Rating:</label>
                        <select 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Terrible</option>
                        </select>
                    </div>
                    <textarea 
                        className="w-full border p-2 rounded mb-2" 
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Submit Review
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {reviews.length === 0 ? <p className="text-gray-500">No reviews yet. Be the first!</p> : (
                    reviews.map(review => (
                        <div key={review._id} className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between">
                                <span className="font-bold">{review.user?.username || "User"}</span>
                                <span className="text-yellow-600 font-bold">{'★'.repeat(review.rating)}</span>
                            </div>
                            <p className="text-gray-700 mt-1">{review.comment}</p>
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;