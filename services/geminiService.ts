
import { GoogleGenAI } from "@google/genai";
import { CircuitComponent, AnalysisResult } from '../types';

// Per Gemini guidelines, API key must be read from process.env.API_KEY within the service.
export async function explainCircuitResults(
  components: CircuitComponent[],
  results: AnalysisResult
): Promise<string> {
  if (!process.env.API_KEY) {
    return "API_KEY environment variable not set.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const componentDetails = components.map(c => {
    switch (c.type) {
      case 'Resistor': return `A ${c.resistance} Ohm resistor (rated for ${c.powerRating}) between node ${c.startNode} and ${c.endNode}.`;
      case 'Voltage Source': return `A ${c.voltage}V DC source between node ${c.startNode} (+) and ${c.endNode} (-).`;
      case 'Switch': return `A switch between node ${c.startNode} and ${c.endNode}, which is currently ${c.isOpen ? 'OPEN' : 'CLOSED'}.`;
    }
  }).join('\n');

  const resultDetails = `
Node Voltages:
${results.nodeVoltages.map(v => ` - Node ${v.nodeId}: ${v.voltage.toFixed(3)} V`).join('\n')}

Branch Analysis:
${results.branchResults.map(b => {
  const component = components.find(c => c.id === b.componentId)!;
  let detail = `- ${component.type} (${component.startNode}-${component.endNode}): `;
  if (b.current !== undefined) detail += `Current: ${(b.current * 1000).toFixed(2)} mA. `;
  if (b.power !== undefined) detail += `Power: ${(b.power * 1000).toFixed(2)} mW. `;
  if (b.warning) detail += `WARNING: ${b.warning}`;
  return detail;
}).join('\n')}
`;

  const prompt = `
You are an expert electrical engineering teaching assistant. 
Based on the following DC circuit definition and its calculated analysis results, provide a clear, concise explanation of the circuit's behavior. 
Reference Kirchhoff's Current Law (KCL) and Kirchhoff's Voltage Law (KVL) where appropriate to explain why the node voltages and branch currents are what they are. 
If there are any thermal overload warnings, explain the implications. 
Keep the explanation suitable for a first-year engineering student.

**Circuit Definition:**
${componentDetails}

**Analysis Results:**
${resultDetails}

**Your Explanation:**
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while generating the explanation. Please check the console for details.";
  }
}
