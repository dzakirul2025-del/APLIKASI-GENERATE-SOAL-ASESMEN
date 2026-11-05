import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RefreshCw,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BookOpen,
} from 'lucide-react';
import { Question, JenisSoal, AppSettings } from '../types';
import MathView from '../components/MathView';
import { MAPEL_OPTIONS, JENIS_SOAL_OPTIONS } from './GenerateAiView';

interface ImageQuestionViewProps {
  onSaveQuestions: (questions: Question[]) => void;
  settings: AppSettings;
  onAnalyzeQuestion: (question: Question) => void;
}

// Built-in educational sample images for quick test/demonstration
const SAMPLE_GALLERY = [
  {
    title: 'Bangun Ruang Kubus (Matematika)',
    caption: 'Gambar jaring-jaring dan struktur rusuk serta titik sudut kubus ABCD.EFGH',
    mapel: 'Matematika',
    kelas: '5',
    fase: 'C',
    prompt: 'Buat soal mengenai jumlah rusuk, titik sudut, luas permukaan, dan volume kubus.',
    // Clean SVG Data URI for crisp rendering and zero external network latency
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f8fafc"/><path d="M120,180 L220,180 L220,80 L120,80 Z" fill="%23e2e8f0" stroke="%230f766e" stroke-width="3"/><path d="M170,130 L270,130 L270,30 L170,30 Z" fill="none" stroke="%230f766e" stroke-dasharray="4,4" stroke-width="2"/><line x1="120" y1="80" x2="170" y2="30" stroke="%230f766e" stroke-width="3"/><line x1="220" y1="80" x2="270" y2="30" stroke="%230f766e" stroke-width="3"/><line x1="220" y1="180" x2="270" y2="130" stroke="%230f766e" stroke-width="3"/><line x1="120" y1="180" x2="170" y2="130" stroke="%230f766e" stroke-dasharray="4,4" stroke-width="2"/><text x="110" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">A</text><text x="225" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">B</text><text x="275" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">C</text><text x="175" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">D</text><text x="110" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">E</text><text x="225" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">F</text><text x="275" y="25" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">G</text><text x="165" y="25" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23006a4e">H</text><text x="155" y="210" font-family="sans-serif" font-size="12" fill="%23b45309">s = 12 cm</text></svg>',
  },
  {
    title: 'Sistem Pernapasan Manusia (IPAS)',
    caption: 'Bagan saluran pernapasan dari hidung, trakea, bronkus, hingga alveolus',
    mapel: 'IPAS',
    kelas: '5',
    fase: 'C',
    prompt: 'Buat soal identifikasi fungsi organ hidung, trakea, dan pertukaran gas di alveolus.',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f0fdf4"/><circle cx="200" cy="50" r="30" fill="%23fecdd3" stroke="%23e11d48" stroke-width="2"/><line x1="200" y1="80" x2="200" y2="140" stroke="%23334155" stroke-width="6"/><circle cx="160" cy="180" r="35" fill="%23bae6fd" stroke="%230284c7" stroke-width="2"/><circle cx="240" cy="180" r="35" fill="%23bae6fd" stroke="%230284c7" stroke-width="2"/><line x1="200" y1="140" x2="160" y2="180" stroke="%23334155" stroke-width="4"/><line x1="200" y1="140" x2="240" y2="180" stroke="%23334155" stroke-width="4"/><text x="210" y="55" font-size="12" fill="%230f172a" font-weight="bold">1. Hidung</text><text x="215" y="115" font-size="12" fill="%230f172a" font-weight="bold">2. Trakea</text><text x="125" y="235" font-size="12" fill="%230f172a" font-weight="bold">3. Paru-paru Kiri</text><text x="225" y="235" font-size="12" fill="%230f172a" font-weight="bold">4. Paru-paru Kanan</text></svg>',
  },
  {
    title: 'Pola Lantai Tari Tradisional (Seni Budaya)',
    caption: 'Diagram formasi pola lantai tari berkelompok (horizontal, diagonal, melingkar)',
    mapel: 'Seni Budaya dan Prakarya',
    kelas: '4',
    fase: 'B',
    prompt: 'Buat soal mengidentifikasi makna dan jenis pola lantai pada tarian daerah.',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fffbeb"/><line x1="50" y1="80" x2="350" y2="80" stroke="%23d97706" stroke-width="3" stroke-dasharray="6,4"/><circle cx="80" cy="80" r="10" fill="%23059669"/><circle cx="160" cy="80" r="10" fill="%23059669"/><circle cx="240" cy="80" r="10" fill="%23059669"/><circle cx="320" cy="80" r="10" fill="%23059669"/><text x="120" y="60" font-size="13" font-weight="bold" fill="%2378350f">Pola Lantai A: Garis Lurus Horizontal</text><circle cx="200" cy="200" r="60" fill="none" stroke="%23b45309" stroke-width="2"/><circle cx="200" cy="140" r="10" fill="%23dc2626"/><circle cx="260" cy="200" r="10" fill="%23dc2626"/><circle cx="200" cy="260" r="10" fill="%23dc2626"/><circle cx="140" cy="200" r="10" fill="%23dc2626"/><text x="140" y="285" font-size="13" font-weight="bold" fill="%2378350f">Pola Lantai B: Melingkar</text></svg>',
  },
];

