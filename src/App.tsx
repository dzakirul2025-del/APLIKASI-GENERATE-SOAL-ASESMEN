/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UserProfileModal } from './components/UserProfileModal';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';

// Views
import { DashboardView } from './views/DashboardView';
import { GenerateAiView } from './views/GenerateAiView';
import { ImageQuestionView } from './views/ImageQuestionView';
import { EquationEditorView } from './views/EquationEditorView';
import { KisiKisiView } from './views/KisiKisiView';
import { KartuSoalView } from './views/KartuSoalView';
import { BankSoalView } from './views/BankSoalView';
import { AssessmentPackageView } from './views/AssessmentPackageView';
import { AnalisisSoalView } from './views/AnalisisSoalView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';

// Types & Storage Utilities
import {
  Question,
  KisiKisi,
  AssessmentPackage,
  GenerationHistory,
  AppSettings,
} from './types';
import {
  getQuestions,
  saveQuestions,
  addQuestions,
  updateQuestion,
  deleteQuestion,
  getBlueprints,
  saveBlueprint,
  deleteBlueprint,
  getPackages,
  savePackage,
  deletePackage,
  getHistory,
  addHistory,
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  SEED_QUESTIONS,
} from './utils/storage';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // App Data States
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());
  const [blueprints, setBlueprints] = useState<KisiKisi[]>(() => getBlueprints());
  const [packages, setPackages] = useState<AssessmentPackage[]>(() => getPackages());
  const [history, setHistory] = useState<GenerationHistory[]>(() => getHistory());

  // Cross-view state transfer
  const [selectedQuestionForAnalysis, setSelectedQuestionForAnalysis] =
    useState<Question | null>(null);
  const [prefillMathLatex, setPrefillMathLatex] = useState<string>('');

  // Persist settings changes
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Questions Handlers
  const handleSaveNewQuestions = (newQuestions: Question[]) => {
    const updated = addQuestions(newQuestions);
    setQuestions(updated);

    // Also record in generation history
    if (newQuestions.length > 0) {
      const firstQ = newQuestions[0];
      const historyItem: GenerationHistory = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mapel: firstQ.mapel || 'Matematika',
        kelas: firstQ.kelas || '4',
        materi: firstQ.tujuanPembelajaran || 'Evaluasi AI',
        jenisSoal: firstQ.jenis,
        jumlahSoal: newQuestions.length,
        questions: newQuestions,
      };
      const updatedHist = addHistory(historyItem);
      setHistory(updatedHist);
    }
  };

  const handleUpdateQuestion = (q: Question) => {
    const updated = updateQuestion(q);
    setQuestions(updated);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = deleteQuestion(id);
    setQuestions(updated);
  };

  // Blueprint Handlers
  const handleSaveBlueprint = (bp: KisiKisi) => {
    const updated = saveBlueprint(bp);
    setBlueprints(updated);
  };

  const handleDeleteBlueprint = (id: string) => {
    const updated = deleteBlueprint(id);
    setBlueprints(updated);
  };

  // Package Handlers
  const handleSavePackage = (pkg: AssessmentPackage) => {
    const updated = savePackage(pkg);
    setPackages(updated);
  };

  const handleDeletePackage = (id: string) => {
    const updated = deletePackage(id);
    setPackages(updated);
  };

  // Quick Action: Send question to AI Analysis
  const handleRouteToAnalysis = (q: Question) => {
    setSelectedQuestionForAnalysis(q);
    setActiveTab('analisis-soal');
  };

  // Quick Action: Add question to Assessment Package
  const handleRouteToPackage = (q: Question) => {
    if (packages.length > 0) {
      const active = packages[0];
      const updated = {
        ...active,
        questions: [...active.questions, q],
        totalSkor: (active.totalSkor || 0) + (q.skor || 10),
      };
      handleSavePackage(updated);
    }
    setActiveTab('paket-asesmen');
  };

  // Quick Action: Send formula from Equation Editor to Question Generator
  const handleRouteToQuestionBuilderWithLatex = (latex: string) => {
    setPrefillMathLatex(latex);
    setActiveTab('generate-ai');
  };

  // Reset to default
  const handleResetDefaults = () => {
    saveQuestions(SEED_QUESTIONS);
    setQuestions(SEED_QUESTIONS);
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  };

  // Clear history
  const handleClearHistory = () => {
    localStorage.removeItem('min1paser_history');
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar (12 Menus) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={() => setProfileModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              questions={questions}
              blueprints={blueprints}
              packages={packages}
              history={history}
              settings={settings}
              setActiveTab={setActiveTab}
              onSelectQuestion={handleRouteToAnalysis}
            />
          )}

          {activeTab === 'generate-ai' && (
            <GenerateAiView
              onSaveQuestions={handleSaveNewQuestions}
              settings={settings}
              onAnalyzeQuestion={handleRouteToAnalysis}
              prefillMathLatex={prefillMathLatex}
            />
          )}

          {activeTab === 'generate-gambar' && (
            <ImageQuestionView
              onSaveQuestions={handleSaveNewQuestions}
              settings={settings}
              onAnalyzeQuestion={handleRouteToAnalysis}
            />
          )}

          {activeTab === 'equation-editor' && (
            <EquationEditorView
              onSendToQuestionBuilder={handleRouteToQuestionBuilderWithLatex}
            />
          )}

          {activeTab === 'kisi-kisi' && (
            <KisiKisiView
              blueprints={blueprints}
              onSaveBlueprint={handleSaveBlueprint}
              onDeleteBlueprint={handleDeleteBlueprint}
              settings={settings}
            />
          )}

          {activeTab === 'kartu-soal' && (
            <KartuSoalView questions={questions} settings={settings} />
          )}

          {activeTab === 'bank-soal' && (
            <BankSoalView
              questions={questions}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onAddQuestions={handleSaveNewQuestions}
              onAnalyzeQuestion={handleRouteToAnalysis}
              onAddToPackage={handleRouteToPackage}
              settings={settings}
            />
          )}

          {activeTab === 'paket-asesmen' && (
            <AssessmentPackageView
              packages={packages}
              bankQuestions={questions}
              onSavePackage={handleSavePackage}
              onDeletePackage={handleDeletePackage}
              settings={settings}
            />
          )}

          {activeTab === 'analisis-soal' && (
            <AnalisisSoalView
              questions={questions}
              onUpdateQuestion={handleUpdateQuestion}
              selectedQuestionForAnalysis={selectedQuestionForAnalysis}
            />
          )}

          {activeTab === 'riwayat' && (
            <HistoryView
              history={history}
              onRestoreQuestions={handleSaveNewQuestions}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              questions={questions}
              onRestoreQuestions={(restored) => {
                saveQuestions(restored);
                setQuestions(restored);
              }}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        settings={settings}
        onLogout={() => {
          setProfileModalOpen(false);
          setActiveTab('dashboard');
        }}
        onOpenSettings={() => {
          setActiveTab('pengaturan');
        }}
      />

      {/* Floating Relaxing Work Music Player (Lagu Syahdu Teman Kerja) */}
      <AudioPlayerWidget />
    </div>
  );
}
