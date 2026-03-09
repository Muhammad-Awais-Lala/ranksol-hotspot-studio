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

                // console.log("data fetched===>", data)

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#EFE223] rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <SEO />
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Categories</span>
                </button>
            </div>

            {/* Hero Section */}
            <section className="pt-10 pb-16 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                    {metaData.title || 'Transform Your Space'} <span className="text-[#EFE223]">KMI</span>
                </h1>
                <div className="w-24 h-1 bg-[#EFE223] mx-auto mb-8" />
                <p className="text-slate-500 text-lg leading-relaxed mb-12">
                    {metaData.description || "Experience premium interior customization with KMI Groups' high-quality materials."}
                </p>

                <div className="inline-block relative">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 mb-2">
                        Premium Interior Templates
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
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col group hover:scale-[1.02] transition-all duration-500"
                                onClick={() => onSelectTemplate(template.slug)}
                            >
                                {/* Image Container */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-5 h-5 text-slate-900">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900">{template.title}</h3>
                                    </div>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                        Design your perfect sanctuary for rest and relaxation. Personalize your bed, storage, lighting, and color scheme for the ultimate comfort.
                                    </p>

                                    <button
                                        onClick={() => onSelectTemplate(template.slug)}
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

export default Templates;
