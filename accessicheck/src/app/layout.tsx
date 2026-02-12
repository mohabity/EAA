import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "./globals.css"
import AppLayout from "@/components/layout/AppLayout"

export const metadata: Metadata = {
  title: "AccessiCheck",
  description: "AccessiCheck — Audit d'accessibilité web EAA",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AppLayout>{children}</AppLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
