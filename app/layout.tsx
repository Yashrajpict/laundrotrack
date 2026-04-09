import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LaundroTrack",
  description: "AI + ML laundry discovery and live tracking platform for students and hostelites."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            LaundroTrack
          </Link>
          <nav className="nav">
          <Link href="/student">Student Dashboard</Link>
          <Link href="/orders">Orders + Tracking</Link>
          <Link href="/owner">Laundry Owner</Link>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/signup">Signup</Link>
        </nav>
      </header>
      {children}
      </body>
    </html>
  );
}
