import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkThemeProvider } from "@/components/ClerkThemeProvider";
import { GlobalErrorWrapper } from "@/components/GlobalErrorWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";

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
