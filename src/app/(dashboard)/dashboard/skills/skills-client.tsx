"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
type S={id:string;name:string;category:string|null;level:number|null};
export function SkillsClient({initial}:{initial:S[]}){
 const rtr=useRouter();const[items,setItems]=useState(initial);
 const[form,setForm]=useState({name:"",category:"",level:"3"});
 const[editing,setEditing]=useState<string|null>(null);const[msg,setMsg]=useState<string|null>(null);const[loading,setLoading]=useState(false);
 async function refresh(){const r=await fetch("/api/admin/skills");if(r.ok){const j=await r.json();setItems(j.data??[]) } }
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMsg(null);
  const body={name:form.name,category:form.category||null,level:form.level===""?null:Number(form.level)};
  try{const url=editing?`/api/admin/skills/${editing}`:"/api/admin/skills";const method=editing?"PATCH":"POST";
   const res=await fetch(url,{method,headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   const j=await res.json();if(!res.ok){setMsg(j.message||"Failed");return;}
   setForm({name:"",category:"",level:"3"});setEditing(null);await refresh();setMsg(editing?"Updated":"Created");rtr.refresh();
  }finally{setLoading(false)}}
 function edit(s:S){setEditing(s.id);setForm({name:s.name,category:s.category??"",level:s.level==null?"":String(s.level)});scrollTo({top:0,behavior:"smooth"})}
 async function del(id:string){if(!confirm("Delete?"))return;const x=await fetch(`/api/admin/skills/${id}`,{method:"DELETE"});if(x.ok){await refresh();rtr.refresh()}}
 return(<div className="space-y-6">
  <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-6">
   <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">{editing?"Edit":"New"} skill</p>
   <div className="mt-4 grid gap-4 md:grid-cols-3">
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Name *</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Category</span><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Frontend" className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Level 0-5</span><input value={form.level} onChange={e=>setForm({...form,level:e.target.value})} placeholder="3" type="number" min={0} max={5} className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
   </div>
   <div className="mt-4 flex gap-2"><button disabled={loading} className="h-10 rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-60">{loading?"...":editing?"Update":"Create"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm({name:"",category:"",level:"3"})}} className="h-10 rounded-full border border-black/10 px-5 text-sm">Cancel</button>}</div>
   {msg&&<p className="mt-3 font-mono text-xs text-gold">{msg}</p>}
  </form>
  <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white"><table className="w-full text-sm"><thead><tr className="border-b border-black/5 bg-black/[0.02]"><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Name</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Category</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Level</th><th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Actions</th></tr></thead>
  <tbody>{items.length===0?<tr><td colSpan={4} className="px-4 py-10 text-center font-mono text-xs text-black/30">No skills</td></tr>:items.map(s=><tr key={s.id} className="border-b border-black/5 last:border-0"><td className="px-4 py-3 font-medium">{s.name}</td><td className="px-4 py-3 text-black/60">{s.category??"—"}</td><td className="px-4 py-3 font-mono text-xs">{s.level??"—"}</td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={()=>edit(s)} className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px]">Edit</button><button onClick={()=>del(s.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-[11px] text-red-600">Delete</button></div></td></tr>)}</tbody></table></div>
 </div>)
}
