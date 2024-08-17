import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "0xPartner | Blockchain-Powered Influencer Partnerships",
  description: "Revolutionize influencer marketing with 0xPartner. Create, manage, and track blockchain-secured partnerships between brands and influencers.",
  keywords: "blockchain, influencer marketing, smart contracts, partnerships, ethereum, web3",
  authors: [{ name: "0xPartner Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        {children}
        </Providers>
        </body>
    </html>
  );
}