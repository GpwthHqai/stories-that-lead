import React from "react";

// Keystatic document field stores content as an array of nodes
// Each node has a type and children/text
// This renderer converts them to React elements

interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface ElementNode {
  type: string;
  children: (TextNode | ElementNode)[];
  level?: number;
  href?: string;
  listType?: string;
}

export type DocumentNode = TextNode | ElementNode;

function isTextNode(node: DocumentNode): node is TextNode {
  return "text" in node;
}

function renderTextNode(node: TextNode, key: string): React.ReactNode {
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong key={key + "-b"}>{content}</strong>;
  if (node.italic) content = <em key={key + "-i"}>{content}</em>;
  if (node.underline)
    content = (
      <span key={key + "-u"} className="underline">
        {content}
      </span>
    );
  if (node.strikethrough)
    content = <s key={key + "-s"}>{content}</s>;
  if (node.code)
    content = (
      <code
        key={key + "-c"}
        className="bg-navy-light/50 px-1.5 py-0.5 rounded text-gold text-sm"
      >
        {content}
      </code>
    );
  return content;
}

function renderNode(node: DocumentNode, key: string): React.ReactNode {
  if (isTextNode(node)) {
    return renderTextNode(node, key);
  }

  const children = node.children?.map((child, i) =>
    renderNode(child, `${key}-${i}`)
  );

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-4 text-gray-300 leading-relaxed">
          {children}
        </p>
      );
    case "heading": {
      const level = node.level || 2;
      const headingClasses =
        level === 2
          ? "text-2xl font-bold text-white mt-8 mb-4"
          : level === 3
          ? "text-xl font-bold text-white mt-6 mb-3"
          : "text-lg font-bold text-white mt-4 mb-2";
      if (level === 2)
        return (
          <h2 key={key} className={headingClasses}>
            {children}
          </h2>
        );
      if (level === 3)
        return (
          <h3 key={key} className={headingClasses}>
            {children}
          </h3>
        );
      return (
        <h4 key={key} className={headingClasses}>
          {children}
        </h4>
      );
    }
    case "unordered-list":
      return (
        <ul key={key} className="list-disc list-inside mb-4 space-y-2 text-gray-300">
          {children}
        </ul>
      );
    case "ordered-list":
      return (
        <ol key={key} className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li key={key} className="leading-relaxed">
          {children}
        </li>
      );
    case "list-item-content":
      return <span key={key}>{children}</span>;
    case "link":
      return (
        <a
          key={key}
          href={node.href}
          className="text-gold hover:text-gold-light underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    case "divider":
      return (
        <hr key={key} className="border-navy-light/30 my-8" />
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-gold/50 pl-4 my-4 italic text-gray-400"
        >
          {children}
        </blockquote>
      );
    default:
      return <div key={key}>{children}</div>;
  }
}

export function DocumentRenderer({
  document,
}: {
  document: DocumentNode[] | null | undefined;
}) {
  if (!document || !Array.isArray(document)) {
    return null;
  }
  return <>{document.map((node, i) => renderNode(node, `doc-${i}`))}</>;
}
