import React from 'react';
import { useSummaryGenerator } from './hooks/index.js';
import { SessionNotesInput } from './components/features/SessionNotesInput.jsx';
import { SummaryPreferences } from './components/features/SummaryPreferences.jsx';
import { SummaryOutputDisplay } from './components/features/SummaryOutputDisplay.jsx';
import { Header, Footer } from './components/layout/index.js';
import { Card, CardHeader, CardContent } from './components/ui/Card.jsx';
import { Button } from './components/ui/Button.jsx';
import { LoadingOverlay } from './components/ui/Feedback.jsx';
import { VALIDATION } from './config/constants.js';
import { toast, Toaster } from 'sonner';

function App() {
  const {
    sessionNotes,
    preferences,
    summary,
    isLoading,
    isGenerating,
    error,
    updateSessionNotes,
    updatePreferences,
    updateSummary,
    generateSummary,
    clearError,
    clearSummary,
    resetAll
  } = useSummaryGenerator();

  const isSessionNotesValid = sessionNotes.trim().length >= VALIDATION.SESSION_NOTES.MIN_LENGTH && 
                             sessionNotes.trim().length <= VALIDATION.SESSION_NOTES.MAX_LENGTH;
  const canGenerate = isSessionNotesValid && !isLoading;

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

 
  React.useEffect(() => {
    const hasShownWelcome = localStorage.getItem('rocket_health_welcome_shown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast.success("Welcome to Rocket Health! Enter your session notes to get started.", {
          duration: 5000,
        });
        localStorage.setItem('rocket_health_welcome_shown', 'true');
      }, 1000);
    }
  }, []);

  const handleGenerateSummary = async () => {
    if (!canGenerate) return;
    try {
      await generateSummary();
      toast.success("Summary generated successfully!");
    } catch {
      // Error handling is done in useEffect above
    }
  };

  const handleSummaryChange = (newSummary) => {
    updateSummary(newSummary);
  };

  const handleClearSummary = () => {
    clearSummary();
    toast.success("Summary cleared successfully!");
  };

  const handleReset = () => {
    resetAll();
    toast.success("All data has been reset!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        closeButton={true}
        duration={4000}
      />

      {isGenerating && (
        <LoadingOverlay message="Generating your consultation summary..." />
      )}

      <Header onReset={handleReset} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Session Notes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your consultation notes. The content will be automatically saved as you type.
                </p>
              </CardHeader>
              <CardContent>
                <SessionNotesInput
                  value={sessionNotes}
                  onChange={updateSessionNotes}
                  error={!isSessionNotesValid && sessionNotes.length > 0 ? 
                    `Session notes must be between ${VALIDATION.SESSION_NOTES.MIN_LENGTH} and ${VALIDATION.SESSION_NOTES.MAX_LENGTH} characters.` : 
                    null
                  }
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="font-medium text-gray-900">Ready to generate your summary?</h3>
                  <p className="text-sm text-gray-600">
                    Click the button to create a professional consultation summary using AI.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateSummary}
                  disabled={!canGenerate}
                  loading={isLoading}
                  size="large"
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Generating...' : 'Generate Summary'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <SummaryPreferences
              preferences={preferences}
              onPreferenceChange={updatePreferences}
              disabled={isLoading}
            />
          </div>
        </div>

        {(summary || isLoading) && (
          <div className="mt-8">
            <SummaryOutputDisplay
              summary={summary}
              isEditable={true}
              onSummaryChange={handleSummaryChange}
            />
          </div>
        )}

        {summary && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              onClick={handleClearSummary}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Summary</span>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
