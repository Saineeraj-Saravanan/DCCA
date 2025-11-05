import React from 'react';
import { CircuitComponent, ComponentType } from '../types';
import { ResistorIcon, VoltageSourceIcon, SwitchIcon } from './icons';

interface ComponentListProps {
  components: CircuitComponent[];
  onRemove: (id: string) => void;
  onToggleSwitch: (id: string) => void;
  highlightedComponentId: string | null;
  onHighlightChange: (id: string | null) => void;
}

export const ComponentList: React.FC<ComponentListProps> = ({ components, onRemove, onToggleSwitch, highlightedComponentId, onHighlightChange }) => {
  if (components.length === 0) {
    return <p className="text-brand-text-secondary text-center py-4">No components added yet. Add one above to get started.</p>;
  }

  const renderComponentDetails = (c: CircuitComponent) => {
    switch (c.type) {
      case ComponentType.RESISTOR:
        return `${c.resistance}Ω, ${c.powerRating}`;
      case ComponentType.VOLTAGE_SOURCE:
        return `${c.voltage}V`;
      case ComponentType.SWITCH:
        return (
          <button onClick={() => onToggleSwitch(c.id)} className={`px-2 py-1 text-xs rounded ${c.isOpen ? 'bg-brand-warn text-brand-bg' : 'bg-brand-secondary text-white'}`}>
            {c.isOpen ? 'Open' : 'Closed'}
          </button>
        );
    }
  };

  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
        case ComponentType.RESISTOR: return <ResistorIcon className="w-6 h-6 text-brand-secondary" />;
        case ComponentType.VOLTAGE_SOURCE: return <VoltageSourceIcon className="w-6 h-6 text-brand-primary" />;
        case ComponentType.SWITCH: return <SwitchIcon className="w-6 h-6 text-brand-warn" />;
    }
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {components.map((c, index) => (
        <div 
          key={c.id} 
          className={`bg-brand-bg p-3 rounded-lg flex items-center justify-between transition-all duration-200 ${highlightedComponentId === c.id ? 'ring-2 ring-brand-primary' : ''}`}
          onMouseEnter={() => onHighlightChange(c.id)}
          onMouseLeave={() => onHighlightChange(null)}
        >
          <div className="flex items-center gap-4">
            {getComponentIcon(c.type)}
            <div>
                <p className="font-semibold">{`C${index + 1}: ${c.type}`}</p>
                <p className="text-sm text-brand-text-secondary">{`Nodes: ${c.startNode} → ${c.endNode}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono text-sm">{renderComponentDetails(c)}</p>
            <button onClick={() => onRemove(c.id)} className="text-brand-error hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
