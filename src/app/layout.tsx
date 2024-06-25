import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import SetSeesionToken from "./app-provider"
import "./globals.css"
import SlideSession from "@/components/slide-session"
import { AccountType } from "@/schemaValidations/account.schema"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Enode",
    template: "%s | Enode"
  },
  description: "Logtechub Enode"
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("sessionToken")?.value
  let user: AccountType | null = null
  if (sessionToken) {
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Toaster richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SetSeesionToken initialSessionToken={sessionToken} user={user}>
            {children}
            <SlideSession />
          </SetSeesionToken>
        </ThemeProvider>
      </body>
    </html>
  )
}
