import { prisma } from "@/lib/db/prisma";
import { InboxClient } from "./inbox-client";
export const dynamic="force-dynamic";
export default async function Page(){
 let items:unknown[]=[];try{items=await prisma.contactMessage.findMany({orderBy:{createdAt:"desc"}})}catch{}
 return(<div className="mx-auto max-w-[1080px]"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">06 — Inbox</p><h1 className="font-display mt-2 text-[28px] tracking-[-0.02em]">Inbox</h1><p className="mt-2 text-sm text-black/50">Messages from /contact.</p><div className="mt-8"><InboxClient initial={items as never[]}/></div></div>)
}
