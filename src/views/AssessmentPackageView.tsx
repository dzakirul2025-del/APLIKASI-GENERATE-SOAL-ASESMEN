import React, { useState } from 'react';
import {
  FolderArchive,
  Plus,
  Trash2,
  Shuffle,
  FileDown,
  Printer,
  Clock,
  CheckCircle2,
  FileText,
  Save,
  Columns,
  Columns2,
  HelpCircle,
  Award,
} from 'lucide-react';
import { AssessmentPackage, Question, AppSettings } from '../types';
import MathView from '../components/MathView';
import {
  exportQuestionsToDocx,
  exportAnswerKeyAndDiscussionDocx,
  exportRubrikDocx,
  exportKisiKisiFromQuestionsToDocx,
} from '../utils/exportDocx';
import { MAPEL_OPTIONS } from './GenerateAiView';

interface AssessmentPackageViewProps {
  packages: AssessmentPackage[];
  bankQuestions: Question[];
  onSavePackage: (pkg: AssessmentPackage) => void;
  onDeletePackage: (id: string) => void;
  settings: AppSettings;
}

export const AssessmentPackageView: React.FC<AssessmentPackageViewProps> = ({
  packages,
  bankQuestions,
  onSavePackage,
  onDeletePackage,
  settings,
}) => {
  // Current active package
  const [activePackage, setActivePackage] = useState<AssessmentPackage>(() => {
    if (packages.length > 0) return packages[0];
    return {
      id: `pkg-${Date.now()}`,
      title: 'Sumatif Akhir Semester (SAS) Ganjil',
      mapel: 'Matematika',
      kelas: '4',
      fase: 'B',
      semester: 'Ganjil',
      alokasiWaktu: 90,
      tahunPelajaran: settings.academicYear,
      jenisAsesmen: 'Asesmen Sumatif Akhir Semester',
      petunjukPengerjaan: [
        'Awali dengan membaca basmalah dan berdoa sesuai keyakinan masing-masing.',
        'Tulis nama lengkap dan nomor peserta pada lembar jawaban yang disediakan.',
        'Periksa dan bacalah setiap butir soal dengan teliti sebelum menjawab.',
        'Dahulukan menjawab soal-soal yang Anda anggap lebih mudah.',
        'Periksa kembali pekerjaan Anda sebelum diserahkan kepada pengawas ujian.',
      ],
      questions: bankQuestions.slice(0, 4),
      totalSkor: bankQuestions.slice(0, 4).reduce((acc, q) => acc + (q.skor || 10), 0),
      createdAt: new Date().toISOString(),
    };
  });

  const [columnsLayout, setColumnsLayout] = useState<'1-col' | '2-col'>('1-col');
  const [activeTabSub, setActiveTabSub] = useState<'naskah' | 'lembar_jawaban' | 'kunci_rubrik'>(
    'naskah'
  );
  const [isAddingQuestions, setIsAddingQuestions] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Shuffle Questions
  const handleShuffleQuestions = () => {
    const shuffled = [...activePackage.questions].sort(() => Math.random() - 0.5);
    const renumbered = shuffled.map((q, i) => ({ ...q, nomor: i + 1 }));
    setActivePackage({ ...activePackage, questions: renumbered });
    showToast('Urutan butir soal berhasil diacak!');
  };

  // Shuffle Options within each question
  const handleShuffleOptions = () => {
    const updated = activePackage.questions.map((q) => {
      if (!q.options || q.options.length === 0) return q;
      const stripped = q.options.map((opt) => opt.replace(/^[A-D]\.\s*/, ''));
      const shuffled = [...stripped].sort(() => Math.random() - 0.5);
      const letters = ['A', 'B', 'C', 'D'];
      const newOpts = shuffled.map((text, idx) => `${letters[idx]}. ${text}`);
      return { ...q, options: newOpts };
    });
    setActivePackage({ ...activePackage, questions: updated });
    showToast('Pilihan jawaban berhasil diacak!');
  };

  // Remove question from package
  const handleRemoveQuestion = (id: string) => {
    const updated = activePackage.questions
      .filter((q) => q.id !== id)
      .map((q, i) => ({ ...q, nomor: i + 1 }));
    setActivePackage({
      ...activePackage,
      questions: updated,
      totalSkor: updated.reduce((acc, q) => acc + (q.skor || 10), 0),
    });
  };

  // Add question from bank
  const handleAddQuestionToPackage = (q: Question) => {
    if (activePackage.questions.some((item) => item.id === q.id)) {
      showToast('Soal ini sudah ada di dalam paket.');
      return;
    }
    const updated = [
      ...activePackage.questions,
      { ...q, nomor: activePackage.questions.length + 1 },
    ];
    setActivePackage({
      ...activePackage,
      questions: updated,
      totalSkor: updated.reduce((acc, q) => acc + (q.skor || 10), 0),
    });
    showToast('Soal ditambahkan ke naskah paket!');
  };

  // Save Package
  const handleSave = () => {
    onSavePackage(activePackage);
    showToast('Paket asesmen berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-600" />
            <span>Manajemen Paket Asesmen & Naskah Ujian</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
              Format Standar A4
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rakit butir soal menjadi naskah evaluasi siap cetak, petunjuk pengerjaan, lembar jawaban
            siswa, dan ekspor DOCX resmi MIN 1 Paser.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Paket</span>
          </button>
          
          {/* Naskah Soal Saja */}
          <button
            onClick={() =>
              exportQuestionsToDocx(
                activePackage.title,
                activePackage.mapel,
                activePackage.kelas,
                activePackage.semester,
                activePackage.questions,
                settings,
                false,
                false
              )
            }
            title="Download Naskah Soal Saja (Tanpa Kunci/Pembahasan untuk Siswa)"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 transition shadow-2xs"
          >
            <FileDown className="w-4 h-4 text-emerald-700" />
            <span>Naskah Soal Saja</span>
          </button>

          {/* Kunci & Pembahasan Terpisah */}
          <button
            onClick={() =>
              exportAnswerKeyAndDiscussionDocx(
                `Kunci_${activePackage.title}`,
                activePackage.mapel,
                activePackage.kelas,
                activePackage.semester,
                activePackage.questions,
                settings
              )
            }
            title="Download File Terpisah: Kunci Jawaban & Pembahasan Lengkap"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 transition shadow-2xs"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Kunci & Pembahasan</span>
          </button>

          {/* Rubrik Penilaian Terpisah */}
          <button
            onClick={() =>
              exportRubrikDocx(
                `Rubrik_${activePackage.title}`,
                activePackage.mapel,
                activePackage.kelas,
                activePackage.semester,
                activePackage.questions,
                settings
              )
            }
            title="Download File Terpisah: Pedoman Penskoran & Rubrik Penilaian"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-950 border border-teal-300 flex items-center gap-1.5 transition shadow-2xs"
          >
            <FileDown className="w-4 h-4 text-teal-700" />
            <span>Rubrik Penilaian</span>
          </button>

          {/* Kisi-Kisi Terpisah */}
          <button
            onClick={() =>
              exportKisiKisiFromQuestionsToDocx(
                `Kisi_Kisi_${activePackage.title}`,
                activePackage.mapel,
                activePackage.kelas,
                activePackage.semester,
                activePackage.questions,
                settings
              )
            }
            title="Download File Terpisah: Kisi-Kisi Soal Asesmen"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 flex items-center gap-1.5 transition shadow-2xs"
          >
            <FileDown className="w-4 h-4 text-blue-700" />
            <span>Kisi-Kisi Soal</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Langsung</span>
          </button>
        </div>
      </div>

      {/* Package Configuration & Toolbar (No-Print) */}
      <div className="no-print p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Judul Asesmen</label>
            <input
              type="text"
              value={activePackage.title}
              onChange={(e) => setActivePackage({ ...activePackage, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
            <select
              value={activePackage.mapel}
              onChange={(e) => setActivePackage({ ...activePackage, mapel: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-hidden"
            >
              {MAPEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Kelas & Semester</label>
            <div className="flex gap-1.5">
              <select
                value={activePackage.kelas}
                onChange={(e) => setActivePackage({ ...activePackage, kelas: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <option key={k} value={String(k)}>
                    Kelas {k}
                  </option>
                ))}
              </select>
              <select
                value={activePackage.semester}
                onChange={(e) => setActivePackage({ ...activePackage, semester: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-hidden"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Alokasi Waktu (Menit)
            </label>
            <input
              type="number"
              value={activePackage.alokasiWaktu}
              onChange={(e) =>
                setActivePackage({ ...activePackage, alokasiWaktu: Number(e.target.value) })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-hidden"
            />
          </div>
        </div>

        {/* Quick Toolbar: Randomize, Column layout, Add question */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddingQuestions(!isAddingQuestions)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ambil Soal dari Bank Soal ({bankQuestions.length})</span>
            </button>
            <button
              onClick={handleShuffleQuestions}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 flex items-center gap-1.5 transition"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-500" />
              <span>Acak Nomor Soal</span>
            </button>
            <button
              onClick={handleShuffleOptions}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 flex items-center gap-1.5 transition"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-500" />
              <span>Acak Pilihan (A-B-C-D)</span>
            </button>
          </div>

          {/* View Tabs & Layout toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setColumnsLayout('1-col')}
                className={`p-1 rounded ${columnsLayout === '1-col' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-400'}`}
                title="Satu Kolom"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setColumnsLayout('2-col')}
                className={`p-1 rounded ${columnsLayout === '2-col' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-400'}`}
                title="Dua Kolom (Hemat Kertas Ujian)"
              >
                <Columns2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTabSub('naskah')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  activeTabSub === 'naskah' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'
                }`}
              >
                Naskah Soal
              </button>
              <button
                onClick={() => setActiveTabSub('lembar_jawaban')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  activeTabSub === 'lembar_jawaban'
                    ? 'bg-white shadow-xs text-emerald-800'
                    : 'text-slate-600'
                }`}
              >
                Lembar Jawaban Siswa
              </button>
              <button
                onClick={() => setActiveTabSub('kunci_rubrik')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  activeTabSub === 'kunci_rubrik'
                    ? 'bg-white shadow-xs text-emerald-800'
                    : 'text-slate-600'
                }`}
              >
                Kunci & Rubrik
              </button>
            </div>
          </div>
        </div>

        {/* Picker drawer for Bank Questions */}
        {isAddingQuestions && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Pilih Soal dari Bank Soal untuk Ditambahkan ke Naskah:</span>
              <button
                onClick={() => setIsAddingQuestions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Tutup ✕
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {bankQuestions.map((bq, bIdx) => {
                const inPackage = activePackage.questions.some((q) => q.id === bq.id);
                return (
                  <div
                    key={bq.id || bIdx}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-3 truncate">
                      <span className="font-bold text-slate-800">{bIdx + 1}. </span>
                      <span className="text-slate-700">{bq.pertanyaan}</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        ({bq.mapel} • Kls {bq.kelas})
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={inPackage}
                      onClick={() => handleAddQuestionToPackage(bq)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        inPackage
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {inPackage ? 'Sudah Ada' : '+ Masukkan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Printable Sheet View */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto print-container">
        {/* Kop Surat MIN 1 Paser */}
        <div className="border-b-4 border-double border-emerald-900 pb-3 mb-5 text-center">
          <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-700">
            KEMENTERIAN AGAMA REPUBLIK INDONESIA
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-700">
            KANTOR KEMENTERIAN AGAMA KABUPATEN PASER
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 tracking-wide mt-0.5">
            {settings.madrasahName.toUpperCase()}
          </div>
          <div className="text-xs text-slate-500 italic mt-0.5">{settings.madrasahAddress}</div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            NASKAH SOAL {activePackage.title.toUpperCase()}
          </h3>
          <div className="text-xs text-slate-600 font-semibold mt-0.5">
            TAHUN PELAJARAN {settings.academicYear}
          </div>
        </div>

        {/* Identity & Exam Details Table */}
        <div className="border border-slate-300 rounded-lg p-3 mb-5 text-xs grid grid-cols-2 gap-y-1.5 divide-y sm:divide-y-0">
          <div>
            <span className="font-bold text-slate-600">Mata Pelajaran:</span>{' '}
            <span className="font-semibold text-slate-900">{activePackage.mapel}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Hari / Tanggal:</span>{' '}
            <span className="text-slate-800">
              ............................................
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Kelas / Semester:</span>{' '}
            <span>
              {activePackage.kelas} / {activePackage.semester}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Alokasi Waktu:</span>{' '}
            <span>{activePackage.alokasiWaktu} Menit</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Nama Peserta:</span>{' '}
            <span className="text-slate-400">............................................</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">Nomor Absen / Ujian:</span>{' '}
            <span className="text-slate-400">........................</span>
          </div>
        </div>

        {/* Petunjuk Umum */}
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
          <div className="font-bold text-emerald-900 uppercase">PETUNJUK UMUM:</div>
          <ol className="list-decimal pl-4 space-y-0.5 text-slate-700">
            {activePackage.petunjukPengerjaan.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ol>
        </div>

        {/* Mode 1: Naskah Soal */}
        {activeTabSub === 'naskah' && (
          <div
            className={`space-y-4 ${
              columnsLayout === '2-col' ? 'columns-1 md:columns-2 gap-6' : ''
            }`}
          >
            {activePackage.questions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs italic">
                Belum ada butir soal di paket ini. Klik tombol "Ambil Soal dari Bank Soal" di atas.
              </div>
            ) : (
              activePackage.questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="break-inside-avoid mb-4 pb-3 border-b border-slate-100 last:border-b-0 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-1.5 flex-1">
                      <span className="font-bold text-slate-900">{idx + 1}.</span>
                      <div className="leading-relaxed text-slate-900">
                        {q.stimulus && (
                          <div className="p-2 mb-1.5 rounded bg-slate-50 border-l-2 border-emerald-600 italic text-slate-700">
                            <MathView content={q.stimulus} />
                          </div>
                        )}
                        <MathView content={q.pertanyaan} />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="no-print text-slate-300 hover:text-rose-500 ml-2"
                      title="Hapus dari Naskah"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Question Image if any */}
                  {q.image && q.image.url && (
                    <div className="pl-4 py-1 text-center">
                      <img
                        src={q.image.url}
                        alt="Ilustrasi"
                        className="max-h-36 mx-auto object-contain rounded border border-slate-200"
                      />
                      {q.image.caption && (
                        <p className="text-[10px] text-slate-500 italic mt-1 font-medium">
                          {q.image.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="text-slate-800 leading-normal">
                          <MathView content={opt} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Pairs */}
                  {q.matchingPairs && q.matchingPairs.length > 0 && (
                    <div className="pl-4 py-1 space-y-1">
                      <p className="italic text-[11px] text-slate-600">Pasangkan pernyataan berikut:</p>
                      {q.matchingPairs.map((pair, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-3 text-[11px]">
                          <span>{pIdx + 1}. {pair.left}</span>
                          <span className="text-slate-400">------------------</span>
                          <span>[  ] {pair.right}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Mode 2: Lembar Jawaban Siswa (LJK format) */}
        {activeTabSub === 'lembar_jawaban' && (
          <div className="space-y-6 text-xs">
            <div className="text-center font-bold text-sm text-slate-800 uppercase border-b pb-2">
              LEMBAR JAWABAN SISWA (LJK EVALUASI)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activePackage.questions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-700">Nomor {idx + 1} ({q.jenis}):</div>
                  {q.options && q.options.length > 0 ? (
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((letter) => (
                        <div
                          key={letter}
                          className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center font-bold text-[11px] text-slate-700 bg-white"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-10 border-b border-dashed border-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode 3: Kunci Jawaban & Rubrik Penilaian */}
        {activeTabSub === 'kunci_rubrik' && (
          <div className="space-y-4 text-xs">
            <div className="text-center font-bold text-sm text-emerald-900 uppercase border-b border-emerald-900 pb-2">
              KUNCI JAWABAN & PEDOMAN PENSKORAN
            </div>

            <div className="space-y-3">
              {activePackage.questions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Soal No. {idx + 1} ({q.jenis})
                    </span>
                    <span className="font-extrabold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100">
                      Kunci: {q.kunciJawaban}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    <span className="font-semibold text-slate-700">Pembahasan: </span>
                    <MathView content={q.pembahasan || 'Sesuai dengan konsep kompetensi dasar.'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Signature on printed copy */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-xs text-slate-800 border-t border-slate-200">
          <div>
            <div>Mengetahui,</div>
            <div className="font-semibold">Kepala {settings.madrasahName}</div>
            <div className="h-14" />
            <div className="font-bold underline">{settings.headmasterName}</div>
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
            <div className="h-14" />
            <div className="font-bold underline">{settings.teacherName}</div>
            <div>NIP. {settings.teacherNIP}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
