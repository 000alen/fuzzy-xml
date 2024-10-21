import { ParsedNode } from "@/types";

export * from "@/types";

export class FuzzyXMLParser {
  private input: string;
  private position: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Parses the entire input and returns an array of ParsedNode objects.
   */
  public parse(): ParsedNode[] {
    const nodes: ParsedNode[] = [];
    while (this.position < this.input.length) {
      const node = this.parseNode();
      if (node) {
        nodes.push(node);
      } else {
        this.position++;
      }
    }
    return nodes;
  }

  /**
   * Parses a node, which could be text or a tag.
   */
  private parseNode(): ParsedNode | null {
    this.skipWhitespace();

    if (this.peek() === "<") {
      // Possible start of a tag
      const tag = this.readTagName();
      if (tag) {
        const children: ParsedNode[] = [];
        let content = "";

        while (this.position < this.input.length) {
          if (
            this.peekAhead(0) === "<" &&
            this.peekAhead(1) === "/" &&
            this.matchTagName(tag)
          ) {
            // End tag found
            this.readTagName(); // Consume the end tag
            break;
          } else if (this.peek() === "<") {
            // Nested tag
            const childNode = this.parseNode();
            if (childNode) {
              children.push(childNode);
            }
          } else {
            // Text content
            content += this.readUntil("<");
          }
        }

        return {
          tagName: tag,
          content: content.trim(),
          children,
        };
      } else {
        // Not a valid tag, treat as text
        const text = this.readUntil("<");
        return {
          content: text.trim(),
          children: [],
        };
      }
    } else {
      // Text outside of tags
      const text = this.readUntil("<");
      return text.trim()
        ? {
            content: text.trim(),
            children: [],
          }
        : null;
    }
  }

  /**
   * Reads a tag name if present.
   */
  private readTagName(): string | null {
    if (this.peek() !== "<") {
      return null;
    }
    let start = this.position;
    this.position++; // Consume '<'

    // Handle end tag
    if (this.peek() === "/") {
      this.position++; // Consume '/'
    }

    let tagName = "";
    while (
      this.position < this.input.length &&
      /[a-zA-Z0-9]/.test(this.peek())
    ) {
      tagName += this.peek();
      this.position++;
    }

    // Skip the rest until '>' to handle attributes or incorrect formatting
    while (this.position < this.input.length && this.peek() !== ">") {
      this.position++;
    }
    if (this.peek() === ">") {
      this.position++; // Consume '>'
      return tagName;
    } else {
      // Malformed tag
      this.position = start; // Reset position
      return null;
    }
  }

  /**
   * Checks if the upcoming end tag matches the given tag name.
   */
  private matchTagName(tagName: string): boolean {
    let tempPosition = this.position;
    if (this.peekAhead(0) === "<" && this.peekAhead(1) === "/") {
      tempPosition += 2; // Skip '</'
      let endTagName = "";
      while (
        tempPosition < this.input.length &&
        /[a-zA-Z0-9]/.test(this.input.charAt(tempPosition))
      ) {
        endTagName += this.input.charAt(tempPosition);
        tempPosition++;
      }
      return endTagName === tagName;
    }
    return false;
  }

  /**
   * Reads characters until the specified character is found.
   */
  private readUntil(char: string): string {
    let result = "";
    while (this.position < this.input.length && this.peek() !== char) {
      result += this.peek();
      this.position++;
    }
    return result;
  }

  /**
   * Skips whitespace characters.
   */
  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.peek())) {
      this.position++;
    }
  }

  /**
   * Peeks at the current character without advancing the position.
   */
  private peek(): string {
    return this.input.charAt(this.position);
  }

  /**
   * Peeks ahead by the specified number of characters.
   */
  private peekAhead(offset: number): string {
    return this.input.charAt(this.position + offset);
  }
}
