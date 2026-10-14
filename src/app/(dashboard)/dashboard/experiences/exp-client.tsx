"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
type E={id:string;company:string;position:string;startDate:string;endDate:string|null;detail:string|null};
function toInput(d:string|null|undefined){if(!d)return"";try{return new Date(d).toISOString().slice(0,10)}catch{return""}}
export function ExpClient({initial}:{initial:E[]}){
 const rtr=useRouter();const[items,setItems]=useState(initial);
 const[f,setF]=useState({company:"",position:"",startDate:"",endDate:"",detail:""});
 const[editing,setEditing]=useState<string|null>(null);const[msg,setMsg]=useState<string|null>(null);const[loading,setLoading]=useState(false);
 async function refresh(){const r=await fetch("/api/admin/experiences");if(r.ok){const j=await r.json();setItems(j.data??[]) } }
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMsg(null);
  const body={company:f.company,position:f.position,startDate:f.startDate,endDate:f.endDate||null,detail:f.detail||null};
  try{const url=editing?`/api/admin/experiences/${editing}`:"/api/admin/experiences";const method=editing?"PATCH":"POST";
   const res=await fetch(url,{method,headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   const j=await res.json();if(!res.ok){setMsg(JSON.stringify(j.errors??j.message));return;}
   setF({company:"",position:"",startDate:"",endDate:"",detail:""});setEditing(null);await refresh();setMsg(editing?"Updated":"Created");rtr.refresh();
  }finally{setLoading(false)}}
 function edit(x:E){setEditing(x.id);setF({company:x.company,position:x.position,startDate:toInput(x.startDate),endDate:toInput(x.endDate),detail:x.detail??""});scrollTo({top:0,behavior:"smooth"})}
 async function del(id:string){if(!confirm("Delete?"))return;const x=await fetch(`/api/admin/experiences/${id}`,{method:"DELETE"});if(x.ok){await refresh();rtr.refresh()}}
 return(<div className="space-y-6">
  <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-6">
   <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">{editing?"Edit":"New"} experience</p>
   <div className="mt-4 grid gap-4 md:grid-cols-2">
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Company *</span><input value={f.company} onChange={e=>setF({...f,company:e.target.value})} required className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Position *</span><input value={f.position} onChange={e=>setF({...f,position:e.target.value})} required className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Start date *</span><input type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})} required className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">End date (empty = present)</span><input type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})} className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
    <label className="space-y-1.5 md:col-span-2"><span className="font-mono text-[11px] text-black/60">Detail</span><textarea value={f.detail} onChange={e=>setF({...f,detail:e.target.value})} rows={2} className="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2.5 text-sm outline-none focus:border-gold/40"/></label>
   </div>
   <div className="mt-4 flex gap-2"><button disabled={loading} className="h-10 rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-60">{loading?"...":editing?"Update":"Create"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setF({company:"",position:"",startDate:"",endDate:"",detail:""})}} className="h-10 rounded-full border border-black/10 px-5 text-sm">Cancel</button>}</div>
   {msg&&<p className="mt-3 font-mono text-xs text-gold break-all">{msg}</p>}
  </form>
  <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white"><table className="w-full text-sm"><thead><tr className="border-b border-black/5 bg-black/[0.02]"><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Company</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Position</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Period</th><th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Actions</th></tr></thead>
  <tbody>{items.length===0?<tr><td colSpan={4} className="px-4 py-10 text-center font-mono text-xs text-black/30">No experience</td></tr>:items.map(x=><tr key={x.id} className="border-b border-black/5 last:border-0"><td className="px-4 py-3 font-medium">{x.company}</td><td className="px-4 py-3 text-black/60">{x.position}</td><td className="px-4 py-3 font-mono text-xs text-black/50">{toInput(x.startDate)} → {toInput(x.endDate)||"Present"}</td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={()=>edit(x)} className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px]">Edit</button><button onClick={()=>del(x.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-[11px] text-red-600">Delete</button></div></td></tr>)}</tbody></table></div>
 </div>)
}
