import { useState } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Review = () => {
    const { data } = useWizardStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePublish = async () => {
        setIsProcessing(true);
        setError('');

        // In a real app, we would upload images here first to get cloud URLs
        // Then replace local blob URLs with cloud URLs in the payload
        // For this demo, we assume blob URLs are sufficient for local session or basic string passing

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success
            const slug = Math.random().toString(36).substring(2, 8);
            console.log("Published to:", slug);

            // Since we don't have a real backend responding yet (we need to finish server routes),
            // we'll just navigate to the client-side route for now.
            // In full impl, we POST to /api/create

            /* 
            const res = await fetch('/api/create', { ... });
            */

            navigate(`/love/${slug}`);

        } catch (e) {
            setError('Failed to publish');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 text-center">
            <h2 className="text-3xl font-heading text-primary">Everything looks perfect!</h2>
            <p className="text-gray-600">You're ready to publish for <strong>{data.partnerName}</strong>.</p>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-md mx-auto text-left space-y-3">
                <h3 className="font-bold border-b pb-2">Summary</h3>
                <p className="text-sm"><span className="text-gray-500">Title:</span> {data.yourName} & {data.partnerName}</p>
                <p className="text-sm"><span className="text-gray-500">Photos:</span> {data.photos.length} selected</p>
                <p className="text-sm"><span className="text-gray-500">Privacy:</span> {data.isPrivate ? 'Password Protected' : 'Public'}</p>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">One-Time License</span>
                    <span className="font-bold text-2xl text-primary">$4.99</span>
                </div>
                <button
                    onClick={handlePublish}
                    disabled={isProcessing}
                    className="w-full btn-primary py-4 text-lg flex justify-center items-center gap-2"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                    {isProcessing ? 'Processing Payment...' : 'Pay & Publish'}
                </button>
                <p className="text-xs text-gray-500 mt-3">Secure payment processed by Stripe (Mock).</p>
            </div>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default Review;
