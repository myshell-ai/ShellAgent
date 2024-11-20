// import 'reflect-metadata';
import './reflect-metadata-client-side';
import './globals.css';
import '@shellagent/ui/styles.css';
import '@shellagent/flow-engine/styles.css';
import '@shellagent/form-engine/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { PropsWithChildren } from 'react';

import MainLayout from '@/components/layouts/main-layout';

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: 'MyShell - Build, Share, and Own AI Chat.',
  description:
    'MyShell is a decentralized and comprehensive platform for discovering, creating, and investing AI-native apps.',
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/Reflect.min.js"
          as="script"
          fetchPriority="high"
        />
      </head>
      <body>
        <Script strategy="beforeInteractive" id="sc-global">
          {`
        window.$global = window.$global || {};
      `}
        </Script>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
