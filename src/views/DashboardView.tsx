import React from 'react';
import {
  Sparkles,
  Layers,
  FolderArchive,
  TableProperties,
  CreditCard,
  Image as ImageIcon,
  Sigma,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { Question, KisiKisi, AssessmentPackage, GenerationHistory, AppSettings } from '../types';

interface DashboardViewProps {
  questions: Question[];
  blueprints: KisiKisi[];
  packages: AssessmentPackage[];
  history: GenerationHistory[];
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
  onSelectQuestion: (question: Question) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  questions,
  blueprints,
  packages,
  history,
  settings,
  setActiveTab,
  onSelectQuestion,
}) => {
  // Compute Mapel counts
  const mapelDistribution = questions.reduce((acc, q) => {
    const key = q.mapel || 'Lainnya';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMapels = Object.entries(mapelDistribution).sort((a, b) => b[1] - a[1]);

  // Compute Difficulty stats
  const difficultyStats = {
    Mudah: questions.filter((q) => q.tingkatKesulitan === 'Mudah').length,
    Sedang: questions.filter((q) => q.tingkatKesulitan === 'Sedang').length,
    Sulit: questions.filter((q) => q.tingkatKesulitan === 'Sulit').length,
  };

  const statCards = [
    {
      label: 'Total Soal Dibuat',
      value: questions.length,
      icon: Sparkles,
      color: 'from-emerald-600 to-emerald-700',
      textColor: 'text-emerald-100',
      action: () => setActiveTab('bank-soal'),
    },
    {
      label: 'Bank Soal Digital',
      value: questions.length,
      icon: Layers,
      color: 'from-teal-600 to-teal-700',
      textColor: 'text-teal-100',
      action: () => setActiveTab('bank-soal'),
    },
    {
      label: 'Paket Asesmen',
      value: packages.length,
      icon: FolderArchive,
      color: 'from-amber-600 to-amber-700',
      textColor: 'text-amber-100',
      action: () => setActiveTab('paket-asesmen'),
    },
    {
      label: 'Kisi-Kisi Soal',
      value: blueprints.length,
      icon: TableProperties,
      color: 'from-blue-600 to-blue-700',
      textColor: 'text-blue-100',
      action: () => setActiveTab('kisi-kisi'),
    },
    {
      label: 'Kartu Soal Aktif',
      value: questions.length,
      icon: CreditCard,
      color: 'from-indigo-600 to-indigo-700',
      textColor: 'text-indigo-100',
      action: () => setActiveTab('kartu-soal'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/60">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Sistem Evaluasi Pembelajaran Kurikulum Merdeka</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Generator Soal Cerdas – MIN 1 Paser
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
            Solusi cerdas bagi guru madrasah dalam menyusun butir soal HOTS, instrumen evaluasi
            berbasis gambar visual, dan persamaan matematika KaTeX dengan standar penulisan resmi Kemenag RI.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('generate-ai')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Generate Soal AI Sekarang</span>
            </button>
            <button
              onClick={() => setActiveTab('generate-gambar')}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700/90 text-white font-semibold rounded-xl text-sm border border-emerald-600/70 shadow-sm transition flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-amber-300" />
              <span>Soal Berbasis Gambar</span>
            </button>
            <button
              onClick={() => setActiveTab('equation-editor')}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700/90 text-white font-semibold rounded-xl text-sm border border-emerald-600/70 shadow-sm transition flex items-center gap-2"
            >
              <Sigma className="w-4 h-4 text-emerald-300" />
              <span>Equation Editor</span>
            </button>
          </div>
        </div>

        {/* Decorative background Islamic geometry / circles */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-4 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={stat.action}
              className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition bg-gradient-to-b from-white to-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-700 transition">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Buka kelola</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Activity Breakdown & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mapel & Cognitive Distribution (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mapel breakdown */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Distribusi Soal Berdasarkan Mata Pelajaran</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cakupan kurikulum MI pada bank soal saat ini
                </p>
              </div>
              <button
                onClick={() => setActiveTab('bank-soal')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {sortedMapels.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Belum ada soal pada database. Mulai buat sekarang!
                </div>
              ) : (
                sortedMapels.slice(0, 6).map(([mapel, count]) => {
                  const percentage = Math.round((count / questions.length) * 100) || 0;
                  return (
                    <div key={mapel} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{mapel}</span>
                        <span className="text-slate-500">
                          {count} soal ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Difficulty Pill summary */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800">Tingkat Mudah</div>
                <div className="text-base font-bold text-emerald-900">{difficultyStats.Mudah}</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-[11px] font-semibold text-amber-800">Tingkat Sedang</div>
                <div className="text-base font-bold text-amber-900">{difficultyStats.Sedang}</div>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-[11px] font-semibold text-rose-800">Tingkat Sulit (HOTS)</div>
                <div className="text-base font-bold text-rose-900">{difficultyStats.Sulit}</div>
              </div>
            </div>
          </div>

          {/* Activity Chart simulation */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Aktivitas Pembuatan Soal Mingguan</span>
              </h3>
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                Aktif
              </span>
            </div>

            <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
              {[
                { day: 'Sen', val: 8, height: '40%' },
                { day: 'Sel', val: 14, height: '70%' },
                { day: 'Rab', val: 12, height: '60%' },
                { day: 'Kam', val: 18, height: '90%' },
                { day: 'Jum', val: 10, height: '50%' },
                { day: 'Sab', val: 20, height: '100%' },
                { day: 'Ahad', val: 6, height: '30%' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 font-medium group-hover:text-emerald-700 transition">
                    {item.val}
                  </div>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[36px] rounded-t-lg bg-emerald-200 group-hover:bg-gradient-to-t group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all duration-300"
                  />
                  <div className="text-[11px] font-semibold text-slate-600">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Generation History & Quick Cards */}
        <div className="space-y-6">
          {/* Recent History Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Aktivitas Generate Terbaru</span>
              </h3>
              <button
                onClick={() => setActiveTab('riwayat')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Riwayat
              </button>
            </div>

            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  Belum ada catatan riwayat generate.
                </div>
              ) : (
                history.slice(0, 4).map((hist) => (
                  <div
                    key={hist.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/70 hover:border-emerald-200 transition text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{hist.mapel} (Kelas {hist.kelas})</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        {hist.jumlahSoal} soal
                      </span>
                    </div>
                    <div className="text-slate-600 truncate">{hist.materi || 'Materi Umum'}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(hist.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-md space-y-3 border border-emerald-900">
            <div className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Akses Cepat Fitur Unggulan</span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('kisi-kisi')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center justify-between border border-white/10"
              >
                <span>5. Generator Kisi-Kisi Penulisan Soal</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
              <button
                onClick={() => setActiveTab('kartu-soal')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center justify-between border border-white/10"
              >
                <span>6. Format Resmi Kartu Soal MIN 1 Paser</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
              <button
                onClick={() => setActiveTab('analisis-soal')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center justify-between border border-white/10"
              >
                <span>9. Audit Mutu & Distraktor Soal AI</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
