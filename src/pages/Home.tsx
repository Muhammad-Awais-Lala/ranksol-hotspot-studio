import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import { API_BASE_URL } from '../../constants';

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
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/portfolio-categories`);
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF6B00] animate-spin"></div>
                        <div className="absolute inset-3 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B00">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[#0A0A0A] font-bold text-sm">Loading Design Spaces</p>
                        <p className="text-gray-400 text-xs mt-1">Preparing your canvas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-[#0A0A0A]">
            <SEO />

            {/* ─── Hero Section ─── */}
            <section className="relative bg-[#0A0A0A] overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF6B00]/8 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#FF6B00]/20 to-transparent"></div>
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}
                    ></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
                    <div className="max-w-4xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/25 mb-8">
                            <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></div>
                            <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest">
                                RankSol — AI Design Studio
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                            Visualize Your{' '}
                            <span className="relative inline-block">
                                <span className="text-[#FF6B00]">Dream</span>
                            </span>
                            <br />
                            Interior Space
                        </h1>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-1 bg-[#FF6B00] rounded-full"></div>
                            <div className="w-4 h-1 bg-[#FF6B00]/40 rounded-full"></div>
                            <div className="w-2 h-1 bg-[#FF6B00]/20 rounded-full"></div>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
                            Experience premium interior visualization with AI-powered hotspot technology.
                            Select a room category, choose your template, and transform your space with
                            precision and creativity — powered by <span className="text-[#FF6B00] font-semibold">RankSol</span>.
                        </p>

                        {/* CTA Stats Row */}
                        <div className="flex flex-wrap items-center gap-6">
                            {[
                                { value: '5+', label: 'Room Categories' },
                                { value: 'AI', label: 'Powered Engine' },
                                { value: '∞', label: 'Customization' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {i > 0 && <div className="w-px h-8 bg-white/10 hidden sm:block"></div>}
                                    <div>
                                        <div className="text-2xl font-black text-[#FF6B00]">{stat.value}</div>
                                        <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* ─── Section Header ─── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-0.5 bg-[#FF6B00]"></div>
                            <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest">Choose Your Space</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-[#0A0A0A] leading-tight">
                            Select a Room Category
                        </h2>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                        Each category offers unique AI-powered templates with full customization control.
                    </p>
                </div>
            </section>

            {/* ─── Grid Section ─── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-8">
                {error ? (
                    <div className="text-center py-20 bg-orange-50 rounded-3xl border-2 border-dashed border-orange-200">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-bold text-base mb-2">Failed to Load</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.portfolios?.map((category: Category) => (
                            <div
                                key={category.id}
                                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-500 hover:border-[#FF6B00]/30 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-1"
                                onClick={() => onSelectRoom(category.slug)}
                                onMouseEnter={() => setHoveredId(category.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={category.main_image?.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-[#0A0A0A] rounded-full shadow-sm">
                                            {category.title}
                                        </span>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Icon + Title */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] flex-shrink-0 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300">
                                            <div className="w-5 h-5">
                                                {getIconForCategory(category.slug)}
                                            </div>
                                        </div>
                                        <h3 className="text-base font-black text-[#0A0A0A] group-hover:text-[#FF6B00] transition-colors duration-300">
                                            {category.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                                        {getDescriptionForCategory(category.slug)}
                                    </p>

                                    {/* CTA */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectRoom(category.slug); }}
                                        className="w-full py-3 px-5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                            bg-[#0A0A0A] text-white group-hover:bg-[#FF6B00] group-hover:shadow-lg group-hover:shadow-orange-200 active:scale-95"
                                    >
                                        <span>Explore Templates</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── Bottom CTA Banner ─── */}
            <section className="bg-[#0A0A0A] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">
                            Ready to Transform Your Space?
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Select any category above and start your design journey today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://ranksol.com/contact/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3.5 bg-[#FF6B00] text-white font-bold text-sm rounded-xl hover:bg-[#E05E00] transition-all shadow-lg shadow-orange-900/30 no-underline whitespace-nowrap active:scale-95"
                        >
                            Contact RankSol
                        </a>
                        <a
                            href="https://ranksol.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3.5 border border-white/20 text-white font-bold text-sm rounded-xl hover:border-[#FF6B00]/50 hover:text-[#FF6B00] transition-all no-underline whitespace-nowrap"
                        >
                            Visit Website
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper: SVG icons per category
const getIconForCategory = (slug: string) => {
    switch (slug) {
        case 'kitchen':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M13 3v6" /></svg>;
        case 'bedroom':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>;
        case 'bathroom':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0 1.5 1.5 0 0 0 0 2.12L7 8z" /><path d="M2 14h15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2v-6Z" /></svg>;
        case 'office-room':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>;
        case 'lounge':
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M6 16h12" /><path d="M6 13a6 6 0 0 1 12 0v3H6v-3Z" /></svg>;
        default:
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    }
};

// Helper: descriptions
const getDescriptionForCategory = (slug: string) => {
    switch (slug) {
        case 'kitchen': return 'Design a functional and stylish kitchen with custom cabinetry, countertops, and premium finishes.';
        case 'bedroom': return 'Create your perfect retreat with personalized wardrobes, lighting, and tranquil color palettes.';
        case 'bathroom': return 'Elevate your bathroom with elegant surface panels and moisture-resistant luxury finishes.';
        case 'office-room': return 'Design a productive workspace balancing focus, comfort, and modern aesthetics.';
        case 'lounge': return 'Transform your lounge into a welcoming social space with premium panels and feature walls.';
        default: return 'Design your perfect sanctuary with premium materials and finishes tailored to perfection.';
    }
};

export default Home;