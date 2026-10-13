import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { SelectedWorks } from "@/components/sections/selected-works";
import { Philosophy } from "@/components/sections/philosophy";
import { ExperienceRail } from "@/components/sections/experience-rail";
import { SkillsBento } from "@/components/sections/skills-bento";
import { ContactCta } from "@/components/sections/contact-cta";
import { fetchSiteProfile } from "@/server/services/site-profile.service";
import { fetchPublishedProjects } from "@/server/services/project.service";
import { fetchSkills } from "@/server/services/skill.service";
import { fetchExperiences } from "@/server/services/experience.service";
import { fetchEducations } from "@/server/services/education.service";

export const revalidate = 60;

export default async function Home() {
  const [siteProfile, projects, skills, experiences, educations] = await Promise.all([
    fetchSiteProfile().catch(() => null),
    fetchPublishedProjects().catch(() => []),
    fetchSkills().catch(() => []),
    fetchExperiences().catch(() => []),
    fetchEducations().catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1">
        <Hero profile={siteProfile as never} />
        <SelectedWorks projects={projects as never} />
        <Philosophy profile={siteProfile as never} />
        <ExperienceRail experiences={experiences as never} educations={educations as never} />
        <SkillsBento skills={skills as never} />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
