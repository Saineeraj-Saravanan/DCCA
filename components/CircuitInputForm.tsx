import React, { useState } from 'react';
import { ComponentType, PowerRating, POWER_RATINGS, CircuitComponent } from '../types';

interface CircuitInputFormProps {
  onAddComponent: (component: Omit<CircuitComponent, 'id'>) => void;
}

export const CircuitInputForm: React.FC<CircuitInputFormProps> = ({ onAddComponent }) => {
  const [type, setType] = useState<ComponentType>(ComponentType.RESISTOR);
  const [startNode, setStartNode] = useState('1');
  const [endNode, setEndNode] = useState('0');
  const [value, setValue] = useState(1000);
  const [powerRating, setPowerRating] = useState<PowerRating>('1/4W');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startNode || !endNode || startNode === endNode) {
        alert("Please provide valid and different start/end nodes.");
        return;
    }

    switch (type) {
      case ComponentType.RESISTOR:
        onAddComponent({ type, startNode, endNode, resistance: value, powerRating });
        break;
      case ComponentType.VOLTAGE_SOURCE:
        onAddComponent({ type, startNode, endNode, voltage: value });
        break;
      case ComponentType.SWITCH:
        onAddComponent({ type, startNode, endNode, isOpen: true });
        break;
    }
  };

  const renderValueInput = () => {
    switch (type) {
      case ComponentType.RESISTOR:
        return (
          <div className="flex-1">
            <label htmlFor="resistance" className="block text-sm font-medium text-brand-text-secondary">Resistance (Ω)</label>
            <input
              type="number"
              id="resistance"
              value={value}
              onChange={e => setValue(parseFloat(e.target.value))}
              min="0"
              step="any"
              required
              className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
            />
          </div>
        );
      case ComponentType.VOLTAGE_SOURCE:
        return (
          <div className="flex-1">
            <label htmlFor="voltage" className="block text-sm font-medium text-brand-text-secondary">Voltage (V)</label>
            <input
              type="number"
              id="voltage"
              value={value}
              onChange={e => setValue(parseFloat(e.target.value))}
              step="any"
              required
              className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
            />
          </div>
        );
      case ComponentType.SWITCH:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-brand-text-secondary">Component</label>
          <select
            id="type"
            value={type}
            onChange={e => setType(e.target.value as ComponentType)}
            className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
          >
            {Object.values(ComponentType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {type === ComponentType.RESISTOR && (
          <div>
            <label htmlFor="powerRating" className="block text-sm font-medium text-brand-text-secondary">Power Rating</label>
            <select
              id="powerRating"
              value={powerRating}
              onChange={e => setPowerRating(e.target.value as PowerRating)}
              className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
            >
              {POWER_RATINGS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startNode" className="block text-sm font-medium text-brand-text-secondary">Start Node</label>
          <input
            type="text"
            id="startNode"
            value={startNode}
            onChange={e => setStartNode(e.target.value)}
            required
            className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="endNode" className="block text-sm font-medium text-brand-text-secondary">End Node</label>
          <input
            type="text"
            id="endNode"
            value={endNode}
            onChange={e => setEndNode(e.target.value)}
            required
            className="mt-1 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        {renderValueInput()}
      </div>

      <button type="submit" className="w-full bg-brand-secondary text-white font-bold py-2 rounded-md hover:opacity-90 transition-opacity">
        Add Component
      </button>
    </form>
  );
};
