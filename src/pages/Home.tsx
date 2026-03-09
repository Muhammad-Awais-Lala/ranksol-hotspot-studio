import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';

interface Category {
    id: number;
    title: string;
    slug: string;
    main_image: {
        id: number;
        title: string;
        slug: string;
        image: string;
    };
}

interface HomeProps {
    onSelectRoom: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectRoom }) => {
    const [categories, setCategories] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://kmigroups.com/api/portfolio-categories');
                // console.log("data fetched===>", response.data.portfolios)
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load room categories.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Spaces...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <SEO />
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                    Transform Your Space with <span className="text-[#EFE223]">KMI</span>
                </h1>
                <div className="w-24 h-1 bg-[#EFE223] mx-auto mb-8" />
                <p className="text-slate-500 text-lg leading-relaxed mb-12">
                    Experience premium interior customization with KMI Groups' high-quality materials.
                    Visualize and design your perfect space using our innovative room
                    customization tools, featuring KMI's exclusive wooden sheets and premium finishes.
                </p>

                <div className="inline-block relative">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 mb-2">
                        Premium Interior Spaces by KMI
                    </h2>
                    <div className="w-full h-1 bg-[#EFE223]" />
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                {error ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.portfolios.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col group hover:scale-[1.02] transition-all duration-500"
                                onClick={() => onSelectRoom(category.slug)}
                            >
                                {/* Image Container */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={category.main_image?.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-5 h-5 text-slate-900">
                                            {getIconForCategory(category.slug)}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900">{category.title}</h3>
                                    </div>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                        {getDescriptionForCategory(category.slug)}
                                    </p>

                                    <button
                                        onClick={() => onSelectRoom(category.slug)}
                                        className="w-full py-4 bg-[#EFE223] hover:bg-[#D7D126] text-slate-900 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-100 uppercase tracking-widest text-[11px]"
                                    >
                                        Customize This Room
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

// Helper function to return SVG icons based on category slug
const getIconForCategory = (slug: string) => {
    switch (slug) {
        case 'kitchen':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M13 3v6" /><path d="M11 14h2" /><path d="M11 18h2" /></svg>;
        case 'bedroom':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>;
        case 'bathroom':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0 1.5 1.5 0 0 0 0 2.12L7 8z" /><path d="M2 14h15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2v-6Z" /><path d="M6 14v1h1" /><path d="M10 14v1h1" /></svg>;
        case 'office-room':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 12h10" /><path d="M9 12v2" /><path d="M15 12v2" /></svg>;
        case 'lounge':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18" /><path d="M6 16h12" /><path d="M6 13a6 6 0 0 1 12 0v3H6v-3Z" /><path d="M12 7V4" /></svg>;
        default:
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    }
};

// Helper function to return description based on category slug
const getDescriptionForCategory = (slug: string) => {
    switch (slug) {
        case 'kitchen':
            return "Design a functional and stylish kitchen with customized cabinetry, countertops, finishes that blend practicality with modern aesthetics.";
        case 'bedroom':
            return "Create a calm and comfortable bedroom by personalizing wardrobes, wall panels, lighting, and color tones for a peaceful retreat.";
        case 'bathroom':
            return "Upgrade your bathroom with elegant surface panels and moisture-resistant finishes that enhance comfort and luxury.";
        case 'office-room':
            return "Design a productive workspace with customized wall solutions and finishes that balance focus, comfort, and style.";
        case 'lounge':
            return "Transform your lounge into a welcoming space with premium panels and feature walls that elevate relaxation and social living.";
        default:
            return "Design your perfect sanctuary. Personalize your space with our premium materials and finishes.";
    }
};

export default Home;