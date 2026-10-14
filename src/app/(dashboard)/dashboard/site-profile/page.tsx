import { prisma } from "@/lib/db/prisma";
import { SiteProfileClient } from "./site-profile-client";
export const dynamic="force-dynamic";
export default async function Page(){
 let profile:unknown=null;try{profile=await prisma.siteProfile.findFirst()}catch{}
 return(<div className="mx-auto max-w-[720px]"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">07 — Site Profile</p><h1 className="font-display mt-2 text-[28px] tracking-[-0.02em]">Site Profile</h1><p className="mt-2 text-sm text-black/50">Powers hero, about, and contact across the site.</p><div className="mt-8"><SiteProfileClient initial={profile as never}/></div></div>)
}
