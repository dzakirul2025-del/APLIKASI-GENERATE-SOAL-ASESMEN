import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({ content, className = '', block = false }) => {
  const renderedContent = useMemo(() => {
    if (!content) return '';

    // If pure LaTeX string without delimiters or instructed as block
    if (block && !content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (err) {
        return content;
      }
    }

    // Split and parse mixed text with $...$ or $$...$$
    // Regex for $$...$$ (display math) and $...$ (inline math)
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
    const parts = content.split(regex);

    return parts
      .map((part) => {
        if (!part) return '';

        // Block math $$...$$
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-rose-600 font-mono text-xs">${part}</span>`;
          }
        }

        // Inline math $...$
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-rose-600 font-mono text-xs">${part}</span>`;
          }
        }

        // Escaped block \[...\]
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const formula = part.slice(2, -2).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-rose-600 font-mono text-xs">${part}</span>`;
          }
        }

        // Escaped inline \(...\)
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const formula = part.slice(2, -2).trim();
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
          } catch (e) {
            return `<span class="text-rose-600 font-mono text-xs">${part}</span>`;
          }
        }

        // Standard text: preserve line breaks safely
        return part.replace(/\n/g, '<br/>');
      })
      .join('');
  }, [content, block]);

  return (
    <span
      className={`inline-block leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default MathView;
