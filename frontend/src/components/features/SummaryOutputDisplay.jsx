import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { copyToClipboard, downloadAsFile, formatDate } from '../../utils/helpers.js';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { toast } from 'sonner';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import '../../styles/blocknote-custom.css';

export const SummaryOutputDisplay = ({ 
  summary, 
  isEditable = true,
  onSummaryChange 
}) => {
  const [editableContent, setEditableContent] = useState(summary?.summary || '');
  const [isEditing, setIsEditing] = useState(false);

  // Create BlockNote editor instance
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: ""
      }
    ]
  });

  React.useEffect(() => {
    if (summary?.summary && editor) {
      setEditableContent(summary.summary);
      // Convert markdown text to BlockNote blocks using built-in parser
      try {
        // Use BlockNote's built-in markdown parser
        const parseMarkdown = async () => {
          try {
            const blocks = await editor.tryParseMarkdownToBlocks(summary.summary);
            if (blocks && blocks.length > 0) {
              await editor.replaceBlocks(editor.document, blocks);
            } else {
              // Fallback: create simple paragraph blocks
              const paragraphs = summary.summary.split('\n\n').filter(p => p.trim());
              const fallbackBlocks = paragraphs.map(paragraph => ({
                type: "paragraph",
                content: paragraph.trim()
              }));
              await editor.replaceBlocks(editor.document, fallbackBlocks);
            }
          } catch (parseError) {
            console.warn('Markdown parsing failed, using fallback:', parseError);
            // Final fallback: single paragraph with full content
            await editor.replaceBlocks(editor.document, [{
              type: "paragraph",
              content: summary.summary
            }]);
          }
        };
        
        parseMarkdown();
      } catch (error) {
        console.error('Failed to update editor content:', error);
      }
    }
  }, [summary?.summary, editor]);

  // Update editableContent when summary changes
  React.useEffect(() => {
    if (summary?.summary) {
      setEditableContent(summary.summary);
    }
  }, [summary?.summary]);

  // Simple markdown-to-HTML renderer for read-only view
  const renderMarkdownAsHTML = (markdownText) => {
    if (!markdownText) return '';
    
    return markdownText
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      // Bullet points
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br/>');
  };

  const showFeedback = (type, message) => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };

  const handleCopy = async () => {
    try {
      if (editor && isEditing) {
        // Get markdown content from BlockNote editor
        const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
        const success = await copyToClipboard(markdownContent, true); // true for plain text
        if (success) {
          showFeedback('success', 'Summary copied to clipboard as plain text!');
        } else {
          showFeedback('error', 'Failed to copy to clipboard');
        }
      } else {
        const success = await copyToClipboard(editableContent, true); // true for plain text
        if (success) {
          showFeedback('success', 'Summary copied to clipboard as plain text!');
        } else {
          showFeedback('error', 'Failed to copy to clipboard');
        }
      }
    } catch (error) {
      console.error('Error copying summary:', error);
      showFeedback('error', 'Failed to copy to clipboard');
    }
  };

  const handleDownload = async () => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `consultation-summary-${timestamp}`;
      
      if (editor && isEditing) {
        // Export as markdown from BlockNote editor
        const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
        const success = downloadAsFile(markdownContent, filename, 'pdf');
        if (success) {
          showFeedback('success', 'Summary downloaded as PDF successfully!');
        } else {
          showFeedback('error', 'Failed to download summary');
        }
      } else {
        const success = downloadAsFile(editableContent, filename, 'pdf');
        if (success) {
          showFeedback('success', 'Summary downloaded as PDF successfully!');
        } else {
          showFeedback('error', 'Failed to download summary');
        }
      }
    } catch (error) {
      console.error('Error downloading summary:', error);
      showFeedback('error', 'Failed to download summary');
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      // Save changes from BlockNote editor
      try {
        if (editor && onSummaryChange) {
          // Export markdown from BlockNote editor
          const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
          setEditableContent(markdownContent);
          onSummaryChange(markdownContent);
        }
        setIsEditing(false);
        showFeedback('success', 'Summary saved successfully!');
      } catch (error) {
        console.error('Error saving summary:', error);
        showFeedback('error', 'Failed to save summary changes');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleSimulateSend = async () => {
    try {
      let content;
      if (editor && isEditing) {
        content = await editor.blocksToMarkdownLossy(editor.document);
      } else {
        content = editableContent;
      }
      
      // In a real application, this would make an API call to send the email
      // For simulation, we'll just show a success message after a brief delay
      setTimeout(() => {
        showFeedback('success', 'Summary sent to patient successfully! (Simulation)');
      }, 1000);
      
    } catch (error) {
      console.error('Error sending summary to patient:', error);
      showFeedback('error', 'Failed to send summary to patient');
    }
  };

  if (!summary) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Summary Generated</h3>
          <p className="text-gray-600">
            Enter your session notes and click "Generate Summary" to create a consultation summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Generated Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Generated on {formatDate(summary.metadata?.generatedAt)}
              </p>
            </div>
            {isEditable && (
              <Button
                variant={isEditing ? 'success' : 'secondary'}
                size="small"
                onClick={handleEdit}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                {isEditing ? (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="truncate">Save Changes</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="truncate">Edit Summary</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {isEditing ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
              <BlockNoteView 
                editor={editor}
                editable={isEditable}
                theme="light"
                className="bn-container h-full"
              />
            </div>
          ) : (
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <div 
                className="text-gray-900 leading-relaxed min-h-[100px] p-3 sm:p-4 bg-gray-50 rounded-lg border text-sm sm:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: `<div class="markdown-content">${renderMarkdownAsHTML(editableContent)}</div>` 
                }}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="small"
                onClick={handleCopy}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </Button>

              <Button
                variant="outline"
                size="small"
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden xs:inline">Download PDF</span>
                <span className="xs:hidden">Download</span>
              </Button>

              <Button
                variant="outline"
                size="small"
                onClick={handleSimulateSend}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden xs:inline">Send to Patient</span>
                <span className="xs:hidden">Send</span>
              </Button>
            </div>

            {/* Summary Statistics */}
            <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-end">
              <span className="whitespace-nowrap">Words: {summary.metadata?.wordCount?.toLocaleString() || 0}</span>
              <span className="whitespace-nowrap">Characters: {summary.metadata?.characterCount?.toLocaleString() || 0}</span>             
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Summary Metadata */}
      {summary.metadata && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-medium text-gray-900">Summary Details</h4>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Tone:</span>
                <span className="capitalize text-gray-600">{summary.metadata.preferences?.tone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Session Type:</span>
                <span className="capitalize text-gray-600">{summary.metadata.preferences?.sessionType?.replace('-', ' ')}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Length:</span>
                <span className="capitalize text-gray-600">{summary.metadata.preferences?.summaryLength}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Action Items:</span>
                <span className="text-gray-600">{summary.metadata.preferences?.includeActionItems ? 'Included' : 'Not included'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Privacy:</span>
                <span className="text-gray-600">{summary.metadata.anonymized ? 'Anonymized' : 'Not anonymized'}</span>
              </div>
              {summary.metadata.piiDetected && (
                <div className="flex flex-col sm:flex-row sm:items-center p-2 sm:p-0">
                  <span className="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">PII Status:</span>
                  <span className={`${summary.metadata.piiDetected ? 'text-amber-600' : 'text-green-600'}`}>
                    {summary.metadata.piiDetected ? 'Detected' : 'None detected'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
