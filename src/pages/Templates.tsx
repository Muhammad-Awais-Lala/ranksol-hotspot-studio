import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import SEO from '../components/SEO';

interface PortfolioItem {
    id: number;
    title: string;
    slug: string;
    image: string;
}

interface TemplatesResponse {
    success: boolean;
    portfolios: Array<{
        id: number;
        title: string;
        slug: string;
        main_images: {
            [key: string]: PortfolioItem;
        };
    }>;
    meta_title: string;
    meta_description: string;
}

interface TemplatesProps {
    categorySlug: string;
    onSelectTemplate: (id: string) => void;
    onBack: () => void;
}

const Templates: React.FC<TemplatesProps> = ({ categorySlug, onSelectTemplate, onBack }) => {
    const [templates, setTemplates] = useState<PortfolioItem[]>([]);
    const [metaData, setMetaData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/templates/${categorySlug}`);
                const data: TemplatesResponse = response.data;

                if (data.success && data.portfolios.length > 0) {
                    const mainImagesObj = data.portfolios[0].main_images;
                    const templateList = Object.values(mainImagesObj);
                    setTemplates(templateList);
                    setMetaData({
                        title: data.meta_title,
                        description: data.meta_description
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching templates:', err);
                setError('Failed to load room templates.');
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF6B00] animate-spin"></div>
                        <div className="absolute inset-3 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.5">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[#0A0A0A] font-bold text-sm">Loading Templates</p>
                        <p className="text-gray-400 text-xs mt-1">Fetching design options...</p>
                    </div>
                </div>
            </div>
        );
    }

    const categoryLabel = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="min-h-screen bg-white font-sans text-[#0A0A0A]">
            <SEO />

            {/* ─── Page Header ─── */}
            <div className="bg-[#0A0A0A] relative overflow-hidden">
                {/* Background decor */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF6B00]/8 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}
                    ></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    {/* Breadcrumb / Back */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#FF6B00] transition-colors group mb-8"
                    >
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#FF6B00]/20 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Categories</span>
                    </button>

                    {/* Title Area */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/25 mb-5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></div>
                            <span className="text-[#FF6B00] text-[11px] font-bold uppercase tracking-widest">
                                {categoryLabel} Templates
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-4">
                            {metaData.title || `${categoryLabel} Design`}{' '}
                            <span className="text-[#FF6B00]">Templates</span>
                        </h1>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-0.5 bg-[#FF6B00]"></div>
                            <div className="w-4 h-0.5 bg-[#FF6B00]/40"></div>
                        </div>

                        <p className="text-gray-400 text-base leading-relaxed">
                            {metaData.description || `Explore premium ${categoryLabel.toLowerCase()} design templates with full AI-powered customization.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Results Count ─── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                    <span className="text-sm font-bold text-gray-700">
                        {templates.length} Template{templates.length !== 1 ? 's' : ''} Available
                    </span>
                </div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                    {categoryLabel} Collection
                </div>
            </div>

            {/* ─── Templates Grid ─── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 pb-24">
                {error ? (
                    <div className="text-center py-20 bg-orange-50 rounded-3xl border-2 border-dashed border-orange-200">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-bold text-base mb-2">Could Not Load Templates</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                        <button onClick={onBack} className="mt-6 px-6 py-2.5 bg-[#FF6B00] text-white text-sm font-bold rounded-xl hover:bg-[#E05E00] transition-colors">
                            Go Back
                        </button>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-bold text-base mb-1">No Templates Found</p>
                        <p className="text-gray-400 text-sm">No templates available for this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {templates.map((template, index) => (
                            <div
                                key={template.id}
                                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-500 hover:border-[#FF6B00]/30 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-1"
                                onClick={() => onSelectTemplate(template.slug)}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Template Number */}
                                <div className="absolute top-4 left-4 z-10">
                                    <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                        <span className="text-[11px] font-black text-[#0A0A0A]">{String(index + 1).padStart(2, '0')}</span>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-50">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Hover: Launch CTA */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="px-5 py-2.5 bg-[#FF6B00] text-white text-sm font-bold rounded-full shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            Open in Studio →
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-0.5 bg-[#FF6B00]"></div>
                                                <span className="text-[#FF6B00] text-[10px] font-bold uppercase tracking-widest">{categoryLabel}</span>
                                            </div>
                                            <h3 className="text-base font-black text-[#0A0A0A] group-hover:text-[#FF6B00] transition-colors">
                                                {template.title}
                                            </h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300 text-gray-400">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                <polyline points="9 22 9 12 15 12 15 22" />
                                            </svg>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                        Customize this {categoryLabel.toLowerCase()} design with AI-powered hotspot tools. Edit colors, textures, and finishes instantly.
                                    </p>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectTemplate(template.slug); }}
                                        className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                            bg-[#0A0A0A] text-white group-hover:bg-[#FF6B00] group-hover:shadow-lg group-hover:shadow-orange-200 active:scale-95"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        Customize in Studio
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

export default Templates;
