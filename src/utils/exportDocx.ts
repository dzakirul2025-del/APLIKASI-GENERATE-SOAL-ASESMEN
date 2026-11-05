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
} from 'docx';
import { Question, KisiKisi, AppSettings } from '../types';

export const exportQuestionsToDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings,
  includeAnswers: boolean = true,
  includeDiscussion: boolean = true
) => {
  const children: any[] = [];

  // Kop Surat MIN 1 Paser
  const kopHeader = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.DOUBLE, size: 6, color: '006A4E' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                    bold: true,
                    size: 24, // 12pt
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'KANTOR KEMENTERIAN AGAMA KABUPATEN PASER',
                    bold: true,
                    size: 24,
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: settings.madrasahName.toUpperCase(),
                    bold: true,
                    size: 28, // 14pt
                    color: '006A4E',
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: settings.madrasahAddress,
                    size: 18, // 9pt
                    italics: true,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(kopHeader);
  children.push(new Paragraph({ text: '', spacing: { before: 200 } }));

  // Title of assessment
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 26,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Metadata Table
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Mata Pelajaran\t: ', bold: true, font: 'Times New Roman', size: 22 }),
                  new TextRun({ text: mapel, font: 'Times New Roman', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Kelas / Semester\t: ', bold: true, font: 'Times New Roman', size: 22 }),
                  new TextRun({ text: `${kelas} / ${semester}`, font: 'Times New Roman', size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Tahun Pelajaran\t: ', bold: true, font: 'Times New Roman', size: 22 }),
                  new TextRun({ text: settings.academicYear, font: 'Times New Roman', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Guru / Kord. Kurikulum\t: ', bold: true, font: 'Times New Roman', size: 22 }),
                  new TextRun({ text: settings.teacherName, font: 'Times New Roman', size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(metaTable);
  children.push(new Paragraph({ text: '', spacing: { before: 200 } }));

  // Instructions
  children.push(
    new Paragraph({
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: 'PETUNJUK UMUM:',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: 'Awali dengan membaca basmalah dan periksa kelengkapan naskah soal.',
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: 'Tuliskan nama dan nomor peserta Anda pada lembar jawaban yang tersedia.',
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'Periksa kembali seluruh jawaban sebelum diserahkan kepada pengawas ujian.',
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    })
  );

  // Divider Line
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'NASKAH SOAL EVALUASI',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Questions loop with Section Headers support (e.g. Bagian A: Pilihan Ganda, Bagian B: Isian, Bagian C: Essay)
  let currentSectionType = '';
  let sectionIndex = 0;
  const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  questions.forEach((q, idx) => {
    const num = q.nomor || idx + 1;

    // Check if new section begins
    if (q.jenis && q.jenis !== currentSectionType) {
      currentSectionType = q.jenis;
      const sectionLetter = sectionLetters[sectionIndex % sectionLetters.length];
      sectionIndex++;

      children.push(
        new Paragraph({
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: `BAGIAN ${sectionLetter}: SOAL ${currentSectionType.toUpperCase()}`,
              bold: true,
              size: 22,
              font: 'Times New Roman',
              color: '006A4E',
            }),
          ],
        })
      );
    }

    // Stimulus if available
    if (q.stimulus) {
      children.push(
        new Paragraph({
          spacing: { before: 150, after: 100 },
          children: [
            new TextRun({
              text: `Wacana / Stimulus Soal No. ${num}:`,
              bold: true,
              italics: true,
              size: 20,
              font: 'Times New Roman',
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: q.stimulus,
              italics: true,
              size: 20,
              font: 'Times New Roman',
            }),
          ],
        })
      );
    }

    // Question body
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: `${num}. `,
            bold: true,
            size: 22,
            font: 'Times New Roman',
          }),
          new TextRun({
            text: q.pertanyaan,
            size: 22,
            font: 'Times New Roman',
          }),
        ],
      })
    );

    // Options for Multiple Choice
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        children.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: opt,
                size: 21,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      });
    }

    // Matching pairs if applicable
    if (q.matchingPairs && q.matchingPairs.length > 0) {
      children.push(
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: 'Pasangkan pernyataan kiri dengan jawaban kanan yang sesuai:',
              italics: true,
              size: 20,
              font: 'Times New Roman',
            }),
          ],
        })
      );
      q.matchingPairs.forEach((pair, pIdx) => {
        children.push(
          new Paragraph({
            indent: { left: 600 },
            children: [
              new TextRun({
                text: `(${pIdx + 1}) ${pair.left}  <=====>  [  ] ${pair.right}`,
                size: 20,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      });
    }

    // Answer Key & Discussion section if enabled
    if (includeAnswers || includeDiscussion) {
      const solChildren: TextRun[] = [];
      if (includeAnswers) {
        solChildren.push(
          new TextRun({
            text: `[Kunci: ${q.kunciJawaban}] `,
            bold: true,
            color: '006A4E',
            size: 20,
            font: 'Times New Roman',
          })
        );
      }
      if (includeDiscussion && q.pembahasan) {
        solChildren.push(
          new TextRun({
            text: `Pembahasan: ${q.pembahasan}`,
            italics: true,
            color: '555555',
            size: 19,
            font: 'Times New Roman',
          })
        );
      }

      children.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 50, after: 150 },
          children: solChildren,
        })
      );
    }
  });

  // Signature section
  children.push(new Paragraph({ text: '', spacing: { before: 400 } }));
  const sigTable = new Table({
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
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Kepala MIN 1 Paser', font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({ text: '', spacing: { before: 800 } }),
              new Paragraph({
                children: [
                  new TextRun({ text: settings.headmasterName, bold: true, underline: {}, font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `NIP. ${settings.headmasterNIP}`, font: 'Times New Roman', size: 20 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Tanah Grogot, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Guru Pengampu / Kord. Kurikulum,', font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({ text: '', spacing: { before: 800 } }),
              new Paragraph({
                children: [
                  new TextRun({ text: settings.teacherName, bold: true, underline: {}, font: 'Times New Roman', size: 21 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `NIP. ${settings.teacherNIP}`, font: 'Times New Roman', size: 20 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  children.push(sigTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'MIN 1 PASER – Asesmen Pembelajaran',
                    italics: true,
                    size: 16,
                    color: '888888',
                    font: 'Times New Roman',
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
                children: [
                  new TextRun({ text: 'Halaman ', size: 16, font: 'Times New Roman' }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    font: 'Times New Roman',
                  }),
                  new TextRun({ text: ' dari ', size: 16, font: 'Times New Roman' }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    font: 'Times New Roman',
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
  a.download = `${title.replace(/\s+/g, '_')}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportKisiKisiToDocx = async (blueprint: KisiKisi, settings: AppSettings) => {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        'No',
        'Capaian Pembelajaran',
        'Tujuan Pembelajaran',
        'Materi',
        'Indikator Soal',
        'Level',
        'Bentuk',
        'No Soal',
        'Kesulitan',
      ].map(
        (headerText) =>
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: headerText,
                    bold: true,
                    size: 18,
                    font: 'Times New Roman',
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
          new TableCell({ children: [new Paragraph({ text: String(row.nomor), alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: row.capaianPembelajaran })] }),
          new TableCell({ children: [new Paragraph({ text: row.tujuanPembelajaran })] }),
          new TableCell({ children: [new Paragraph({ text: row.materi })] }),
          new TableCell({ children: [new Paragraph({ text: row.indikatorSoal })] }),
          new TableCell({ children: [new Paragraph({ text: row.levelKognitif, alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: row.bentukSoal, alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: String(row.nomorSoal), alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: row.tingkatKesulitan, alignment: AlignmentType.CENTER })] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'KISI-KISI PENULISAN SOAL ASESMEN',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${settings.madrasahName} – ${blueprint.mapel} (Kelas ${blueprint.kelas} / ${blueprint.semester})`,
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kisi_Kisi_${blueprint.mapel.replace(/\s+/g, '_')}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
