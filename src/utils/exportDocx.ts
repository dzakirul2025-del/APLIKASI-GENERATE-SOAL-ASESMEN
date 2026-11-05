import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  Packer,
  VerticalAlign,
  LineRuleType,
} from 'docx';
import { Question, KisiKisi, AppSettings } from '../types';

/**
 * STANDAR TIPOGRAFI & TATA LETAK RESMI KEMENAG / MIN 1 PASER:
 * 1. Font Family: Times New Roman (standar dokumen kedinasan/akademik).
 * 2. Ukuran Font:
 *    - Kop Judul Utama: 14pt (size 28), bold
 *    - Kop Instansi: 12pt (size 24), bold
 *    - Judul Dokumen: 14pt (size 28), bold, spasi teratur
 *    - Subjudul / Bagian: 12pt (size 24), bold
 *    - Teks Batang Soal: 11.5pt (size 23) atau 12pt (size 24), rata kiri-kanan (JUSTIFIED)
 *    - Opsi Jawaban: 11pt (size 22), rata kiri (LEFT) dengan tab/indent terukur
 *    - Petunjuk & Stimulus: 11pt (size 22), rata kiri-kanan (JUSTIFIED)
 *    - Keterangan & Footer: 10pt (size 20)
 * 3. Paragraf & Rata:
 *    - Alignment: AlignmentType.JUSTIFIED untuk teks isi narasi/soal/petunjuk
 *    - Spacing Rata Atas Bawah: Line spacing 1.15x (276) dengan before/after konsisten
 * 4. Margin Halaman A4 Resmi:
 *    - Atas (Top): 1440 twips (1.0 inch / 2.54 cm)
 *    - Bawah (Bottom): 1440 twips (1.0 inch / 2.54 cm)
 *    - Kiri (Left): 1440 twips (1.0 inch / 2.54 cm)
 *    - Kanan (Right): 1440 twips (1.0 inch / 2.54 cm)
 */

const FONT_FAMILY = 'Times New Roman';
const COLOR_PRIMARY = '006A4E'; // Hijau Kemenag
const COLOR_TEXT = '000000';
const COLOR_MUTED = '444444';

