"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
type E={id:string;school:string;degree:string|null;field:string|null;startDate:string;endDate:string|null;detail:string|null};
const d=(v:string|null|undefined)=>{if(!v)return"";try{return new Date(v).toISOString().slice(0,10)}catch{return""}};
const I="w-full rounded-xl border border-black/10 bg-[#FDFCFB] px-3 py-2 text-sm outline-none";
export function EduClient({initial}:{initial:E[]}){
 const rtr=useRouter();const[items,setItems]=useState(initial);
 const[f,setF]=useState({school:"",degree:"",field:"",startDate:"",endDate:"",detail:""});
 const[editing,setEditing]=useState<string|null>(null);const[msg,setMsg]=useState<string|null>(null);const[loading,setLoading]=useState(false);
 async function refresh(){const r=await fetch("/api/admin/educations");if(r.ok){const j=await r.json();setItems(j.data??[]) } }
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMsg(null);
  const body={school:f.school,degree:f.degree||null,field:f.field||null,startDate:f.startDate,endDate:f.endDate||null,detail:f.detail||null};
  try{const url=editing?`/api/admin/educations/${editing}`:"/api/admin/educations";const m=editing?"PATCH":"POST";
   const res=await fetch(url,{method:m,headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   const j=await res.json();if(!res.ok){setMsg(JSON.stringify(j.errors??j.message));return;}
   setF({school:"",degree:"",field:"",startDate:"",endDate:"",detail:""});setEditing(null);await refresh();setMsg(editing?"Updated":"Created");rtr.refresh();
  }finally{setLoading(false)}}
 function edit(x:E){setEditing(x.id);setF({school:x.school,degree:x.degree??"",field:x.field??"",startDate:d(x.startDate),endDate:d(x.endDate),detail:x.detail??""});scrollTo({top:0,behavior:"smooth"})}
 async function del(id:string){if(!confirm("Delete?"))return;const x=await fetch(`/api/admin/educations/${id}`,{method:"DELETE"});if(x.ok){await refresh();rtr.refresh()}}
 return(<div className="space-y-6">
  <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-6">
   <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">{editing?"Edit":"New"} education</p>
   <div className="mt-4 grid gap-4 md:grid-cols-2">
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">School *</span><input value={f.school} onChange={e=>setF({...f,school:e.target.value})} required className={I}/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Degree</span><input value={f.degree} onChange={e=>setF({...f,degree:e.target.value})} className={I}/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Field</span><input value={f.field} onChange={e=>setF({...f,field:e.target.value})} className={I}/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">Start *</span><input type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})} required className={I}/></label>
    <label className="space-y-1.5"><span className="font-mono text-[11px] text-black/60">End</span><input type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})} className={I}/></label>
    <label className="space-y-1.5 md:col-span-2"><span className="font-mono text-[11px] text-black/60">Detail</span><textarea value={f.detail} onChange={e=>setF({...f,detail:e.target.value})} rows={2} className={I}/></label>
   </div>
   <div className="mt-4 flex gap-2"><button disabled={loading} className="h-10 rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-60">{loading?"...":editing?"Update":"Create"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setF({school:"",degree:"",field:"",startDate:"",endDate:"",detail:""})}} className="h-10 rounded-full border border-black/10 px-5 text-sm">Cancel</button>}</div>
   {msg&&<p className="mt-3 font-mono text-xs text-gold break-all">{msg}</p>}
  </form>
  <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white"><table className="w-full text-sm"><thead><tr className="border-b border-black/5 bg-black/[0.02]"><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">School</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Degree</th><th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Period</th><th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-black/40">Actions</th></tr></thead>
  <tbody>{items.length===0?<tr><td colSpan={4} className="px-4 py-10 text-center font-mono text-xs text-black/30">No education</td></tr>:items.map(x=><tr key={x.id} className="border-b border-black/5 last:border-0"><td className="px-4 py-3 font-medium">{x.school}</td><td className="px-4 py-3 text-black/60">{x.degree??"—"} {x.field?`· ${x.field}`:""}</td><td className="px-4 py-3 font-mono text-xs text-black/50">{d(x.startDate)} → {d(x.endDate)||"Present"}</td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={()=>edit(x)} className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px]">Edit</button><button onClick={()=>del(x.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-[11px] text-red-600">Delete</button></div></td></tr>)}</tbody></table></div>
 </div>)
}
