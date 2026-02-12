import { useEffect, useState, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { useWizardStore } from '../../store/wizardStore';
import { LovePageData, defaultPageData } from '../../types';
import { Heart, Music, Lock } from 'lucide-react';

// Subcomponents would typically be separate files


const LovePage = () => {
    const { slug } = useParams();
    const { data: storeData } = useWizardStore();
    const [apiData, setApiData] = useState<LovePageData | null>(null);
    const [loading, setLoading] = useState(!!slug);
    const [error, setError] = useState('');

    // Choose source
    const data = slug ? (apiData || defaultPageData) : storeData;

    const [isLocked, setIsLocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [unlockError, setUnlockError] = useState('');

    useEffect(() => {
        if (slug) {
            fetch(`/api/page/${slug}`)
                .then(res => res.json())
                .then(data => {
                    if (data.isLocked) {
                        setIsLocked(true);
                        setApiData(data); // Will contain limited info
                    } else if (data.error) {
                        setError(data.error);
                    } else {
                        setApiData(data);
                    }
                })
                .catch(() => setError('Failed to load page'))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const unlock = async () => {
        if (!slug) return;

        try {
            const res = await fetch('/api/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, password: passwordInput })
            });
            const json = await res.json();

            if (json.error) {
                setUnlockError(json.error);
            } else {
                setApiData(json);
                setIsLocked(false);
            }
        } catch {
            setUnlockError('Unlock failed');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl text-primary">❤️</div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-heading mb-2">This page is protected</h2>
                    <p className="text-gray-500 mb-6">Please enter the password to view this love page.</p>

                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4 text-center"
                        placeholder="Password"
                    />
                    {unlockError && <p className="text-red-500 text-sm mb-4">{unlockError}</p>}

                    <button onClick={unlock} className="w-full btn-primary">Unlock</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-light font-body" style={{ '--primary-color': data.themeColor } as CSSProperties}>

            {/* Hero */}
            <header className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 z-0"></div>
                <div className="z-10 relative">
                    <div className="animate-float text-6xl mb-6">❤️</div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-4">
                        {data.partnerName}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light italic">
                        "{data.yourName} has a message for you..."
                    </p>
                    <button onClick={() => document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' })} className="animate-bounce">
                        <Heart className="w-10 h-10 text-primary mx-auto fill-current" />
                    </button>
                </div>
            </header>

            {/* Gallery */}
            {data.photos && data.photos.length > 0 && (
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl text-center font-heading text-primary mb-10">Our Memories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.photos.map((photo, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-500">
                                    <img src={photo.url} alt="Memory" className="w-full h-64 object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Letter */}
            <section id="letter" className="py-20 px-4">
                <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-2xl shadow-xl transform skew-y-1 relative">
                    <div className="absolute -top-6 -left-6 text-6xl opacity-20">❝</div>
                    <div className="prose prose-lg mx-auto font-heading text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data.loveLetter || "No letter written yet..."}
                    </div>
                    <div className="mt-8 text-right font-bold text-xl text-primary">— {data.yourName}</div>
                </div>
            </section>

            {/* Reasons */}
            {data.reasons && data.reasons.length > 0 && (
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl text-center font-heading text-primary mb-10">Why I Love You</h2>
                        <div className="grid gap-4">
                            {data.reasons.map((r, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center text-lg">
                                    {r.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-10 text-center text-gray-500 text-sm">
                Made with ❤️ via ForeverUs
            </footer>

            {/* Music Player Mock */}
            {data.bgMusicUrl && (
                <div className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-xl z-50 animate-spin-slow cursor-pointer" title="Playing Music">
                    <Music className="text-primary" />
                    <audio src={data.bgMusicUrl} autoPlay loop />
                </div>
            )}
        </div>
    );
};

export default LovePage;
