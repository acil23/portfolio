import { prisma } from "@/lib/db/prisma";
import { EduClient } from "./edu-client";
export const dynamic="force-dynamic";
export default async function Page(){
 let items:unknown[]=[];try{items=await prisma.education.findMany({orderBy:[{startDate:"desc"},{createdAt:"desc"}]})}catch{}
 return(<div className="mx-auto max-w-[1080px]"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">05 — Education</p><h1 className="font-display mt-2 text-[28px] tracking-[-0.02em]">Education</h1><p className="mt-2 text-sm text-black/50">Manage education entries.</p><div className="mt-8"><EduClient initial={items as never[]}/></div></div>)
}
