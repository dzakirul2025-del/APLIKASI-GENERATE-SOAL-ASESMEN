export interface MathPreset {
  category: string;
  name: string;
  latex: string;
  description: string;
}

export const MATH_PRESETS: MathPreset[] = [
  // Pecahan & Operasi
  {
    category: 'Pecahan',
    name: 'Penjumlahan Pecahan',
    latex: '\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}',
    description: 'Pecahan biasa dengan penyebut berbeda',
  },
  {
    category: 'Pecahan',
    name: 'Perkalian Pecahan',
    latex: '\\frac{3}{5} \\times \\frac{2}{7} = \\frac{6}{35}',
    description: 'Operasi perkalian pecahan',
  },
  {
    category: 'Pecahan',
    name: 'Pembagian Pecahan',
    latex: '\\frac{4}{5} \\div \\frac{2}{3} = \\frac{4}{5} \\times \\frac{3}{2} = \\frac{6}{5}',
    description: 'Operasi pembagian pecahan',
  },
  {
    category: 'Pecahan',
    name: 'Bilangan Campuran',
    latex: '2\\frac{1}{3} + 1\\frac{2}{5} = 3\\frac{11}{15}',
    description: 'Operasi pecahan campuran',
  },
  {
    category: 'Persentase & Desimal',
    name: 'Persen dari Bilangan',
    latex: '25\\% \\times 400 = \\frac{25}{100} \\times 400 = 100',
    description: 'Menghitung nilai persentase',
  },
  {
    category: 'Persentase & Desimal',
    name: 'Desimal ke Pecahan',
    latex: '0{,}75 = \\frac{75}{100} = \\frac{3}{4}',
    description: 'Konversi desimal ke pecahan biasa',
  },

  // Geometri & Pengukuran (MI)
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Volume Kubus',
    latex: 'V = s^3 = s \\times s \\times s',
    description: 'Rumus volume kubus',
  },
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Volume Balok',
    latex: 'V = p \\times l \\times t',
    description: 'Rumus volume balok',
  },
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Luas Persegi Panjang',
    latex: 'L = p \\times l',
    description: 'Rumus luas persegi panjang',
  },
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Luas Segitiga',
    latex: 'L = \\frac{1}{2} \\times a \\times t',
    description: 'Rumus luas segitiga',
  },
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Keliling & Luas Lingkaran',
    latex: 'K = 2 \\times \\pi \\times r, \\quad L = \\pi \\times r^2',
    description: 'Rumus lingkaran dengan jari-jari r',
  },
  {
    category: 'Geometri & Bangun Ruang',
    name: 'Sudut Siku-Siku',
    latex: '\\angle ABC = 90^\\circ',
    description: 'Notasi sudut derajat',
  },

  // Pangkat, Akar & Aljabar Sederhana
  {
    category: 'Akar & Pangkat',
    name: 'Pangkat Tiga',
    latex: '8^3 = 8 \\times 8 \\times 8 = 512',
    description: 'Pangkat tiga bilangan bulat',
  },
  {
    category: 'Akar & Pangkat',
    name: 'Akar Pangkat Dua',
    latex: '\\sqrt{144} = 12',
    description: 'Akar kuadrat',
  },
  {
    category: 'Akar & Pangkat',
    name: 'Akar Pangkat Tiga',
    latex: '\\sqrt[3]{512} = 8',
    description: 'Akar kubik',
  },
  {
    category: 'Aljabar & Rasio',
    name: 'Persamaan Linear Sederhana',
    latex: '2x + 5 = 15 \\implies 2x = 10 \\implies x = 5',
    description: 'Penyelesaian nilai x',
  },
  {
    category: 'Aljabar & Rasio',
    name: 'Perbandingan / Rasio',
    latex: '\\frac{A}{B} = \\frac{3}{4} \\iff A : B = 3 : 4',
    description: 'Konsep rasio nilai',
  },
];
