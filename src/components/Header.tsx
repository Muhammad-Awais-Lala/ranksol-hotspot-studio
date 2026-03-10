import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigationLinks = [
        { text: 'Home', href: 'https://ranksol.com/' },
        { text: 'Services', href: 'https://ranksol.com/services/', target: '_blank' },
        { text: 'Portfolio', href: 'https://ranksol.com/portfolio/', target: '_blank' },
        { text: 'Case Studies', href: 'https://ranksol.com/case-studies/', target: '_blank' },
        { text: 'Contact', href: 'https://ranksol.com/contact/', target: '_blank' },
    ];

    const socialLinks = [
        {
            href: 'https://www.facebook.com/ranksol',
            label: 'Facebook',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            )
        },
        {
            href: 'https://www.instagram.com/ranksol/',
            label: 'Instagram',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            href: 'https://www.linkedin.com/company/ranksol',
            label: 'LinkedIn',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            )
        },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 border-b border-gray-100'
                    : 'bg-white border-b border-gray-100'
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                    <nav className="flex items-center justify-between h-[72px]">

                        {/* Logo */}
                        <div className="flex items-center gap-3 z-50">
                            <a href="https://ranksol.com/" className="flex items-center gap-3 no-underline group">
                                {/* RankSol Logo Mark */}
                                <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:shadow-orange-300 transition-shadow">
                                    <span className="text-white font-black text-lg leading-none">R</span>
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[#0A0A0A] font-black text-[18px] tracking-tight">Rank<span className="text-[#FF6B00]">Sol</span></span>
                                    <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Design Studio</span>
                                </div>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <ul className="hidden lg:flex items-center gap-1">
                            {navigationLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="relative px-4 py-2 text-[14px] font-semibold text-gray-700 hover:text-[#FF6B00] transition-colors duration-200 group no-underline rounded-lg hover:bg-orange-50"
                                        target={link.target || '_self'}
                                        rel={link.target ? 'noopener noreferrer' : ''}
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Social Icons */}
                            <div className="flex items-center gap-1.5">
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#FF6B00] hover:bg-orange-50 transition-all duration-200"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            <div className="w-px h-6 bg-gray-200"></div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B00] text-white text-[13px] font-bold rounded-xl hover:bg-[#E05E00] transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-orange-300 active:scale-95"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Logout
                            </button>
                        </div>

                        {/* Hamburger (Mobile) */}
                        <button
                            id="hamburger"
                            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-orange-50 transition-colors z-50"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className={`block w-5 h-0.5 bg-[#0A0A0A] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-[#0A0A0A] my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-[#0A0A0A] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white transition-all duration-400 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ paddingTop: '72px' }}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Orange top accent */}
                    <div className="h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF8C33] to-[#FF6B00] w-full"></div>

                    <div className="flex-1 px-6 py-8">
                        {/* Navigation Links */}
                        <ul className="flex flex-col gap-2 mb-8">
                            {navigationLinks.map((link, index) => (
                                <li key={index} className="border-b border-gray-100 last:border-0">
                                    {link.href.startsWith('/') ? (
                                        <Link
                                            to={link.href}
                                            className="flex items-center justify-between py-4 text-[18px] font-bold text-gray-800 hover:text-[#FF6B00] transition-colors no-underline"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.text}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="flex items-center justify-between py-4 text-[18px] font-bold text-gray-800 hover:text-[#FF6B00] transition-colors no-underline"
                                            target={link.target || '_self'}
                                            rel={link.target ? 'noopener noreferrer' : ''}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.text}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Logout Button */}
                        <button
                            onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                            className="w-full py-4 bg-[#FF6B00] text-white font-bold text-[16px] rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>

                    {/* Mobile Social */}
                    <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow RankSol</p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#FF6B00] hover:border-orange-200 transition-all shadow-sm"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4">© {new Date().getFullYear()} RankSol. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-[72px]"></div>
        </>
    );
};

export default Header;