// Helper membuat Kop Surat Resmi
function createOfficialKopTable(settings: AppSettings): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.DOUBLE, size: 8, color: COLOR_PRIMARY },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 160, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40, line: 240 },
                children: [
                  new TextRun({
                    text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                    bold: true,
                    size: 24, // 12pt
                    font: FONT_FAMILY,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40, line: 240 },
                children: [
                  new TextRun({
                    text: 'KANTOR KEMENTERIAN AGAMA KABUPATEN PASER',
                    bold: true,
                    size: 24, // 12pt
                    font: FONT_FAMILY,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 60, line: 260 },
                children: [
                  new TextRun({
                    text: (settings.madrasahName || 'MADRASAH IBTIDAIYAH NEGERI 1 PASER').toUpperCase(),
                    bold: true,
                    size: 28, // 14pt
                    color: COLOR_PRIMARY,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 80, line: 220 },
                children: [
                  new TextRun({
                    text: settings.madrasahAddress || 'Jl. Kusuma Bangsa Km. 05 Tanah Grogot, Kabupaten Paser, Kalimantan Timur',
                    size: 19, // 9.5pt
                    italics: true,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Helper membuat Tabel Tanda Tangan Resmi
function createOfficialSignatureTable(settings: AppSettings, teacherRoleLabel: string = 'Guru Pengampu / Kord. Kurikulum,'): Table {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Kolom Kiri: Mengetahui Kepala Madrasah
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 100, left: 100, right: 100 },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: 'Mengetahui,', font: FONT_FAMILY, size: 22, color: COLOR_TEXT }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 700 }, // Ruang tanda tangan
                children: [
                  new TextRun({ text: 'Kepala Madrasah,', font: FONT_FAMILY, size: 22, bold: true, color: COLOR_TEXT }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: settings.headmasterName || 'Ismail, S.Ag',
                    bold: true,
                    underline: {},
                    font: FONT_FAMILY,
                    size: 23,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `NIP. ${settings.headmasterNIP || '197406122005011004'}`,
                    font: FONT_FAMILY,
                    size: 21,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
            ],
          }),
          // Kolom Kanan: Guru Pengampu
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 100, left: 100, right: 100 },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: `Tanah Grogot, ${currentDate}`,
                    font: FONT_FAMILY,
                    size: 22,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 700 },
                children: [
                  new TextRun({
                    text: teacherRoleLabel,
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: settings.teacherName || 'Dzakirul Husni, S.Pd',
                    bold: true,
                    underline: {},
                    font: FONT_FAMILY,
                    size: 23,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `NIP. ${settings.teacherNIP || '199205102020121008'}`,
                    font: FONT_FAMILY,
                    size: 21,
                    color: COLOR_TEXT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// =========================================================================
// 1. EKSPOR NASKAH SOAL SAJA (UNTUK SISWA - BERSIH TANPA KUNCI/PEMBAHASAN)
// =========================================================================
export const exportQuestionsToDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings,
  includeAnswers: boolean = false,
  includeDiscussion: boolean = false
) => {
  const children: any[] = [];

  // Kop Surat
  children.push(createOfficialKopTable(settings));
  children.push(new Paragraph({ text: '', spacing: { before: 140, after: 0 } }));

  // Judul Naskah Asesmen
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 60, line: 260 },
      children: [
        new TextRun({
          text: (title || 'NASKAH ASESMEN PEMBELAJARAN').toUpperCase(),
          bold: true,
          size: 26, // 13pt
          font: FONT_FAMILY,
          color: COLOR_TEXT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180, line: 240 },
      children: [
        new TextRun({
          text: `TAHUN AJARAN ${settings.academicYear || '2025/2026'}`,
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: COLOR_MUTED,
        }),
      ],
    })
  );

  // Tabel Identitas Lembar Soal (Rapi rata garis border tipis)
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '888888' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 60, right: 60 },
            children: [
              new Paragraph({
                spacing: { line: 260 },
                children: [
                  new TextRun({ text: 'Mata Pelajaran\t: ', bold: true, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: mapel, font: FONT_FAMILY, size: 22 }),
                ],
              }),
              new Paragraph({
                spacing: { line: 260 },
                children: [
                  new TextRun({ text: 'Kelas / Semester\t: ', bold: true, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: `${kelas} / ${semester}`, font: FONT_FAMILY, size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 60, right: 60 },
            children: [
              new Paragraph({
                spacing: { line: 260 },
                children: [
                  new TextRun({ text: 'Hari, Tanggal\t: ', bold: true, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: '....................................', font: FONT_FAMILY, size: 22 }),
                ],
              }),
              new Paragraph({
                spacing: { line: 260 },
                children: [
                  new TextRun({ text: 'Alokasi Waktu\t: ', bold: true, font: FONT_FAMILY, size: 22 }),
                  new TextRun({ text: '90 Menit', font: FONT_FAMILY, size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(metaTable);

  // Petunjuk Umum (Rata Kiri-Kanan / Justified dengan Spasi Rapi)
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: 'PETUNJUK UMUM:',
          bold: true,
          font: FONT_FAMILY,
          size: 22,
          color: COLOR_PRIMARY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      bullet: { level: 0 },
      spacing: { before: 20, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'Awali dengan membaca basmalah dan berdoa sebelum mulai mengerjakan naskah soal.',
          font: FONT_FAMILY,
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      bullet: { level: 0 },
      spacing: { before: 20, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'Tuliskan nama lengkap, nomor peserta, dan kelas pada lembar jawaban yang telah disediakan.',
          font: FONT_FAMILY,
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      bullet: { level: 0 },
      spacing: { before: 20, after: 40, line: 260 },
      children: [
        new TextRun({
          text: 'Bacalah setiap butir soal dengan cermat dan teliti sebelum menentukan jawaban.',
          font: FONT_FAMILY,
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      bullet: { level: 0 },
      spacing: { before: 20, after: 200, line: 260 },
      children: [
        new TextRun({
          text: 'Periksa kembali seluruh pekerjaan Anda sebelum diserahkan kepada pengawas ujian.',
          font: FONT_FAMILY,
          size: 21,
        }),
      ],
    })
  );

  // Header Bagian Soal
  let currentSectionType = '';
  let sectionIndex = 0;
  const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  questions.forEach((q, idx) => {
    const num = q.nomor || idx + 1;

    // Header pergantian bagian (Bagian A, B, C)
    if (q.jenis && q.jenis !== currentSectionType) {
      currentSectionType = q.jenis;
      const sectionLetter = sectionLetters[sectionIndex % sectionLetters.length];
      sectionIndex++;

      children.push(
        new Paragraph({
          spacing: { before: 300, after: 120, line: 280 },
          children: [
            new TextRun({
              text: `BAGIAN ${sectionLetter}: SOAL ${currentSectionType.toUpperCase()}`,
              bold: true,
              size: 24, // 12pt
              font: FONT_FAMILY,
              color: COLOR_PRIMARY,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 0, after: 140, line: 250 },
          children: [
            new TextRun({
              text: currentSectionType.includes('Pilihan')
                ? 'Petunjuk: Pilihlah salah satu jawaban yang paling tepat dengan memberi tanda silang (X) atau menghitamkan bulatan pada huruf A, B, C, atau D pada lembar jawaban!'
                : currentSectionType === 'Isian Singkat'
                ? 'Petunjuk: Isilah titik-titik di bawah ini dengan jawaban yang singkat, tepat, dan benar!'
                : 'Petunjuk: Jawablah pertanyaan-pertanyaan berikut dengan uraian yang jelas, sistematis, dan tepat!',
              italics: true,
              size: 20,
              font: FONT_FAMILY,
              color: COLOR_MUTED,
            }),
          ],
        })
      );
    }

    // Stimulus Wacana / Narasi (Rata Kiri-Kanan Justified + Indent)
    if (q.stimulus) {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60, line: 240 },
          children: [
            new TextRun({
              text: `Perhatikan teks / stimulus berikut untuk menjawab soal nomor ${num}:`,
              bold: true,
              italics: true,
              size: 21,
              font: FONT_FAMILY,
              color: COLOR_MUTED,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 400, right: 200 },
          spacing: { before: 40, after: 100, line: 260 },
          children: [
            new TextRun({
              text: q.stimulus,
              italics: true,
              size: 21,
              font: FONT_FAMILY,
              color: COLOR_TEXT,
            }),
          ],
        })
      );
    }

    // Batang Pertanyaan Soal (Rata Kiri-Kanan Justified dengan Spasi Atas Bawah Konsisten)
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 140, after: 70, line: 276 },
        children: [
          new TextRun({
            text: `${num}. `,
            bold: true,
            size: 23, // 11.5pt
            font: FONT_FAMILY,
            color: COLOR_TEXT,
          }),
          new TextRun({
            text: q.pertanyaan,
            size: 23,
            font: FONT_FAMILY,
            color: COLOR_TEXT,
          }),
        ],
      })
    );

    // Opsi Jawaban (Pilihan Ganda - Rata Kiri dengan indentasi teratur)
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            indent: { left: 450 },
            spacing: { before: 20, after: 40, line: 250 },
            children: [
              new TextRun({
                text: opt,
                size: 22, // 11pt
                font: FONT_FAMILY,
                color: COLOR_TEXT,
              }),
            ],
          })
        );
      });
    }

    // Menjodohkan / Pasangan jika ada
    if (q.matchingPairs && q.matchingPairs.length > 0) {
      children.push(
        new Paragraph({
          indent: { left: 450 },
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({
              text: 'Pasangkan butir di sebelah kiri dengan jawaban di sebelah kanan:',
              italics: true,
              size: 21,
              font: FONT_FAMILY,
            }),
          ],
        })
      );
      q.matchingPairs.forEach((pair, pIdx) => {
        children.push(
          new Paragraph({
            indent: { left: 650 },
            spacing: { before: 20, after: 30 },
            children: [
              new TextRun({
                text: `(${pIdx + 1}) ${pair.left}  \t<=====>\t [  ] ${pair.right}`,
                size: 21,
                font: FONT_FAMILY,
              }),
            ],
          })
        );
      });
    }

    // Hanya jika diinstruksikan menyertakan kunci (default: false / Soal Saja)
    if (includeAnswers || includeDiscussion) {
      const solRuns: TextRun[] = [];
      if (includeAnswers) {
        solRuns.push(
          new TextRun({
            text: `[Kunci: ${q.kunciJawaban}] `,
            bold: true,
            color: COLOR_PRIMARY,
            size: 21,
            font: FONT_FAMILY,
          })
        );
      }
      if (includeDiscussion && q.pembahasan) {
        solRuns.push(
          new TextRun({
            text: `Pembahasan: ${q.pembahasan}`,
            italics: true,
            color: COLOR_MUTED,
            size: 20,
            font: FONT_FAMILY,
          })
        );
      }
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 450 },
          spacing: { before: 60, after: 120, line: 250 },
          children: solRuns,
        })
      );
    }
  });

  // Tanda Tangan Pengesahan (Rata Kiri Kanan Kolom)
  children.push(new Paragraph({ text: '', spacing: { before: 350, after: 0 } }));
  children.push(createOfficialSignatureTable(settings, 'Guru Pengampu Mata Pelajaran,'));

  // Perakitan Dokumen Word Resmi A4
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inci / 2.54 cm
              bottom: 1440, // 1 inci / 2.54 cm
              left: 1440,   // 1 inci / 2.54 cm
              right: 1440,  // 1 inci / 2.54 cm
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: 'MIN 1 PASER – Naskah Soal Evaluasi Pembelajaran',
                    italics: true,
                    size: 18,
                    color: '777777',
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: 'Halaman ', size: 18, font: FONT_FAMILY, color: '666666' }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: FONT_FAMILY,
                    color: '666666',
                  }),
                  new TextRun({ text: ' dari ', size: 18, font: FONT_FAMILY, color: '666666' }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    font: FONT_FAMILY,
                    color: '666666',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Naskah_Soal_${mapel.replace(/\s+/g, '_')}_Kls${kelas}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =========================================================================
// 2. EKSPOR FILE TERPISAH: KUNCI JAWABAN & PEMBAHASAN RESMI
// =========================================================================
export const exportAnswerKeyAndDiscussionDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings
) => {
  const children: any[] = [];

  // Kop Surat
  children.push(createOfficialKopTable(settings));
  children.push(new Paragraph({ text: '', spacing: { before: 140, after: 0 } }));

  // Judul Dokumen
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 60, line: 260 },
      children: [
        new TextRun({
          text: 'DOKUMEN KUNCI JAWABAN & PEMBAHASAN LENGKAP',
          bold: true,
          size: 26,
          font: FONT_FAMILY,
          color: COLOR_TEXT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180, line: 240 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Semester: ${semester} | Total: ${questions.length} Butir Soal`,
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: COLOR_MUTED,
        }),
      ],
    })
  );

  // Bagian I: Tabel Kunci Cepat Pilihan Ganda (Tersusun Rapi dan Simetris)
  const mcQuestions = questions.filter((q) => q.jenis.includes('Pilihan'));
  if (mcQuestions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 160, after: 100 },
        children: [
          new TextRun({
            text: 'I. TABEL KUNCI JAWABAN PILIHAN GANDA (PENGOREKSIAN CEPAT)',
            bold: true,
            size: 24,
            font: FONT_FAMILY,
            color: COLOR_PRIMARY,
          }),
        ],
      })
    );

    const keyRows: TableRow[] = [];
    const chunkSize = 10;
    for (let i = 0; i < mcQuestions.length; i += chunkSize) {
      const slice = mcQuestions.slice(i, i + chunkSize);

      keyRows.push(
        new TableRow({
          children: slice.map(
            (q) =>
              new TableCell({
                margins: { top: 60, bottom: 60, left: 40, right: 40 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `No ${q.nomor}`,
                        bold: true,
                        size: 20,
                        font: FONT_FAMILY,
                      }),
                    ],
                  }),
                ],
              })
          ),
        }),
        new TableRow({
          children: slice.map(
            (q) =>
              new TableCell({
                margins: { top: 80, bottom: 80, left: 40, right: 40 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: q.kunciJawaban || '-',
                        bold: true,
                        size: 24,
                        color: COLOR_PRIMARY,
                        font: FONT_FAMILY,
                      }),
                    ],
                  }),
                ],
              })
          ),
        })
      );
    }

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
          left: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
          right: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        },
        rows: keyRows,
      }),
      new Paragraph({ text: '', spacing: { before: 180 } })
    );
  }

  // Bagian II: Rincian Pembahasan Lengkap Per Butir Soal (Rata Kiri-Kanan Justified)
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'II. RINCIAN KUNCI JAWABAN & PEMBAHASAN KONSEPTUAL SETIAP BUTIR SOAL',
          bold: true,
          size: 24,
          font: FONT_FAMILY,
          color: COLOR_PRIMARY,
        }),
      ],
    })
  );

  questions.forEach((q) => {
    children.push(
      // Nomor & Metadata Soal
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [
          new TextRun({
            text: `Soal Nomor ${q.nomor} `,
            bold: true,
            size: 22,
            font: FONT_FAMILY,
            color: COLOR_PRIMARY,
          }),
          new TextRun({
            text: `[${q.jenis} | Level: ${q.levelKognitif || 'C3'} | Kesulitan: ${q.tingkatKesulitan || 'Sedang'} | Bobot: ${q.skor || 2} Poin]`,
            bold: true,
            size: 20,
            font: FONT_FAMILY,
            color: COLOR_MUTED,
          }),
        ],
      }),
      // Naskah Pertanyaan (Justified)
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 300 },
        spacing: { before: 20, after: 50, line: 260 },
        children: [
          new TextRun({ text: 'Naskah Soal: ', bold: true, font: FONT_FAMILY, size: 21 }),
          new TextRun({ text: q.pertanyaan, font: FONT_FAMILY, size: 21, color: COLOR_TEXT }),
        ],
      }),
      // Kunci Jawaban
      new Paragraph({
        alignment: AlignmentType.LEFT,
        indent: { left: 300 },
        spacing: { before: 20, after: 50, line: 260 },
        children: [
          new TextRun({ text: 'Kunci Jawaban: ', bold: true, font: FONT_FAMILY, size: 21, color: COLOR_PRIMARY }),
          new TextRun({ text: `${q.kunciJawaban}`, bold: true, font: FONT_FAMILY, size: 21, color: COLOR_TEXT }),
        ],
      }),
      // Pembahasan Konseptual (Justified)
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 300 },
        spacing: { before: 20, after: 120, line: 270 },
        children: [
          new TextRun({ text: 'Pembahasan: ', bold: true, italics: true, font: FONT_FAMILY, size: 21 }),
          new TextRun({
            text: q.pembahasan || 'Jawaban dianalisis berdasarkan capaian pembelajaran Kurikulum Merdeka.',
            italics: true,
            font: FONT_FAMILY,
            size: 21,
            color: COLOR_MUTED,
          }),
        ],
      })
    );
  });

  // Tanda Tangan
  children.push(new Paragraph({ text: '', spacing: { before: 350, after: 0 } }));
  children.push(createOfficialSignatureTable(settings, 'Penyusun / Kord. Kurikulum,'));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kunci_Jawaban_dan_Pembahasan_${mapel.replace(/\s+/g, '_')}_Kls${kelas}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =========================================================================
// 3. EKSPOR FILE TERPISAH: PEDOMAN PENSKORAN & RUBRIK PENILAIAN RESMI
// =========================================================================
export const exportRubrikDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings
) => {
  const children: any[] = [];

  // Kop Surat
  children.push(createOfficialKopTable(settings));
  children.push(new Paragraph({ text: '', spacing: { before: 140, after: 0 } }));

  // Judul Dokumen
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 60, line: 260 },
      children: [
        new TextRun({
          text: 'PEDOMAN PENSKORAN & RUBRIK PENILAIAN ASESMEN',
          bold: true,
          size: 26,
          font: FONT_FAMILY,
          color: COLOR_TEXT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180, line: 240 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Semester: ${semester}`,
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: COLOR_MUTED,
        }),
      ],
    })
  );

  // Tabel Rubrik Bergaris Lengkap & Rapi (Vertical Center)
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        { label: 'No', width: 6 },
        { label: 'Bentuk Soal', width: 18 },
        { label: 'Indikator Soal / Kompetensi', width: 36 },
        { label: 'Kriteria Penilaian & Kunci', width: 28 },
        { label: 'Skor Maks', width: 12 },
      ].map(
        (col) =>
          new TableCell({
            width: { size: col.width, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 60, right: 60 },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: col.label,
                    bold: true,
                    size: 20, // 10pt
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          })
      ),
    }),
  ];

  let totalSkorMaks = 0;

  questions.forEach((q) => {
    const skorItem = q.skor || (q.jenis.includes('Essay') ? 15 : q.jenis === 'Isian Singkat' ? 5 : 2);
    totalSkorMaks += skorItem;

    let kriteria = '';
    if (q.jenis.includes('Pilihan')) {
      kriteria = `Jawaban tepat opsi [${q.kunciJawaban}]: Skor ${skorItem}. Salah/kosong: Skor 0.`;
    } else if (q.jenis === 'Isian Singkat') {
      kriteria = `Menuliskan konsep "${q.kunciJawaban}": Skor ${skorItem}. Salah: Skor 0.`;
    } else {
      kriteria = `Jawaban konsep lengkap & logis: Skor ${skorItem}. Jawaban kurang lengkap: Skor ${Math.round(skorItem / 2)}. Kunci Inti: ${q.kunciJawaban}`;
    }

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 6, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: String(q.nomor), alignment: AlignmentType.CENTER, style: 'normal' })],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 60, right: 60 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: q.jenis, alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 36, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 60, right: 60 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: q.indikatorSoal || q.tujuanPembelajaran || '-', alignment: AlignmentType.JUSTIFIED })],
          }),
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 60, right: 60 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: kriteria, alignment: AlignmentType.JUSTIFIED })],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: String(skorItem), alignment: AlignmentType.CENTER })],
          }),
        ],
      })
    );
  });

  // Baris Total
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          margins: { top: 100, bottom: 100, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'TOTAL SKOR MAKSIMAL = ',
                  bold: true,
                  size: 21,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          margins: { top: 100, bottom: 100, left: 40, right: 40 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: String(totalSkorMaks),
                  bold: true,
                  size: 22,
                  color: COLOR_PRIMARY,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        left: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        right: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      },
      rows: tableRows,
    })
  );

  // Rumus Nilai Akhir
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 60 },
      children: [
        new TextRun({
          text: 'PENGHITUNGAN NILAI AKHIR (NA) PESERTA DIDIK:',
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: COLOR_PRIMARY,
        }),
      ],
    }),
    new Paragraph({
      indent: { left: 300 },
      spacing: { before: 20, after: 200, line: 260 },
      children: [
        new TextRun({
          text: `Nilai Akhir (Skala 100) = (Skor Perolehan Peserta Didik / ${totalSkorMaks}) × 100`,
          bold: true,
          color: COLOR_TEXT,
          size: 22,
          font: FONT_FAMILY,
        }),
      ],
    })
  );

  // Tanda Tangan
  children.push(new Paragraph({ text: '', spacing: { before: 350, after: 0 } }));
  children.push(createOfficialSignatureTable(settings, 'Guru Pengampu Mata Pelajaran,'));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rubrik_Penilaian_dan_Penskoran_${mapel.replace(/\s+/g, '_')}_Kls${kelas}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =========================================================================
