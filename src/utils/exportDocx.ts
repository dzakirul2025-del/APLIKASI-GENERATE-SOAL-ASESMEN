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
  includeAnswers: boolean = false,
  includeDiscussion: boolean = false
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

// ==========================================
// 1. DOKUMEN KHUSUS: KUNCI JAWABAN & PEMBAHASAN (TERPISAH)
// ==========================================
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
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
          bold: true,
          size: 22,
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
          size: 26,
          color: '006A4E',
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: settings.madrasahAddress,
          italics: true,
          size: 18,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: `DOKUMEN KUNCI JAWABAN & PEMBAHASAN SOAL`,
          bold: true,
          size: 26,
          font: 'Times New Roman',
          underline: {},
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 250 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Semester: ${semester} | Total: ${questions.length} Butir Soal`,
          bold: true,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Quick Table for Multiple Choice Keys if exists
  const mcQuestions = questions.filter((q) => q.jenis.includes('Pilihan'));
  if (mcQuestions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: 'I. TABEL KUNCI JAWABAN PILIHAN GANDA CEPAT',
            bold: true,
            size: 22,
            font: 'Times New Roman',
            color: '006A4E',
          }),
        ],
      })
    );

    // Group in rows of 5 or 10
    const keyRows: TableRow[] = [];
    const chunkSize = 10;
    for (let i = 0; i < mcQuestions.length; i += chunkSize) {
      const slice = mcQuestions.slice(i, i + chunkSize);
      
      // Header row (Nomor Soal)
      keyRows.push(
        new TableRow({
          children: slice.map(
            (q) =>
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `No ${q.nomor}`,
                        bold: true,
                        size: 18,
                        font: 'Times New Roman',
                      }),
                    ],
                  }),
                ],
              })
          ),
        })
      );

      // Value row (Kunci Jawaban)
      keyRows.push(
        new TableRow({
          children: slice.map(
            (q) =>
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: q.kunciJawaban || '-',
                        bold: true,
                        size: 22,
                        color: '006A4E',
                        font: 'Times New Roman',
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
        rows: keyRows,
      })
    );
    children.push(new Paragraph({ text: '', spacing: { before: 200 } }));
  }

  // Detailed Discussion for each question
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 150 },
      children: [
        new TextRun({
          text: 'II. RINCIAN KUNCI JAWABAN & PEMBAHASAN LENGKAP SETIAP BUTIR SOAL',
          bold: true,
          size: 22,
          font: 'Times New Roman',
          color: '006A4E',
        }),
      ],
    })
  );

  questions.forEach((q) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: `Nomor ${q.nomor}. [${q.jenis}] – Level: ${q.levelKognitif || 'C3'} | Bobot: ${q.skor || 2}`,
            bold: true,
            size: 21,
            font: 'Times New Roman',
            color: '006A4E',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'Pertanyaan: ', bold: true, font: 'Times New Roman', size: 20 }),
          new TextRun({ text: q.pertanyaan, font: 'Times New Roman', size: 20 }),
        ],
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'Kunci Jawaban: ', bold: true, color: '006A4E', font: 'Times New Roman', size: 20 }),
          new TextRun({ text: `${q.kunciJawaban}`, bold: true, font: 'Times New Roman', size: 20 }),
        ],
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 120 },
        children: [
          new TextRun({ text: 'Pembahasan Konseptual: ', bold: true, italics: true, font: 'Times New Roman', size: 20 }),
          new TextRun({ text: q.pembahasan || 'Sesuai dengan konsep capaian Kurikulum Merdeka.', italics: true, font: 'Times New Roman', size: 20 }),
        ],
      })
    );
  });

  // Signature
  children.push(
    new Paragraph({ text: '', spacing: { before: 300 } }),
    new Table({
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
                new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Kepala MIN 1 Paser', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ text: '', spacing: { before: 700 } }),
                new Paragraph({ children: [new TextRun({ text: settings.headmasterName, bold: true, underline: {}, font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: `NIP. ${settings.headmasterNIP}`, font: 'Times New Roman', size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Tanah Grogot, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Penyusun / Kord. Kurikulum,', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ text: '', spacing: { before: 700 } }),
                new Paragraph({ children: [new TextRun({ text: settings.teacherName, bold: true, underline: {}, font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: `NIP. ${settings.teacherNIP}`, font: 'Times New Roman', size: 19 })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kunci_Jawaban_dan_Pembahasan_${mapel.replace(/\s+/g, '_')}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==========================================
// 2. DOKUMEN KHUSUS: PEDOMAN PENSKORAN & RUBRIK PENILAIAN (TERPISAH)
// ==========================================
export const exportRubrikDocx = async (
  title: string,
  mapel: string,
  kelas: string,
  semester: string,
  questions: Question[],
  settings: AppSettings
) => {
  const children: any[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
          bold: true,
          size: 22,
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
          size: 26,
          color: '006A4E',
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `PEDOMAN PENSKORAN & RUBRIK PENILAIAN ASESMEN`,
          bold: true,
          size: 24,
          font: 'Times New Roman',
          underline: {},
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 250 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Semester: ${semester}`,
          bold: true,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Rubrik Table
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        'No',
        'Bentuk Soal',
        'Indikator Kompetensi',
        'Kriteria & Kunci Jawaban',
        'Skor Maksimal',
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

  let totalSkorMaks = 0;

  questions.forEach((q) => {
    const skorItem = q.skor || (q.jenis.includes('Essay') ? 15 : q.jenis === 'Isian Singkat' ? 5 : 2);
    totalSkorMaks += skorItem;

    let kriteria = '';
    if (q.jenis.includes('Pilihan')) {
      kriteria = `Jawaban benar memilih opsi [${q.kunciJawaban}]: Skor ${skorItem}. Jawaban salah/kosong: Skor 0.`;
    } else if (q.jenis === 'Isian Singkat') {
      kriteria = `Menuliskan kata/istilah/angka "${q.kunciJawaban}" dengan benar: Skor ${skorItem}. Salah: Skor 0.`;
    } else {
      kriteria = `Rubrik Uraian:\n- Pemahaman konsep tepat & logis: Skor ${Math.round(skorItem * 0.5)}\n- Penjelasan lengkap & sistematis: Skor ${Math.round(skorItem * 0.3)}\n- Kesimpulan/contoh kontekstual: Skor ${Math.round(skorItem * 0.2)}\nKunci Jawaban Inti: ${q.kunciJawaban}`;
    }

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: String(q.nomor), alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: q.jenis, alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: q.indikatorSoal || q.tujuanPembelajaran || '-' })] }),
          new TableCell({ children: [new Paragraph({ text: kriteria })] }),
          new TableCell({ children: [new Paragraph({ text: String(skorItem), alignment: AlignmentType.CENTER })] }),
        ],
      })
    );
  });

  // Total Row
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'TOTAL SKOR MAKSIMAL = ',
                  bold: true,
                  size: 20,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: String(totalSkorMaks),
                  bold: true,
                  size: 20,
                  color: '006A4E',
                  font: 'Times New Roman',
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
      rows: tableRows,
    })
  );

  // Formula Perhitungan Nilai Akhir
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'RUMUS PENGHITUNGAN NILAI AKHIR (NA):',
          bold: true,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Nilai Akhir = (Skor Perolehan Peserta Didik / ${totalSkorMaks}) × 100`,
          bold: true,
          color: '006A4E',
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Signatures
  children.push(
    new Paragraph({ text: '', spacing: { before: 200 } }),
    new Table({
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
                new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Kepala MIN 1 Paser', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ text: '', spacing: { before: 700 } }),
                new Paragraph({ children: [new TextRun({ text: settings.headmasterName, bold: true, underline: {}, font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: `NIP. ${settings.headmasterNIP}`, font: 'Times New Roman', size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Tanah Grogot, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Guru Pengampu,', font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ text: '', spacing: { before: 700 } }),
                new Paragraph({ children: [new TextRun({ text: settings.teacherName, bold: true, underline: {}, font: 'Times New Roman', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: `NIP. ${settings.teacherNIP}`, font: 'Times New Roman', size: 19 })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rubrik_Penilaian_dan_Penskoran_${mapel.replace(/\s+/g, '_')}_MIN1PASER.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==========================================
// 3. DOKUMEN KHUSUS: KISI-KISI PENULISAN SOAL (DARI DAFTAR SOAL TERGENERATE)
// ==========================================
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
    tahunPelajaran: settings.academicYear,
    jenisAsesmen: title || 'Asesmen Sumatif Akhir Semester',
    rows: questions.map((q, idx) => ({
      nomor: idx + 1,
      capaianPembelajaran: q.tujuanPembelajaran || `Peserta didik menguasai materi ${mapel}`,
      tujuanPembelajaran: q.tujuanPembelajaran || `Menyelesaikan permasalahan ${mapel} pada butir ke-${idx + 1}`,
      materi: q.mapel || mapel,
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

