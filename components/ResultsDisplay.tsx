
import React, { useState } from 'react';
import { AnalysisResult, CircuitComponent } from '../types';
import { explainCircuitResults } from '../services/geminiService';

interface ResultsDisplayProps {
  results: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
  components: CircuitComponent[];
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, error, isLoading, components }) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleExplain = async () => {
    if (!results) return;
    setIsAiLoading(true);
    setAiExplanation(null);
    // Update function call to match refactored geminiService.
    const explanation = await explainCircuitResults(components, results);
    setAiExplanation(explanation);
    setIsAiLoading(false);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="bg-brand-error/20 text-brand-error p-4 rounded-md">{error}</div>;
  if (!results) return <p className="text-brand-text-secondary text-center py-4">Click "Analyze Circuit" to see results.</p>;
  if (results.nodeVoltages.length === 0) return <p className="text-brand-text-secondary text-center py-4">Circuit is empty. No results to show.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-brand-secondary mb-2">Node Voltages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
          {results.nodeVoltages.sort((a,b) => a.nodeId.localeCompare(b.nodeId)).map(({ nodeId, voltage }) => (
            <div key={nodeId} className="bg-brand-bg p-2 rounded-md">
              <p className="text-sm text-brand-text-secondary">Node {nodeId}</p>
              <p className="font-bold text-lg text-brand-primary">{voltage.toFixed(3)} V</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-brand-secondary mb-2">Branch Analysis</h3>
        <div className="space-y-2">
          {results.branchResults.map(res => {
            const component = components.find(c => c.id === res.componentId)!;
            return (
              <div key={res.componentId} className={`p-3 rounded-md ${res.warning ? 'bg-brand-error/20' : 'bg-brand-bg'}`}>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{component.type} ({component.startNode}→{component.endNode})</p>
                  <div className="text-right font-mono text-sm">
                    {res.current !== undefined && <p>I: {(res.current * 1000).toFixed(2)} mA</p>}
                    {res.power !== undefined && <p>P: {(res.power * 1000).toFixed(2)} mW</p>}
                  </div>
                </div>
                {res.warning && <p className="text-sm text-brand-error mt-1 font-semibold">{res.warning}</p>}
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <button
          onClick={handleExplain}
          disabled={isAiLoading}
          className="w-full bg-brand-secondary/80 text-white font-bold py-2 rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-50"
        >
          {isAiLoading ? 'Generating...' : '⚡ Explain with AI'}
        </button>
        {isAiLoading && <LoadingSpinner />}
        {aiExplanation && (
          <div className="mt-4 p-4 bg-brand-bg rounded-md border border-brand-border">
            <h4 className="font-semibold text-lg text-brand-primary mb-2">AI Explanation</h4>
            <p className="text-brand-text-secondary whitespace-pre-wrap">{aiExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
