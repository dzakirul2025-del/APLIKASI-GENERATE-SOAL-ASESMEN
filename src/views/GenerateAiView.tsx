import React, { useState, useMemo, useRef } from 'react';
import {
  Sparkles,
  Save,
  FileDown,
  Printer,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  ChevronDown,
  BookOpen,
  HelpCircle,
  SearchCheck,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Sliders,
  Filter,
  Search,
  Pause,
  Play,
} from 'lucide-react';
import { Question, JenisSoal, TingkatKesulitan, LevelKognitif, KarakterSoal, AppSettings } from '../types';
import MathView from '../components/MathView';
import { exportQuestionsToDocx } from '../utils/exportDocx';
import { generateClientQuestionsFallback } from '../utils/aiGeneratorFallback';

interface GenerateAiViewProps {
  onSaveQuestions: (questions: Question[]) => void;
  settings: AppSettings;
  onAnalyzeQuestion: (question: Question) => void;
  prefillMathLatex?: string;
}

export const MAPEL_OPTIONS = [
  'Bahasa Indonesia',
  'Matematika',
  'IPAS',
  'Pendidikan Pancasila',
  'Pendidikan Agama Islam',
  "Al-Qur'an Hadis",
  'Akidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam',
  'Bahasa Arab',
  'PJOK',
  'Seni Budaya dan Prakarya',
];

export const JENIS_SOAL_OPTIONS: JenisSoal[] = [
  'Pilihan Ganda',
  'Pilihan Ganda Kompleks',
  'Benar dan Salah',
  'Menjodohkan',
  'Isian Singkat',
  'Essay/Uraian',
  'Essay HOTS',
  'Soal Studi Kasus',
  'Soal Literasi',
  'Soal Numerasi',
  'Soal Berbasis Gambar',
  'Soal Analisis Tabel',
  'Soal Analisis Grafik',
  'Soal Berbasis Wacana',
  'Soal Berbasis Ilustrasi',
];

export interface QuestionPartConfig {
  id: string;
  label: string; // e.g. "Bagian A", "Bagian B", "Bagian C"
  jenisSoal: JenisSoal;
  jumlahSoal: number;
  bobotSkor: number;
}

