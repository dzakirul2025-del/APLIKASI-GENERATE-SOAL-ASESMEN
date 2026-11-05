export type TingkatKesulitan = 'Mudah' | 'Sedang' | 'Sulit' | 'Campuran';

export type LevelKognitif =
  | 'C1 Mengingat'
  | 'C2 Memahami'
  | 'C3 Mengaplikasikan'
  | 'C4 Menganalisis'
  | 'C5 Mengevaluasi'
  | 'C6 Mencipta';

export type KarakterSoal = 'LOTS' | 'MOTS' | 'HOTS' | 'Campuran';

export type JenisSoal =
  | 'Pilihan Ganda'
  | 'Pilihan Ganda Kompleks'
  | 'Benar dan Salah'
  | 'Menjodohkan'
  | 'Isian Singkat'
  | 'Essay/Uraian'
  | 'Essay HOTS'
  | 'Soal Studi Kasus'
  | 'Soal Literasi'
  | 'Soal Numerasi'
  | 'Soal Berbasis Gambar'
  | 'Soal Analisis Tabel'
  | 'Soal Analisis Grafik'
  | 'Soal Berbasis Wacana'
  | 'Soal Berbasis Ilustrasi';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuestionImage {
  url: string; // base64 or remote URL
  caption?: string;
  widthPercent?: number; // e.g. 50, 75, 100
  position?: 'center' | 'left' | 'right';
  placement?: 'above_stem' | 'below_stem' | 'options';
}

export interface Question {
  id: string;
  nomor: number;
  pertanyaan: string;
  stimulus?: string;
  jenis: JenisSoal;
  options?: string[];
  kunciJawaban: string;
  pembahasan: string;
  tujuanPembelajaran: string;
  capaianPembelajaran?: string;
  materi?: string;
  indikatorSoal: string;
  levelKognitif: LevelKognitif | string;
  tingkatKesulitan: TingkatKesulitan | string;
  karakter?: KarakterSoal | string;
  skor: number;
  image?: QuestionImage;
  latexSnippet?: string;
  matchingPairs?: MatchingPair[];
  trueFalseStatement?: string;
  mapel?: string;
  kelas?: string;
  fase?: string;
  semester?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KisiKisiRow {
  nomor: number;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelKognitif: string;
  bentukSoal: string;
  nomorSoal: number;
  tingkatKesulitan: string;
  skor?: number;
}

export interface KisiKisi {
  id: string;
  title: string;
  mapel: string;
  kelas: string;
  fase: string;
  semester: string;
  jenisAsesmen: string;
  tahunPelajaran: string;
  rows: KisiKisiRow[];
  createdAt: string;
}

export interface AssessmentPackage {
  id: string;
  title: string;
  mapel: string;
  kelas: string;
  fase: string;
  semester: string;
  alokasiWaktu: number; // minutes
  tahunPelajaran: string;
  jenisAsesmen: string;
  petunjukPengerjaan: string[];
  questions: Question[];
  totalSkor: number;
  createdAt: string;
}

export interface GenerationHistory {
  id: string;
  timestamp: string;
  mapel: string;
  kelas: string;
  materi: string;
  jenisSoal: string;
  jumlahSoal: number;
  questions: Question[];
}

export interface AppSettings {
  madrasahName: string;
  madrasahAddress: string;
  headmasterName: string;
  headmasterNIP: string;
  teacherName: string;
  teacherNIP: string;
  academicYear: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
}

export interface QuestionAnalysisResult {
  skorKelayakan: number;
  statusKelayakan: string;
  kesesuaianMateri: string;
  kesesuaianKognitif: string;
  validitasKunci: string;
  kejelasanBahasa: string;
  kualitasDistraktor: string;
  catatanEvaluasi: string[];
  rekomendasiPerbaikan: string[];
  revisiSoal?: {
    pertanyaan: string;
    options?: string[];
    kunciJawaban: string;
    pembahasan: string;
  };
}
