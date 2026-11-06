import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: { default: "BookNook | A little space for big stories", template: "%s | BookNook" },
  description: "Discover, borrow and share your next favourite book."
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><Navbar />{children}<Footer /><Toaster position="top-right" /></body></html>;
}
