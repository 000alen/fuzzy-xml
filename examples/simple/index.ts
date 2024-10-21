import { FuzzyXMLParser, ParsedNode } from "@000alen/fuzzy-xml";

const llmResponse = `
Here is the summary of our findings:

<findings>
  The indemnification clause is overly broad.
  Additionally, the limitation of liability is insufficient.
  <details>
    This could expose us to significant risks.
  </details>
</findings>

Please review these points at your earliest convenience.

<recommendations>
  We should renegotiate the indemnification terms.
  Also, consider increasing the liability cap.
</recommendations>

Thank you.
`;

const parser = new FuzzyXMLParser(llmResponse);
const parsedNodes: ParsedNode[] = parser.parse();

console.log(JSON.stringify(parsedNodes, null, 2));