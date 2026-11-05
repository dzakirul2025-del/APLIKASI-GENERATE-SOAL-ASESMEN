import * as XLSX from 'xlsx';
import { KisiKisi, Question } from '../types';

export const exportKisiKisiToExcel = (blueprint: KisiKisi) => {
  const data = blueprint.rows.map((row) => ({
    'No': row.nomor,
    'Capaian Pembelajaran': row.capaianPembelajaran,
    'Tujuan Pembelajaran': row.tujuanPembelajaran,
    'Materi Pokok': row.materi,
    'Indikator Soal': row.indikatorSoal,
    'Level Kognitif': row.levelKognitif,
    'Bentuk Soal': row.bentukSoal,
    'Nomor Soal': row.nomorSoal,
    'Tingkat Kesulitan': row.tingkatKesulitan,
    'Skor Maksimal': row.skor ?? 1,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 30 },
    { wch: 30 },
    { wch: 25 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
    { wch: 15 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kisi-Kisi Soal');

  const fileName = `Kisi_Kisi_${blueprint.mapel.replace(/\s+/g, '_')}_Kelas_${blueprint.kelas}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportBankSoalToExcel = (questions: Question[], filterTitle: string = 'Bank_Soal') => {
  const data = questions.map((q, idx) => ({
    'No': idx + 1,
    'Mata Pelajaran': q.mapel || '-',
    'Kelas': q.kelas || '-',
    'Bentuk Soal': q.jenis,
    'Naskah Pertanyaan': q.pertanyaan,
    'Pilihan A': q.options?.[0] || '',
    'Pilihan B': q.options?.[1] || '',
    'Pilihan C': q.options?.[2] || '',
    'Pilihan D': q.options?.[3] || '',
    'Kunci Jawaban': q.kunciJawaban,
    'Pembahasan': q.pembahasan,
    'Level Kognitif': q.levelKognitif,
    'Tingkat Kesulitan': q.tingkatKesulitan,
    'Indikator Soal': q.indikatorSoal,
    'Tujuan Pembelajaran': q.tujuanPembelajaran,
    'Bobot Skor': q.skor,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 8 },
    { wch: 18 },
    { wch: 50 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 12 },
    { wch: 40 },
    { wch: 18 },
    { wch: 15 },
    { wch: 35 },
    { wch: 35 },
    { wch: 10 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank Soal');

  const fileName = `${filterTitle.replace(/\s+/g, '_')}_MIN1PASER.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
