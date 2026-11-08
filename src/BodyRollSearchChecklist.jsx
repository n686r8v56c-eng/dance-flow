import React,{useEffect,useRef,useState} from 'react';
import {Check,ChevronDown,ChevronUp,Copy,X} from 'lucide-react';
import {BODYROLL_STYLE_SECTIONS,BODYROLL_CATEGORIES} from './bodyRollCatalog.js';
import './SearchChecklist.css';
import './BodyRollSearchChecklist.css';

// These are search suggestions, not claims of universally standardized dance terminology.
const specialQueries={
 'Belly Dance|Camel':'Belly Dance Camel Undulation Tutorial',
 'Belly Dance|Walking Bodywave':'Belly Dance Walking Camel Body Wave Tutorial',
 'Belly Dance|Reverse Camel':'Belly Dance Reverse Camel Tutorial',
 'Belly Dance|Reverse Undulation':'Belly Dance Reverse Undulation Tutorial',
 'Belly Dance|Belly Roll':'Belly Dance Belly Roll Tutorial',
 'Bachata Sensual|Onda':'Bachata Sensual Onda Tutorial',
 'Bachata Sensual|Reverse Onda':'Bachata Sensual Reverse Onda Tutorial',
 'Bachata Sensual|Onda Lateral':'Bachata Sensual Onda Lateral Tutorial',
 'Bachata Sensual|Continuous Body Undulation':'Bachata Sensual Continuous Body Wave Tutorial',
 'Heels Dance|Floor Body Wave':'Heels Dance Floor Body Wave Tutorial',
 'Popping|Ticking Body Wave':'Popping Ticking Wave Tutorial'
};
const entries=BODYROLL_STYLE_SECTIONS.map((style,genreIndex)=>({
 name:style.label,genre:style.genre,
 parts:BODYROLL_CATEGORIES.map((category,categoryIndex)=>({
  name:category,
  items:style.items.map(([part,name],position)=>({part,name,position})).filter(x=>x.part===categoryIndex).map(x=>({
   id:'g'+genreIndex+':t'+x.position,
   name:x.name,
   query:specialQueries[style.genre+'|'+x.name]||style.genre+' '+x.name+' Tutorial'
  }))
 })).filter(part=>part.items.length)
}));
const all=entries.flatMap(entry=>entry.parts.flatMap(part=>part.items));
const states=['미검색','검색 중','검색 완료'];
const summarize=(items,statuses)=>items.reduce((t,item)=>{
 const v=Number(statuses[item.id])||0;
 if(v===1)t.started++;
 if(v===2)t.done++;
 return t;
},{started:0,done:0});
export default function BodyRollSearchChecklist({statuses={},onSetStatus,onClose}){
 const [genre,setGenre]=useState(0),[openParts,setOpenParts]=useState([0]);
 const [copied,setCopied]=useState('');
 const closeRef=useRef(null);
 useEffect(()=>{
  const handleKey=e=>{if(e.key==='Escape')onClose()};
  window.addEventListener('keydown',handleKey);
  closeRef.current?.focus();
  return()=>window.removeEventListener('keydown',handleKey);
 },[onClose]);
 const total=summarize(all,statuses);
 const copy=async(query,id)=>{
  try{await navigator.clipboard.writeText(query);setCopied(id);}
  catch{setCopied('복사 실패');}
 };
 return <div className="dance-check-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="dance-check-dialog" role="dialog" aria-modal="true" aria-label="Body Roll / Wave 검색 체크리스트">
   <header className="dance-check-header">
    <div><h2>검색 체크리스트</h2><span>Body Roll / Wave · {total.done}/{all.length} 완료 · {total.started} 검색 중</span></div>
    <button ref={closeRef} type="button" aria-label="체크리스트 닫기" onClick={onClose}><X size={20}/></button>
   </header>
   <div className="dance-check-scroll">
    <p className="dance-check-hint">기술명과 추천 검색어를 장르별로 모았어. <strong>한 번: 보라색</strong> · <strong>두 번: ✓ 완료</strong> · <strong>세 번: 초기화</strong>. 복사는 체크 상태를 바꾸지 않아.</p>
    <div className="dance-check-genres" role="tablist" aria-label="댄스 장르">
     {entries.map((entry,index)=>{
      const items=entry.parts.flatMap(part=>part.items),counts=summarize(items,statuses);
      return <button key={entry.genre} type="button" role="tab" aria-selected={genre===index} className={genre===index?'selected':''} onClick={()=>{setGenre(index);setOpenParts([0]);setCopied('')}}>
       {entry.name}<small>{counts.done}/{items.length}</small>
      </button>;
     })}
    </div>
    {entries[genre].parts.map((part,index)=>{
     const open=openParts.includes(index),counts=summarize(part.items,statuses);
     return <section className="dance-check-part" key={part.name}>
      <button className="dance-check-part-head" type="button" aria-expanded={open} onClick={()=>setOpenParts(previous=>open?previous.filter(x=>x!==index):[...previous,index])}>
       <strong>{part.name}</strong><span>{counts.done}/{part.items.length} 완료</span>{open?<ChevronUp size={17}/>:<ChevronDown size={17}/>}
      </button>
      {open&&<div className="dance-check-items">{part.items.map(item=>{
       const status=Math.min(2,Math.max(0,Number(statuses[item.id])||0));
       return <div key={item.id} className="bodyroll-check-row">
        <button type="button" className={'dance-check-item bodyroll-check-state status-'+status} aria-pressed={status===2} aria-label={item.name+' · '+states[status]+' (누르면 다음 상태)'} onClick={()=>onSetStatus(item.id,(status+1)%3)}>
         <span className="dance-check-square">{status===2&&<Check size={14} strokeWidth={3}/>}</span>
         <span className="bodyroll-check-text"><strong>{item.name}</strong><small>{item.query}</small></span>
        </button>
        <button type="button" className="bodyroll-check-copy" title="검색어 복사" aria-label={item.name+' 검색어 복사'} onClick={()=>copy(item.query,item.id)}>
         {copied===item.id?'✓':<Copy size={16}/>}
        </button>
       </div>;
      })}</div>}
     </section>;
    })}
    <p className="bodyroll-check-notice">검색어는 영상 탐색을 위한 추천 문구야. 강사마다 기술 명칭이나 파동의 진행 방향은 다를 수 있으니 동작을 직접 비교해 봐.</p>
   </div>
  </section>
 </div>;
}
