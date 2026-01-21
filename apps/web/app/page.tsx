import Image from "next/image";
import {Header} from "@/components/landing-page/header";
import {Hero} from "@/components/landing-page/hero";
import {Stats} from "@/components/landing-page/stats";
import {Features} from "@/components/landing-page/features";
import {Footer} from "@/components/landing-page/footer";

export default function Home() {
  return (
    <main className="bg-background">
        <Header/>
        <Hero/>
        <Stats/>
        <Features/>
        <Footer/>
    </main>
  );
}
