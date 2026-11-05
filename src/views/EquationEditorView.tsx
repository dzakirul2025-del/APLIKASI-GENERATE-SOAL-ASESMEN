import React, { useState } from 'react';
import {
  Sigma,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  Trash2,
  Plus,
} from 'lucide-react';
import MathView from '../components/MathView';
import { MATH_PRESETS, MathPreset } from '../utils/mathPresets';

interface EquationEditorViewProps {
  onSendToQuestionBuilder: (latex: string) => void;
}

export const EquationEditorView: React.FC<EquationEditorViewProps> = ({
  onSendToQuestionBuilder,
}) => {
  const [latexInput, setLatexInput] = useState<string>(
    'V = s^3 = 80 \\times 80 \\times 80 = 512.000\\text{ cm}^3'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copied, setCopied] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([
    '\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}',
    'V = p \\times l \\times t',
    '\\sqrt{144} = 12',
  ]);

  const categories = [
    'Semua',
    'Pecahan',
    'Persentase & Desimal',
    'Geometri & Bangun Ruang',
    'Akar & Pangkat',
    'Aljabar & Rasio',
  ];

  const filteredPresets =
    selectedCategory === 'Semua'
      ? MATH_PRESETS
      : MATH_PRESETS.filter((p) => p.category === selectedCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(`$${latexInput}$`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSymbol = (symbol: string) => {
    setLatexInput((prev) => prev + symbol);
  };

  const handleSaveFavorite = () => {
    if (latexInput && !savedFavorites.includes(latexInput)) {
      setSavedFavorites([...savedFavorites, latexInput]);
    }
  };

  const quickSymbols = [
    { label: 'Pecahan', code: ' \\frac{a}{b} ' },
    { label: 'Kali (×)', code: ' \\times ' },
    { label: 'Bagi (÷)', code: ' \\div ' },
    { label: 'Akar (√)', code: ' \\sqrt{x} ' },
    { label: 'Pangkat 2', code: '^2 ' },
    { label: 'Pangkat 3', code: '^3 ' },
    { label: 'Persen (%)', code: '\\% ' },
    { label: 'Derajat (°)', code: '^\\circ ' },
    { label: 'Pi (π)', code: ' \\pi ' },
    { label: 'Sudut (∠)', code: ' \\angle ABC ' },
    { label: 'Kurung ()', code: ' \\left( ... \\right) ' },
    { label: 'Panah (→)', code: ' \\implies ' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sigma className="w-5 h-5 text-emerald-600" />
            <span>Equation Editor Matematika KaTeX</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
              LaTeX Engine
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Editor visual rumus matematika MI (pecahan, bangun ruang, akar, persen). Bebas buram,
            mendukung ekspor Word dan PDF secara presisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendToQuestionBuilder(latexInput)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-900 font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Kirim Rumus ke Generator Soal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Live KaTeX Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Preview Display Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Pratinjau Visual Langsung (KaTeX)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveFavorite}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan Favorit</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin $...$</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* The rendered Math */}
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 min-h-[140px] flex items-center justify-center text-center overflow-x-auto text-xl">
              <MathView content={`$$${latexInput || '...'}$$`} />
            </div>

            {/* In-sentence test preview */}
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-slate-600">
              <span className="font-semibold text-emerald-900">Simulasi Teks Soal: </span>
              <span>"Hitunglah nilai dari </span>
              <MathView content={`$${latexInput}$`} />
              <span> dalam satuan standar madrasah."</span>
            </div>
          </div>

          {/* Quick Symbol Insert Palette */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              Palet Simbol Cepat Matematika MI
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSymbols.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertSymbol(sym.code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-medium border border-slate-200/80 transition"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Input Kode LaTeX / KaTeX
            </label>
            <textarea
              rows={4}
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="Ketik notasi LaTeX matematika di sini..."
              className="w-full font-mono text-sm bg-slate-900 text-emerald-400 p-3 rounded-xl border border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Tips: Gunakan tanda kurung kurawal {"{}"} untuk pembilang & penyebut.</span>
              <button
                type="button"
                onClick={() => setLatexInput('')}
                className="text-rose-500 hover:underline"
              >
                Bersihkan
              </button>
            </div>
          </div>
        </div>

        {/* Right: Presets Library & Favorites (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Category Filter Pills */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Koleksi Template Rumus MI
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setLatexInput(preset.latex)}
                  className="cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-emerald-800">
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold group-hover:underline">
                      Gunakan ↵
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-100 text-center font-mono text-slate-700">
                    <MathView content={`$${preset.latex}$`} />
                  </div>
                  <div className="text-[10px] text-slate-400">{preset.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Favorites */}
          {savedFavorites.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Rumus Favorit Anda ({savedFavorites.length})
              </span>
              <div className="space-y-1.5">
                {savedFavorites.map((fav, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div
                      onClick={() => setLatexInput(fav)}
                      className="cursor-pointer font-mono truncate text-emerald-800 hover:underline flex-1"
                    >
                      <MathView content={`$${fav}$`} />
                    </div>
                    <button
                      onClick={() => setSavedFavorites(savedFavorites.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
