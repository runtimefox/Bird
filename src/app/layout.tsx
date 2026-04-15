import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Provider from './provider';

import localFont from 'next/font/local';

const chirpRegular = localFont({
  src: './fonts/Chirp-Regular.ttf',
  weight: '400',
  variable: '--font-chirp-regular',
});

const chirpMedium = localFont({
  src: './fonts/Chirp-Medium.ttf',
  weight: '500',
  variable: '--font-chirp-medium',
});

const chirpBold = localFont({
  src: './fonts/Chirp-Bold.ttf',
  weight: '700',
  variable: '--font-chirp-bold',
});

export const metadata: Metadata = {
  title: 'Bird',
  description: 'Bird - a big platform for posting ',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${chirpRegular.variable} ${chirpMedium.variable}  ${chirpBold.variable}`}
    >
      <Provider>
        <body className={`font-chirp-regular antialiased`}>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </Provider>
    </html>
  );
}
