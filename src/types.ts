export interface ParsedNode {
  tagName?: string;
  content: string;
  children: ParsedNode[];
}
