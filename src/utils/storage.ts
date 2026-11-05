import { Question, KisiKisi, AssessmentPackage, GenerationHistory, AppSettings } from '../types';

const STORAGE_KEYS = {
  QUESTIONS: 'min1paser_questions',
  BLUEPRINTS: 'min1paser_blueprints',
  PACKAGES: 'min1paser_packages',
  HISTORY: 'min1paser_history',
  SETTINGS: 'min1paser_settings',
};

export const DEFAULT_SETTINGS: AppSettings = {
  madrasahName: 'MIN 1 PASER',
  madrasahAddress: 'Jl. Kusuma Bangsa Km. 1, Tanah Grogot, Paser, Kalimantan Timur',
  headmasterName: 'Ismail, S.Ag',
  headmasterNIP: '197406122005011004',
  teacherName: 'Dzakirul Husni, S.Pd',
  teacherNIP: '199205102020121008',
  academicYear: '2026/2027',
  supabaseUrl: '',
  supabaseAnonKey: '',
  isSupabaseConfigured: false,
};

// High quality initial seed questions for MIN 1 PASER
export const SEED_QUESTIONS: Question[] = [
  {
    id: 'seed-1',
    nomor: 1,
    pertanyaan: 'Pak Ahmad mempunyai sebidang kebun madrasah. Seluas $\\frac{2}{3}$ bagian ditanami jagung dan $\\frac{1}{4}$ bagian ditanami cabai. Berapa bagian luas total kebun yang sudah ditanami?',
    jenis: 'Pilihan Ganda',
    options: [
      'A. $\\frac{11}{12}$ bagian',
      'B. $\\frac{3}{7}$ bagian',
      'C. $\\frac{3}{12}$ bagian',
      'D. $\\frac{8}{12}$ bagian',
    ],
    kunciJawaban: 'A',
    pembahasan: 'Samakan penyebut 3 dan 4 (KPK = 12): $\\frac{2}{3} = \\frac{8}{12}$ dan $\\frac{1}{4} = \\frac{3}{12}$. Maka totalnya adalah $\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$.',
    tujuanPembelajaran: 'Menyelesaikan masalah penjumlahan dua pecahan dengan penyebut berbeda dalam kehidupan sehari-hari.',
    indikatorSoal: 'Disajikan soal cerita, peserta didik dapat menghitung hasil penjumlahan dua pecahan berpenyebut tidak sama dengan benar.',
    levelKognitif: 'C3 Mengaplikasikan',
    tingkatKesulitan: 'Sedang',
    karakter: 'MOTS',
    skor: 10,
    mapel: 'Matematika',
    kelas: '4',
    fase: 'B',
    semester: 'Ganjil',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    nomor: 2,
    pertanyaan: 'Sebuah bak penampungan air wudhu di mushola MIN 1 Paser berbentuk kubus dengan panjang rusuk bagian dalam $s = 80\\text{ cm}$. Hitunglah volume air maksimum yang dapat ditampung bak tersebut!',
    stimulus: 'Rumus volume kubus adalah $V = s^3 = s \\times s \\times s$.',
    jenis: 'Pilihan Ganda',
    options: [
      'A. $512.000\\text{ cm}^3$',
      'B. $64.000\\text{ cm}^3$',
      'C. $240\\text{ cm}^3$',
      'D. $25.600\\text{ cm}^3$',
    ],
    kunciJawaban: 'A',
    pembahasan: 'Gunakan rumus volume kubus: $V = s^3 = 80 \\times 80 \\times 80 = 512.000\\text{ cm}^3$ (setara dengan 512 liter).',
    tujuanPembelajaran: 'Menghitung volume bangun ruang kubus menggunakan konsep pangkat tiga.',
    indikatorSoal: 'Disajikan ukuran rusuk kubus dalam konteks fasilitas madrasah, peserta didik dapat menghitung volume kubus dengan tepat.',
    levelKognitif: 'C3 Mengaplikasikan',
    tingkatKesulitan: 'Sedang',
    karakter: 'MOTS',
    skor: 10,
    mapel: 'Matematika',
    kelas: '5',
    fase: 'C',
    semester: 'Genap',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    nomor: 3,
    pertanyaan: 'Perhatikan fungsi organ pernapasan berikut!\n1. Menyaring kotoran dan debu halus dari udara luar.\n2. Menyesuaikan suhu dan kelembaban udara yang masuk ke paru-paru.\n3. Tempat pertukaran gas oksigen ($O_2$) dan karbondioksida ($CO_2$).\n\nOrgan manakah yang menjalankan fungsi nomor 1 dan 2 secara spesifik?',
    jenis: 'Pilihan Ganda',
    options: [
      'A. Rongga hidung',
      'B. Alveolus',
      'C. Bronkus',
      'D. Trakea',
    ],
    kunciJawaban: 'A',
    pembahasan: 'Rongga hidung memiliki rambut hidung dan selaput lendir yang berfungsi menyaring partikel debu serta menghangatkan dan melembabkan udara pernapasan.',
    tujuanPembelajaran: 'Menganalisis keterkaitan fungsi organ pernapasan manusia dan mekanisme kerjanya.',
    indikatorSoal: 'Disajikan deskripsi fungsi alat pernapasan, peserta didik dapat mengidentifikasi nama organ yang sesuai.',
    levelKognitif: 'C4 Menganalisis',
    tingkatKesulitan: 'Sedang',
    karakter: 'HOTS',
    skor: 10,
    mapel: 'IPAS',
    kelas: '5',
    fase: 'C',
    semester: 'Ganjil',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    nomor: 4,
    pertanyaan: 'Mengapa ketika berwudhu kita dianjurkan untuk tidak berlebih-lebihan dalam menggunakan air, meskipun kita sedang berada di tepi sungai yang mengalir deras? Jelaskan berdasarkan nilai adab dan ajaran Rasulullah SAW!',
    jenis: 'Essay HOTS',
    options: [],
    kunciJawaban: 'Karena Islam mengajarkan perilaku hemat (iqtishad), menjaga kelestarian alam, menjauhi sifat tabdzir (boros/sia-sia), dan mematuhi sunnah Nabi Muhammad SAW yang melarang israf dalam ibadah.',
    pembahasan: 'Rubrik penilaian:\n- Skor 15: Menjelaskan aspek adab kesederhanaan, dalil larangan israf (boros), dan dampak ekologis hemat air secara komprehensif.\n- Skor 10: Menjelaskan larangan boros dan hemat air secara umum.\n- Skor 5: Jawaban singkat kurang elaborasi.',
    tujuanPembelajaran: 'Menunjukkan pemahaman tentang adab bersuci dan pencegahan perilaku tabdzir dalam kehidupan sehari-hari.',
    indikatorSoal: 'Disajikan konteks wudhu, peserta didik dapat mengemukakan argumentasi logis mengenai larangan berlebih-lebihan dalam berwudhu.',
    levelKognitif: 'C5 Mengevaluasi',
    tingkatKesulitan: 'Sulit',
    karakter: 'HOTS',
    skor: 15,
    mapel: 'Fikih',
    kelas: '4',
    fase: 'B',
    semester: 'Ganjil',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-5',
    nomor: 5,
    pertanyaan: 'Siswa kelas 4 MIN 1 Paser mengadakan musyawarah pemilihan ketua kelas. Salman terpilih secara demokratis. Ahmad yang sebelumnya mencalonkan diri merasa kecewa. Tindakan apa yang paling tepat dilakukan oleh Ahmad sesuai pengamalan Sila ke-4 Pancasila?',
    jenis: 'Soal Studi Kasus',
    options: [
      'A. Menerima keputusan dengan lapang dada dan siap bekerja sama mendukung kepengurusan Salman',
      'B. Meminta musyawarah diulang hingga dirinya memperoleh suara terbanyak',
      'C. Tidak mau terlibat dalam kegiatan kelas selama Salman menjabat',
      'D. Mengajukan protes kepada wali kelas agar pemilihan dibatalkan',
    ],
    kunciJawaban: 'A',
    pembahasan: 'Sila ke-4 mengamanatkan agar setiap warga negara menghormati dan menjunjung tinggi setiap keputusan musyawarah dengan iktikad baik dan rasa tanggung jawab.',
    tujuanPembelajaran: 'Menerapkan nilai-nilai musyawarah untuk mufakat dalam lingkungan madrasah.',
    indikatorSoal: 'Disajikan narasi studi kasus musyawarah kelas, peserta didik dapat menentukan sikap kesatria yang mencerminkan pengamalan sila ke-4.',
    levelKognitif: 'C3 Mengaplikasikan',
    tingkatKesulitan: 'Sedang',
    karakter: 'MOTS',
    skor: 10,
    mapel: 'Pendidikan Pancasila',
    kelas: '4',
    fase: 'B',
    semester: 'Ganjil',
    createdAt: new Date().toISOString(),
  },
];

