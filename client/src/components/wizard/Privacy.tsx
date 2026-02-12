import { useWizardStore } from '../../store/wizardStore';
import { Lock, Unlock } from 'lucide-react';

const Privacy = () => {
    const { data, updateData } = useWizardStore();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-heading text-primary">Privacy Settings</h2>

            <div
                onClick={() => updateData({ isPrivate: !data.isPrivate })}
                className={`p-6 border-2 rounded-xl cursor-pointer transition flex items-start gap-4 ${data.isPrivate ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
                <div className={`p-3 rounded-full ${data.isPrivate ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {data.isPrivate ? <Lock size={24} /> : <Unlock size={24} />}
                </div>
                <div>
                    <h3 className="text-lg font-bold">Password Protection</h3>
                    <p className="text-gray-600 text-sm">Enable this to require a password to view your love page.</p>
                </div>
                <div className="ml-auto">
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${data.isPrivate ? 'bg-primary' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${data.isPrivate ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>

            {data.isPrivate && (
                <div className="animate-fade-in-up">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
                    <input
                        type="text"
                        value={data.password || ''}
                        onChange={(e) => updateData({ password: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Secret123"
                    />
                    <p className="text-xs text-gray-500 mt-1">Make sure to share this password with them!</p>
                </div>
            )}
        </div>
    );
};

export default Privacy;