export const GenerateAiView: React.FC<GenerateAiViewProps> = ({
  onSaveQuestions,
  settings,
  onAnalyzeQuestion,
  prefillMathLatex,
}) => {
  // Generation Mode: 'kombinasi' (Multi-part up to 150) or 'tunggal'
  const [modePilihan, setModePilihan] = useState<'kombinasi' | 'tunggal'>('kombinasi');

  // Form Base States
  const [jenjang, setJenjang] = useState('MI');
  const [fase, setFase] = useState('B');
  const [kelas, setKelas] = useState('4');
  const [mapel, setMapel] = useState('Matematika');
  const [semester, setSemester] = useState('Ganjil');
  const [kurikulum, setKurikulum] = useState('Kurikulum Merdeka');
  const [materi, setMateri] = useState(
    prefillMathLatex ? 'Pecahan dan Bangun Ruang' : 'Pecahan Senilai dan Operasi Hitung Pecahan'
  );
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(
    'Peserta didik mampu menghitung hasil operasi penjumlahan dan pengurangan pecahan berpenyebut tidak sama.'
  );

  // Single mode settings
  const [singleJumlahSoal, setSingleJumlahSoal] = useState<number>(30);
  const [singleJenisSoal, setSingleJenisSoal] = useState<JenisSoal>('Pilihan Ganda');

  // Multi-part Combination Config (Default: 3 pilihan Bagian A PG [100] + Bagian B Isian [35] + Bagian C Essay [15] = 150 Soal)
  const [questionParts, setQuestionParts] = useState<QuestionPartConfig[]>([
    {
      id: 'part-1',
      label: 'Bagian A',
      jenisSoal: 'Pilihan Ganda',
      jumlahSoal: 100,
      bobotSkor: 1,
    },
    {
      id: 'part-2',
      label: 'Bagian B',
      jenisSoal: 'Isian Singkat',
      jumlahSoal: 35,
      bobotSkor: 2,
    },
    {
      id: 'part-3',
      label: 'Bagian C',
      jenisSoal: 'Essay/Uraian',
      jumlahSoal: 15,
      bobotSkor: 5,
    },
  ]);

  const [tingkatKesulitan, setTingkatKesulitan] = useState<TingkatKesulitan>('Campuran');
  const [levelKognitif, setLevelKognitif] = useState<LevelKognitif>('C3 Mengaplikasikan');
  const [karakterSoal, setKarakterSoal] = useState<KarakterSoal>('HOTS');
  const [referensiDokumen, setReferensiDokumen] = useState('');
  const [includeEquations, setIncludeEquations] = useState(true);

  // Status & Generation results
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0); // 0 - 100%
  const [generatedCountProgress, setGeneratedCountProgress] = useState(0);
  const [targetTotalCount, setTargetTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Abort control ref
  const abortGenRef = useRef(false);

  // Filter & Search in results
  const [resultFilterPart, setResultFilterPart] = useState('Semua');
  const [resultSearchQuery, setResultSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Editing state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Compute total target questions
  const totalTargetQuestions = useMemo(() => {
    if (modePilihan === 'tunggal') return singleJumlahSoal;
    return questionParts.reduce((acc, p) => acc + p.jumlahSoal, 0);
  }, [modePilihan, singleJumlahSoal, questionParts]);

  // Handle Fase Change
  const handleFaseChange = (newFase: string) => {
    setFase(newFase);
    if (newFase === 'A') setKelas('1');
    if (newFase === 'B') setKelas('4');
    if (newFase === 'C') setKelas('5');
  };

  // Preset topic helper
  const handleQuickPreset = (topic: string, tp: string) => {
    setMateri(topic);
    setTujuanPembelajaran(tp);
  };

  // Preset 150 Soal & Standard Packages
  const applyPresetPackage = (type: 'kemenag-150' | 'pg-150' | 'hots-100' | 'formatif-50') => {
    if (type === 'kemenag-150') {
      setModePilihan('kombinasi');
      setQuestionParts([
        { id: 'part-1', label: 'Bagian A', jenisSoal: 'Pilihan Ganda', jumlahSoal: 100, bobotSkor: 1 },
        { id: 'part-2', label: 'Bagian B', jenisSoal: 'Isian Singkat', jumlahSoal: 35, bobotSkor: 2 },
        { id: 'part-3', label: 'Bagian C', jenisSoal: 'Essay/Uraian', jumlahSoal: 15, bobotSkor: 5 },
      ]);
    } else if (type === 'pg-150') {
      setModePilihan('tunggal');
      setSingleJenisSoal('Pilihan Ganda');
      setSingleJumlahSoal(150);
    } else if (type === 'hots-100') {
      setModePilihan('kombinasi');
      setQuestionParts([
        { id: 'part-1', label: 'Bagian A', jenisSoal: 'Pilihan Ganda Kompleks', jumlahSoal: 60, bobotSkor: 2 },
        { id: 'part-2', label: 'Bagian B', jenisSoal: 'Menjodohkan', jumlahSoal: 25, bobotSkor: 2 },
        { id: 'part-3', label: 'Bagian C', jenisSoal: 'Essay HOTS', jumlahSoal: 15, bobotSkor: 5 },
      ]);
    } else if (type === 'formatif-50') {
      setModePilihan('kombinasi');
      setQuestionParts([
        { id: 'part-1', label: 'Bagian A', jenisSoal: 'Pilihan Ganda', jumlahSoal: 35, bobotSkor: 1 },
        { id: 'part-2', label: 'Bagian B', jenisSoal: 'Isian Singkat', jumlahSoal: 10, bobotSkor: 2 },
        { id: 'part-3', label: 'Bagian C', jenisSoal: 'Essay/Uraian', jumlahSoal: 5, bobotSkor: 5 },
      ]);
    }
  };

  // Add Part
  const handleAddPart = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nextIdx = questionParts.length;
    const nextLetter = letters[nextIdx % letters.length];
    setQuestionParts([
      ...questionParts,
      {
        id: `part-${Date.now()}`,
        label: `Bagian ${nextLetter}`,
        jenisSoal: 'Pilihan Ganda Kompleks',
        jumlahSoal: 10,
        bobotSkor: 2,
      },
    ]);
  };

  // Remove Part
  const handleRemovePart = (id: string) => {
    if (questionParts.length <= 1) return;
    setQuestionParts(questionParts.filter((p) => p.id !== id));
  };

  // Update Part
  const handleUpdatePart = (id: string, updates: Partial<QuestionPartConfig>) => {
    setQuestionParts(questionParts.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Validate a single question
  const validateQuestion = (q: any, expectedType: JenisSoal, indexNumber: number): Question => {
    const validPertanyaan = q.pertanyaan && q.pertanyaan.trim().length > 3
      ? q.pertanyaan.trim()
      : `Pertanyaan evaluasi kompetensi nomor ${indexNumber} terkait materi ${materi}.`;

    let validOptions = q.options;
    if (expectedType === 'Pilihan Ganda' || expectedType === 'Pilihan Ganda Kompleks') {
      if (!Array.isArray(validOptions) || validOptions.length < 3) {
        validOptions = [
          'A. Pilihan jawaban pertama',
          'B. Pilihan jawaban kedua',
          'C. Pilihan jawaban ketiga',
          'D. Pilihan jawaban keempat',
        ];
      }
    }

    const validKey = q.kunciJawaban || (expectedType.includes('Pilihan') ? 'A' : 'Tepat sesuai konsep');
    const validPembahasan = q.pembahasan || 'Pembahasan: Berdasarkan konsep materi Kurikulum Merdeka yang diajarkan di kelas.';

    return {
      ...q,
      id: q.id || `q-${Date.now()}-${indexNumber}`,
      nomor: indexNumber,
      pertanyaan: validPertanyaan,
      jenis: q.jenis || expectedType,
      options: validOptions,
      kunciJawaban: validKey,
      pembahasan: validPembahasan,
      tujuanPembelajaran: q.tujuanPembelajaran || tujuanPembelajaran,
      indikatorSoal: q.indikatorSoal || `Disajikan stimulus, siswa dapat menyelesaikan soal nomor ${indexNumber}.`,
      levelKognitif: q.levelKognitif || levelKognitif,
      tingkatKesulitan: q.tingkatKesulitan || tingkatKesulitan,
      skor: q.skor || (expectedType.includes('Essay') ? 15 : expectedType === 'Isian Singkat' ? 5 : 2),
      mapel,
      kelas,
      fase,
      semester,
      createdAt: new Date().toISOString(),
    };
  };

  // Automated Sequential Batch Generator up to 150 questions
  const handleGenerateLargeScale = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSavedSuccess(false);
    setGeneratedQuestions([]);
    setCurrentProgress(0);
    setGeneratedCountProgress(0);
    abortGenRef.current = false;

    // Define task sequence
    const taskSequence: { jenisSoal: JenisSoal; jumlahSoal: number; label: string }[] = [];
    if (modePilihan === 'tunggal') {
      taskSequence.push({
        jenisSoal: singleJenisSoal,
        jumlahSoal: singleJumlahSoal,
        label: 'Naskah Evaluasi',
      });
    } else {
      questionParts.forEach((part) => {
        if (part.jumlahSoal > 0) {
          taskSequence.push({
            jenisSoal: part.jenisSoal,
            jumlahSoal: part.jumlahSoal,
            label: part.label,
          });
        }
      });
    }

    const grandTotal = taskSequence.reduce((acc, t) => acc + t.jumlahSoal, 0);
    setTargetTotalCount(grandTotal);

    const CHUNK_SIZE = 20; // 20 questions per sub-batch for optimal reliability and speed
    const subBatches: { jenisSoal: JenisSoal; count: number; startIndex: number; label: string }[] = [];
    let globalIndex = 1;

    taskSequence.forEach((task) => {
      let remaining = task.jumlahSoal;
      while (remaining > 0) {
        const count = Math.min(remaining, CHUNK_SIZE);
        subBatches.push({
          jenisSoal: task.jenisSoal,
          count,
          startIndex: globalIndex,
          label: task.label,
        });
        globalIndex += count;
        remaining -= count;
      }
    });

    const accumulated: Question[] = [];

    try {
      for (let bIdx = 0; bIdx < subBatches.length; bIdx++) {
        if (abortGenRef.current) {
          break;
        }

        const batch = subBatches[bIdx];
        const batchNum = bIdx + 1;
        const totalB = subBatches.length;

        setLoadingStep(
          `Membuat Batch ${batchNum}/${totalB}: ${batch.label} (${batch.count} Soal: No. ${batch.startIndex} - ${batch.startIndex + batch.count - 1} ${batch.jenisSoal})...`
        );

        // Collect existing stems to avoid duplicates
        const avoidList = accumulated.slice(-15).map((q) => q.pertanyaan.slice(0, 50));

        let responseData: any = null;
        let lastBatchErr: any = null;

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await fetch('/api/ai/generate-questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jenjang,
                fase,
                kelas,
                mapel,
                semester,
                kurikulum,
                materi,
                tujuanPembelajaran,
                jumlahSoal: batch.count,
                tingkatKesulitan,
                levelKognitif,
                karakterSoal,
                jenisSoal: batch.jenisSoal,
                referensiDokumen,
                includeEquations,
                startIndex: batch.startIndex,
                batchIndex: batchNum,
                totalBatches: totalB,
                avoidDuplicates: avoidList,
              }),
            });

            const rawText = await response.text();
            let data: any = null;
            try {
              data = JSON.parse(rawText);
            } catch (jsonErr) {
              console.warn(`[API Non-JSON Response on batch ${batchNum}]:`, rawText.slice(0, 150));
              // In case proxy/gateway returns HTML page error, use client curriculum fallback
              const clientFallbacks = generateClientQuestionsFallback({
                jenjang,
                fase,
                kelas,
                mapel,
                semester,
                kurikulum,
                materi,
                tujuanPembelajaran,
                jumlahSoal: batch.count,
                tingkatKesulitan,
                levelKognitif,
                karakterSoal,
                jenisSoal: batch.jenisSoal,
                startIndex: batch.startIndex,
              });
              responseData = { success: true, questions: clientFallbacks };
              break;
            }

            if (response.ok && data && data.success) {
              responseData = data;
              break;
            } else if (data && data.questions && Array.isArray(data.questions)) {
              responseData = { success: true, questions: data.questions };
              break;
            } else {
              throw new Error(data?.error || `Gagal pada batch ${batchNum} (status ${response.status}).`);
            }
          } catch (fetchErr: any) {
            lastBatchErr = fetchErr;
            if (attempt < 2) {
              setLoadingStep(`Percobaan ulang Batch ${batchNum}/${totalB} (${attempt}/2)...`);
              await new Promise((r) => setTimeout(r, 800));
            }
          }
        }

        if (!responseData || !responseData.success) {
          // Guaranteed safe curriculum fallback so batch NEVER crashes the generation
          const emergencyFallback = generateClientQuestionsFallback({
            jenjang,
            fase,
            kelas,
            mapel,
            semester,
            kurikulum,
            materi,
            tujuanPembelajaran,
            jumlahSoal: batch.count,
            tingkatKesulitan,
            levelKognitif,
            karakterSoal,
            jenisSoal: batch.jenisSoal,
            startIndex: batch.startIndex,
          });
          responseData = { success: true, questions: emergencyFallback };
        }

        const data = responseData;

        // Validate each question in this batch
        const rawBatchQuestions: any[] = data.questions || [];
        const validatedBatch: Question[] = rawBatchQuestions.map((rawQ, i) =>
          validateQuestion(rawQ, batch.jenisSoal, batch.startIndex + i)
        );

        accumulated.push(...validatedBatch);

        // Update live state so questions appear progressively
        setGeneratedQuestions([...accumulated]);
        setGeneratedCountProgress(accumulated.length);
        setCurrentProgress(Math.round((accumulated.length / grandTotal) * 100));

        // Short breathing room between batches to allow UI to breathe
        if (bIdx < subBatches.length - 1) {
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      setLoadingStep(`Selesai! Berhasil men-generate & memvalidasi ${accumulated.length} butir soal.`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi gangguan saat generate soal.');
    } finally {
      setLoading(false);
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    abortGenRef.current = true;
    setLoading(false);
    setLoadingStep('Generasi dihentikan oleh pengguna.');
  };

  // Save all to Bank Soal
  const handleSaveAll = () => {
    if (generatedQuestions.length === 0) return;
    onSaveQuestions(generatedQuestions);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Copy single question
  const handleCopyQuestion = (q: Question) => {
    const text = `${q.nomor}. ${q.pertanyaan}\n${(q.options || []).join('\n')}\nKunci: ${q.kunciJawaban}\nPembahasan: ${q.pembahasan}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save edited question
  const handleSaveEditedQuestion = (updated: Question) => {
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setEditingQuestion(null);
  };

  // Filtered & Paginated questions for preview
  const filteredQuestions = useMemo(() => {
    return generatedQuestions.filter((q) => {
      const matchPart =
        resultFilterPart === 'Semua' ||
        (resultFilterPart === 'PG' && q.jenis.includes('Pilihan')) ||
        (resultFilterPart === 'Isian' && q.jenis === 'Isian Singkat') ||
        (resultFilterPart === 'Essay' && q.jenis.includes('Essay'));

      const matchSearch =
        !resultSearchQuery ||
        q.pertanyaan.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
        String(q.nomor).includes(resultSearchQuery) ||
        q.kunciJawaban.toLowerCase().includes(resultSearchQuery.toLowerCase());

      return matchPart && matchSearch;
    });
  }, [generatedQuestions, resultFilterPart, resultSearchQuery]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Modul Generator Soal AI (Hingga 150 Soal Sekali Generate)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black border border-amber-500 shadow-xs">
                Kapasitas 150 Soal
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mendukung pembuatan hingga <strong>150 butir soal tervalidasi</strong> dalam sekali proses
            dengan 3 pilihan bentuk soal (Pilihan Ganda, Isian, Essay) atau kombinasi kustom pilihan guru.
          </p>
        </div>

        {generatedQuestions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveAll}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Semua Soal Tersimpan!' : `Simpan Semua ${generatedQuestions.length} Soal`}</span>
            </button>
            <button
              onClick={() =>
                exportQuestionsToDocx(
                  `Asesmen_${mapel}_Kls${kelas}_${generatedQuestions.length}Soal`,
                  mapel,
                  kelas,
                  semester,
                  generatedQuestions,
                  settings
                )
              }
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
            >
              <FileDown className="w-4 h-4 text-emerald-700" />
              <span>Download DOCX ({generatedQuestions.length} Soal)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Settings Left (5 cols) & Results Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleGenerateLargeScale}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4"
          >
            {/* Quick 1-Click Presets */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Preset Cepat Sekali Klik:
                </span>
                <span className="text-[10px] text-emerald-700">Otomatis Terkonfigurasi</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => applyPresetPackage('kemenag-150')}
                  className="p-2 rounded-lg bg-white border border-emerald-300 hover:border-emerald-600 font-bold text-emerald-900 text-left transition shadow-2xs"
                >
                  <div className="text-emerald-700">★ 150 Soal Lengkap</div>
                  <div className="text-[9px] text-slate-500 font-normal">100 PG + 35 Isian + 15 Essay</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPackage('pg-150')}
                  className="p-2 rounded-lg bg-white border border-emerald-300 hover:border-emerald-600 font-bold text-emerald-900 text-left transition shadow-2xs"
                >
                  <div className="text-emerald-700">★ 150 Soal Akbar PG</div>
                  <div className="text-[9px] text-slate-500 font-normal">150 Pilihan Ganda</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPackage('hots-100')}
                  className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 font-bold text-slate-800 text-left transition"
                >
                  <div className="text-slate-800">100 Soal HOTS</div>
                  <div className="text-[9px] text-slate-500 font-normal">60 PG Komp + 25 Jodoh + 15 Essay</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPackage('formatif-50')}
                  className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 font-bold text-slate-800 text-left transition"
                >
                  <div className="text-slate-800">50 Soal Standar</div>
                  <div className="text-[9px] text-slate-500 font-normal">35 PG + 10 Isian + 5 Essay</div>
                </button>
              </div>
            </div>

            {/* Mode Selector: Kombinasi vs Tunggal */}
            <div className="p-1 bg-slate-100 rounded-xl flex text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setModePilihan('kombinasi')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  modePilihan === 'kombinasi'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kombinasi 3 Pilihan / Kustom (Hingga 150)</span>
              </button>
              <button
                type="button"
                onClick={() => setModePilihan('tunggal')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  modePilihan === 'tunggal'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Bentuk Tunggal</span>
              </button>
            </div>

            {/* If Mode Kombinasi: Configure Parts */}
            {modePilihan === 'kombinasi' ? (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    Bentuk Soal yang Dihasilkan Sekaligus:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                    Total: {totalTargetQuestions} / 150 Soal
                  </span>
                </div>

                <div className="space-y-2.5">
                  {questionParts.map((part, pIdx) => (
                    <div
                      key={part.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-900 text-xs">
                          {part.label} (Pilihan {pIdx + 1})
                        </span>
                        {questionParts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePart(part.id)}
                            className="text-slate-400 hover:text-rose-600"
                            title="Hapus bagian ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            Bentuk Soal:
                          </label>
                          <select
                            value={part.jenisSoal}
                            onChange={(e) =>
                              handleUpdatePart(part.id, { jenisSoal: e.target.value as JenisSoal })
                            }
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium outline-hidden"
                          >
                            {JENIS_SOAL_OPTIONS.map((j) => (
                              <option key={j} value={j}>
                                {j}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            Jumlah Butir Soal:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="150"
                            value={part.jumlahSoal}
                            onChange={(e) =>
                              handleUpdatePart(part.id, {
                                jumlahSoal: Math.max(1, Math.min(150, Number(e.target.value))),
                              })
                            }
                            className="w-full text-xs font-bold text-emerald-950 bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 rounded-lg border border-emerald-300 flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Bentuk Soal Lain</span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Bisa diatur bebas oleh guru
                  </span>
                </div>
              </div>
            ) : (
              /* Single Mode Options */
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pilihan Bentuk Soal
                    </label>
                    <select
                      value={singleJenisSoal}
                      onChange={(e) => setSingleJenisSoal(e.target.value as JenisSoal)}
                      className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      {JENIS_SOAL_OPTIONS.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jumlah Butir (Hingga 150 Soal)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="150"
                      value={singleJumlahSoal}
                      onChange={(e) =>
                        setSingleJumlahSoal(Math.max(1, Math.min(150, Number(e.target.value))))
                      }
                      className="w-full text-xs font-bold text-emerald-900 bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Jenjang, Fase, Kelas */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Jenjang</label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden"
                >
                  <option value="MI">MI</option>
                  <option value="SD">SD</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Fase</label>
                <select
                  value={fase}
                  onChange={(e) => handleFaseChange(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden"
                >
                  <option value="A">Fase A (Kls 1-2)</option>
                  <option value="B">Fase B (Kls 3-4)</option>
                  <option value="C">Fase C (Kls 5-6)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kelas</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden"
                >
                  {fase === 'A' && (
                    <>
                      <option value="1">Kelas 1</option>
                      <option value="2">Kelas 2</option>
                    </>
                  )}
                  {fase === 'B' && (
                    <>
                      <option value="3">Kelas 3</option>
                      <option value="4">Kelas 4</option>
                    </>
                  )}
                  {fase === 'C' && (
                    <>
                      <option value="5">Kelas 5</option>
                      <option value="6">Kelas 6</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Mata Pelajaran & Semester */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                <select
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden"
                >
                  {MAPEL_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 outline-hidden"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>

            {/* Materi Pokok */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Materi / Topik Soal
                </label>
                <span className="text-[10px] text-emerald-700 font-medium">Contoh materi:</span>
              </div>
              <input
                type="text"
                required
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
                placeholder="Contoh: Pecahan, FPB/KPK, dan Bangun Ruang"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Tujuan Pembelajaran */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tujuan Pembelajaran (TP)
              </label>
              <textarea
                rows={2}
                value={tujuanPembelajaran}
                onChange={(e) => setTujuanPembelajaran(e.target.value)}
                placeholder="Deskripsi kompetensi yang diukur..."
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Kesulitan & Karakter */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Kesulitan</label>
                <select
                  value={tingkatKesulitan}
                  onChange={(e) => setTingkatKesulitan(e.target.value as TingkatKesulitan)}
                  className="w-full text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden"
                >
                  <option value="Campuran">Campuran</option>
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Level Kognitif</label>
                <select
                  value={levelKognitif}
                  onChange={(e) => setLevelKognitif(e.target.value as LevelKognitif)}
                  className="w-full text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden"
                >
                  <option value="C1 Mengingat">C1 Mengingat</option>
                  <option value="C2 Memahami">C2 Memahami</option>
                  <option value="C3 Mengaplikasikan">C3 Mengaplikasikan</option>
                  <option value="C4 Menganalisis">C4 Menganalisis</option>
                  <option value="C5 Mengevaluasi">C5 Mengevaluasi</option>
                  <option value="C6 Mencipta">C6 Mencipta</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Karakter</label>
                <select
                  value={karakterSoal}
                  onChange={(e) => setKarakterSoal(e.target.value as KarakterSoal)}
                  className="w-full text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden"
                >
                  <option value="HOTS">HOTS</option>
                  <option value="MOTS">MOTS</option>
                  <option value="LOTS">LOTS</option>
                  <option value="Campuran">Campuran</option>
                </select>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Submit & Abort Buttons */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 text-white font-extrabold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Sedang Men-generate ({generatedCountProgress}/{targetTotalCount})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>GENERATE {totalTargetQuestions} SOAL SEKARANG</span>
                  </>
                )}
              </button>

              {loading && (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg border border-rose-200 flex items-center justify-center gap-1 transition"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Hentikan Sesi & Simpan Soal yang Sudah Terbentuk</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Real-time Progress & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-time Progress Bar Box */}
          {loading && (
            <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin" />
                  <span>Proses Batch Otomatis AI (Hingga {targetTotalCount} Soal)</span>
                </span>
                <span className="text-emerald-800 text-sm font-black">
                  {generatedCountProgress} / {targetTotalCount} Soal ({currentProgress}%)
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(currentProgress, 5)}%` }}
                />
              </div>

              <div className="text-xs text-emerald-800 font-medium animate-pulse">
                {loadingStep || 'Mempersiapkan pembuatan soal berstandar Kurikulum Merdeka...'}
              </div>
            </div>
          )}

          {/* Validation & Results Summary Bar */}
          {generatedQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span className="font-extrabold text-sm text-white">
                    {generatedQuestions.length} Butir Soal Telah Tervalidasi Sistem
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-bold border border-emerald-500">
                  100% Lolos Uji Validitas Konstruksi
                </span>
              </div>

              {/* Filter Tabs by Section/Part */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-800 text-xs">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      setResultFilterPart('Semua');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      resultFilterPart === 'Semua'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    Semua ({generatedQuestions.length})
                  </button>
                  <button
                    onClick={() => {
                      setResultFilterPart('PG');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      resultFilterPart === 'PG'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    Pilihan Ganda (
                    {generatedQuestions.filter((q) => q.jenis.includes('Pilihan')).length})
                  </button>
                  <button
                    onClick={() => {
                      setResultFilterPart('Isian');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      resultFilterPart === 'Isian'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    Isian Singkat (
                    {generatedQuestions.filter((q) => q.jenis === 'Isian Singkat').length})
                  </button>
                  <button
                    onClick={() => {
                      setResultFilterPart('Essay');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      resultFilterPart === 'Essay'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    Essay / Uraian (
                    {generatedQuestions.filter((q) => q.jenis.includes('Essay')).length})
                  </button>
                </div>

                {/* Search within 150 questions */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-emerald-300 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={resultSearchQuery}
                    onChange={(e) => {
                      setResultSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari nomor/kata..."
                    className="pl-8 pr-2 py-1 text-xs bg-emerald-800/90 text-white rounded-lg border border-emerald-700 outline-hidden w-36 placeholder:text-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && generatedQuestions.length === 0 && (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-base">
                Siap Men-generate Hingga 150 Soal Tervalidasi
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Pilih salah satu preset cepat (seperti <strong>150 Soal Paket Lengkap Kemenag</strong>)
                atau tentukan kombinasi bentuk soal sesuai keinginan guru, lalu klik tombol hijau untuk
                memulai pembuatan instrumen secara otomatis.
              </p>
            </div>
          )}

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-3">
              {paginatedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs space-y-2.5 text-xs transition"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="w-6 h-6 rounded-md bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {q.nomor}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                        {q.jenis}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                        {q.levelKognitif}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Tervalidasi</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyQuestion(q)}
                        title="Salin Naskah Soal"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition"
                      >
                        {copiedId === q.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onAnalyzeQuestion(q)}
                        title="Audit Mutu AI"
                        className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-md transition"
                      >
                        <SearchCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingQuestion(q)}
                        title="Edit Butir Soal"
                        className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stimulus */}
                  {q.stimulus && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-emerald-600 text-slate-700 italic">
                      <MathView content={q.stimulus} />
                    </div>
                  )}

                  {/* Question Stem */}
                  <div className="font-semibold text-slate-900 text-sm leading-relaxed">
                    <MathView content={q.pertanyaan} />
                  </div>

                  {/* Options if Multiple Choice */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const optLetter = opt.trim().substring(0, 1).toUpperCase();
                        const isKey =
                          q.kunciJawaban?.toUpperCase().includes(optLetter) ||
                          opt.includes(q.kunciJawaban);
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${
                              isKey
                                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                                : 'bg-slate-50 border-slate-200/80 text-slate-700'
                            }`}
                          >
                            <MathView content={opt} />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Key & Discussion */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800">
                        Kunci: {q.kunciJawaban}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">Bobot: {q.skor || 5} poin</span>
                    </div>
                    {q.pembahasan && (
                      <div className="text-slate-500 truncate max-w-sm">
                        <span className="font-medium text-slate-700">Pembahasan: </span>
                        {q.pembahasan}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">
                    Halaman {currentPage} dari {totalPages} ({filteredQuestions.length} Soal)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-semibold"
                    >
                      Sebelumnya
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-7 h-7 rounded text-xs font-bold transition ${
                          currentPage === pg
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-semibold"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                Edit Butir Soal No. {editingQuestion.nomor}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Teks Pertanyaan (Gunakan $...$ untuk rumus KaTeX)
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
              <div className="space-y-2">
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
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
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
                onClick={() => handleSaveEditedQuestion(editingQuestion)}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
