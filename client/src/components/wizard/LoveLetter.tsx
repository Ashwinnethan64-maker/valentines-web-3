import { useState } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { Plus, Trash2 } from 'lucide-react';

const LoveLetter = () => {
    const { data, updateData } = useWizardStore();
    const [newReason, setNewReason] = useState('');

    const addReason = () => {
        if (newReason.trim()) {
            updateData({ reasons: [...data.reasons, { text: newReason }] });
            setNewReason('');
        }
    };

    const removeReason = (index: number) => {
        const updated = [...data.reasons];
        updated.splice(index, 1);
        updateData({ reasons: updated });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-heading text-primary mb-4">Write a Love Letter</h2>
                <textarea
                    value={data.loveLetter}
                    onChange={(e) => updateData({ loveLetter: e.target.value })}
                    className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    placeholder="My dearest..."
                ></textarea>
            </div>

            <div>
                <h2 className="text-xl font-heading text-primary mb-4">Reasons I Love You</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addReason()}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="You make me laugh when..."
                    />
                    <button
                        onClick={addReason}
                        className="bg-primary text-white p-3 rounded-lg hover:bg-primary-hover"
                    >
                        <Plus />
                    </button>
                </div>

                <ul className="space-y-2">
                    {data.reasons.map((reason, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <span>{reason.text}</span>
                            <button onClick={() => removeReason(idx)} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LoveLetter;
