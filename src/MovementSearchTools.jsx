import React,{useEffect,useRef,useState} from 'react';
import {Check,ChevronDown,ChevronUp,Copy,X} from 'lucide-react';
import {MOVEMENT_CATALOGS} from './movementCatalogs.js';
import './SearchChecklist.css';
import './BodyRollSearchChecklist.css';
import './SearchGuide.css';

const statusesText=['미검색','검색 중','검색 완료'];
const summarize=(items,statuses)=>items.reduce((n,item)=>{
 const v=Number(statuses[item.id])||0;
 if(v===1)n.started++;
 if(v===2)n.done++;
 return n;
},{started:0,done:0});
function getGroups(area){
 const catalog=MOVEMENT_CATALOGS[area];
 return catalog.styles.map((style,genreIndex)=>({
  ...style,
  parts:catalog.categories.map((category,categoryIndex)=>({
   name:category,
   items:style.items.map(([part,name],position)=>({
    part,name,id:'g'+genreIndex+':t'+position,
    query:style.genre+' '+name+' Dance Tutorial'
   })).filter(x=>x.part===categoryIndex)
  })).filter(part=>part.items.length)
 }));
}
function Modal({title,onClose,children,checklist=false}){
 const closeRef=useRef(null);
 useEffect(()=>{
  const onKey=e=>{if(e.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);closeRef.current?.focus();
  return()=>document.removeEventListener('keydown',onKey);
 },[onClose]);
 return <div className={checklist?'dance-check-overlay':'dance-guide-overlay'} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className={checklist?'dance-check-dialog':'dance-guide-dialog'} role="dialog" aria-modal="true" aria-label={title}>
   <header className={checklist?'dance-check-header':'dance-guide-header'}>
    <h2>{title}</h2>
    <button ref={closeRef} type="button" aria-label={title+' 닫기'} onClick={onClose}><X size={20}/></button>
   </header>
   {children}
  </section>
 </div>;
}
export function MovementSearchChecklist({area,statuses={},onSetStatus,onClose}){
 const catalog=MOVEMENT_CATALOGS[area],entries=getGroups(area);
 const [genre,setGenre]=useState(0),[openParts,setOpenParts]=useState([0]),[copied,setCopied]=useState('');
 const all=entries.flatMap(entry=>entry.parts.flatMap(part=>part.items));
 const total=summarize(all,statuses);
 const onCopy=async(text,id)=>{
  try{await navigator.clipboard.writeText(text);setCopied(id)}catch{setCopied('복사 실패')}
 };
 return <Modal title="검색 체크리스트" onClose={onClose} checklist>
  <div className="dance-check-scroll">
   <p className="dance-check-hint">{catalog.title} · <strong>{total.done}/{all.length} 검색 완료</strong> · {total.started} 검색 중. 검색어는 복사할 수 있고, 체크는 <strong>미검색 → 보라색 → ✓ 완료 → 미검색</strong> 순환해.</p>
   <div className="dance-check-genres" role="tablist" aria-label="댄스 장르">
    {entries.map((entry,index)=>{
     const items=entry.parts.flatMap(part=>part.items),count=summarize(items,statuses);
     return <button key={entry.genre} type="button" role="tab" aria-selected={genre===index} className={genre===index?'selected':''} onClick={()=>{setGenre(index);setOpenParts([0]);setCopied('')}}>{entry.label}<small>{count.done}/{items.length}</small></button>
    })}
   </div>
   {entries[genre].parts.map((part,index)=>{
    const open=openParts.includes(index),count=summarize(part.items,statuses);
    return <section className="dance-check-part" key={part.name}>
     <button type="button" className="dance-check-part-head" aria-expanded={open} onClick={()=>setOpenParts(previous=>open?previous.filter(x=>x!==index):[...previous,index])}>
      <strong>{part.name}</strong><span>{count.done}/{part.items.length} 완료</span>{open?<ChevronUp size={17}/>:<ChevronDown size={17}/>}
     </button>
     {open&&<div className="dance-check-items">{part.items.map(item=>{
      const status=Math.min(2,Math.max(0,Number(statuses[item.id])||0));
      return <div className="bodyroll-check-row" key={item.id}>
       <button type="button" className={'dance-check-item bodyroll-check-state status-'+status} aria-label={item.name+' · '+statusesText[status]+' (누르면 다음 단계)'} aria-pressed={status===2} onClick={()=>onSetStatus(item.id,(status+1)%3)}>
        <span className="dance-check-square">{status===2&&<Check size={14} strokeWidth={3}/>}</span>
        <span className="bodyroll-check-text"><strong>{item.name}</strong><small>{item.query}</small></span>
       </button>
       <button type="button" className="bodyroll-check-copy" aria-label={item.name+' 검색어 복사'} onClick={()=>onCopy(item.query,item.id)} title="검색어 복사">
        {copied===item.id?'✓':<Copy size={16}/>}
       </button>
      </div>
     })}</div>}
    </section>;
   })}
   <p className="bodyroll-check-notice">장르별 검색용 추천 문구야. 모든 명칭이 업계 공통 공식 용어는 아니므로 실제 시범 영상을 보고 동작을 확인해.</p>
  </div>
 </Modal>;
}
export function MovementSearchGuide({area,onClose}){
 const catalog=MOVEMENT_CATALOGS[area];
 const guide=catalog.guide;
 return <Modal title="검색가이드" onClose={onClose}>
  <div className="dance-guide-body">
   <p><strong>{catalog.title}</strong> · {guide.focus}. 💜</p>
   <p>기술명과 검색어, 검색 상태는 <strong>체크리스트</strong>에 있으므로 여기에는 비교·관찰·주의사항만 남겼어.</p>
   <section className="dance-guide-section">
    <h3>1. 장르별 관찰 포인트</h3>
    {guide.observation.map(([name,description])=><div className="dance-guide-observation" key={name}>
     <h4>{name}</h4><p>{description}</p>
    </div>)}
   </section>
   <section className="dance-guide-section">
    <h3>2. 헷갈리기 쉬운 움직임 비교</h3>
    {guide.comparisons.map(([name,description])=><div className="dance-guide-comparison" key={name}>
     <strong>{name}</strong><p>{description}</p>
    </div>)}
   </section>
   <section className="dance-guide-section">
    <h3>3. 영상 선택과 연습 시 주의사항</h3>
    <ul>{guide.cautions.map(note=><li key={note}>{note}</li>)}</ul>
    <p>영상은 <strong>정면·측면, 느린 시범·실제 음악 속도</strong>를 함께 관찰하면 좋아. 움직임의 시작점, 체중 이동, 리듬 강세가 이름보다 중요할 때가 있어.</p>
   </section>
   <p className="dance-guide-note">공통 대분류는 기술을 찾고 비교하기 위한 분류야. 한 동작이 여러 패턴에 해당할 수 있지만 우선 대표 대분류 하나에 모았어.</p>
  </div>
 </Modal>;
}
