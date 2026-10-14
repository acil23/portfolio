import { prisma } from "@/lib/db/prisma";
import { SkillsClient } from "./skills-client";
export const dynamic="force-dynamic";
export default async function Page(){
 let items:unknown[]=[];try{items=await prisma.skill.findMany({orderBy:{createdAt:"desc"}})}catch{}
 return(<div className="mx-auto max-w-[1080px]"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">03 — Skills</p><h1 className="font-display mt-2 text-[28px] tracking-[-0.02em]">Skills</h1><p className="mt-2 text-sm text-black/50">Grouped on /skills by category.</p><div className="mt-8"><SkillsClient initial={items as never[]}/></div></div>)
}
