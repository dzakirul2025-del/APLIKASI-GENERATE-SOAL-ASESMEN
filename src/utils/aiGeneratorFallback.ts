import { Question, JenisSoal, LevelKognitif, TingkatKesulitan, KarakterSoal } from '../types';

interface FallbackParams {
  jenjang?: string;
  fase?: string;
  kelas?: string;
  mapel?: string;
  semester?: string;
  kurikulum?: string;
  materi?: string;
  tujuanPembelajaran?: string;
  jumlahSoal?: number;
  tingkatKesulitan?: TingkatKesulitan;
  levelKognitif?: LevelKognitif;
  karakterSoal?: KarakterSoal;
  jenisSoal?: JenisSoal;
  startIndex?: number;
}

export function generateClientQuestionsFallback(opts: FallbackParams): Question[] {
  const {
    fase = 'B',
    kelas = '4',
    mapel = 'Matematika',
    semester = 'Ganjil',
    materi = 'Kompetensi Kurikulum Merdeka',
    tujuanPembelajaran = 'Menguasai capaian pembelajaran dengan analitis',
    jumlahSoal = 5,
    tingkatKesulitan = 'Sedang',
    levelKognitif = 'C3 Mengaplikasikan',
    karakterSoal = 'HOTS',
    jenisSoal = 'Pilihan Ganda',
    startIndex = 1,
  } = opts;

  const results: Question[] = [];
  const isMath = mapel.toLowerCase().includes('matematika');

  for (let i = 0; i < jumlahSoal; i++) {
    const num = startIndex + i;
    const n = i + 1;

    let questionStem = '';
    let options: string[] = [];
    let answerKey = 'A';
    let discussion = '';

    if (isMath) {
      if (num % 3 === 1) {
        questionStem = `Pak Ahmad menyalurkan donasi beras sebanyak $\\frac{${(n % 3) + 2}}{8}$ kuintal dan gula pasir sebanyak $\\frac{${(n % 2) + 1}}{4}$ kuintal untuk santunan siswa MIN 1 Paser. Berapakah total berat seluruh bantuan tersebut?`;
        options = [
          'A. $\\frac{7}{8}$ kuintal',
          'B. $\\frac{5}{8}$ kuintal',
          'C. $\\frac{3}{4}$ kuintal',
          'D. $\\frac{1}{2}$ kuintal',
        ];
        answerKey = 'A';
        discussion = 'Samakan penyebut pecahan ke perdelapan (KPK dari 8 dan 4), kemudian jumlahkan pembilangnya.';
      } else if (num % 3 === 2) {
        questionStem = `Bak penampungan air wudhu di MIN 1 Paser memiliki bentuk balok berukuran panjang $p = ${15 + n}\\text{ cm}$, lebar $l = 10\\text{ cm}$, dan tinggi $t = 8\\text{ cm}$. Hitunglah volume air maksimum yang dapat ditampung!`;
        options = [
          `A. ${(15 + n) * 80}\\text{ cm}^3`,
          `B. ${(15 + n) * 60}\\text{ cm}^3`,
          `C. ${(15 + n) * 50}\\text{ cm}^3`,
          `D. ${1200 + n * 10}\\text{ cm}^3`,
        ];
        answerKey = 'A';
        discussion = 'Gunakan rumus volume balok $V = p \\times l \\times t = (' + (15 + n) + ') \\times 10 \\times 8 = ' + ((15 + n) * 80) + '\\text{ cm}^3$.';
      } else {
        questionStem = `Hasil perhitungan dari operasi campuran $25\\% \\times ${100 + n * 20} + \\frac{1}{2} \\times 40$ adalah ...`;
        options = [
          `A. ${(100 + n * 20) * 0.25 + 20}`,
          `B. ${(100 + n * 20) * 0.25 + 10}`,
          `C. ${50 + n * 5}`,
          `D. ${65 + n * 3}`,
        ];
        answerKey = 'A';
        discussion = 'Hitung perkalian terlebih dahulu: $25\\% \\times ' + (100 + n * 20) + ' = ' + ((100 + n * 20) * 0.25) + '$, lalu jumlahkan dengan $20$.';
      }
    } else {
      questionStem = `Dalam pembelajaran ${mapel} materi "${materi}", peserta didik kelas ${kelas} diminta menganalisis fenomena kehidupan sehari-hari (studi kasus ${num}). Berdasarkan konsep Kurikulum Merdeka, tindakan atau kesimpulan manakah yang paling tepat?`;
      options = [
        `A. Menjelaskan, menganalisis, dan menerapkan prinsip ${materi} secara terpadu dan bertanggung jawab`,
        `B. Mengabaikan aturan dan konsep dasar dalam situasi nyata di lingkungan sekolah`,
        `C. Menghafal definisi teoritis tanpa memahami hubungan kausalitas dan dampaknya`,
        `D. Menyerahkan seluruh penyelesaian masalah tanpa melakukan refleksi dan telaah mandiri`,
      ];
      answerKey = 'A';
      discussion = `Berdasarkan tujuan pembelajaran: "${tujuanPembelajaran}", peserta didik diharapkan mampu berpikir kritis dan mengaplikasikan konsep ${materi} secara kontekstual.`;
    }

    if (jenisSoal === 'Isian Singkat') {
      questionStem = isMath
        ? `Tentukan hasil pembagian pecahan sederhana dari $\\frac{${n + 3}}{4} : \\frac{${n + 3}}{4}$!`
        : `Sebutkan istilah pokok atau nilai utama dalam pembelajaran ${mapel} pada topik "${materi}" yang mencerminkan profil pelajar Pancasila!`;
      options = [];
      answerKey = isMath ? '1' : `${materi}`;
      discussion = `Jawaban tepat dan terarah sesuai konsep dasar materi ${materi}.`;
    } else if (jenisSoal === 'Essay/Uraian' || jenisSoal === 'Essay HOTS') {
      questionStem = `Jelaskan secara mendalam dan berikan minimal 2 contoh konkret penerapan materi "${materi}" dalam kehidupan sehari-hari siswa madrasah kelas ${kelas}!`;
      options = [];
      answerKey = `Rubrik: (1) Penjelasan konsep ${materi} yang tepat (skor 10); (2) Dua contoh konkret yang relevan dan aplikatif di madrasah/rumah (skor 10). Total skor: 20.`;
      discussion = `Uraian komprehensif mengukur kemampuan penalaran analitis (C4-C6) siswa sesuai capaian fase Kurikulum Merdeka.`;
    } else if (jenisSoal === 'Benar dan Salah') {
      questionStem = `Pernyataan: "Penerapan konsep ${materi} secara tepat memberikan dampak positif bagi kebiasaan belajar dan kerjasama di MIN 1 Paser."`;
      options = ['A. Benar', 'B. Salah'];
      answerKey = 'A';
      discussion = `Pernyataan tersebut bernilai Benar sesuai dengan kompetensi capaian ${materi}.`;
    }

    results.push({
      id: `fallback-q-${Date.now()}-${num}`,
      nomor: num,
      pertanyaan: questionStem,
      jenis: jenisSoal,
      options: options.length > 0 ? options : undefined,
      kunciJawaban: answerKey,
      pembahasan: discussion,
      tujuanPembelajaran,
      indikatorSoal: `Disajikan stimulus kontekstual, peserta didik dapat menuntaskan evaluasi ${materi} nomor ${num} dengan tepat.`,
      levelKognitif,
      tingkatKesulitan,
      karakter: karakterSoal,
      skor: jenisSoal.includes('Essay') ? 15 : jenisSoal === 'Isian Singkat' ? 5 : 2,
      mapel,
      kelas,
      fase,
      semester,
      createdAt: new Date().toISOString(),
    });
  }

  return results;
}
