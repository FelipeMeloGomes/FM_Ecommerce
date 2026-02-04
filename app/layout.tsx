import { Toaster } from "react-hot-toast";
import "./globals.css";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
