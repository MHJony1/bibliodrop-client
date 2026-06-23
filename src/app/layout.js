// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
// import { Toaster } from "react-hot-toast";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: 'BiblioDrop',
//   description: 'Your library platform',
//   icons: {
//     icon: '/favicon.png',
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="flex flex-col min-h-screen font-sans relative">
//         <Navbar />
//         <main className="flex-1 relative z-10">        
//           {children}
//         </main>
//         <Footer />
//         <Toaster />
//       </body>
//     </html>
//   );
// }







import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


//Meta data

export const metadata = {
  title: {
    default: "BiblioDrop",
    template: "%s | BiblioDrop",
  },
  description: "Your local library, delivered.",
  icons: {
    icon: '/favicon.png',
  },
};

//  Force viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-screen font-sans relative">
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}