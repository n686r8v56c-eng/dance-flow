import React,{useEffect,useRef,useState} from 'react';
import {Check,ChevronDown,ChevronUp,X} from 'lucide-react';
import {ISOLATION_SEARCH_SECTIONS} from './SearchGuide.jsx';
import './SearchChecklist.css';

const entries=ISOLATION_SEARCH_SECTIONS.map((section,genreIndex)=>({
 name:section.name,
 id:'isolation:genre:'+genreIndex,
 parts:section.rows.map(([body,techniques],partIndex)=>({
  body,
  id:'body:'+partIndex,
  items:techniques.split(',').map((name,techIndex)=>({
   name:name.trim(),
   id:'g'+genreIndex+':p'+partIndex+':t'+techIndex
  }))
 }))
}));
const allItems=entries.flatMap(g=>g.parts.flatMap(p=>p.items));
const statusNames=['미검색','검색 중','검색 완료'];
export default function SearchChecklist({statuses={},onSetStatus,onClose}){
 const [genre,setGenre]=useState(0),[openParts,setOpenParts]=useState([0]);
 const closeButton=useRef(null);
 useEffect(()=>{
  const onKey=e=>{if(e.key==='Escape')onClose()};
  window.addEventListener('keydown',onKey);
  closeButton.current?.focus();
  return()=>window.removeEventListener('keydown',onKey);
 },[onClose]);
 const current=entries[genre];
 const calc=items=>items.reduce((s,x)=>{const n=Number(statuses[x.id])||0;if(n===1)s.started++;if(n===2)s.done++;return s},{started:0,done:0});
 const full=calc(allItems);
 return <div className="dance-check-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="dance-check-dialog" role="dialog" aria-modal="true" aria-label="Isolation 검색 체크리스트">
   <header className="dance-check-header">
    <div><h2>검색 체크리스트</h2><span>Isolation · {full.done}/{allItems.length} 완료 · {full.started} 검색 중</span></div>
    <button ref={closeButton} type="button" aria-label="체크리스트 닫기" onClick={onClose}><X size={20}/></button>
   </header>
   <div className="dance-check-scroll">
    <p className="dance-check-hint">한 번 누르면 <strong>보라색</strong>, 두 번 누르면 <strong>✓ 완료</strong>, 세 번 누르면 초기화돼.</p>
    <div className="dance-check-genres" role="tablist" aria-label="댄스 장르">
     {entries.map((item,index)=>{
      const total=item.parts.flatMap(p=>p.items),count=calc(total);
      return <button key={item.id} type="button" role="tab" aria-selected={genre===index} className={genre===index?'selected':''} onClick={()=>{setGenre(index);setOpenParts([0]);}}>
       {item.name.split(' — ')[1]||item.name}<small>{count.done}/{total.length}</small>
      </button>
     })}
    </div>
    {current.parts.map((part,index)=>{
     const active=openParts.includes(index),progress=calc(part.items);
     return <section className="dance-check-part" key={part.id}>
      <button type="button" className="dance-check-part-head" aria-expanded={active} onClick={()=>setOpenParts(old=>active?old.filter(x=>x!==index):[...old,index])}>
       <strong>{String(index+1).padStart(2,'0')} · {part.body}</strong><span>{progress.done}/{part.items.length} 완료</span>{active?<ChevronUp size={17}/>:<ChevronDown size={17}/>}
      </button>
      {active&&<div className="dance-check-items">{part.items.map(item=>{
       const status=Math.min(2,Math.max(0,Number(statuses[item.id])||0));
       return <button key={item.id} type="button" aria-label={item.name+' · '+statusNames[status]+' (누르면 다음 단계)'} aria-pressed={status===2} className={'dance-check-item status-'+status} onClick={()=>onSetStatus(item.id,(status+1)%3)}>
        <span className="dance-check-square">{status===2&&<Check size={14} strokeWidth={3}/>}</span>
        <span>{item.name}</span>
       </button>;
      })}</div>}
     </section>;
    })}
   </div>
  </section>
 </div>;
}
