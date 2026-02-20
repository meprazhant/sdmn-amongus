'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, AlertTriangle, Play, Twitter, Clock, Github } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
    const [latestVideo, setLatestVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeSince, setTimeSince] = useState<any>(null);

    useEffect(() => {
        fetch('/api/stats/latest-video')
            .then((res) => res.json())
            .then((data) => {
                setLatestVideo(data.video);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!latestVideo) return;

        const calculateTime = () => {
            const now = new Date().getTime();
            const published = new Date(latestVideo.publishedAt).getTime();
            const diff = now - published;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeSince({ days, hours, minutes, seconds });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [latestVideo]);

    const [totalStars, setTotalStars] = useState(0);

    useEffect(() => {
        fetch('https://api.github.com/repos/meprazhant/sdmn-amongus')
            .then((res) => res.json())
            .then((data) => {
                setTotalStars(data.stargazers_count);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);


    if (loading) return <div className="animate-pulse text-crewmate font-bold tracking-widest text-2xl p-12 text-center">SCANNING COMMS CHANNELS...</div>;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-6xl mx-auto">
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                <a
                    href="https://github.com/meprazhant/sdmn-amongus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white "
                >
                    <Github className="w-6 h-6" />
                    <span className="flex items-center gap-1">
                        ⭐ {totalStars || 0}
                    </span>
                </a>
            </div>

            {/* Countdown Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Mission Status
                </div>

                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                    DAYS SINCE LAST INCIDENT
                </h1>

                {timeSince ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <TimeUnit value={timeSince.days} label="DAYS" />
                        <TimeUnit value={timeSince.hours} label="HOURS" />
                        <TimeUnit value={timeSince.minutes} label="MINUTES" />
                        <TimeUnit value={timeSince.seconds} label="SECONDS" />
                    </div>
                ) : (
                    <div className="text-2xl text-gray-500 font-mono">CALCULATING...</div>
                )}
            </div>

            {/* Action Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Last Sighting Card */}
                <div className="bg-glass rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 z-10">
                        <div className="bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            LAST SIGHTING
                        </div>
                    </div>

                    {latestVideo && (
                        <a href={latestVideo.url} target="_blank" className="block relative aspect-video rounded-xl overflow-hidden mb-4 group-hover:ring-2 ring-white/20 transition-all">
                            <Image
                                src={latestVideo.thumbnail}
                                alt={latestVideo.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-16 h-16 text-white drop-shadow-lg" />
                            </div>
                        </a>
                    )}

                    <div>
                        <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
                            {latestVideo?.channelName}
                        </div>
                        <h2 className="text-2xl font-black text-white leading-tight mb-4">
                            {latestVideo?.title}
                        </h2>
                        <div className="text-gray-400 text-sm font-mono">
                            DETECTED: {new Date(latestVideo?.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                    </div>
                </div>

                {/* Petition Section */}
                <div className="flex flex-col items-center justify-center text-center space-y-8 p-8 bg-gradient-to-br from-red-900/20 to-transparent rounded-3xl border border-red-500/10 h-full relative overflow-hidden">
                    <PetitionSection latestVideoDate={latestVideo?.publishedAt} />
                    {/* Tweet Button moved inside PetitionSection or kept below? */}
                </div>
            </div>
        </div>
    );
}

function PetitionSection({ latestVideoDate }: { latestVideoDate?: string }) {
    const petitionStats = useQuery(api.community.getPetitionStats);
    const increment = useMutation(api.community.incrementPetition);
    // Logic to check archival could be here, but better in a useEffect or separate job.
    // simpler: If latestVideoDate is newer than petition start, we theoretically should have archived.
    // For now, let's just show the current count.

    if (!petitionStats) return <div className="animate-pulse text-gray-500">Connecting to Fleet...</div>;

    return (
        <div className="w-full relative z-10">
            <h2 className="text-3xl font-black italic text-white mb-2">
                THE CREW NEEDS YOU
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                Morale is dropping. The imposters are winning. Mobilize the fleet.
            </p>

            <button
                onClick={() => increment()}
                className="group relative inline-flex items-center justify-center px-8 py-6 font-black text-2xl text-white transition-all duration-200 bg-red-600 rounded-2xl hover:bg-red-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(220,38,38,0.4)] w-full max-w-xs mx-auto"
            >
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors" />
                <span className="relative z-10 flex flex-col items-center">
                    <span>DEMAND MISSION</span>
                    <span className="text-sm font-normal opacity-80 mt-1">
                        {petitionStats.currentCount.toLocaleString()} CREWMATES WAITING
                    </span>
                </span>
            </button>

            {/* History */}
            {petitionStats.history.length > 0 && (
                <div className="mt-8 text-sm text-gray-500 border-t border-white/5 pt-4">
                    <div className="font-bold uppercase tracking-widest mb-2">PREVIOUS MISSIONS</div>
                    {petitionStats.history.slice(0, 1).map((h: any) => (
                        <div key={h._id}>
                            <span className="text-white font-bold">{h.count.toLocaleString()}</span> crewmates demanded the previous mission.
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function TimeUnit({ value, label }: { value: number, label: string }) {
    return (
        <div className="bg-glass border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="text-5xl md:text-7xl font-black text-white font-mono z-10">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-[0.2em] z-10 mt-2">
                {label}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity" />
        </div>
    );
}