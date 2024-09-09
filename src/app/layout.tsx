import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameMatch",
  description: "Find your next favorite game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <Providers>
          <Navbar />
          <div className="max-w-4xl mx-auto p-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
