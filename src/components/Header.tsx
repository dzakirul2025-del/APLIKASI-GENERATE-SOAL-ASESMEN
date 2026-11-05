import React from 'react';
import {
  Sparkles,
  School,
  Database,
  Menu,
  X,
  FileCheck2,
  User,
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenProfile,
}) => {
  return (
    <header className="no-print bg-emerald-900 border-b border-emerald-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Islamic/Madrasah Emblem Badge */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-emerald-400 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition">
                <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                  <School className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                    GENERATOR SOAL CERDAS
                    <span className="text-amber-400 text-xs px-2 py-0.5 bg-amber-400/20 border border-amber-400/30 rounded-full font-semibold">
                      MIN 1 PASER
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-emerald-200 hidden md:block">
                  Instrumen Evaluasi Pembelajaran Kurikulum Merdeka Terintegrasi AI
                </p>
              </div>
            </div>
          </div>

          {/* Right Status Badges & User info */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Supabase Status Pill */}
            <div
              onClick={() => setActiveTab('pengaturan')}
              title="Klik untuk membuka konfigurasi database"
              className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-800/80 border border-emerald-700 hover:bg-emerald-800 transition"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-100">
                {settings.isSupabaseConfigured ? 'Supabase Cloud' : 'Penyimpanan Lokal'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </div>

            {/* Quick Action: Generate Soal */}
            <button
              onClick={() => setActiveTab('generate-ai')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg text-xs sm:text-sm shadow-sm transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span className="hidden sm:inline">Buat Soal AI</span>
              <span className="sm:hidden">Buat</span>
            </button>

            {/* User Profile Info */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/60 transition group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300 font-bold text-xs border border-emerald-600">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {settings.teacherName}
                </div>
                <div className="text-[10px] text-emerald-300 leading-tight">
                  Kord. Kurikulum • MIN 1 Paser
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
