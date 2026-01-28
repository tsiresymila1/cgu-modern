import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <article className={cn("prose prose-slate dark:prose-invert max-w-none lg:prose-xl text-sm", className)}>
      <ReactMarkdown components={{
        h1: ({ node, ...props }) => <div {...props} className="mb-4 text-xl font-bold " />,
        h2: ({ node, ...props }) => <div {...props} className="mb-4 text-lg font-bold" />,
        h3: ({ node, ...props }) => <div {...props} className="mb-4 text-lg font-bold" />,
        h4: ({ node, ...props }) => <div {...props} className="mb-4 text-md font-bold" />,
        h5: ({ node, ...props }) => <div {...props} className="mb-4 text-md font-bold" />,
        h6: ({ node, ...props }) => <div {...props} className="mb-4 text-sm font-bold" />,
        p: ({ node, ...props }) => <p {...props} className="mb-4 text-sm" />,
        a: ({ node, ...props }) => <a {...props} className="text-primary hover:underline text-sm" />,
        li: ({ node, ...props }) => <li {...props} className="text-sm" />,
      }}>{content}</ReactMarkdown>
    </article>
  );
}
