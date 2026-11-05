import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Edit3,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  SearchCheck,
  FolderPlus,
  AlertCircle,
  FileDown,
} from 'lucide-react';
import { Question, JenisSoal, AppSettings } from '../types';
import MathView from '../components/MathView';
import { exportBankSoalToExcel } from '../utils/exportExcel';
import { MAPEL_OPTIONS, JENIS_SOAL_OPTIONS } from './GenerateAiView';

interface BankSoalViewProps {
  questions: Question[];
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onAddQuestions: (questions: Question[]) => void;
  onAnalyzeQuestion: (question: Question) => void;
  onAddToPackage: (question: Question) => void;
  settings: AppSettings;
}

export const BankSoalView: React.FC<BankSoalViewProps> = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestions,
  onAnalyzeQuestion,
  onAddToPackage,
  settings,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [selectedJenis, setSelectedJenis] = useState('Semua');
  const [selectedLevel, setSelectedLevel] = useState('Semua');

  // Modals
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New question form state
  const [newQ, setNewQ] = useState<Partial<Question>>({
    pertanyaan: '',
    jenis: 'Pilihan Ganda',
    options: ['A. ', 'B. ', 'C. ', 'D. '],
    kunciJawaban: 'A',
    pembahasan: '',
    mapel: 'Matematika',
    kelas: '4',
    fase: 'B',
    semester: 'Ganjil',
    levelKognitif: 'C3 Mengaplikasikan',
    tingkatKesulitan: 'Sedang',
    tujuanPembelajaran: '',
    indikatorSoal: '',
    skor: 10,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        !searchTerm ||
        q.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tujuanPembelajaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.materi?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMapel = selectedMapel === 'Semua' || q.mapel === selectedMapel;
      const matchKelas = selectedKelas === 'Semua' || q.kelas === selectedKelas;
      const matchJenis = selectedJenis === 'Semua' || q.jenis === selectedJenis;
      const matchLevel =
        selectedLevel === 'Semua' || q.levelKognitif?.includes(selectedLevel);

      return matchSearch && matchMapel && matchKelas && matchJenis && matchLevel;
    });
  }, [questions, searchTerm, selectedMapel, selectedKelas, selectedJenis, selectedLevel]);

  // Duplicate question
  const handleDuplicate = (q: Question) => {
    const duplicated: Question = {
      ...q,
      id: `dup-${Date.now()}`,
      nomor: questions.length + 1,
      pertanyaan: `${q.pertanyaan} (Duplikat)`,
      createdAt: new Date().toISOString(),
    };
    onAddQuestions([duplicated]);
    showToast('Soal berhasil digandakan!');
  };

  // Create manual question
  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.pertanyaan) return;

    const fullQuestion: Question = {
      id: `manual-${Date.now()}`,
      nomor: questions.length + 1,
      pertanyaan: newQ.pertanyaan,
      jenis: (newQ.jenis as JenisSoal) || 'Pilihan Ganda',
      options: newQ.options || [],
      kunciJawaban: newQ.kunciJawaban || 'A',
      pembahasan: newQ.pembahasan || '',
      mapel: newQ.mapel || 'Matematika',
      kelas: newQ.kelas || '4',
      fase: newQ.fase || 'B',
      semester: newQ.semester || 'Ganjil',
      levelKognitif: newQ.levelKognitif || 'C3 Mengaplikasikan',
      tingkatKesulitan: newQ.tingkatKesulitan || 'Sedang',
      tujuanPembelajaran: newQ.tujuanPembelajaran || newQ.pertanyaan.slice(0, 50),
      indikatorSoal: newQ.indikatorSoal || 'Disajikan soal...',
      skor: newQ.skor || 10,
      createdAt: new Date().toISOString(),
    };

    onAddQuestions([fullQuestion]);
    setIsCreatingNew(false);
    showToast('Soal baru berhasil ditambahkan ke Bank Soal!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Bank Soal Digital Madrasah</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              {questions.length} Butir Soal Tersimpan
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Repositori butir soal terstruktur, pencarian instan, filter level kognitif, ekspor Excel,
            dan perakitan paket asesmen.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal Manual</span>
          </button>
          <button
            onClick={() => exportBankSoalToExcel(filteredQuestions, `Bank_Soal_${selectedMapel}`)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari teks soal, materi, rumus, atau tujuan pembelajaran..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Quick Clear */}
          {(searchTerm ||
            selectedMapel !== 'Semua' ||
            selectedKelas !== 'Semua' ||
            selectedJenis !== 'Semua' ||
            selectedLevel !== 'Semua') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMapel('Semua');
                setSelectedKelas('Semua');
                setSelectedJenis('Semua');
                setSelectedLevel('Semua');
              }}
              className="text-xs text-rose-600 hover:underline shrink-0"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Mata Pelajaran:
            </label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium outline-hidden"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              {MAPEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">Kelas:</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium outline-hidden"
            >
              <option value="Semua">Semua Kelas</option>
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={String(k)}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Bentuk Soal:
            </label>
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium outline-hidden"
            >
              <option value="Semua">Semua Bentuk Soal</option>
              {JENIS_SOAL_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Level Kognitif:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium outline-hidden"
            >
              <option value="Semua">Semua Level (C1-C6)</option>
              <option value="C1">C1 Mengingat</option>
              <option value="C2">C2 Memahami</option>
              <option value="C3">C3 Mengaplikasikan</option>
              <option value="C4">C4 Menganalisis</option>
              <option value="C5">C5 Mengevaluasi</option>
              <option value="C6">C6 Mencipta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Menampilkan {filteredQuestions.length} butir soal</span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Soal yang Cocok</h4>
            <p className="text-xs text-slate-400 mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah filter di atas.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-xs space-y-3 transition group"
            >
              {/* Meta row */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="w-6 h-6 rounded-md bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{q.mapel}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">Kelas {q.kelas}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {q.jenis}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                    {q.levelKognitif}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium text-[11px] border border-amber-200">
                    {q.tingkatKesulitan}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onAddToPackage(q);
                      showToast('Soal ditambahkan ke Paket Asesmen!');
                    }}
                    title="Tambahkan ke Paket Asesmen"
                    className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAnalyzeQuestion(q)}
                    title="Audit Mutu & Pengecoh dengan AI"
                    className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                  >
                    <SearchCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(q)}
                    title="Duplikat Soal"
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingQuestion(q)}
                    title="Edit Soal"
                    className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus butir soal ini dari Bank Soal?')) {
                        onDeleteQuestion(q.id);
                        showToast('Soal telah dihapus.');
                      }
                    }}
                    title="Hapus Soal"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Image if present */}
              {q.image && q.image.url && (
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 inline-block max-w-sm">
                  <img
                    src={q.image.url}
                    alt="Lampiran Soal"
                    className="max-h-40 rounded object-contain"
                  />
                  {q.image.caption && (
                    <p className="text-[10px] text-slate-500 italic mt-1">{q.image.caption}</p>
                  )}
                </div>
              )}

              {/* Stimulus */}
              {q.stimulus && (
                <div className="p-2.5 rounded-xl bg-slate-50 border-l-3 border-emerald-600 text-xs text-slate-700 italic">
                  <MathView content={q.stimulus} />
                </div>
              )}

              {/* Pertanyaan */}
              <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                <MathView content={q.pertanyaan} />
              </div>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-xl text-xs border ${
                        opt.includes(q.kunciJawaban)
                          ? 'bg-emerald-50/70 border-emerald-300 font-medium text-emerald-950'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <MathView content={opt} />
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Key & Indicator */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                <div className="space-x-2">
                  <span className="font-bold text-emerald-800">
                    Kunci: {q.kunciJawaban}
                  </span>
                  <span>•</span>
                  <span>Skor: {q.skor || 10}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-md">
                  TP: {q.tujuanPembelajaran}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                Edit Soal: {editingQuestion.mapel} (Kelas {editingQuestion.kelas})
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Teks Pertanyaan (Gunakan $...$ untuk KaTeX)
              </label>
              <textarea
                rows={3}
                value={editingQuestion.pertanyaan}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, pertanyaan: e.target.value })
                }
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {editingQuestion.options && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Pilihan Jawaban</label>
                {editingQuestion.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...(editingQuestion.options || [])];
                      newOpts[i] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kunci Jawaban
                </label>
                <input
                  type="text"
                  value={editingQuestion.kunciJawaban}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, kunciJawaban: e.target.value })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bobot Skor</label>
                <input
                  type="number"
                  value={editingQuestion.skor}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, skor: Number(e.target.value) })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pembahasan</label>
              <textarea
                rows={2}
                value={editingQuestion.pembahasan}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, pembahasan: e.target.value })
                }
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateQuestion(editingQuestion);
                  setEditingQuestion(null);
                  showToast('Soal berhasil diperbarui!');
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Manual Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManual}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                Tambah Butir Soal Baru Secara Manual
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                <select
                  value={newQ.mapel}
                  onChange={(e) => setNewQ({ ...newQ, mapel: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                >
                  {MAPEL_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kelas</label>
                <select
                  value={newQ.kelas}
                  onChange={(e) => setNewQ({ ...newQ, kelas: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <option key={k} value={String(k)}>
                      Kelas {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Bentuk Soal</label>
                <select
                  value={newQ.jenis}
                  onChange={(e) => setNewQ({ ...newQ, jenis: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                >
                  {JENIS_SOAL_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Teks Pertanyaan (Gunakan $...$ untuk KaTeX)
              </label>
              <textarea
                required
                rows={3}
                value={newQ.pertanyaan}
                onChange={(e) => setNewQ({ ...newQ, pertanyaan: e.target.value })}
                placeholder="Tulis naskah pertanyaan soal..."
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {newQ.jenis === 'Pilihan Ganda' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Pilihan Jawaban</label>
                {newQ.options?.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...(newQ.options || [])];
                      updated[i] = e.target.value;
                      setNewQ({ ...newQ, options: updated });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kunci Jawaban</label>
                <input
                  type="text"
                  value={newQ.kunciJawaban}
                  onChange={(e) => setNewQ({ ...newQ, kunciJawaban: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Skor / Bobot</label>
                <input
                  type="number"
                  value={newQ.skor}
                  onChange={(e) => setNewQ({ ...newQ, skor: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Pembahasan & Rubrik
              </label>
              <textarea
                rows={2}
                value={newQ.pembahasan}
                onChange={(e) => setNewQ({ ...newQ, pembahasan: e.target.value })}
                placeholder="Penjelasan jawaban yang benar..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
              >
                Simpan ke Bank Soal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
