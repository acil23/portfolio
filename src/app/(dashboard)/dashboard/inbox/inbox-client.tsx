"use client";
import {useState} from "react";
type M={id:string;name:string;email:string;subject:string|null;message:string;isRead:boolean;createdAt:string};
export function InboxClient({initial}:{initial:M[]}){
 const[items,setItems]=useState(initial);
 async function refresh(){const r=await fetch("/api/admin/contact");if(r.ok){const j=await r.json();setItems(j.data??[])}}
 async function tog(m:M){const r=await fetch(`/api/admin/contact/${m.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({isRead:!m.isRead})});if(r.ok)refresh()}
 async function del(id:string){if(!confirm("Delete?"))return;const r=await fetch(`/api/admin/contact/${id}`,{method:"DELETE"});if(r.ok)refresh()}
 return(<div className="space-y-3">
  {items.length===0?<div className="rounded-2xl border border-black/10 bg-white p-10 text-center font-mono text-xs text-black/30">No messages</div>:items.map(m=><div key={m.id} className={`rounded-2xl border p-5 ${m.isRead?"border-black/10 bg-white":"border-gold/30 bg-gold/5"}`}>
   <div className="flex items-start justify-between gap-4"><div><p className="font-medium text-sm">{m.name} <span className="font-mono text-xs text-black/40">{m.email}</span></p><p className="font-mono text-[11px] text-black/40">{new Date(m.createdAt).toLocaleString()} · {m.subject??"No subject"} · {m.isRead?"Read":"Unread"}</p></div><div className="flex gap-2"><button onClick={()=>tog(m)} className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px]">{m.isRead?"Mark unread":"Mark read"}</button><button onClick={()=>del(m.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-[11px] text-red-600">Delete</button></div></div>
   <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{m.message}</p>
  </div>)}
 </div>)
}
