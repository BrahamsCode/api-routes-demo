import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Routes Demo',
  description: 'Demo de API Routes con Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}