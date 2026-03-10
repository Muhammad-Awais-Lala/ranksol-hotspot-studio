import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonicalUrl }) => {
    const location = useLocation();
    const baseUrl = 'https://studio.ranksol.com';

    const fullUrl = canonicalUrl || `${baseUrl}${location.pathname}${location.search}`;

    const defaultTitle = 'RankSol Design Studio — AI-Powered Interior Visualization';
    const defaultDescription = 'RankSol Design Studio: Visualize and transform any room with AI-powered hotspot technology. Explore premium interior templates built by RankSol.';

    return (
        <Helmet>
            <title>{title || defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <link rel="canonical" href={fullUrl} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={fullUrl} />
        </Helmet>
    );
};

export default SEO;
