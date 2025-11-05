
import React from 'react';

export const ResistorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h2l2-4 2 8 2-12 2 10 2-4h2" />
  </svg>
);

export const VoltageSourceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="4" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="20" />
    <line x1="8" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="16" y2="12" />
    <line x1="10" y1="12" x2="14" y2="12" />
    <line x1="12" y1="10" x2="12" y2="14" />
  </svg>
);

export const SwitchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12H8" />
    <path d="M16 12h4" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="14" cy="12" r="2" />
    <path d="m14 10-4 4" />
  </svg>
);
