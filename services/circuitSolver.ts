
import { CircuitComponent, ComponentType, AnalysisResult, Resistor } from '../types';
import { POWER_RATING_MAP, SWITCH_RESISTANCE } from '../constants';
import { solveLinearSystem } from './matrixSolver';

export function analyzeCircuit(components: CircuitComponent[], groundNodeId: string): AnalysisResult | { error: string } {
  const nodes = new Set<string>();
  components.forEach(c => {
    nodes.add(c.startNode);
    nodes.add(c.endNode);
  });

  if (nodes.size === 0) {
    return { nodeVoltages: [], branchResults: [] };
  }

  if (!nodes.has(groundNodeId)) {
    return { error: `Ground node "${groundNodeId}" not found in circuit.` };
  }

  const nodeList = Array.from(nodes).filter(n => n !== groundNodeId);
  const nodeMap = new Map(nodeList.map((node, i) => [node, i]));
  const numNodes = nodeList.length;

  const voltageSources = components.filter(c => c.type === ComponentType.VOLTAGE_SOURCE);
  const numVoltageSources = voltageSources.length;
  
  const matrixSize = numNodes + numVoltageSources;
  const G = Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
  const I = new Array(matrixSize).fill(0);

  components.forEach(comp => {
    const isStartGround = comp.startNode === groundNodeId;
    const isEndGround = comp.endNode === groundNodeId;
    const i = isStartGround ? -1 : nodeMap.get(comp.startNode)!;
    const j = isEndGround ? -1 : nodeMap.get(comp.endNode)!;

    let resistance = 0;
    if (comp.type === ComponentType.RESISTOR) {
      resistance = comp.resistance;
    } else if (comp.type === ComponentType.SWITCH) {
      resistance = comp.isOpen ? SWITCH_RESISTANCE.OPEN : SWITCH_RESISTANCE.CLOSED;
    }

    if (resistance > 0) {
      const conductance = 1 / resistance;
      if (i !== -1) G[i][i] += conductance;
      if (j !== -1) G[j][j] += conductance;
      if (i !== -1 && j !== -1) {
        G[i][j] -= conductance;
        G[j][i] -= conductance;
      }
    } else if (comp.type === ComponentType.VOLTAGE_SOURCE) {
      const vIndex = voltageSources.findIndex(v => v.id === comp.id);
      const k = numNodes + vIndex;
      
      if (i !== -1) {
        G[k][i] = 1;
        G[i][k] = 1;
      }
      if (j !== -1) {
        G[k][j] = -1;
        G[j][k] = -1;
      }
      I[k] = comp.voltage;
    }
  });

  const solution = solveLinearSystem(G, I);

  if (!solution) {
    return { error: 'The circuit is unsolvable. Check for floating nodes or invalid configurations.' };
  }

  const nodeVoltagesMap = new Map<string, number>();
  nodeVoltagesMap.set(groundNodeId, 0);
  nodeList.forEach((nodeId, i) => {
    nodeVoltagesMap.set(nodeId, solution[i]);
  });
  
  const voltageSourceCurrents = solution.slice(numNodes);

  const branchResults: AnalysisResult['branchResults'] = [];
  components.forEach(comp => {
    const vStart = nodeVoltagesMap.get(comp.startNode)!;
    const vEnd = nodeVoltagesMap.get(comp.endNode)!;
    let result: AnalysisResult['branchResults'][0] = { componentId: comp.id };

    if (comp.type === ComponentType.RESISTOR || comp.type === ComponentType.SWITCH) {
      const resistance = comp.type === ComponentType.RESISTOR ? comp.resistance : (comp.isOpen ? SWITCH_RESISTANCE.OPEN : SWITCH_RESISTANCE.CLOSED);
      const current = (vStart - vEnd) / resistance;
      const power = current * current * resistance;
      result = {...result, current, power };

      if (comp.type === ComponentType.RESISTOR) {
        const ratedPower = POWER_RATING_MAP[comp.powerRating];
        if (power > ratedPower) {
          result.warning = `Thermal overload! Power (${power.toFixed(3)}W) > Rating (${ratedPower}W)`;
        }
      }
    } else if (comp.type === ComponentType.VOLTAGE_SOURCE) {
      const vIndex = voltageSources.findIndex(v => v.id === comp.id);
      result.current = voltageSourceCurrents[vIndex];
    }
    branchResults.push(result);
  });

  return {
    nodeVoltages: Array.from(nodeVoltagesMap.entries()).map(([nodeId, voltage]) => ({ nodeId, voltage })),
    branchResults,
  };
}
