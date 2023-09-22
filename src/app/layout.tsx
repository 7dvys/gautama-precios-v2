'use client'
import '@/assets/globals.css'
import { RootNav } from '@/components/RootLayout'
import { useContabiliumApi } from '@/hooks/useContabiliumApi'
import { useEffect } from 'react'
import { rootContext } from '@/context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const {login,vendors,products,updateProducts} = useContabiliumApi();
 
  return (
    <html lang="en">
      <body>
        <main>
        <RootNav/>
        <article className="tool">
          <rootContext.Provider value={{login,vendors,products,updateProducts}}>
            {children}
          </rootContext.Provider>
        </article>
        </main>
      </body>
    </html>
  )
}

