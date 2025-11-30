"use client";

import { Accordion, AccordionSummary, Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from "remark-breaks";
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNotifications } from '@toolpad/core/useNotifications';
import 'katex/dist/katex.min.css';

const components: Components = {
  code({ node, className, children, ...props }) {
    if(className == "details") {
      const lines = (children as string).split("\n");
      return (
        <Accordion>
          <AccordionSummary>{lines[0]}</AccordionSummary>
          <Divider />
          <Box sx={{ m: 2 }}>
            <Markdown md={lines.slice(1).join("\n")} />
          </Box>
        </Accordion>
      );
    }
    const match = /language-(\w+)/.exec(className || '');
    const notifications = useNotifications();
    if (match && match[1] == "tex") {
      return (
        <div style={{ background: "#f3f3f3", display: "block", padding: ".5rem", fontSize: "0.9em", lineHeight: "0.5" }}>
          <Markdown md={"$" + (children as string).split("\n").slice(0, -1).map((line) => line.replaceAll(" ", "~")).join('$\n$') + "$"} />
        </div>
      )
    }
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
        remarkBreaks,
      ]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {md}
    </ReactMarkdown>
  );

}
