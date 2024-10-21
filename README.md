# fuzzy-xml

![License](https://img.shields.io/badge/license-MIT-blue.svg)

**fuzzy-xml** is a robust TypeScript library designed to parse semi-structured, XML-like tags interleaved with natural language text, commonly found in responses from Large Language Models (LLMs). It gracefully handles fuzzy and malformed tags, ensuring reliable extraction of structured data from otherwise unpredictable outputs.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Handling Nested Tags](#handling-nested-tags)
  - [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Fuzzy Parsing**: Handles semi-structured inputs with interleaved natural language and XML-like tags.
- **Error Tolerance**: Continues parsing despite malformed or incomplete tags.
- **Nested Tag Support**: Accurately parses nested tags, maintaining hierarchical relationships.
- **Lightweight**: Minimal dependencies, ensuring fast and efficient parsing.
- **Extensible**: Easily extendable to handle custom parsing requirements.
- **TypeScript Support**: Provides strong type definitions for enhanced developer experience.

## Installation

You can install **fuzzy-xml** via npm:

```bash
npm install @000alen/fuzzy-xml
```

Or using yarn:

```bash
yarn add @000alen/fuzzy-xml
```

## Usage

### Basic Example

```typescript
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
```

**Output:**

```json
[
  {
    "content": "Here is the summary of our findings:",
    "children": []
  },
  {
    "tagName": "findings",
    "content": "The indemnification clause is overly broad.\nAdditionally, the limitation of liability is insufficient.",
    "children": [
      {
        "tagName": "details",
        "content": "This could expose us to significant risks.",
        "children": []
      }
    ]
  },
  {
    "content": "Please review these points at your earliest convenience.",
    "children": []
  },
  {
    "tagName": "recommendations",
    "content": "We should renegotiate the indemnification terms.\nAlso, consider increasing the liability cap.",
    "children": []
  },
  {
    "content": "Thank you.",
    "children": []
  }
]
```

### Handling Nested Tags

The parser accurately captures nested structures, maintaining the hierarchy of tags and their respective contents.

```typescript
const complexResponse = `
<report>
  Overview:
  <section>
    <title>Revenue Growth</title>
    Our revenue increased by 20%.
    <details>
      Major contributors include product A and product B.
    </details>
  </section>
  <section>
    <title>Profit Margins</title>
    Profit margins remained stable.
  </section>
</report>
`;

const parser = new FuzzyXMLParser(complexResponse);
const parsedNodes = parser.parse();

console.log(JSON.stringify(parsedNodes, null, 2));
```

**Output:**

```json
[
  {
    "tagName": "report",
    "content": "Overview:",
    "children": [
      {
        "tagName": "section",
        "content": "Our revenue increased by 20%.",
        "children": [
          {
            "tagName": "title",
            "content": "Revenue Growth",
            "children": []
          },
          {
            "tagName": "details",
            "content": "Major contributors include product A and product B.",
            "children": []
          }
        ]
      },
      {
        "tagName": "section",
        "content": "Profit margins remained stable.",
        "children": [
          {
            "tagName": "title",
            "content": "Profit Margins",
            "children": []
          }
        ]
      }
    ]
  }
]
```

### Error Handling

**fuzzy-xml** is designed to handle malformed tags without interrupting the parsing process. Text outside of tags or incorrect tag formats are treated as plain text.

```typescript
const malformedResponse = `
Here is an overview:

<findings>
  The terms are unclear.
  <details>
    Missing clauses on liability.
  <!-- Missing closing tag for findings

Recommendations follow.

<recommendations>
  Clarify liability clauses.
  Add termination conditions.
</recommendations>
`;

const parser = new FuzzyXMLParser(malformedResponse);
const parsedNodes = parser.parse();

console.log(JSON.stringify(parsedNodes, null, 2));
```

**Output:**

```json
[
  {
    "content": "Here is an overview:",
    "children": []
  },
  {
    "tagName": "findings",
    "content": "The terms are unclear.",
    "children": [
      {
        "tagName": "details",
        "content": "Missing clauses on liability.",
        "children": []
      }
    ]
  },
  {
    "content": "<!-- Missing closing tag for findings\n\nRecommendations follow.",
    "children": []
  },
  {
    "tagName": "recommendations",
    "content": "Clarify liability clauses.\nAdd termination conditions.",
    "children": []
  }
]
```

## Contributing

Contributions are welcome! Whether it's reporting bugs, suggesting features, or submitting pull requests, your help is appreciated.

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

Please ensure your code adheres to the existing style and includes relevant tests.

## License

This project is licensed under the [MIT License](LICENSE).
