import React, { useState, useCallback, useEffect } from 'react';
import { CircuitComponent, AnalysisResult, ComponentType } from './types';
import { analyzeCircuit } from './services/circuitSolver';
import { ComponentList } from './components/ComponentList';
import { CircuitInputForm } from './components/CircuitInputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CircuitDiagram } from './components/CircuitDiagram';

const GRID_SPACING = 150;
const COLS = 3;

const App: React.FC = () => {
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [groundNode, setGroundNode] = useState<string>('0');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [highlightedComponentId, setHighlightedComponentId] = useState<string | null>(null);

  useEffect(() => {
    // Fix for lines 29, 34, 41, 42: Changed `Array.from(new Set(...))` to use the spread syntax for better type inference.
    const allNodeIds = [...new Set(components.flatMap(c => [c.startNode, c.endNode]))];
    
    setNodePositions(currentPositions => {
      const newPositions = { ...currentPositions };
      const positionedNodeIds = Object.keys(currentPositions);

      // Add positions for new nodes
      const unpositionedNodes = allNodeIds.filter(id => !positionedNodeIds.includes(id));
      let lastIndex = positionedNodeIds.length;
      unpositionedNodes.forEach(nodeId => {
          const row = Math.floor(lastIndex / COLS);
          const col = lastIndex % COLS;
          newPositions[nodeId] = { x: 50 + col * GRID_SPACING, y: 50 + row * GRID_SPACING };
          lastIndex++;
      });

      // Remove positions for nodes that no longer exist
      const finalPositions: Record<string, { x: number; y: number }> = {};
      for (const nodeId of allNodeIds) {
          if(newPositions[nodeId]) {
              finalPositions[nodeId] = newPositions[nodeId];
          }
      }
      
      return finalPositions;
    });
  }, [components]);

  const addComponent = (component: Omit<CircuitComponent, 'id'>) => {
    setComponents(prev => [...prev, { ...component, id: self.crypto.randomUUID() }]);
    setResults(null);
    setError(null);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setResults(null);
    setError(null);
  };
  
  const toggleSwitch = (id: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id && c.type === ComponentType.SWITCH) {
        return { ...c, isOpen: !c.isOpen };
      }
      return c;
    }));
    setResults(null);
    setError(null);
  };

  const handleAnalysis = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setTimeout(() => {
      const analysisOutput = analyzeCircuit(components, groundNode);
      if ('error' in analysisOutput) {
        setError(analysisOutput.error);
        setResults(null);
      } else {
        setResults(analysisOutput);
        setError(null);
      }
      setIsLoading(false);
    }, 50);
  }, [components, groundNode]);
  
  const loadSampleCircuit = () => {
    const sample: CircuitComponent[] = [
      { id: self.crypto.randomUUID(), type: ComponentType.VOLTAGE_SOURCE, startNode: '1', endNode: '0', voltage: 9 },
      { id: self.crypto.randomUUID(), type: ComponentType.RESISTOR, startNode: '1', endNode: '2', resistance: 1000, powerRating: '1/4W' },
      { id: self.crypto.randomUUID(), type: ComponentType.RESISTOR, startNode: '2', endNode: '0', resistance: 2000, powerRating: '1/4W' },
      { id: self.crypto.randomUUID(), type: ComponentType.RESISTOR, startNode: '2', endNode: '3', resistance: 500, powerRating: '1/8W' },
      { id: self.crypto.randomUUID(), type: ComponentType.RESISTOR, startNode: '3', endNode: '0', resistance: 1000, powerRating: '1/4W' },
    ];
    setComponents(sample);
    setGroundNode('0');
    setResults(null);
    setError(null);
  };

  const clearCircuit = () => {
    setComponents([]);
    setResults(null);
    setError(null);
    setNodePositions({});
  }

  const handleNodePositionChange = (nodeId: string, position: { x: number; y: number }) => {
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: position,
    }));
  };

  const uniqueNodes = Array.from(new Set(components.flatMap(c => [c.startNode, c.endNode]))).sort();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">DC Circuit Analyzer</h1>
          <p className="text-brand-text-secondary mt-2">Design, solve, and analyze simple DC circuits with thermal warnings.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-brand-surface rounded-lg p-6 shadow-lg flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-brand-primary border-b-2 border-brand-border pb-2">Circuit Definition</h2>
            <CircuitInputForm onAddComponent={addComponent} />
            <div className="flex flex-wrap gap-2">
                <button onClick={loadSampleCircuit} className="bg-brand-secondary/20 text-brand-secondary px-4 py-2 rounded-md hover:bg-brand-secondary/30 transition-colors">Load Sample</button>
                <button onClick={clearCircuit} className="bg-brand-error/20 text-brand-error px-4 py-2 rounded-md hover:bg-brand-error/30 transition-colors">Clear All</button>
            </div>
            <ComponentList 
              components={components} 
              onRemove={removeComponent} 
              onToggleSwitch={toggleSwitch}
              highlightedComponentId={highlightedComponentId}
              onHighlightChange={setHighlightedComponentId}
            />
          </div>

          <div className="bg-brand-surface rounded-lg p-6 shadow-lg flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-brand-primary border-b-2 border-brand-border pb-2">Analysis & Visualization</h2>
            
            <CircuitDiagram 
              components={components}
              nodePositions={nodePositions}
              onNodePositionChange={handleNodePositionChange}
              groundNode={groundNode}
              results={results}
              highlightedComponentId={highlightedComponentId}
              onHighlightChange={setHighlightedComponentId}
            />

            <div className="flex items-center space-x-4">
              <label htmlFor="groundNode" className="font-semibold">Ground Node (0V):</label>
              <select
                id="groundNode"
                value={groundNode}
                onChange={e => setGroundNode(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-md px-3 py-2"
                disabled={uniqueNodes.length === 0}
              >
                {uniqueNodes.length > 0 ? uniqueNodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                )) : <option>N/A</option>}
              </select>
            </div>
            <button
              onClick={handleAnalysis}
              disabled={components.length === 0 || isLoading}
              className="w-full bg-brand-primary text-brand-bg font-bold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Circuit'}
            </button>
            <ResultsDisplay results={results} error={error} isLoading={isLoading} components={components} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
