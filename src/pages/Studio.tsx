
import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { AppStatus, Hotspot } from '../../types';
import { editImageMaterial } from '../services/geminiService';
import { Sheet, fetchSheets, PaginationInfo } from '../services/sheetService';
import { checkRequestLimit } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import HotspotOverlay from '../components/HotspotOverlay';
import { API_BASE_URL } from '../../constants';


import SEO from '../components/SEO';

interface StudioProps {
    onBack: () => void;
}

const Studio: React.FC<StudioProps> = ({ onBack }) => {
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
    const [image, setImage] = useState<string>('');
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [roomName, setRoomName] = useState<string>('Studio');


    // Sheets state
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loadingSheets, setLoadingSheets] = useState(false);
    const [pendingSheet, setPendingSheet] = useState<Sheet | null>(null);



    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = `Vivid-Design-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const fetchRoomData = useCallback(async () => {
        setStatus(AppStatus.FETCHING);
        setError(null);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const roomId = urlParams.get('id');

            const response = await axios.get(`${API_BASE_URL}/portfolio-data/${roomId}`);
            const data = response.data;

            // console.log("data fetched===>", data)

            if (data.main_image) {
                setImage(data.main_image);
            }

            if (data.masks && Array.isArray(data.masks)) {
                const mappedHotspots: Hotspot[] = data.masks.map((m: any, index: number) => ({
                    id: m.slug || `spot-${Date.now()}-${index}`,
                    label: m.title || m.application_area || 'Point',
                    area: m.application_area || 'General',
                    applicationAreaSlug: m.application_area_slug || m.slug || '',
                    description: m.short_description,
                    x: parseFloat(m.mask_x || '0') * 1000,
                    y: parseFloat(m.mask_y || '0') * 1000
                }));
                setHotspots(mappedHotspots);
            }

            if (data.name || data.title) {
                setRoomName(data.name || data.title);
            }

            setStatus(AppStatus.READY);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError("Failed to load design data. Using fallback.");
            // Fallback to initial state or error
            setStatus(AppStatus.ERROR);
        }
    }, []);



    const loadSheets = useCallback(async (slug: string, page: number) => {
        setLoadingSheets(true);
        try {
            const response = await fetchSheets(slug, page);
            setSheets(response.sheets);
            setPagination(response.pagination);
            setCurrentPage(response.pagination.current_page);
        } catch (err) {
            console.error("Error loading sheets:", err);
            setSheets([]);
            setPagination(null);
        } finally {
            setLoadingSheets(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSpot) {
            setCurrentPage(1);
            setPendingSheet(null);
            loadSheets(selectedSpot.applicationAreaSlug, 1);
        } else {
            setSheets([]);
            setPendingSheet(null);
            setPagination(null);
        }
    }, [selectedSpot, loadSheets]);

    const handleNextPage = () => {
        if (!selectedSpot || !pagination || loadingSheets) return;
        if (currentPage < pagination.last_page) {
            loadSheets(selectedSpot.applicationAreaSlug, currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (!selectedSpot || !pagination || loadingSheets) return;
        if (currentPage > 1) {
            loadSheets(selectedSpot.applicationAreaSlug, currentPage - 1);
        }
    };

    const { token } = useAuth();

    const confirmApplySheet = async () => {
        if (!selectedSpot || !pendingSheet) return;

        // Stop user if limit reached
        if (error === "No remaining requests") {
            return;
        }

        setStatus(AppStatus.EDITING);
        setError(null);
        try {
            const newImage = await editImageMaterial(
                image,
                selectedSpot.label,
                pendingSheet.name,
                pendingSheet.path,
                { x: selectedSpot.x, y: selectedSpot.y },
                selectedSpot.description
            );
            setImage(newImage);

            // Hit Request Limit API after successful apply
            if (token) {
                try {
                    await checkRequestLimit(token);
                } catch (limitErr: any) {
                    // If limit reached, show the specific error message
                    setError(limitErr.message);
                    setStatus(AppStatus.READY);
                    // We don't return here because the image was already updated successfully
                }
            }

            setStatus(AppStatus.READY);
            setPendingSheet(null); // Clear selection after apply
        } catch (err: any) {
            console.error("Editing Error:", err);
            setError(err.message || "Render engine busy. Please retry.");
            setStatus(AppStatus.READY);
        }
    };

    useEffect(() => {
        fetchRoomData();
        if (token) {
            checkRequestLimit(token).catch(err => {
                if (err.message === "No remaining requests") {
                    setError(err.message);
                }
            });
        }
    }, [fetchRoomData, token]);

    const [activeTab, setActiveTab] = useState<'elements' | 'materials'>('elements');

    useEffect(() => {
        if (selectedSpot) {
            setActiveTab('materials');
        }
    }, [selectedSpot]);

    return (
        <>
            <SEO />
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#FF6B00] transition-colors group"
                >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Templates</span>
                </button>
            </div>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-orange-100 overflow-x-hidden">

                <main className="flex-1 flex flex-col lg:flex-row p-3 lg:p-6 gap-4 lg:gap-8 max-w-[1920px] mx-auto w-full overflow-hidden">
                    {/* Main Viewport */}
                    <div className="flex-[1.5] flex flex-col bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-200 overflow-hidden relative min-h-[50vh] lg:min-h-0">
                        <div className="px-4 lg:px-10 py-4 lg:py-5 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-30">
                            <div className="flex items-center gap-2 lg:gap-3">
                                <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shadow-lg ${status === AppStatus.ERROR ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                <h2 className="text-[10px] lg:text-sm font-black text-[#0A0A0A] uppercase tracking-widest truncate max-w-[150px] lg:max-w-none">
                                    {roomName}
                                </h2>
                            </div>
                            <button
                                onClick={downloadImage}
                                className="px-3 lg:px-6 py-2 lg:py-3 bg-[#FF6B00] text-white text-[9px] lg:text-[10px] font-black rounded-lg lg:rounded-xl hover:bg-[#E05E00] transition-all shadow-xl shadow-orange-200 active:scale-95 uppercase tracking-widest flex items-center gap-2"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                <span className="hidden sm:inline">Download</span>
                            </button>
                        </div>

                        <div className="relative flex-1 bg-gray-50 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
                            <div className="relative max-w-full h-full flex items-center justify-center">
                                <div className="relative shadow-2xl rounded-3xl overflow-hidden bg-white ring-1 ring-slate-900/5">
                                    <img
                                        src={image}
                                        className={`max-w-full max-h-[70vh] lg:max-h-[95vh] object-contain block transition-all duration-1000 ${status === AppStatus.EDITING ? 'scale-105 blur-2xl opacity-40 saturate-150' : 'scale-100'}`}
                                    />

                                    {(status === AppStatus.READY || status === AppStatus.EDITING || status === AppStatus.ERROR) && (
                                        <HotspotOverlay
                                            hotspots={hotspots}
                                            onSelect={(spot) => status !== AppStatus.EDITING && setSelectedSpot(spot)}
                                            activeId={selectedSpot?.id}
                                        />
                                    )}

                                    {(status === AppStatus.FETCHING || status === AppStatus.EDITING) && (
                                        <div className="absolute inset-0 z-40 bg-white/30 backdrop-blur-2xl flex flex-col items-center justify-center">
                                            <div className="relative w-16 lg:w-24 h-16 lg:h-24 mb-4 lg:mb-8">
                                                <div className="absolute inset-0 border-3 lg:border-4 border-orange-100 rounded-full" />
                                                <div className="absolute inset-0 border-3 lg:border-4 border-t-[#FF6B00] rounded-full animate-spin" />
                                            </div>
                                            <p className="text-[9px] lg:text-xs font-black text-slate-900 tracking-[0.3em] lg:tracking-[0.5em] uppercase animate-pulse px-4 text-center">
                                                {status === AppStatus.FETCHING ? 'Initializing Studio' : 'Processing...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 lg:px-8 py-3 lg:py-5 rounded-2xl lg:rounded-[2rem] text-[9px] lg:text-[10px] font-black tracking-widest shadow-2xl border border-white/10 z-50 flex items-center gap-4 lg:gap-6 animate-in slide-in-from-bottom-5">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="uppercase text-center">{error}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Controls */}
                    <aside className="lg:w-[380px] xl:w-[420px] flex flex-col gap-4 lg:gap-6 h-[600px] lg:h-auto min-h-[450px] lg:min-h-0 overflow-hidden lg:overflow-visible">
                        {/* Tab Navigation for Mobile */}
                        <div className="flex lg:hidden bg-white p-1 rounded-2xl shadow-lg border border-slate-200 gap-1">
                            {/* <button
                            onClick={() => setActiveTab('elements')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'elements' ? 'bg-[#E8E237] text-slate-900 shadow-md' : 'text-slate-400'}`}
                        >
                            Elements
                        </button> */}
                            <button
                                onClick={() => setActiveTab('materials')}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'materials' ? 'bg-[#FF6B00] text-white shadow-md' : 'text-gray-400'}`}
                            >
                                Materials
                            </button>
                        </div>

                        {/* Room Elements Panel */}
                        {/* <div className={`${activeTab === 'elements' ? 'flex' : 'hidden'} lg:flex bg-white rounded-3xl p-5 lg:p-6 border border-slate-200 shadow-xl flex-col max-h-[40%] lg:max-h-none overflow-hidden lg:overflow-visible shrink-0`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-900">Room Elements</h3>
                                <span className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase mt-1">Select area to customize</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto overflow-y-auto lg:overflow-visible custom-scrollbar">
                            <div className="space-y-2 lg:hidden">
                                {hotspots.map((spot) => (
                                    <div
                                        key={spot.id}
                                        onClick={() => setSelectedSpot(spot)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedSpot?.id === spot.id ? 'bg-yellow-50 border-[#E8E237] ring-1 ring-[#E8E237]' : 'bg-slate-50/50 border-slate-100'}`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                            <img src={image} className="w-20 h-20 object-none" style={{ objectPosition: `${spot.x / 10}% ${spot.y / 10}%`, transform: 'scale(4)' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-800 uppercase truncate">{spot.label}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase">{spot.area}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedSpot?.id === spot.id ? 'bg-[#E8E237]' : 'bg-slate-200'}`}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <table className="hidden lg:table w-full border-collapse text-[10px] text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-3 py-3 font-black text-slate-500 uppercase tracking-widest">Preview</th>
                                        <th className="px-3 py-3 font-black text-slate-500 uppercase tracking-widest">Title</th>
                                        <th className="px-3 py-3 font-black text-slate-500 uppercase tracking-widest">Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotspots.map((spot) => (
                                        <tr
                                            key={spot.id}
                                            onClick={() => setSelectedSpot(spot)}
                                            className={`group cursor-pointer border-b border-slate-50 transition-colors ${selectedSpot?.id === spot.id ? 'bg-yellow-50/50' : 'hover:bg-slate-50/30'}`}
                                        >
                                            <td className="px-3 py-4">
                                                <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                                                    <img src={image} className="w-16 h-16 object-none" style={{ objectPosition: `${spot.x / 10}% ${spot.y / 10}%`, transform: 'scale(4)' }} />
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 font-bold text-slate-800 uppercase tracking-tight">{spot.label}</td>
                                            <td className="px-3 py-4">
                                                <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${selectedSpot?.id === spot.id ? 'bg-[#E8E237] text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                                                    {spot.area}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> */}

                        {/* Material Suite Panel */}
                        <div className={`${activeTab === 'materials' ? 'flex' : 'flex'} lg:flex bg-white rounded-3xl p-5 lg:p-6 border border-gray-200 shadow-xl flex-1 lg:flex-none flex flex-col min-h-0 lg:min-h-0 overflow-hidden lg:overflow-visible`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-[#FF6B00] rounded-full"></div>
                                    <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#0A0A0A]">Select Material</h3>
                                </div>
                                {selectedSpot && <button onClick={() => setActiveTab('elements')} className="lg:hidden text-[9px] font-black text-[#FF6B00] uppercase">Change Area</button>}
                            </div>

                            {!selectedSpot ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                    <div className="w-14 lg:w-16 h-14 lg:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-orange-200">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M12 5v2M12 17v2M5 12H3M21 12h-2M7.05 7.05L5.636 5.636M18.364 18.364l-1.414-1.414M7.05 16.95l-1.414 1.414M18.364 5.636l-1.414 1.414" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] lg:text-[11px] font-black text-[#FF6B00] uppercase tracking-widest px-4 mb-2">Select a Hotspot</p>
                                    <p className="text-[9px] text-gray-400 font-medium px-4">Click on any glowing point on the image to choose a design area</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col overflow-hidden lg:overflow-visible">
                                    <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-[#0A0A0A] rounded-xl lg:rounded-2xl text-white shadow-lg shadow-black/20 flex items-center justify-between">
                                        <div className="min-w-0 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></div>
                                            </div>
                                            <div>
                                                <span className="text-[8px] lg:text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Editing Area</span>
                                                <p className="text-xs lg:text-sm font-black truncate uppercase tracking-tight text-white">{selectedSpot.label}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center lg:hidden cursor-pointer hover:bg-white/20" onClick={() => setActiveTab('elements')}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 lg:gap-3 overflow-y-auto lg:overflow-visible pr-1 lg:pr-0 custom-scrollbar flex-1 min-h-0 content-start">
                                        {loadingSheets && sheets.length === 0 ? (
                                            <div className="col-span-full py-12 text-center">
                                                <div className="w-8 h-8 border-2 border-orange-100 border-t-[#FF6B00] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading catalog...</p>
                                            </div>
                                        ) : (
                                            <>
                                                {sheets.map((sheet) => (
                                                    <button
                                                        key={sheet.id}
                                                        onClick={() => setPendingSheet(sheet)}
                                                        disabled={status === AppStatus.EDITING}
                                                        className={`group flex flex-col p-1.5 lg:p-2 bg-gray-50 rounded-xl lg:rounded-2xl border-2 transition-all disabled:opacity-40 ${pendingSheet?.id === sheet.id ? 'border-[#FF6B00] bg-white ring-2 ring-[#FF6B00]/20 shadow-xl lg:scale-105' : 'border-transparent hover:border-orange-200 hover:bg-white hover:shadow-lg'}`}
                                                    >
                                                        <div className="w-full aspect-square rounded-lg lg:rounded-xl mb-1.5 lg:mb-2 shadow-inner overflow-hidden">
                                                            <img src={sheet.thumbnail || sheet.path} alt={sheet.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-[8px] lg:text-[9px] font-black text-[#0A0A0A] uppercase tracking-tight truncate w-full text-center">{sheet.name}</span>
                                                    </button>
                                                ))}

                                                {/* Pagination Controls */}
                                                {pagination && pagination.total > 0 && (
                                                    <div className="col-span-full flex items-center justify-between gap-3 pt-3 mt-2 border-t border-gray-100">
                                                        <button
                                                            onClick={handlePreviousPage}
                                                            disabled={loadingSheets || currentPage === 1}
                                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-orange-50 hover:text-[#FF6B00] active:scale-95 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                                            title={currentPage === 1 ? 'You are on the first page' : 'Go to previous page'}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                <polyline points="15 18 9 12 15 6" />
                                                            </svg>
                                                            <span className="hidden sm:inline">Prev</span>
                                                        </button>

                                                        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                                                            <span className="text-[9px] font-black text-[#FF6B00]">{currentPage}</span>
                                                            <span className="text-[8px] text-gray-300">/</span>
                                                            <span className="text-[9px] font-black text-gray-600">{pagination.last_page}</span>
                                                        </div>

                                                        <button
                                                            onClick={handleNextPage}
                                                            disabled={loadingSheets || currentPage >= pagination.last_page}
                                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-orange-50 hover:text-[#FF6B00] active:scale-95 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                                            title={currentPage >= pagination.last_page ? 'You are on the last page' : 'Go to next page'}
                                                        >
                                                            <span className="hidden sm:inline">Next</span>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                <polyline points="9 18 15 12 9 6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}

                                                {!loadingSheets && sheets.length === 0 && (
                                                    <div className="col-span-full py-8 lg:py-12 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">No materials found</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={confirmApplySheet}
                                            disabled={!pendingSheet || status === AppStatus.EDITING || error === "No remaining requests"}
                                            className="w-full py-3.5 lg:py-4 bg-[#FF6B00] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-black uppercase text-[10px] lg:text-[11px] tracking-widest transition-all shadow-xl shadow-orange-200 hover:bg-[#E05E00] active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {status === AppStatus.EDITING ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Rendering...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                                                    <span>Apply Texture</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </main>

                <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 20px; opacity: 0.5; }
                @media (max-width: 1024px) {
                    .custom-scrollbar::-webkit-scrollbar { width: 0px; }
                }
            `}</style>
            </div>
        </>
    );
};

export default Studio;




