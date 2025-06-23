import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-maze-bg text-white font-sans">
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center bg-maze-bg">
          {children}
        </main>
      </body>
    </html>
  )
}
