import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Slider Puzzle Challenge',
  description: 'A 6x6 sliding puzzle. Can you solve it?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

