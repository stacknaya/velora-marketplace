import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velora | Extraordinary Rentals",
  description: "Book exotic cars, boats, yachts, RVs and aircraft from verified hosts."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
