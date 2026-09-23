// pages/_app.js
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
//import WatermarkBackground from "@/components/WatermarkBackground";
import { PointsProvider } from "@/context/PointContext";
import "@/styles/globals.css";
import Head from "next/head";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Revisely — Turn any PDF into a quiz</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${jakarta.variable} font-sans flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          <PointsProvider>
            <Component {...pageProps} />
          </PointsProvider>
        </main>
        <Footer />
      </div>
    </>
  );
}
