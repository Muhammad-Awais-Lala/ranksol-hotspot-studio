const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { text: 'Services', href: 'https://ranksol.com/services/' },
        { text: 'Portfolio', href: 'https://ranksol.com/portfolio/' },
        { text: 'Case Studies', href: 'https://ranksol.com/case-studies/' },
        { text: 'Careers', href: 'https://ranksol.com/careers/' },
    ];

    const companyLinks = [
        { text: 'About RankSol', href: 'https://ranksol.com/about/' },
        { text: 'Blog', href: 'https://ranksol.com/blog/' },
        { text: 'Privacy Policy', href: 'https://ranksol.com/privacy-policy/' },
        { text: 'Contact Us', href: 'https://ranksol.com/contact/' },
    ];

    const socialLinks = [
        {
            href: 'https://www.facebook.com/ranksol',
            label: 'Facebook',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            )
        },
        {
            href: 'https://www.instagram.com/ranksol/',
            label: 'Instagram',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
                </svg>
            )
        },
        {
            href: 'https://x.com/ranksol',
            label: 'Twitter/X',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            href: 'https://www.linkedin.com/company/ranksol',
            label: 'LinkedIn',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            )
        },
    ];

    return (
        <footer className="bg-[#0A0A0A] text-white relative overflow-hidden">
            {/* Top orange line */}
            <div className="h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF8C33] to-[#FF6B00]"></div>

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative max-w-[1440px] mx-auto px-6 lg:px-8 pt-16 pb-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Logo */}
                        <a href="https://ranksol.com/" className="inline-flex items-center gap-3 no-underline group">
                            <div className="w-12 h-12 bg-[#FF6B00] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/30">
                                <span className="text-white font-black text-xl leading-none">R</span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-white font-black text-[22px] tracking-tight">Rank<span className="text-[#FF6B00]">Sol</span></span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Design Studio</span>
                            </div>
                        </a>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            RankSol is a full-service digital agency specializing in web development,
                            digital marketing, and innovative design solutions. This AI Design Studio
                            showcases our creative capabilities.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-3">
                            <a href="mailto:info@ranksol.com" className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B00] transition-colors text-sm no-underline group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                info@ranksol.com
                            </a>
                            <a href="https://ranksol.com" className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B00] transition-colors text-sm no-underline group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                ranksol.com
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10 lg:pl-8">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span className="w-5 h-0.5 bg-[#FF6B00] inline-block"></span>
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-[#FF6B00] text-sm transition-colors no-underline flex items-center gap-2 group"
                                        >
                                            <span className="w-0 group-hover:w-3 h-px bg-[#FF6B00] transition-all duration-200 inline-block"></span>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span className="w-5 h-0.5 bg-[#FF6B00] inline-block"></span>
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {companyLinks.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-[#FF6B00] text-sm transition-colors no-underline flex items-center gap-2 group"
                                        >
                                            <span className="w-0 group-hover:w-3 h-px bg-[#FF6B00] transition-all duration-200 inline-block"></span>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social & Connect */}
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span className="w-5 h-0.5 bg-[#FF6B00] inline-block"></span>
                                Connect
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FF6B00] hover:bg-orange-500/20 hover:border-orange-500/30 transition-all duration-200"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            {/* Built by badge */}
                            <div className="p-4 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                                <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">A Product By</p>
                                <a
                                    href="https://ranksol.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FF6B00] font-black text-lg no-underline hover:text-orange-400 transition-colors"
                                >
                                    RankSol
                                </a>
                                <p className="text-[11px] text-gray-600 mt-1">Digital Innovation Agency</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        © {currentYear} <span className="text-gray-400 font-semibold">RankSol</span>. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <span>Built with</span>
                        <span className="text-[#FF6B00]">♥</span>
                        <span>by</span>
                        <a href="https://ranksol.com" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-bold no-underline hover:text-orange-400 transition-colors">
                            RankSol
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;