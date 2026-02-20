"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Map as MapIcon,
    Trophy,
    Gamepad2,
    ListOrdered,
    MessageSquare,
    DollarSign,
    Menu,
    X,
    Github,
} from "lucide-react";
import { useEffect } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Games", href: "/games", icon: Gamepad2 },
    { name: "Players", href: "/players", icon: Users },
    { name: "Maps", href: "/maps", icon: MapIcon },
    { name: "Statistics", href: "/stats", icon: Trophy },
    { name: "Tier List", href: "/tier", icon: ListOrdered },
    { name: "Comms", href: "/discussions", icon: MessageSquare },
];

export default function Sidebar({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    // lock body scroll when mobile sidebar open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const SidebarContent = () => (
        <>
            {/* Header */}
            <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-imposter rounded-xl flex items-center justify-center glow-imposter">
                        <Gamepad2 className="text-white w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold tracking-tighter">
                        SDMN AMONGUS
                    </span>
                </div>

                {/* Close button (mobile only) */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pt-1 py-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>



            {/* Donation */}
            <div className="p-4 border-t border-white/10 mt-auto">
                <div
                    onClick={() =>
                        window.open(
                            "https://www.paypal.com/qrcodes/p2pqrc/SK8S8N4ZUA8HJ",
                            "_blank"
                        )
                    }
                    className="bg-white/5 hover:bg-blue-300/5 transition-all duration-300 cursor-pointer rounded-2xl p-4 flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-crewmate/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-crewmate" />
                    </div>
                    <div>
                        <div className="text-sm font-medium">Donation</div>
                        <div className="text-xs text-gray-500">
                            Support the server
                        </div>
                    </div>
                </div>
            </div>
            <a href="https://www.reddit.com/r/Sidemen/comments/1flz5hp/moresidemen_among_us_stats_this_took_me_months_to/" target="_blank" rel="noopener noreferrer" className="p-2 pl-5 pb-2 text-blue-600 py-0">
                <span className="text-blue-600">Database Credit</span>
            </a>
        </>
    );

    return (
        <>
            {/* ================= DESKTOP SIDEBAR ================= */}
            <div className="hidden md:flex w-64 bg-glass border-r border-white/10 flex-col h-screen fixed left-0 top-0 z-40">
                <SidebarContent />
            </div>

            {/* ================= MOBILE HAMBURGER ================= */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-[100] p-2 rounded-lg bg-black/40 backdrop-blur"
            >
                {!open && <Menu className="w-6 h-6 text-white" />}
            </button>

            {/* ================= MOBILE DRAWER ================= */}
            <div
                className={`fixed inset-0 z-50 md:hidden ${open ? "visible" : "invisible"}`}
            >
                {/* Overlay */}
                <div
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                />

                {/* Sliding Sidebar */}
                <div
                    className={`absolute left-0 top-0 h-full w-64 bg-glass border-r border-white/10 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent />
                </div>
            </div>
        </>
    );
}