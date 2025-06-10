// src/components/BlogView.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/styles/atom-one-dark";
import { loadMarkdown } from "@/utils/markdownLoader";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const customComponents = {
  h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-6 mb-3 border-b pb-1.5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-5 mb-2" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-1.5" {...props} />,
  h5: ({ node, ...props }) => <h5 className="text-lg font-semibold mt-3 mb-1" {...props} />,
  h6: ({ node, ...props }) => <h6 className="text-base font-semibold mt-2.5 mb-0.5" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc mb-4 pl-4" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal mb-4 pl-4" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  a: ({ node, ...props }) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400" {...props} />,
  img: ({ node, ...props }) => <img className="max-w-full h-auto my-4 rounded-lg shadow-md" {...props} />,
  table: ({ node, ...props }) => <table className="w-full border-collapse my-4" {...props} />,
  th: ({ node, ...props }) => <th className="border p-2 text-left bg-gray-100 dark:bg-gray-700" {...props} />,
  td: ({ node, ...props }) => <td className="border p-2" {...props} />,
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
};

export default function BlogView({ filePath, downloadLink }) {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (filePath) {
      setLoading(true);
      setError(null);
      loadMarkdown(filePath)
        .then(content => {
          setMarkdown(content);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading markdown:", err);
          setError(new Error(`Failed to load content for: ${filePath}. Please ensure the file exists.`));
          setLoading(false);
        });
    } else {
      setMarkdown("No content path provided. Please select a topic/subtopic.");
      setLoading(false);
    }
  }, [filePath]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading blog content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive px-4">
        <p className="font-bold text-lg mb-2">Error loading blog content!</p>
        <p className="text-sm">{error.message}</p>
        <p className="text-xs text-gray-500 mt-2">Please ensure the markdown file exists at the correct path in `public/content/`.</p>
      </div>
    );
  }

  return (
    <div className={`blog-content p-6 max-w-4xl mx-auto ${isDark ? 'prose-invert' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {markdown}
      </ReactMarkdown>
      {downloadLink && (
        <div className="mt-8 text-center">
          <Button asChild className={`bg-primary hover:bg-primary/90 ${isDark ? 'text-white' : 'text-foreground'}`}>
            <a href={downloadLink} target="_blank" rel="noopener noreferrer">
              Download .docx File
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}