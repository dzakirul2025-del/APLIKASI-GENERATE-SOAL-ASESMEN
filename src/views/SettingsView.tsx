import React, { useState } from 'react';
import {
  Settings,
  School,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Terminal,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AppSettings, Question } from '../types';
import { testSupabaseConnection } from '../utils/supabaseClient';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  questions: Question[];
  onRestoreQuestions: (questions: Question[]) => void;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  questions,
  onRestoreQuestions,
  onResetDefaults,
}) => {
  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Test Supabase connection
  const handleTestSupabase = async () => {
    if (!formSettings.supabaseUrl || !formSettings.supabaseAnonKey) {
      setSupabaseStatusMsg({
        success: false,
        message: 'Masukkan URL dan Anon Key Supabase terlebih dahulu.',
      });
      return;
    }
    setTestingSupabase(true);
    setSupabaseStatusMsg(null);
    const result = await testSupabaseConnection(
      formSettings.supabaseUrl,
      formSettings.supabaseAnonKey
    );
    setTestingSupabase(false);
    setSupabaseStatusMsg(result);
    if (result.success) {
      setFormSettings({ ...formSettings, isSupabaseConfigured: true });
    }
  };

  // Save Settings
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Export Full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      settings: formSettings,
      questions,
      exportedAt: new Date().toISOString(),
      institution: 'MIN 1 PASER',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_MIN1Paser_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          onRestoreQuestions(parsed.questions);
        }
        if (parsed.settings) {
          setFormSettings(parsed.settings);
          onSaveSettings(parsed.settings);
        }
        alert('Data backup berhasil dipulihkan!');
      } catch (err) {
        alert('File backup JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const sqlSchemaSnippet = `-- SKEMA DATABASE SUPABASE RESMI - MIN 1 PASER
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  nip TEXT,
  role TEXT DEFAULT 'guru_mi',
  madrasah TEXT DEFAULT 'MIN 1 PASER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
  number INT,
  stem TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options JSONB,
  answer_key TEXT NOT NULL,
  discussion TEXT,
  cognitive_level TEXT,
  difficulty TEXT,
  score NUMERIC DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  rows JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Pengaturan Identitas & Basis Data</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              MIN 1 PASER
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi kop madrasah, tanda tangan pejabat evaluasi, integrasi cloud database
            Supabase, dan manajemen pencadangan data.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Madrasah & Officer Identity (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <form
            onSubmit={handleSave}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs"
          >
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 pb-2 border-b border-slate-100">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Identitas Resmi Madrasah & Kop Surat</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Nama Madrasah / Satuan Pendidikan
              </label>
              <input
                type="text"
                value={formSettings.madrasahName}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, madrasahName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Alamat Lengkap Madrasah
              </label>
              <textarea
                rows={2}
                value={formSettings.madrasahAddress}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, madrasahAddress: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Nama Kepala Madrasah
                </label>
                <input
                  type="text"
                  value={formSettings.headmasterName}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, headmasterName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">NIP Kepala Madrasah</label>
                <input
                  type="text"
                  value={formSettings.headmasterNIP}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, headmasterNIP: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Nama Pengembang Aplikasi & Kord. Kurikulum
                </label>
                <input
                  type="text"
                  value={formSettings.teacherName}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, teacherName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-emerald-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">NIP Pengembang / Kord. Kurikulum</label>
                <input
                  type="text"
                  value={formSettings.teacherNIP}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, teacherNIP: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                value={formSettings.academicYear}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, academicYear: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              />
            </div>
          </form>

          {/* Backup & Restore Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <span className="font-bold text-sm text-slate-800 block">
              Pencadangan & Pemulihan Data
            </span>
            <p className="text-slate-500">
              Unduh salinan cadangan seluruh bank soal, paket asesmen, dan preferensi dalam format
              JSON aman.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Backup JSON</span>
              </button>

              <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300 flex items-center gap-1.5 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Pulihkan dari File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan bank soal ke data awal contoh MIN 1 Paser?')) {
                    onResetDefaults();
                    alert('Data berhasil diatur ulang ke default!');
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold transition"
              >
                Reset ke Default
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Supabase Cloud Database (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Koneksi Supabase Cloud Database</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  formSettings.isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {formSettings.isSupabaseConfigured ? 'Terhubung' : 'Penyimpanan Lokal Aktif'}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Aplikasi ini beroperasi secara lancar secara <strong>Lokal / Offline-first</strong>,
              dan dapat dihubungkan ke akun Supabase Cloud Anda untuk sinkronisasi multi-perangkat.
            </p>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={formSettings.supabaseUrl}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, supabaseUrl: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={formSettings.supabaseAnonKey}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, supabaseAnonKey: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px]"
              />
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={testingSupabase}
                onClick={handleTestSupabase}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {testingSupabase ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Uji Koneksi Supabase</span>
              </button>
            </div>

            {supabaseStatusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  supabaseStatusMsg.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                    : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                }`}
              >
                {supabaseStatusMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{supabaseStatusMsg.message}</span>
              </div>
            )}
          </div>

          {/* SQL Blueprint Helper Accordion */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Skema Tabel Supabase (SQL Script)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(sqlSchemaSnippet);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
              >
                {copiedSql ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedSql ? 'Tersalin' : 'Salin SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/40 rounded-lg text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-48 leading-relaxed">
              {sqlSchemaSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
