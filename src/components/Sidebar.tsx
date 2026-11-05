import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Sigma,
  TableProperties,
  CreditCard,
  Layers,
  FolderArchive,
  SearchCheck,
  History,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      subtitle: 'Ringkasan & Aktivitas',
      icon: LayoutDashboard,
      badge: '',
    },
    {
      id: 'generate-ai',
      label: '2. Generate Soal AI',
      subtitle: 'Kurikulum Merdeka MI',
      icon: Sparkles,
      badge: 'Cerdas',
      badgeColor: 'bg-amber-400 text-emerald-950 font-bold',
    },
    {
      id: 'generate-gambar',
      label: '3. Soal Berbasis Gambar',
      subtitle: 'Analisis Visual Gemini',
      icon: ImageIcon,
      badge: 'Visual',
      badgeColor: 'bg-emerald-700 text-white',
    },
    {
      id: 'equation-editor',
      label: '4. Equation Editor',
      subtitle: 'KaTeX & Formula MI',
      icon: Sigma,
      badge: 'LaTeX',
      badgeColor: 'bg-cyan-700 text-white',
    },
    {
      id: 'kisi-kisi',
      label: '5. Generator Kisi-Kisi',
      subtitle: 'Matriks Capaian & TP',
      icon: TableProperties,
      badge: '',
    },
    {
      id: 'kartu-soal',
      label: '6. Generator Kartu Soal',
      subtitle: 'Format Resmi Madrasah',
      icon: CreditCard,
      badge: '',
    },
    {
      id: 'bank-soal',
      label: '7. Bank Soal',
      subtitle: 'Koleksi Soal Tersimpan',
      icon: Layers,
      badge: '',
    },
    {
      id: 'paket-asesmen',
      label: '8. Paket Asesmen',
      subtitle: 'Naskah Ujian & Evaluasi',
      icon: FolderArchive,
      badge: '',
    },
    {
      id: 'analisis-soal',
      label: '9. Analisis Soal',
      subtitle: 'Uji Mutu & Distraktor',
      icon: SearchCheck,
      badge: 'Audit',
      badgeColor: 'bg-purple-700 text-white',
    },
    {
      id: 'riwayat',
      label: '10. Riwayat Generate',
      subtitle: 'Log Sesi Pembuatan',
      icon: History,
      badge: '',
    },
    {
      id: 'pengaturan',
      label: '11. Pengaturan',
      subtitle: 'Madrasah & Supabase',
      icon: SettingsIcon,
      badge: '',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`no-print fixed lg:static top-16 bottom-0 left-0 z-30 w-72 bg-emerald-950 text-white flex flex-col justify-between border-r border-emerald-900 shadow-xl lg:shadow-none transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation links scrollable area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">
            Menu Utama Aplikasi
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md font-semibold border-l-4 border-amber-400'
                    : 'text-emerald-100/90 hover:bg-emerald-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                      isActive
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'bg-emerald-900/90 text-emerald-300 group-hover:bg-emerald-800 group-hover:text-amber-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-medium leading-tight truncate">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-emerald-400/70 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                        item.badgeColor || 'bg-emerald-800 text-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-amber-400 translate-x-0.5' : 'text-emerald-600 opacity-40 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer with Developer signature & Logout */}
        <div className="p-3 border-t border-emerald-900/80 bg-emerald-950/90 space-y-2">
          {/* Developer Identity Card */}
          <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>MIN 1 PASER</span>
            </div>
            <div className="text-[11px] text-emerald-200">
              Pengembang & Kord. Kurikulum: <br />
              <span className="text-white font-bold text-xs">Dzakirul Husni, S.Pd</span>
            </div>
            <div className="text-[10px] text-emerald-400/80 italic mt-1">
              Kepala Madrasah: <span className="text-emerald-100 font-medium">Ismail, S.Ag</span>
            </div>
          </div>

          {/* Logout button (item 12) */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>12. Logout / Profil Guru</span>
          </button>
        </div>
      </aside>
    </>
  );
};