export const getQuestions = (): Question[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
      return SEED_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading questions from storage:', e);
    return SEED_QUESTIONS;
  }
};

export const saveQuestions = (questions: Question[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.error('Error saving questions to storage:', e);
  }
};

export const addQuestions = (newQuestions: Question[]) => {
  const current = getQuestions();
  const updated = [...newQuestions, ...current];
  saveQuestions(updated);
  return updated;
};

export const updateQuestion = (updatedQ: Question) => {
  const current = getQuestions();
  const updated = current.map((q) => (q.id === updatedQ.id ? updatedQ : q));
  saveQuestions(updated);
  return updated;
};

export const deleteQuestion = (id: string) => {
  const current = getQuestions();
  const updated = current.filter((q) => q.id !== id);
  saveQuestions(updated);
  return updated;
};

// Blueprints (Kisi-Kisi)
export const getBlueprints = (): KisiKisi[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveBlueprint = (blueprint: KisiKisi) => {
  const current = getBlueprints();
  const exists = current.findIndex((b) => b.id === blueprint.id);
  let updated: KisiKisi[];
  if (exists >= 0) {
    updated = current.map((b) => (b.id === blueprint.id ? blueprint : b));
  } else {
    updated = [blueprint, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(updated));
  return updated;
};

export const deleteBlueprint = (id: string) => {
  const current = getBlueprints();
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(updated));
  return updated;
};

// Packages (Paket Asesmen)
export const getPackages = (): AssessmentPackage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const savePackage = (pkg: AssessmentPackage) => {
  const current = getPackages();
  const exists = current.findIndex((p) => p.id === pkg.id);
  let updated: AssessmentPackage[];
  if (exists >= 0) {
    updated = current.map((p) => (p.id === pkg.id ? pkg : p));
  } else {
    updated = [pkg, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(updated));
  return updated;
};

export const deletePackage = (id: string) => {
  const current = getPackages();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(updated));
  return updated;
};

// History
export const getHistory = (): GenerationHistory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addHistory = (item: GenerationHistory) => {
  const current = getHistory();
  const updated = [item, ...current].slice(0, 50); // keep last 50
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return updated;
};

// App Settings
export const getSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    // Auto-migrate if previous placeholder existed
    if (merged.headmasterName === 'Drs. H. M. Syukri, M.Pd.' || !merged.headmasterName) {
      merged.headmasterName = 'Ismail, S.Ag';
    }
    if (merged.teacherName === 'Dzakirul Husni, S.Pd.' || !merged.teacherName) {
      merged.teacherName = 'Dzakirul Husni, S.Pd';
    }
    return merged;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
