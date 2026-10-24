import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkillsBento } from "@/components/sections/skills-bento";
import { fetchSkills } from "@/server/services/skill.service";

export const revalidate = 60;
export const metadata = { title: "Skills & Lab" };

export default async function SkillsPage() {
  const skills = (await fetchSkills().catch(() => [])) as Awaited<ReturnType<typeof fetchSkills>>;
  return (
    <div className="flex min-h-screen flex-col bg-[#060609] text-white">
      <Navbar />
      <main className="flex-1 pt-12">
        <SkillsBento skills={skills as never} />
      </main>
      <Footer />
    </div>
  );
}
