import { useWizardStore } from '../../store/wizardStore';

const BasicInfo = () => {
    const { data, updateData } = useWizardStore();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-heading text-primary">Let's start with the basics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        value={data.yourName}
                        onChange={(e) => updateData({ yourName: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Romeo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner's Name</label>
                    <input
                        type="text"
                        value={data.partnerName}
                        onChange={(e) => updateData({ partnerName: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Juliet"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Date (optional)</label>
                <input
                    type="date"
                    value={data.relationshipDate}
                    onChange={(e) => updateData({ relationshipDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">We'll add a countdown to this date (or anniversary) on the love page.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                <div className="flex space-x-4">
                    {['#D32F2F', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'].map(color => (
                        <button
                            key={color}
                            onClick={() => updateData({ themeColor: color })}
                            className={`w-10 h-10 rounded-full border-2 transition-transform ${data.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
