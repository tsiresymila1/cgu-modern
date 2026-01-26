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
        h1: 'h2',
        p: ({ node, ...props }) => <p {...props} className="mb-4 text-sm" />,
        a: ({ node, ...props }) => <a {...props} className="text-primary hover:underline text-sm" />,
        li: ({ node, ...props }) => <li {...props} className="text-sm" />,
      }}>{content}</ReactMarkdown>
    </article>
  );
}
