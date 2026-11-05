import React, { useState } from 'react';
import {
  TableProperties,
  Sparkles,
  Save,
  FileDown,
  Printer,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import { KisiKisi, KisiKisiRow, AppSettings } from '../types';
import { MAPEL_OPTIONS } from './GenerateAiView';
import { exportKisiKisiToDocx } from '../utils/exportDocx';
import { exportKisiKisiToExcel } from '../utils/exportExcel';

interface KisiKisiViewProps {
  blueprints: KisiKisi[];
  onSaveBlueprint: (blueprint: KisiKisi) => void;
  onDeleteBlueprint: (id: string) => void;
  settings: AppSettings;
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({
  blueprints,
  onSaveBlueprint,
  onDeleteBlueprint,
  settings,
}) => {
  // Active Blueprint state
  const [activeBlueprint, setActiveBlueprint] = useState<KisiKisi>(() => {
    if (blueprints.length > 0) return blueprints[0];
    return {
      id: `bp-${Date.now()}`,
      title: 'Kisi-Kisi Asesmen Sumatif Akhir Semester (SAS)',
      mapel: 'Bahasa Indonesia',
      kelas: '4',
      fase: 'B',
      semester: 'Ganjil',
      jenisAsesmen: 'Asesmen Sumatif Akhir Semester (SAS)',
      tahunPelajaran: settings.academicYear,
      createdAt: new Date().toISOString(),
      rows: [
        {
          nomor: 1,
          capaianPembelajaran:
            'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan.',
          tujuanPembelajaran: 'Menemukan informasi penting dari teks narasi fiksi sederhana.',
          materi: 'Ide Pokok Teks Narasi',
          indikatorSoal: 'Disajikan kutipan cerita fabel, peserta didik dapat menentukan ide pokok paragraf pertama.',
          levelKognitif: 'C2 Memahami',
          bentukSoal: 'Pilihan Ganda',
          nomorSoal: 1,
          tingkatKesulitan: 'Sedang',
          skor: 1,
        },
        {
          nomor: 2,
          capaianPembelajaran:
            'Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari.',
          tujuanPembelajaran: 'Mengidentifikasi unsur intrinsik (tokoh dan amanat) dalam cerita rakyat.',
          materi: 'Unsur Intrinsik Cerita',
          indikatorSoal: 'Disajikan cuplikan cerita, peserta didik dapat menganalisis amanat tersirat dengan tepat.',
          levelKognitif: 'C4 Menganalisis',
          bentukSoal: 'Pilihan Ganda',
          nomorSoal: 2,
          tingkatKesulitan: 'Sulit',
          skor: 1,
        },
        {
          nomor: 3,
          capaianPembelajaran:
            'Peserta didik mampu menulis teks narasi dan deskripsi dengan kaidah bahasa yang tepat.',
          tujuanPembelajaran: 'Menerapkan penggunaan tanda baca titik dan koma pada kalimat majemuk setara.',
          materi: 'Kaidah Ejaan & Tanda Baca',
          indikatorSoal: 'Disajikan kalimat tidak lengkap, peserta didik dapat melengkapi dengan tanda baca yang benar.',
          levelKognitif: 'C3 Mengaplikasikan',
          bentukSoal: 'Isian Singkat',
          nomorSoal: 3,
          tingkatKesulitan: 'Sedang',
          skor: 2,
        },
      ],
    };
  });

  // AI Auto-Generator parameters
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [aiMateriPokok, setAiMateriPokok] = useState('Ide Pokok, Unsur Cerita, dan Menulis Surat');
  const [aiJumlahSoal, setAiJumlahSoal] = useState(5);

  // Auto-generate Kisi-Kisi with AI
  const handleGenerateAi = async () => {
    setLoadingAi(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/ai/generate-kisi-kisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapel: activeBlueprint.mapel,
          kelas: activeBlueprint.kelas,
          fase: activeBlueprint.fase,
          semester: activeBlueprint.semester,
          materiPokok: aiMateriPokok,
          jumlahSoal: aiJumlahSoal,
          jenisAsesmen: activeBlueprint.jenisAsesmen,
        }),
      });

      const rawText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn('Kisi-kisi non-JSON response:', rawText.slice(0, 150));
        throw new Error('Layanan penyusun kisi-kisi sedang padat. Silakan klik buat kisi-kisi kembali.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat kisi-kisi.');
      }

      const rows: KisiKisiRow[] = data.blueprint.map((r: any, idx: number) => ({
        ...r,
        nomor: idx + 1,
        nomorSoal: idx + 1,
      }));

      setActiveBlueprint({
        ...activeBlueprint,
        rows,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyusun kisi-kisi.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Add Row manually
  const handleAddRow = () => {
    const nextNo = activeBlueprint.rows.length + 1;
    const newRow: KisiKisiRow = {
      nomor: nextNo,
      capaianPembelajaran: 'Peserta didik mampu...',
      tujuanPembelajaran: 'Menjelaskan...',
      materi: 'Materi Baru',
      indikatorSoal: 'Disajikan..., peserta didik dapat...',
      levelKognitif: 'C3 Mengaplikasikan',
      bentukSoal: 'Pilihan Ganda',
      nomorSoal: nextNo,
      tingkatKesulitan: 'Sedang',
      skor: 1,
    };
    setActiveBlueprint({
      ...activeBlueprint,
      rows: [...activeBlueprint.rows, newRow],
    });
  };

  // Delete Row
  const handleDeleteRow = (index: number) => {
    const updatedRows = activeBlueprint.rows
      .filter((_, i) => i !== index)
      .map((r, i) => ({ ...r, nomor: i + 1, nomorSoal: i + 1 }));
    setActiveBlueprint({
      ...activeBlueprint,
      rows: updatedRows,
    });
  };

  // Update specific row cell
  const handleRowChange = (index: number, field: keyof KisiKisiRow, value: any) => {
    const updatedRows = [...activeBlueprint.rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setActiveBlueprint({ ...activeBlueprint, rows: updatedRows });
  };

  // Save blueprint
  const handleSave = () => {
    onSaveBlueprint(activeBlueprint);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-emerald-600" />
            <span>Generator Kisi-Kisi Penulisan Soal</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
              Format Kemenag RI
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Matriks pemetaan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), indikator soal,
            level kognitif, dan bentuk soal resmi MIN 1 Paser.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{savedNotice ? 'Tersimpan!' : 'Simpan Kisi-Kisi'}</span>
          </button>
          <button
            onClick={() => exportKisiKisiToDocx(activeBlueprint, settings)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
          >
            <FileDown className="w-4 h-4 text-emerald-700" />
            <span>DOCX</span>
          </button>
          <button
            onClick={() => exportKisiKisiToExcel(activeBlueprint)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* AI Generator Panel */}
      <div className="no-print p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-md space-y-4 border border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-sm text-amber-300">
              Buat Kisi-Kisi Otomatis dengan AI
            </span>
          </div>
          <span className="text-xs text-emerald-300">Berbasis Kurikulum Merdeka</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-emerald-200 mb-1">Mata Pelajaran</label>
            <select
              value={activeBlueprint.mapel}
              onChange={(e) => setActiveBlueprint({ ...activeBlueprint, mapel: e.target.value })}
              className="w-full bg-emerald-900 border border-emerald-700 text-white rounded-lg p-2 outline-hidden"
            >
              {MAPEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-emerald-200 mb-1">Kelas & Semester</label>
            <div className="flex gap-1.5">
              <select
                value={activeBlueprint.kelas}
                onChange={(e) => setActiveBlueprint({ ...activeBlueprint, kelas: e.target.value })}
                className="w-1/2 bg-emerald-900 border border-emerald-700 text-white rounded-lg p-2 outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <option key={k} value={k}>
                    Kls {k}
                  </option>
                ))}
              </select>
              <select
                value={activeBlueprint.semester}
                onChange={(e) =>
                  setActiveBlueprint({ ...activeBlueprint, semester: e.target.value })
                }
                className="w-1/2 bg-emerald-900 border border-emerald-700 text-white rounded-lg p-2 outline-hidden"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-emerald-200 mb-1">Materi Pokok Pembelajaran</label>
            <input
              type="text"
              value={aiMateriPokok}
              onChange={(e) => setAiMateriPokok(e.target.value)}
              placeholder="Contoh: Operasi Hitung dan Bangun Datar"
              className="w-full bg-emerald-900 border border-emerald-700 text-white rounded-lg p-2 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-emerald-200 mb-1">Jumlah Butir ({aiJumlahSoal} Soal)</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min="3"
                max="15"
                value={aiJumlahSoal}
                onChange={(e) => setAiJumlahSoal(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={loadingAi}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-900 font-bold rounded-lg shrink-0 shadow-xs flex items-center gap-1.5"
              >
                {loadingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                )}
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-lg bg-rose-900/60 border border-rose-700 text-rose-200 text-xs">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Official Kop Surat & Table Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs print-container">
        {/* Kop Surat MIN 1 Paser */}
        <div className="border-b-4 border-double border-emerald-800 pb-4 mb-6 text-center">
          <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-700">
            KEMENTERIAN AGAMA REPUBLIK INDONESIA
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-700">
            KANTOR KEMENTERIAN AGAMA KABUPATEN PASER
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-900 tracking-wide mt-0.5">
            {settings.madrasahName.toUpperCase()}
          </div>
          <div className="text-[11px] text-slate-500 italic mt-0.5">{settings.madrasahAddress}</div>
        </div>

        {/* Title of Blueprint */}
        <div className="text-center mb-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
            KISI-KISI PENULISAN SOAL ASESMEN PEMBELAJARAN
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Tahun Pelajaran {settings.academicYear} • Mata Pelajaran: {activeBlueprint.mapel} •
            Kelas {activeBlueprint.kelas} / Semester {activeBlueprint.semester}
          </p>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold text-center">
                <th className="border border-slate-300 p-2 w-10">No</th>
                <th className="border border-slate-300 p-2 min-w-[160px]">Capaian Pembelajaran (CP)</th>
                <th className="border border-slate-300 p-2 min-w-[150px]">Tujuan Pembelajaran (TP)</th>
                <th className="border border-slate-300 p-2 min-w-[120px]">Materi Pokok</th>
                <th className="border border-slate-300 p-2 min-w-[180px]">Indikator Soal</th>
                <th className="border border-slate-300 p-2 w-20">Level</th>
                <th className="border border-slate-300 p-2 w-24">Bentuk</th>
                <th className="border border-slate-300 p-2 w-14">No Soal</th>
                <th className="border border-slate-300 p-2 w-20">Kesulitan</th>
                <th className="border border-slate-300 p-2 w-12 no-print">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activeBlueprint.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="border border-slate-300 p-2 text-center font-bold">{row.nomor}</td>
                  <td className="border border-slate-300 p-2">
                    <textarea
                      rows={2}
                      value={row.capaianPembelajaran}
                      onChange={(e) => handleRowChange(idx, 'capaianPembelajaran', e.target.value)}
                      className="w-full text-xs border-none bg-transparent outline-hidden resize-none"
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <textarea
                      rows={2}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => handleRowChange(idx, 'tujuanPembelajaran', e.target.value)}
                      className="w-full text-xs border-none bg-transparent outline-hidden resize-none"
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      value={row.materi}
                      onChange={(e) => handleRowChange(idx, 'materi', e.target.value)}
                      className="w-full text-xs border-none bg-transparent outline-hidden"
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <textarea
                      rows={2}
                      value={row.indikatorSoal}
                      onChange={(e) => handleRowChange(idx, 'indikatorSoal', e.target.value)}
                      className="w-full text-xs border-none bg-transparent outline-hidden resize-none"
                    />
                  </td>
                  <td className="border border-slate-300 p-1 text-center">
                    <select
                      value={row.levelKognitif}
                      onChange={(e) => handleRowChange(idx, 'levelKognitif', e.target.value)}
                      className="text-[11px] bg-transparent outline-hidden font-medium"
                    >
                      <option value="C1 Mengingat">C1</option>
                      <option value="C2 Memahami">C2</option>
                      <option value="C3 Mengaplikasikan">C3</option>
                      <option value="C4 Menganalisis">C4</option>
                      <option value="C5 Mengevaluasi">C5</option>
                      <option value="C6 Mencipta">C6</option>
                    </select>
                  </td>
                  <td className="border border-slate-300 p-1 text-center">
                    <select
                      value={row.bentukSoal}
                      onChange={(e) => handleRowChange(idx, 'bentukSoal', e.target.value)}
                      className="text-[11px] bg-transparent outline-hidden font-medium"
                    >
                      <option value="Pilihan Ganda">Pilihan Ganda</option>
                      <option value="Isian Singkat">Isian Singkat</option>
                      <option value="Uraian">Uraian</option>
                      <option value="Menjodohkan">Menjodohkan</option>
                    </select>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold">
                    {row.nomorSoal}
                  </td>
                  <td className="border border-slate-300 p-1 text-center">
                    <select
                      value={row.tingkatKesulitan}
                      onChange={(e) => handleRowChange(idx, 'tingkatKesulitan', e.target.value)}
                      className="text-[11px] bg-transparent outline-hidden"
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Sulit">Sulit</option>
                    </select>
                  </td>
                  <td className="border border-slate-300 p-2 text-center no-print">
                    <button
                      onClick={() => handleDeleteRow(idx)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="no-print mt-4 flex justify-between items-center">
          <button
            onClick={handleAddRow}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baris Kisi-Kisi</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Total Butir Soal Terpetakan: {activeBlueprint.rows.length} Soal
          </span>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-xs text-slate-800">
          <div>
            <div>Mengetahui,</div>
            <div className="font-semibold">Kepala {settings.madrasahName}</div>
            <div className="h-16" />
            <div className="font-bold underline text-sm">{settings.headmasterName}</div>
            <div>NIP. {settings.headmasterNIP}</div>
          </div>
          <div className="text-right">
            <div>
              Tanah Grogot,{' '}
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="font-semibold">Guru Pengampu / Kord. Kurikulum</div>
            <div className="h-16" />
            <div className="font-bold underline text-sm">{settings.teacherName}</div>
            <div>NIP. {settings.teacherNIP}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
