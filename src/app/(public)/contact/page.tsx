import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1">
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
