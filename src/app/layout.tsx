import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import StoreProvider from "./storeProvider"
import Navbar from "@/components/Navbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["100", "400", "500", "700", "900"],
})

export const metadata: Metadata = {
  title: "Weather Forecast App",
  description: "Infinite Scroll Weather Forecast App",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={"en"}>
      <body className={`${roboto.className}`}>
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </body>
    </html>
  )
}
