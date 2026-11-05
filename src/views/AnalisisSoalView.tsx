import React, { useState } from 'react';
import {
  SearchCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  Check,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Question, QuestionAnalysisResult } from '../types';
import MathView from '../components/MathView';

interface AnalisisSoalViewProps {
  questions: Question[];
  onUpdateQuestion: (question: Question) => void;
  selectedQuestionForAnalysis?: Question | null;
}

export const AnalisisSoalView: React.FC<AnalisisSoalViewProps> = ({
  questions,
  onUpdateQuestion,
  selectedQuestionForAnalysis,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(() => {
    return selectedQuestionForAnalysis || questions[0] || null;
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<QuestionAnalysisResult | null>(null);
  const [appliedRevision, setAppliedRevision] = useState(false);

  // Analyze with AI
  const handleRunAnalysis = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    setErrorMessage('');
    setAnalysisResult(null);
    setAppliedRevision(false);

    try {
      const response = await fetch('/api/ai/analyze-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion,
          mapel: selectedQuestion.mapel,
          kelas: selectedQuestion.kelas,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal menganalisis butir soal.');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses evaluasi mutu soal.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click apply revised question
  const handleApplyRevision = () => {
    if (!analysisResult?.revisiSoal || !selectedQuestion) return;

    const updated: Question = {
      ...selectedQuestion,
      pertanyaan: analysisResult.revisiSoal.pertanyaan || selectedQuestion.pertanyaan,
      options: analysisResult.revisiSoal.options || selectedQuestion.options,
      kunciJawaban: analysisResult.revisiSoal.kunciJawaban || selectedQuestion.kunciJawaban,
      pembahasan: analysisResult.revisiSoal.pembahasan || selectedQuestion.pembahasan,
      updatedAt: new Date().toISOString(),
    };

    onUpdateQuestion(updated);
    setSelectedQuestion(updated);
    setAppliedRevision(true);
  };

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
        <SearchCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-700 text-base">Belum Ada Soal di Bank Soal</h3>
        <p className="text-xs text-slate-400 mt-1">
          Buat soal terlebih dahulu di menu "Generate Soal AI" untuk melakukan audit mutu butir soal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <SearchCheck className="w-5 h-5 text-purple-600" />
            <span>Audit & Analisis Kualitas Butir Soal</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
              Pakar Evaluasi Pendidikan AI
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Uji kelayakan substantif, validitas konstruksi, mutu distraktor pilihan, dan rekomendasi
            penyempurnaan naskah soal MI.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={loading || !selectedQuestion}
          className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              <span>Memeriksa Butir Soal...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Jalankan Audit AI Sekarang</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Select & View Question (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Pilih Butir Soal dari Bank Soal ({questions.length})
            </label>
            <select
              value={selectedQuestion?.id}
              onChange={(e) => {
                const found = questions.find((q) => q.id === e.target.value);
                if (found) {
                  setSelectedQuestion(found);
                  setAnalysisResult(null);
                  setAppliedRevision(false);
                }
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-hidden"
            >
              {questions.map((q, idx) => (
                <option key={q.id} value={q.id}>
                  No. {idx + 1} • {q.mapel} (Kls {q.kelas}) - {q.pertanyaan.slice(0, 40)}...
                </option>
              ))}
            </select>
          </div>

          {/* Current Question Inspector Card */}
          {selectedQuestion && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">
                  {selectedQuestion.mapel} (Kelas {selectedQuestion.kelas})
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                  {selectedQuestion.levelKognitif}
                </span>
              </div>

              {selectedQuestion.stimulus && (
                <div className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-purple-500 italic text-slate-700">
                  <MathView content={selectedQuestion.stimulus} />
                </div>
              )}

              <div className="font-semibold text-slate-900 leading-relaxed text-sm">
                <MathView content={selectedQuestion.pertanyaan} />
              </div>

              {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                <div className="space-y-1 pt-1">
                  {selectedQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border ${
                        opt.includes(selectedQuestion.kunciJawaban)
                          ? 'bg-purple-50 border-purple-200 font-semibold text-purple-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <MathView content={opt} />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                <div>
                  <span className="font-bold text-purple-900">
                    Kunci: {selectedQuestion.kunciJawaban}
                  </span>
                </div>
                {selectedQuestion.pembahasan && (
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Pembahasan: </span>
                    <MathView content={selectedQuestion.pembahasan} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Note on Validity */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Pedoman Validitas Asesmen:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Pemeriksaan AI ini menguji <strong>telaah substansi dan konstruksi logis</strong> butir
              soal. Pengujian empiris validitas dan reliabilitas tetap memerlukan uji coba langsung
              terhadap responden siswa di madrasah.
            </p>
          </div>
        </div>

        {/* Right Column: AI Audit Results & Revision (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading && (
            <div className="p-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                Mengevaluasi Konstruksi & Kualitas Butir Soal...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Memeriksa kecocokan bahasa siswa MI, kejelasan stimulus, dan efektivitas pilihan
                pengecoh (distraktor).
              </p>
            </div>
          )}

          {!loading && !analysisResult && (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Siap Melakukan Audit</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Pilih butir soal di panel sebelah kiri, kemudian klik tombol "Jalankan Audit AI
                Sekarang".
              </p>
            </div>
          )}

          {!loading && analysisResult && (
            <div className="space-y-4">
              {/* Score card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Skor Kelayakan Butir Soal
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {analysisResult.skorKelayakan} / 100
                  </div>
                  <div className="text-xs font-bold text-purple-700 mt-1">
                    {analysisResult.statusKelayakan}
                  </div>
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${
                    analysisResult.skorKelayakan >= 80
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <Award className="w-8 h-8" />
                </div>
              </div>

              {/* Detail Audit Aspects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Kesesuaian Materi & TP:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult.kesesuaianMateri}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Level Kognitif & Siswa:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult.kesesuaianKognitif}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Validitas Kunci Jawaban:</span>
                  <p className="text-slate-600 leading-relaxed">{analysisResult.validitasKunci}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Kualitas Pengecoh (Distraktor):</span>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult.kualitasDistraktor}
                  </p>
                </div>
              </div>

              {/* Evaluation Notes & Recommendations */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Catatan & Rekomendasi Perbaikan:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {analysisResult.catatanEvaluasi?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {analysisResult.rekomendasiPerbaikan?.map((r, i) => (
                    <li key={`r-${i}`} className="text-purple-900 font-medium">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Revised Version Card with 1-Click Update */}
              {analysisResult.revisiSoal && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-purple-950">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span>Versi Soal yang Telah Disempurnakan oleh AI:</span>
                    </div>

                    <button
                      onClick={handleApplyRevision}
                      disabled={appliedRevision}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                        appliedRevision
                          ? 'bg-emerald-600 text-white'
                          : 'bg-purple-700 hover:bg-purple-800 text-white'
                      }`}
                    >
                      {appliedRevision ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Revisi Telah Diterapkan!</span>
                        </>
                      ) : (
                        <>
                          <span>Terapkan Revisi Ini ke Bank Soal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-100 text-xs space-y-2">
                    <div className="font-semibold text-slate-900">
                      <MathView content={analysisResult.revisiSoal.pertanyaan} />
                    </div>

                    {analysisResult.revisiSoal.options && (
                      <div className="space-y-1 pl-2">
                        {analysisResult.revisiSoal.options.map((opt, i) => (
                          <div key={i} className="text-slate-700">
                            <MathView content={opt} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] text-purple-900 font-bold pt-1">
                      Kunci Jawaban Baru: {analysisResult.revisiSoal.kunciJawaban}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
