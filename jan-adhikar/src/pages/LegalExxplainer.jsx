import React, { useState } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Gavel, Lightbulb, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LegalExplainerPage() {
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExplain = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setExplanation('');

    try {
      const prompt = `
        You are an expert in Indian law, skilled at simplifying complex legal concepts for the average person.
        A user has asked the following question: "${question}"
        
        Please provide a clear, simple, and accurate explanation in plain English.
        Structure your response for easy readability. Use markdown for formatting (like headings, bold text, and lists).
        Start with a direct answer, then provide a more detailed explanation.
        If relevant, mention the key law or constitutional article.
        Do not provide legal advice. Frame your response as educational information only.
        Conclude with a disclaimer that this is not a substitute for professional legal advice.
      `;

      const response = await InvokeLLM({ prompt });
      setExplanation(response);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the explanation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 pb-8">
      <div className="text-center">
        <Gavel className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-slate-900">AI Legal Explainer</h1>
        <p className="mt-2 text-lg text-slate-600">
          Simplify complex legal jargon. Ask a question and get a clear answer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-500" />
            Your Legal Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., 'What is an FIR?' or 'Explain Article 21 of the Constitution.'"
            className="h-28"
          />
          <Button onClick={handleExplain} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Explanation...
              </>
            ) : (
              'Explain It To Me'
            )}
          </Button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
      </Card>

      {explanation && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Simplified Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-900 mb-4 mt-6 border-b-2 border-blue-300 pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-blue-800 mb-3 mt-5" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-blue-700 mb-2 mt-4" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-blue-900 font-semibold" {...props} />,
                  em: ({node, ...props}) => <em className="text-slate-800 italic" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? 
                    <code className="bg-blue-100 text-blue-900 px-2 py-1 rounded font-mono text-sm" {...props} /> :
                    <code className="bg-slate-900 text-slate-100 p-4 rounded-lg block mb-4 overflow-x-auto font-mono text-xs" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 italic my-4 text-slate-700" {...props} />,
                }}
              >
                {explanation}
              </ReactMarkdown>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Disclaimer:</strong> This explanation is for educational purposes only and does not constitute legal advice. 
                For specific legal matters, please consult with a qualified legal professional.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!explanation && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Lightbulb className="mx-auto h-10 w-10 text-slate-400 mb-4" />
            <p className="text-slate-500">
              The explanation will appear here once you submit a question.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}