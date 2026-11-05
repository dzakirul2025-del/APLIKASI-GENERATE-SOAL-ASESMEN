import React from 'react';
import {
  User,
  School,
  Award,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { AppSettings } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  settings,
  onLogout,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Profil Guru & Pengembang</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Avatar & Hero */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-emerald-800 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md border-2 border-white">
            DH
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">{settings.teacherName}</h4>
            <p className="text-xs text-emerald-700 font-bold">Pengembang Aplikasi & Kord. Kurikulum</p>
            <p className="text-[11px] text-slate-400">NIP. {settings.teacherNIP}</p>
          </div>
        </div>

        {/* Institution Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <School className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Satuan Kerja: <strong className="text-slate-900">{settings.madrasahName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Kepala Madrasah: <strong className="text-slate-900">{settings.headmasterName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Email: dzakirul2025@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">Kurikulum: Kurikulum Merdeka Kemenag RI</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition text-center"
          >
            Buka Pengaturan Identitas & Madrasah
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
