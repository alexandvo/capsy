import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PoppinsBold, PoppinsMedium, PoppinsRegular } from "./fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${PoppinsBold.variable} ${PoppinsMedium.variable} ${PoppinsRegular.variable}`}>{children}</body>
    </html>
  );
}
