import './globals.css';

export const metadata = {
  title: 'A.T. Dey & Son',
  description: 'Premium Jewelers & Merchants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Forcing white background and dark slate text globally */}
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}