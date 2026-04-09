import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkThemeProvider } from "@/components/ClerkThemeProvider";
import { GlobalErrorWrapper } from "@/components/GlobalErrorWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-poppins antialiased">
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
