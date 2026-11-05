import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Question, AppSettings } from '../types';
import MathView from '../components/MathView';

interface KartuSoalViewProps {
  questions: Question[];
  settings: AppSettings;
}

export const KartuSoalView: React.FC<KartuSoalViewProps> = ({ questions, settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
        <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-700 text-base">Belum Ada Soal di Bank Soal</h3>
        <p className="text-xs text-slate-400 mt-1">
          Silakan buat soal terlebih dahulu di menu "Generate Soal AI" untuk melihat Kartu Soal otomatis.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Generator Kartu Soal Asesmen</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
              Format Standar MI
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Format resmi kartu butir soal dilengkapi naskah pertanyaan, indikator, level kognitif,
            kunci jawaban, dan rubrik penilaian.
          </p>
        </div>

        {/* Navigation & Print buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 transition"
              title="Soal Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-3">
              Kartu {currentIndex + 1} dari {questions.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 transition"
              title="Soal Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Soal Ini</span>
          </button>
        </div>
      </div>

      {/* Official Kartu Soal Layout Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto print-container">
        {/* Header Institution */}
        <div className="border-b-2 border-emerald-900 pb-3 mb-4 text-center">
          <div className="text-xs font-bold tracking-wider text-slate-600">
            KEMENTERIAN AGAMA REPUBLIK INDONESIA
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-900 tracking-wide">
            KARTU SOAL ASESMEN PEMBELAJARAN
          </div>
          <div className="text-xs font-semibold text-slate-700">
            {settings.madrasahName} • TAHUN PELAJARAN {settings.academicYear}
          </div>
        </div>

        {/* Identity Grid Table */}
        <div className="border border-slate-300 rounded-lg overflow-hidden mb-5 text-xs">
          <div className="grid grid-cols-2 divide-x divide-slate-300 bg-slate-50 border-b border-slate-300 p-2.5">
            <div>
              <span className="font-bold text-slate-600">Satuan Pendidikan:</span>{' '}
              <span className="font-semibold text-emerald-900">{settings.madrasahName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Mata Pelajaran:</span>{' '}
              <span className="font-semibold text-slate-800">{currentQ.mapel || 'Matematika'}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-300 bg-white border-b border-slate-300 p-2.5">
            <div>
              <span className="font-bold text-slate-600">Kelas / Fase:</span>{' '}
              <span>{currentQ.kelas || '4'} / {currentQ.fase || 'B'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Semester:</span>{' '}
              <span>{currentQ.semester || 'Ganjil'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Bentuk Soal:</span>{' '}
              <span className="font-semibold text-slate-800">{currentQ.jenis}</span>
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 border-b border-slate-300">
            <span className="font-bold text-slate-700">Materi Pokok:</span>{' '}
            <span className="text-slate-800">{currentQ.materi || currentQ.tujuanPembelajaran}</span>
          </div>
          <div className="p-2.5 bg-white">
            <span className="font-bold text-slate-700">Tujuan Pembelajaran:</span>{' '}
            <span className="text-slate-800">{currentQ.tujuanPembelajaran}</span>
          </div>
        </div>

        {/* Question Components Table */}
        <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
          {/* Row: Nomor, Indikator, Level */}
          <div className="grid grid-cols-12 divide-x divide-slate-300 bg-emerald-900 text-white font-bold p-2 text-center">
            <div className="col-span-2">Nomor Soal</div>
            <div className="col-span-7">Indikator Soal</div>
            <div className="col-span-3">Level Kognitif & Bobot</div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-slate-300 bg-slate-50/50 p-3 border-b border-slate-300">
            <div className="col-span-2 text-center font-black text-lg text-emerald-900">
              {currentQ.nomor || currentIndex + 1}
            </div>
            <div className="col-span-7 text-slate-700 leading-relaxed">
              {currentQ.indikatorSoal || 'Disajikan stimulus, peserta didik dapat menyelesaikan permasalahan dengan benar.'}
            </div>
            <div className="col-span-3 text-center space-y-1">
              <div className="font-bold text-emerald-800">{currentQ.levelKognitif}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Skor Maksimal: <span className="font-bold text-slate-700">{currentQ.skor || 10}</span>
              </div>
            </div>
          </div>

          {/* Naskah Soal Box */}
          <div className="p-4 bg-white border-b border-slate-300 space-y-3">
            <div className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-emerald-900">
              Naskah Butir Soal:
            </div>

            {/* If has image */}
            {currentQ.image && currentQ.image.url && (
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <img
                  src={currentQ.image.url}
                  alt="Ilustrasi Soal"
                  className="max-h-48 mx-auto object-contain rounded"
                />
                {currentQ.image.caption && (
                  <p className="text-[10px] text-slate-500 italic mt-1 font-medium">
                    {currentQ.image.caption}
                  </p>
                )}
              </div>
            )}

            {/* Stimulus */}
            {currentQ.stimulus && (
              <div className="p-2.5 bg-slate-50 rounded border-l-3 border-emerald-600 italic text-slate-700">
                <MathView content={currentQ.stimulus} />
              </div>
            )}

            {/* Question Text */}
            <div className="text-sm font-semibold text-slate-900 leading-relaxed">
              <MathView content={currentQ.pertanyaan} />
            </div>

            {/* Options */}
            {currentQ.options && currentQ.options.length > 0 && (
              <div className="space-y-1 pl-4 pt-1">
                {currentQ.options.map((opt, i) => (
                  <div key={i} className="text-xs text-slate-800">
                    <MathView content={opt} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kunci & Pembahasan Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-300 bg-slate-50 p-4">
            <div className="col-span-4 pr-3">
              <div className="font-bold text-emerald-900 uppercase text-[11px] mb-1">
                Kunci Jawaban:
              </div>
              <div className="text-sm font-extrabold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                {currentQ.kunciJawaban}
              </div>
            </div>

            <div className="col-span-8 md:pl-3 pt-2 md:pt-0">
              <div className="font-bold text-slate-700 uppercase text-[11px] mb-1">
                Pedoman Penskoran / Pembahasan:
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                <MathView content={currentQ.pembahasan || 'Siswa menjawab tepat sesuai kaidah konsep materi.'} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="grid grid-cols-2 gap-8 mt-8 text-xs text-slate-700">
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
            <div className="font-semibold">Penyusun / Kord. Kurikulum</div>
            <div className="h-14" />
            <div className="font-bold underline">{settings.teacherName}</div>
            <div>NIP. {settings.teacherNIP}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
