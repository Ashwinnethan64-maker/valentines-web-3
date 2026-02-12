import { useWizardStore } from '../../store/wizardStore';
import { Music as MusicIcon, PlayCircle } from 'lucide-react';

const Music = () => {
    const { data, updateData } = useWizardStore();

    const royaltyFreeTracks = [
        { name: "Romantic Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "Acoustic Love", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { name: "Soft Jazz", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-heading text-primary">Set the Mood</h2>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Choose a track (Royalty Free)</label>
                <div className="grid gap-3">
                    {royaltyFreeTracks.map((track) => (
                        <div
                            key={track.url}
                            onClick={() => updateData({ bgMusicUrl: track.url })}
                            className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition ${data.bgMusicUrl === track.url ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <MusicIcon className="text-gray-400" size={20} />
                                <span className="font-medium">{track.name}</span>
                            </div>
                            {data.bgMusicUrl === track.url && <div className="text-primary text-sm font-bold">Selected</div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">Or paste your own</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direct MP3 URL</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={data.bgMusicUrl || ''}
                        onChange={(e) => updateData({ bgMusicUrl: e.target.value })}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://example.com/song.mp3"
                    />
                    {data.bgMusicUrl && (
                        <button
                            onClick={() => {
                                const audio = new Audio(data.bgMusicUrl);
                                audio.play().catch(() => alert("Could not play url"));
                            }}
                            className="p-3 text-primary hover:bg-primary/10 rounded-lg"
                            title="Test Play"
                        >
                            <PlayCircle />
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Note: Popular streaming links (Spotify/YouTube) won't work automatically due to restrictions. Use a direct MP3 link.</p>
            </div>
        </div>
    );
};

export default Music;
