import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../constants';
import SEO from '../components/SEO';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: formData.email, password: formData.password
            });
            if (response.data.status) {
                const { token, user } = response.data.data;
                login(token, { id: user.id.toString(), name: user.name, email: user.email });
                navigate('/');
            } else {
                setErrors({ general: response.data.message || 'Login failed' });
            }
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsLoading(true);
        setErrors({});
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: 'guest@example.com', password: 'Guest@12345'
            });
            if (response.data.status) {
                const { token, user } = response.data.data;
                login(token, { id: user.id.toString(), name: user.name, email: user.email });
                navigate('/');
            } else {
                setErrors({ general: response.data.message || 'Guest login failed' });
            }
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Guest login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <SEO />

            {/* ─── Left Panel — Branding ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative overflow-hidden flex-col items-center justify-center p-12">
                {/* Background decor */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#FF6B00]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF6B00]/8 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }}
                    ></div>
                </div>

                <div className="relative z-10 text-center max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <div className="w-14 h-14 bg-[#FF6B00] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                            <span className="text-white font-black text-2xl leading-none">R</span>
                        </div>
                        <div className="text-left">
                            <div className="text-white font-black text-2xl tracking-tight">Rank<span className="text-[#FF6B00]">Sol</span></div>
                            <div className="text-gray-500 text-[11px] font-medium tracking-widest uppercase">Design Studio</div>
                        </div>
                    </div>

                    {/* Feature blocks */}
                    <div className="space-y-5">
                        {[
                            { icon: '🎨', title: 'AI-Powered Design', desc: 'Visualize rooms with intelligent hotspot technology' },
                            { icon: '🏠', title: '5+ Room Categories', desc: 'Kitchen, bedroom, lounge, bathroom, office & more' },
                            { icon: '⚡', title: 'Real-Time Editing', desc: 'Instant customization with premium materials' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-[#FF6B00]/30 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center text-lg flex-shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{f.title}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10">
                        <p className="text-gray-600 text-xs">
                            Crafted with excellence by{' '}
                            <a href="https://ranksol.com" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-bold no-underline hover:underline">
                                RankSol
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Right Panel — Form ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <span className="text-white font-black text-lg leading-none">R</span>
                        </div>
                        <div>
                            <div className="text-[#0A0A0A] font-black text-xl tracking-tight">Rank<span className="text-[#FF6B00]">Sol</span></div>
                            <div className="text-gray-400 text-[10px] font-medium tracking-widest uppercase">Design Studio</div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-[#0A0A0A] mb-2">Welcome Back</h1>
                        <p className="text-gray-500 text-sm">Sign in to your RankSol Design Studio account</p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-0.5 bg-[#FF6B00]"></div>
                            <div className="w-4 h-0.5 bg-[#FF6B00]/40"></div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errors.general && (
                        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="login-email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-11 pr-4 py-3.5 text-sm text-[#0A0A0A] bg-gray-50 border-2 rounded-2xl outline-none transition-all
                                        focus:bg-white focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100
                                        ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="login-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-12 py-3.5 text-sm text-[#0A0A0A] bg-gray-50 border-2 rounded-2xl outline-none transition-all
                                        focus:bg-white focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100
                                        ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B00] transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            id="login-submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#FF6B00] text-white font-black text-sm rounded-2xl hover:bg-[#E05E00] transition-all shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400 font-medium px-2">OR</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Guest Button */}
                        <button
                            type="button"
                            id="guest-login"
                            onClick={handleGuestLogin}
                            disabled={isLoading}
                            className="w-full py-3.5 border-2 border-gray-200 text-[#0A0A0A] font-bold text-sm rounded-2xl hover:border-[#FF6B00]/50 hover:bg-orange-50 hover:text-[#FF6B00] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Continue as Guest
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#FF6B00] font-bold no-underline hover:underline">
                            Create Account
                        </Link>
                    </p>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-[11px] text-gray-400">
                        By signing in you agree to RankSol's{' '}
                        <a href="https://ranksol.com/privacy-policy/" className="text-[#FF6B00] no-underline hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
