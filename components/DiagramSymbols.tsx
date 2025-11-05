import React from 'react';
import { CircuitComponent, ComponentType } from '../types';

interface SymbolProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  component: CircuitComponent;
  isHighlighted: boolean;
}

const SYMBOL_LENGTH = 40;
const SYMBOL_HEIGHT = 20;

const ResistorSymbol: React.FC = () => (
  <path
    d={`M -${SYMBOL_LENGTH / 2} 0 l ${SYMBOL_LENGTH/8} ${SYMBOL_HEIGHT/2} l ${SYMBOL_LENGTH/4} -${SYMBOL_HEIGHT} l ${SYMBOL_LENGTH/4} ${SYMBOL_HEIGHT} l ${SYMBOL_LENGTH/4} -${SYMBOL_HEIGHT} l ${SYMBOL_LENGTH/8} ${SYMBOL_HEIGHT/2}`}
    strokeWidth="2"
    fill="none"
  />
);

const VoltageSourceSymbol: React.FC = () => (
    <g strokeWidth="2" fill="none">
      <circle cx="0" cy="0" r={SYMBOL_HEIGHT / 2} />
      <text x="-1" y="4" fontSize="10px" textAnchor="middle" stroke="none" fill="currentColor">+</text>
      <text x="1" y="-12" fontSize="10px" textAnchor="middle" stroke="none" fill="currentColor">-</text>
    </g>
);

const SwitchSymbol: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <g strokeWidth="2">
        <line x1={`-${SYMBOL_LENGTH / 2}`} y1="0" x2="-4" y2="0" />
        <line x1="4" y1="0" x2={`${SYMBOL_LENGTH / 2}`} y2="0" />
        <circle cx="-4" cy="0" r="3" fill="currentColor" stroke="none" />
        <circle cx="4" cy="0" r="3" fill="currentColor" stroke="none" />
        <line x1="-4" y1="0" x2="10" y2={isOpen ? -10 : 0} />
    </g>
);

export const GroundSymbol: React.FC = () => (
  <g className="fill-none stroke-current text-brand-text-secondary" strokeWidth="2">
    <path d="M 0 0 V 10" />
    <path d="M -10 10 H 10" />
    <path d="M -6 14 H 6" />
    <path d="M -2 18 H 2" />
  </g>
);


export const ComponentSymbol: React.FC<SymbolProps> = ({ x1, y1, x2, y2, component, isHighlighted }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  let symbol;
  let color = 'text-brand-text';
  switch (component.type) {
    case ComponentType.RESISTOR:
      symbol = <ResistorSymbol />;
      color = 'text-brand-secondary';
      break;
    case ComponentType.VOLTAGE_SOURCE:
      symbol = <VoltageSourceSymbol />;
      color = 'text-brand-primary';
      break;
    case ComponentType.SWITCH:
      symbol = <SwitchSymbol isOpen={component.isOpen} />;
      color = 'text-brand-warn';
      break;
  }

  return (
    <g
      transform={`translate(${midX} ${midY}) rotate(${angle})`}
      className={`${color} transition-all duration-200 ${isHighlighted ? 'opacity-100' : 'opacity-80'}`}
      stroke="currentColor"
    >
      <rect x={-SYMBOL_LENGTH/2 - 2} y={-SYMBOL_HEIGHT/2 - 2} width={SYMBOL_LENGTH + 4} height={SYMBOL_HEIGHT + 4} fill="var(--color-brand-bg)" stroke="none" />
      {symbol}
    </g>
  );
};