// 4. EKSPOR FILE TERPISAH: KISI-KISI PENULISAN SOAL RESMI (LANDSCAPE A4)
// =========================================================================
export const exportKisiKisiToDocx = async (blueprint: KisiKisi, settings: AppSettings) => {
  const children: any[] = [];

  // Kop Surat
  children.push(createOfficialKopTable(settings));
  children.push(new Paragraph({ text: '', spacing: { before: 140, after: 0 } }));

  // Judul Kisi-kisi
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 60, line: 260 },
      children: [
        new TextRun({
          text: 'KISI-KISI PENULISAN SOAL ASESMEN PEMBELAJARAN',
          bold: true,
          size: 26,
          font: FONT_FAMILY,
          color: COLOR_TEXT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180, line: 240 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${blueprint.mapel} | Kelas: ${blueprint.kelas} (Fase ${blueprint.fase}) | Semester: ${blueprint.semester} | T.A: ${blueprint.tahunPelajaran || settings.academicYear}`,
          bold: true,
          size: 21,
          font: FONT_FAMILY,
          color: COLOR_MUTED,
        }),
      ],
    })
  );

  // Tabel Kisi-kisi Rapi Simetris
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        { label: 'No', width: 5 },
        { label: 'Capaian Pembelajaran (CP)', width: 22 },
        { label: 'Tujuan Pembelajaran (TP)', width: 20 },
        { label: 'Materi Pokok', width: 14 },
        { label: 'Indikator Soal', width: 21 },
        { label: 'Level', width: 6 },
        { label: 'Bentuk', width: 7 },
        { label: 'No Soal', width: 5 },
      ].map(
        (col) =>
          new TableCell({
            width: { size: col.width, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: col.label,
                    bold: true,
                    size: 19, // 9.5pt
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          })
      ),
    }),
  ];

  blueprint.rows.forEach((row) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 30, right: 30 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: String(row.nomor), alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.capaianPembelajaran, alignment: AlignmentType.JUSTIFIED })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.tujuanPembelajaran, alignment: AlignmentType.JUSTIFIED })],
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.materi, alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            width: { size: 21, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 40, right: 40 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.indikatorSoal, alignment: AlignmentType.JUSTIFIED })],
          }),
          new TableCell({
            width: { size: 6, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 20, right: 20 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.levelKognitif.split(' ')[0] || row.levelKognitif, alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 7, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 20, right: 20 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: row.bentukSoal === 'Pilihan Ganda' ? 'PG' : row.bentukSoal, alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 20, right: 20 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ text: String(row.nomorSoal), alignment: AlignmentType.CENTER })],
          }),
        ],
      })
    );
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        left: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        right: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      },
      rows: tableRows,
    })
  );

  // Tanda Tangan
  children.push(new Paragraph({ text: '', spacing: { before: 300, after: 0 } }));
  children.push(createOfficialSignatureTable(settings, 'Koordinator Kurikulum / Guru,'));

  // Format Standar A4
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kisi_Kisi_${blueprint.mapel.replace(/\s+/g, '_')}_Kls${blueprint.kelas}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =========================================================================
// 5. HELPER PEMBUATAN KISI-KISI DARI DAFTAR SOAL AKTIF
// =========================================================================
export const exportKisiKisiFromQuestionsToDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings
) => {
  const blueprint: KisiKisi = {
    id: `kk-${Date.now()}`,
    title: `Kisi-Kisi Soal Asesmen ${mapel}`,
    mapel,
    kelas,
    fase: Number(kelas) <= 2 ? 'A' : Number(kelas) <= 4 ? 'B' : 'C',
    semester,
    tahunPelajaran: settings.academicYear || '2025/2026',
    jenisAsesmen: title || 'Asesmen Sumatif Akhir Semester',
    rows: questions.map((q, idx) => ({
      nomor: idx + 1,
      capaianPembelajaran: q.capaianPembelajaran || q.tujuanPembelajaran || `Peserta didik menguasai materi ${mapel}`,
      tujuanPembelajaran: q.tujuanPembelajaran || `Menyelesaikan permasalahan ${mapel} pada butir ke-${idx + 1}`,
      materi: q.materi || q.mapel || mapel,
      indikatorSoal: q.indikatorSoal || `Disajikan soal, siswa dapat menentukan jawaban dengan benar`,
      levelKognitif: q.levelKognitif || 'C3 Mengaplikasikan',
      bentukSoal: q.jenis,
      nomorSoal: q.nomor || idx + 1,
      tingkatKesulitan: q.tingkatKesulitan || 'Sedang',
      skor: q.skor || 2,
    })),
    createdAt: new Date().toISOString(),
  };

  await exportKisiKisiToDocx(blueprint, settings);
};
