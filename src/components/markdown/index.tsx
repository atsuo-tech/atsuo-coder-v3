"use client";

import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNotifications } from '@toolpad/core/useNotifications';
import 'katex/dist/katex.min.css';

const components: Components = {
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const notifications = useNotifications();
    return match ? (
      <div style={{ position: 'relative' }}>
        <SyntaxHighlighter
          style={oneLight as any}
          customStyle={{ fontSize: "0.8em" }}
          language={match[1]}
        >
          {children as string}
        </SyntaxHighlighter>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <Button
            onClick={() => {
              "use client";
              navigator.clipboard.writeText(children as string).then(() => {
                notifications.show("Copied!");
              })
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table: ({ node, ...props }) => <Table {...props} />,
  thead: ({ node, ...props }) => <TableHead {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => <TableCell {...(props as any)} component="th" />,
  td: ({ node, ...props }) => <TableCell {...(props as any)} />,
};


export default function Markdown({ md }: { md: string }) {

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        [remarkMath, { singleDollarTextMath: true }],
      ]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {md}
    </ReactMarkdown>
  );

}
