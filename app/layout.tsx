import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ClerkThemeProvider } from "@/components/ClerkThemeProvider";
import { GlobalErrorWrapper } from "@/components/GlobalErrorWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";
import { SanityLive } from "@/sanity/lib/live";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://clerk.accounts.dev" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://clerk.accounts.dev" />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased`}
      >
        <GlobalErrorWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <ClerkThemeProvider>
              {children}
              <SanityLive />
              <SpeedInsights />
              <Toaster />
            </ClerkThemeProvider>
          </ThemeProvider>
        </GlobalErrorWrapper>
      </body>
    </html>
  );
};
export default RootLayout;
