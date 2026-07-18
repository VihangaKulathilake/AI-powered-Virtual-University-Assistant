import React from 'react';

/**
 * Format bytes to readable size string (KB, MB, GB etc.)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format timestamp string into a friendly hour/minute or day/month string
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Format timestamp string into a friendly display date (e.g. July 18, 2026)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Helper to join tailwind CSS classes conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Inner CodeBlock component written using pure React.createElement to support pure TS file compiles
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return React.createElement(
    'div',
    { className: 'my-4 rounded-xl overflow-hidden border border-slate-750 bg-slate-950 font-mono text-xs shadow-md' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-850 text-[10px] font-semibold text-slate-400 select-none' },
      React.createElement('span', null, language.toUpperCase() || 'CODE'),
      React.createElement(
        'button',
        {
          onClick: handleCopy,
          type: 'button',
          className: 'hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800 border border-slate-750 hover:bg-slate-700 cursor-pointer'
        },
        copied ? 'Copied!' : 'Copy'
      )
    ),
    React.createElement(
      'pre',
      { className: 'p-4 overflow-x-auto text-slate-350 leading-relaxed font-mono' },
      React.createElement('code', null, code)
    )
  );
};

/**
 * Helper to parse inline bold and code tags.
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const content: React.ReactNode[] = [];
  let currentText = text;
  let inlineIndex = 0;

  while (currentText.length > 0) {
    const boldStart = currentText.indexOf('**');
    const codeStart = currentText.indexOf('`');

    if (boldStart !== -1 && (codeStart === -1 || boldStart < codeStart)) {
      if (boldStart > 0) {
        content.push(React.createElement(React.Fragment, { key: inlineIndex++ }, currentText.substring(0, boldStart)));
      }

      const boldEnd = currentText.indexOf('**', boldStart + 2);
      if (boldEnd !== -1) {
        const boldVal = currentText.substring(boldStart + 2, boldEnd);
        content.push(React.createElement('strong', { key: inlineIndex++, className: 'font-bold text-slate-100' }, boldVal));
        currentText = currentText.substring(boldEnd + 2);
      } else {
        content.push(React.createElement(React.Fragment, { key: inlineIndex++ }, currentText.substring(boldStart)));
        currentText = '';
      }
    } else if (codeStart !== -1) {
      if (codeStart > 0) {
        content.push(React.createElement(React.Fragment, { key: inlineIndex++ }, currentText.substring(0, codeStart)));
      }

      const codeEnd = currentText.indexOf('`', codeStart + 1);
      if (codeEnd !== -1) {
        const codeVal = currentText.substring(codeStart + 1, codeEnd);
        content.push(
          React.createElement(
            'code',
            {
              key: inlineIndex++,
              className: 'px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 font-mono text-xs text-indigo-300'
            },
            codeVal
          )
        );
        currentText = currentText.substring(codeEnd + 1);
      } else {
        content.push(React.createElement(React.Fragment, { key: inlineIndex++ }, currentText.substring(codeStart)));
        currentText = '';
      }
    } else {
      content.push(React.createElement(React.Fragment, { key: inlineIndex++ }, currentText));
      currentText = '';
    }
  }

  return content;
}

/**
 * Parses basic markdown syntax using React.createElement (supporting code blocks, headings, bullets, bold and code tags)
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const parts = text.split('```');
  
  return parts.map((part, index) => {
    const isCodeBlock = index % 2 === 1;

    if (isCodeBlock) {
      const firstLineBreak = part.indexOf('\n');
      let language = 'code';
      let code = part;

      if (firstLineBreak !== -1) {
        language = part.substring(0, firstLineBreak).trim() || 'code';
        code = part.substring(firstLineBreak + 1);
      }

      if (code.endsWith('\n')) {
        code = code.slice(0, -1);
      }

      return React.createElement(CodeBlock, {
        key: index,
        code: code,
        language: language,
      });
    }

    const lines = part.split('\n');
    return React.createElement(
      React.Fragment,
      { key: index },
      lines.map((line, lineIndex) => {
        const trimmedLine = line.trim();

        // 1. Handle Horizontal Rules
        if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
          return React.createElement('hr', { key: lineIndex, className: 'my-4 border-slate-800' });
        }

        // 2. Handle Headings (e.g. ### Header)
        if (trimmedLine.startsWith('#')) {
          const hashCount = (trimmedLine.match(/^#+/) || [''])[0].length;
          const headingText = trimmedLine.replace(/^#+\s*/, '');
          const headingContent = parseInlineMarkdown(headingText);
          
          const headingClass = 'font-bold text-slate-100 mt-4 mb-2 tracking-tight';
          const headingSizes = {
            1: 'text-2xl border-b border-slate-800 pb-1.5',
            2: 'text-xl',
            3: 'text-lg',
            4: 'text-base',
            5: 'text-sm text-slate-350',
            6: 'text-xs text-slate-400',
          };
          
          const tag = `h${Math.min(hashCount, 6)}`;
          return React.createElement(
            tag,
            { key: lineIndex, className: `${headingClass} ${headingSizes[hashCount as keyof typeof headingSizes] || 'text-sm'}` },
            headingContent
          );
        }

        // 3. Handle Bullets
        const isBullet = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');
        const lineText = isBullet ? trimmedLine.substring(2) : line;
        const content = parseInlineMarkdown(lineText);

        if (isBullet) {
          return React.createElement(
            'ul',
            { key: lineIndex, className: 'list-disc pl-5 my-1.5 space-y-1 text-slate-400' },
            React.createElement('li', { className: 'text-sm' }, content)
          );
        }

        // 4. Regular Paragraphs
        return React.createElement(
          'p',
          { key: lineIndex, className: 'min-h-[1.2rem] my-1 text-sm text-slate-350 leading-relaxed' },
          content.length === 0 ? ' ' : content
        );
      })
    );
  });
}
