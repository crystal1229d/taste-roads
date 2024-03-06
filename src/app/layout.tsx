import '@/styles/globals.css'
import { NextProvider, NextLayout } from './providers'
import { Metadata } from 'next'
import { Suspense } from 'react'
import FullPageLoader from '@/components/FullPageLoader'

export const metadata: Metadata = {
  title: 'Fastcampus NextMap',
  description: 'Next.js 13을 이용한 맛집 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextProvider>
          <NextLayout>
            <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
          </NextLayout>
        </NextProvider>
      </body>
    </html>
  )
}
