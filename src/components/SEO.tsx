import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ canonicalUrl }) => {
    const location = useLocation();
    const baseUrl = 'https://designstudio.kmigroups.com';

    // Construct the canonical URL if not provided
    const fullUrl = canonicalUrl || `${baseUrl}${location.pathname}${location.search}`;
    console.log("fullUrl===>", fullUrl)
    return (
        <Helmet>
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};

export default SEO;
