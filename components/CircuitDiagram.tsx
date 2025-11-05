import React, { useState, useRef, useEffect } from 'react';
import { CircuitComponent, AnalysisResult, BranchResult } from '../types';
import { ComponentSymbol, GroundSymbol } from './DiagramSymbols';

interface CircuitDiagramProps {
  components: CircuitComponent[];
  nodePositions: Record<string, { x: number; y: number }>;
  onNodePositionChange: (nodeId: string, position: { x: number; y: number }) => void;
  results: AnalysisResult | null;
  groundNode: string;
  highlightedComponentId: string | null;
  onHighlightChange: (id: string | null) => void;
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  components,
  nodePositions,
  onNodePositionChange,
  results,
  groundNode,
  highlightedComponentId,
  onHighlightChange,
}) => {
  const [draggingNode, setDraggingNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGPoint = (e: React.MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const point = getSVGPoint(e);
    const nodePos = nodePositions[nodeId];
    setDraggingNode({
      id: nodeId,
      offsetX: point.x - nodePos.x,
      offsetY: point.y - nodePos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode) return;
    const point = getSVGPoint(e);
    onNodePositionChange(draggingNode.id, {
      x: point.x - draggingNode.offsetX,
      y: point.y - draggingNode.offsetY,
    });
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };
  
  if (components.length === 0) {
      return <div className="aspect-video bg-brand-bg rounded-lg flex items-center justify-center text-brand-text-secondary">No components to visualize.</div>
  }

  const allNodeIds = Object.keys(nodePositions);
  // Fix for lines 122, 128, 160: Explicitly typed the Maps to avoid inferring values as 'unknown'.
  const resultVoltages = new Map<string, number>(results?.nodeVoltages.map(nv => [nv.nodeId, nv.voltage]));
  const resultBranches = new Map<string, BranchResult>(results?.branchResults.map(br => [br.componentId, br]));

  return (
    <div className="aspect-video bg-brand-bg rounded-lg overflow-hidden border border-brand-border">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="select-none"
      >
        {/* Wires */}
        <g>
          {components.map(comp => {
            const startPos = nodePositions[comp.startNode];
            const endPos = nodePositions[comp.endNode];
            if (!startPos || !endPos) return null;
            return (
              <line
                key={`${comp.id}-wire`}
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                className={`stroke-current transition-all duration-200 ${highlightedComponentId === comp.id ? 'text-brand-primary stroke-2' : 'text-brand-border'}`}
              />
            );
          })}
        </g>

        {/* Components & Labels */}
        <g>
          {components.map(comp => {
            const startPos = nodePositions[comp.startNode];
            const endPos = nodePositions[comp.endNode];
            if (!startPos || !endPos) return null;
            const branchResult = resultBranches.get(comp.id);
            const midX = (startPos.x + endPos.x) / 2;
            const midY = (startPos.y + endPos.y) / 2;
            const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x) * 180 / Math.PI;

            return (
              <g 
                key={comp.id} 
                className="cursor-pointer"
                onMouseEnter={() => onHighlightChange(comp.id)}
                onMouseLeave={() => onHighlightChange(null)}
              >
                <ComponentSymbol
                  x1={startPos.x} y1={startPos.y}
                  x2={endPos.x} y2={endPos.y}
                  component={comp}
                  isHighlighted={highlightedComponentId === comp.id}
                />
                {branchResult?.current !== undefined && (
                   <text 
                     x={midX} y={midY - 25}
                     transform={`rotate(${angle > 90 || angle < -90 ? angle + 180 : angle}, ${midX}, ${midY})`}
                     className="text-[10px] fill-current text-brand-secondary" textAnchor="middle"
                   >
                     {(branchResult.current * 1000).toFixed(2)} mA
                   </text>
                )}
              </g>
            );
          })}
        </g>
        
        {/* Nodes & Labels */}
        <g>
          {allNodeIds.map(nodeId => {
            const pos = nodePositions[nodeId];
            if (!pos) return null;
            const voltage = resultVoltages.get(nodeId);
            return (
              <g key={nodeId} transform={`translate(${pos.x}, ${pos.y})`}>
                {nodeId === groundNode ? (
                  <GroundSymbol />
                ) : (
                  <circle
                    r="5"
                    className="fill-current text-brand-border"
                  />
                )}
                <circle
                  r="15"
                  className="fill-transparent cursor-grab"
                  onMouseDown={e => handleNodeMouseDown(e, nodeId)}
                />
                <text className="text-xs fill-current text-brand-text-secondary" y="-10" textAnchor="middle">{nodeId}</text>
                {voltage !== undefined && (
                  <text className="text-xs fill-current text-brand-primary font-bold" y="20" textAnchor="middle">
                    {voltage.toFixed(2)}V
                  </text>
                )}
              </g>
            );
          })}
        </g>

      </svg>
    </div>
  );
};
