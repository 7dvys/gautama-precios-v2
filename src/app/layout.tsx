import '@/assets/globals.css'
import { Inter } from 'next/font/google'
import { RootNav } from '@/components/RootLayout'
const inter = Inter({ subsets: ['latin'] })

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Inicio - Movimientos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
        <RootNav/>
        {children}
        </main>
      </body>
    </html>
  )
}
