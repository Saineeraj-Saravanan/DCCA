
export enum ComponentType {
  RESISTOR = 'Resistor',
  VOLTAGE_SOURCE = 'Voltage Source',
  SWITCH = 'Switch',
}

export const POWER_RATINGS = ['1/8W', '1/4W', '1/2W', '1W', '2W'] as const;
export type PowerRating = typeof POWER_RATINGS[number];

interface BaseComponent {
  id: string;
  type: ComponentType;
  startNode: string;
  endNode: string;
}

export interface Resistor extends BaseComponent {
  type: ComponentType.RESISTOR;
  resistance: number;
  powerRating: PowerRating;
}

export interface VoltageSource extends BaseComponent {
  type: ComponentType.VOLTAGE_SOURCE;
  voltage: number;
}

export interface Switch extends BaseComponent {
  type: ComponentType.SWITCH;
  isOpen: boolean;
}

export type CircuitComponent = Resistor | VoltageSource | Switch;

export interface NodeVoltage {
  nodeId: string;
  voltage: number;
}

export interface BranchResult {
  componentId: string;
  current?: number;
  power?: number;
  warning?: string;
}

export interface AnalysisResult {
  nodeVoltages: NodeVoltage[];
  branchResults: BranchResult[];
}
