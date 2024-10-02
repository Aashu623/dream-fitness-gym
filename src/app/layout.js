'use client'
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from 'react-redux'
import store from '../redux/store'
import { Theme } from '@radix-ui/themes';
import { useRouter } from 'next/navigation'
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  const router = useRouter()
  return (
    <Provider store={store}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <button
            onClick={() => router.push('/dashboard/members')}
            className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 mt-3 absolute top-0 right-2"
          >
            Go to member List
          </button>
          <Theme>
            {children}
          </Theme>
        </body>
      </html>
    </Provider>
  );
}
