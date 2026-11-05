import React, { useState } from 'react';
import {
  History,
  Clock,
  Sparkles,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GenerationHistory, Question } from '../types';
import MathView from '../components/MathView';

interface HistoryViewProps {
  history: GenerationHistory[];
  onRestoreQuestions: (questions: Question[]) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onRestoreQuestions,
  onClearHistory,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleRestore = (item: GenerationHistory) => {
    onRestoreQuestions(item.questions);
    showToast(`${item.questions.length} butir soal berhasil dipulihkan ke Bank Soal!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Riwayat Pembuatan Soal AI</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {history.length} Sesi Tercatat
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Catatan log pembuatan soal per sesi. Anda dapat memeriksa butir soal terdahulu dan
            memulihkannya ke Bank Soal kapan saja.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Yakin ingin membersihkan seluruh riwayat generate?')) {
                onClearHistory();
                showToast('Riwayat berhasil dibersihkan.');
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Riwayat</span>
          </button>
        )}
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Catatan Riwayat</h4>
            <p className="text-xs text-slate-400 mt-1">
              Setiap kali Anda men-generate soal AI, sesi tersebut akan otomatis tersimpan di sini.
            </p>
          </div>
        ) : (
          history.map((item) => {
            const isExpanded = expandedId === item.id;
            const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="cursor-pointer p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 text-sm truncate">
                        {item.mapel} (Kelas {item.kelas}) – {item.materi || 'Materi Umum'}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          {item.jumlahSoal} Butir Soal ({item.jenisSoal})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1 transition"
                      title="Pulihkan Semua Soal Sesi Ini ke Bank Soal"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Pulihkan ke Bank Soal</span>
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded questions list */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      Rincian Butir Soal Sesi Ini:
                    </div>
                    {item.questions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span className="font-bold text-slate-800">Soal No. {qIdx + 1}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            Kunci: {q.kunciJawaban}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900">
                          <MathView content={q.pertanyaan} />
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] pt-1">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="text-slate-600">
                                <MathView content={opt} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
