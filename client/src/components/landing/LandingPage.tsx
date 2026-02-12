import { Link } from 'react-router-dom';
import { Heart, Gift, Eye, Lock, Smartphone } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-secondary-light overflow-x-hidden">
            {/* Navigation */}
            <nav className="absolute w-full z-10 top-0 py-6 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-md rounded-full px-6 py-3 shadow-sm">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">ForeverUs</Link>
                    <div className="hidden md:flex space-x-8">
                        <a href="#how-it-works" className="text-gray-700 hover:text-primary transition">How It Works</a>
                        <a href="#features" className="text-gray-700 hover:text-primary transition">Features</a>
                    </div>
                    <Link to="/create" className="btn-sm btn-primary py-2 px-6 text-sm">Create Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-4 text-center">
                <div className="max-w-4xl mx-auto z-10 relative">
                    <div className="inline-block animate-float mb-4 text-3xl">❤️</div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Make Them Feel Truly Special This Valentine’s Day
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Design a personalized, interactive love website in minutes – photos, messages, moments, all in one private link just for them.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/create" className="btn-primary flex items-center justify-center gap-2">
                            <Gift size={20} /> Create Your Love Page
                        </Link>
                        <button className="btn-secondary">View Demo</button>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-1/2 left-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/3 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
            </header>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4 bg-white/50">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl mb-4">3 Simple Steps to Romance</h2>
                    <p className="text-gray-600">Creating your digital gift is easier than writing a card.</p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                    {[
                        { num: '01', title: 'Customize', desc: 'Add your names, upload photos, and write your heartfelt notes.', icon: <Heart className="w-10 h-10 text-primary" /> },
                        { num: '02', title: 'Preview', desc: 'See your private love page exactly as they’ll see it.', icon: <Eye className="w-10 h-10 text-primary" /> },
                        { num: '03', title: 'Gift', desc: 'Get a unique link. Send it comfortably via text or email.', icon: <Gift className="w-10 h-10 text-primary" /> }
                    ].map((step, idx) => (
                        <div key={idx} className="glass-card p-8 text-center relative group hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute top-4 left-4 text-6xl font-heading text-primary/5 font-bold select-none">{step.num}</div>
                            <div className="mb-6 flex justify-center">{step.icon}</div>
                            <h3 className="text-2xl mb-4">{step.title}</h3>
                            <p className="text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl">Everything in One Romantic Page</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Photo Gallery", desc: "Showcase your beautiful memories.", icon: <Heart /> },
                            { title: "Private & Secure", desc: "Password-protected for your eyes only.", icon: <Lock /> },
                            { title: "Mobile First", desc: "Looks stunning on their phone.", icon: <Smartphone /> }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition">
                                <div className="p-3 bg-secondary-light rounded-full text-primary">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-white py-10 border-t border-gray-100 text-center">
                <p className="text-gray-500 font-body">© 2026 ForeverUs. Making love digital.</p>
            </footer>

        </div>
    );
};

export default LandingPage;