export const ImageQuestionView: React.FC<ImageQuestionViewProps> = ({
  onSaveQuestions,
  onAnalyzeQuestion,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [imageBase64, setImageBase64] = useState<string>(SAMPLE_GALLERY[0].dataUrl);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [caption, setCaption] = useState<string>(SAMPLE_GALLERY[0].caption);
  const [imageWidthPercent, setImageWidthPercent] = useState<number>(75);
  const [imagePosition, setImagePosition] = useState<'center' | 'left' | 'right'>('center');

  // Form options
  const [mapel, setMapel] = useState<string>(SAMPLE_GALLERY[0].mapel);
  const [kelas, setKelas] = useState<string>(SAMPLE_GALLERY[0].kelas);
  const [fase, setFase] = useState<string>(SAMPLE_GALLERY[0].fase);
  const [mode, setMode] = useState<string>('soal_dari_gambar');
  const [jumlahSoal, setJumlahSoal] = useState<number>(3);
  const [jenisSoal, setJenisSoal] = useState<JenisSoal>('Pilihan Ganda');
  const [instructions, setInstructions] = useState<string>(SAMPLE_GALLERY[0].prompt);

  // Loading & Results
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setErrorMessage('Format gambar harus JPG, JPEG, PNG, WEBP, atau SVG.');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageBase64(result);
      setCaption(`Ilustrasi Soal – ${file.name}`);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  // Select sample from gallery
  const handleSelectSample = (sample: (typeof SAMPLE_GALLERY)[0]) => {
    setImageBase64(sample.dataUrl);
    setMimeType('image/png');
    setCaption(sample.caption);
    setMapel(sample.mapel);
    setKelas(sample.kelas);
    setFase(sample.fase);
    setInstructions(sample.prompt);
    setErrorMessage('');
  };

  // Submit to Gemini Vision
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMessage('Silakan unggah atau pilih gambar terlebih dahulu.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/generate-from-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          instructions,
          mapel,
          kelas,
          fase,
          mode,
          jumlahSoal,
          jenisSoal,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses gambar dengan AI.');
      }

      setAnalysisResult(data.result);
      if (data.result.suggestedCaption && !caption) {
        setCaption(data.result.suggestedCaption);
      }

      const questionsWithImages: Question[] = (data.result.questions || []).map(
        (q: any, i: number) => ({
          ...q,
          id: `img-q-${Date.now()}-${i}`,
          mapel,
          kelas,
          fase,
          semester: 'Ganjil',
          nomor: i + 1,
          createdAt: new Date().toISOString(),
          image: {
            url: imageBase64,
            caption: caption || data.result.suggestedCaption,
            widthPercent: imageWidthPercent,
            position: imagePosition,
            placement: 'above_stem',
          },
        })
      );

      setGeneratedQuestions(questionsWithImages);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses visual. Pastikan API key terpasang.');
    } finally {
      setLoading(false);
    }
  };

  // Save to Bank Soal
  const handleSaveToBank = () => {
    if (generatedQuestions.length === 0) return;
    onSaveQuestions(generatedQuestions);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <span>Generate Soal Berbasis Gambar</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Multimodal Gemini AI
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unggah gambar diagram, organ biologis, bangun geometri, atau peta. AI menganalisis visual
            dan menghasilkan instrumen evaluasi akurat.
          </p>
        </div>

        {generatedQuestions.length > 0 && (
          <button
            onClick={handleSaveToBank}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Tersimpan di Bank Soal!' : 'Simpan Semua ke Bank Soal'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Image Management & Settings (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Image Uploader & Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                Media Gambar Soal
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah dari Komputer</span>
              </button>
            </div>

            {/* Quick Sample Gallery Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Atau pilih contoh visual MI:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_GALLERY.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 text-left transition group"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                      {sample.title}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {sample.mapel} • Kls {sample.kelas}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Canvas Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              {imageBase64 ? (
                <div
                  className={`flex flex-col items-${
                    imagePosition === 'left' ? 'start' : imagePosition === 'right' ? 'end' : 'center'
                  } w-full`}
                >
                  <img
                    src={imageBase64}
                    alt="Pratinjau Soal"
                    style={{ width: `${imageWidthPercent}%` }}
                    className="max-h-64 object-contain rounded-lg border border-slate-200 shadow-xs bg-white p-2"
                  />
                  {caption && (
                    <p className="text-center text-[11px] text-slate-500 italic mt-2 font-medium">
                      {caption}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  Belum ada gambar yang dipilih.
                </div>
              )}
            </div>

            {/* Image Properties Control */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ukuran Lebar ({imageWidthPercent}%)
                </label>
                <div className="flex gap-1">
                  {[50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setImageWidthPercent(pct)}
                      className={`flex-1 py-1 text-xs rounded-lg font-medium border transition ${
                        imageWidthPercent === pct
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Posisi Perataan
                </label>
                <div className="flex gap-1">
                  {[
                    { pos: 'left', icon: AlignLeft },
                    { pos: 'center', icon: AlignCenter },
                    { pos: 'right', icon: AlignRight },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.pos}
                        type="button"
                        onClick={() => setImagePosition(p.pos as any)}
                        className={`flex-1 py-1.5 flex items-center justify-center rounded-lg border transition ${
                          imagePosition === p.pos
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Keterangan Gambar (Caption)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Contoh: Gambar 1.1 Struktur Organ Pernapasan Manusia"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right: Vision AI Parameters & Question Generation (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <form
            onSubmit={handleGenerate}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Konfigurasi Analisis Visual AI
              </span>
            </div>

            {/* Mode Pembuatan */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Mode Pembuatan Soal Berbasis Gambar
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                <option value="soal_dari_gambar">1. Generate Soal dari Gambar (Fokus Visual)</option>
                <option value="analisis_gambar">2. Generate Soal Analisis & Identifikasi Objek</option>
                <option value="interpretasi">3. Generate Soal Interpretasi & Penalaran HOTS</option>
              </select>
            </div>

            {/* Mapel & Kelas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {MAPEL_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kelas & Fase
                </label>
                <select
                  value={kelas}
                  onChange={(e) => {
                    const k = e.target.value;
                    setKelas(k);
                    if (['1', '2'].includes(k)) setFase('A');
                    else if (['3', '4'].includes(k)) setFase('B');
                    else setFase('C');
                  }}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="1">Kelas 1 (Fase A)</option>
                  <option value="2">Kelas 2 (Fase A)</option>
                  <option value="3">Kelas 3 (Fase B)</option>
                  <option value="4">Kelas 4 (Fase B)</option>
                  <option value="5">Kelas 5 (Fase C)</option>
                  <option value="6">Kelas 6 (Fase C)</option>
                </select>
              </div>
            </div>

            {/* Bentuk Soal & Jumlah */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bentuk Soal
                </label>
                <select
                  value={jenisSoal}
                  onChange={(e) => setJenisSoal(e.target.value as JenisSoal)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                  <option value="Isian Singkat">Isian Singkat</option>
                  <option value="Essay/Uraian">Essay/Uraian</option>
                  <option value="Soal Studi Kasus">Soal Studi Kasus</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Jumlah Soal ({jumlahSoal} Butir)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-2"
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Fokus Asesmen / Petunjuk Tambahan Guru
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Misal: Buat soal yang menanyakan rumus volume kubus jika rusuk 12 cm..."
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !imageBase64}
              className="w-full py-3 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Gemini Vision Sedang Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>ANALISIS GAMBAR & BUAT SOAL</span>
                </>
              )}
            </button>
          </form>

          {/* AI Analysis Notes */}
          {analysisResult && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Hasil Pengamatan Visual AI:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{analysisResult.imageAnalysis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Questions List with Images attached */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Butir Soal Berbasis Gambar yang Dihasilkan ({generatedQuestions.length})</span>
            </h3>
            <span className="text-xs text-slate-500">
              Gambar akan otomatis disertakan saat diekspor ke Word (.docx) & PDF!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="w-6 h-6 rounded-md bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {q.levelKognitif}
                  </span>
                </div>

                {/* Question stimulus & stem */}
                {q.stimulus && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border-l-2 border-emerald-600">
                    <MathView content={q.stimulus} />
                  </p>
                )}

                <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                  <MathView content={q.pertanyaan} />
                </div>

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <div className="space-y-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg text-xs border ${
                          opt.includes(q.kunciJawaban)
                            ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <MathView content={opt} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-emerald-800">Kunci: {q.kunciJawaban}</span>
                  </div>
                  <div className="text-slate-500">
                    <span className="font-medium text-slate-700">Pembahasan: </span>
                    <MathView content={q.pembahasan} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
