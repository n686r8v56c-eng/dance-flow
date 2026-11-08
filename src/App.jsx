
import React,{useEffect,useRef,useState,useCallback} from 'react';
import {Download,Upload,LogOut,RefreshCw,ChevronDown} from 'lucide-react';
import AuthGate from './AuthGate.jsx';
import CoreStudio from './CoreStudio.jsx';
import {ISOLATION_SEARCH_SECTIONS} from './SearchGuide.jsx';
import {BODYROLL_STYLE_SECTIONS} from './bodyRollCatalog.js';
import {MOVEMENT_CATALOGS} from './movementCatalogs.js';
import {supabase,getRemote,saveRemote} from './supabase.js';
import './style.css';

const GENRES=[
  {id:'isolation',name:'Isolation · 아이솔레이션'},
  {id:'bodyroll',name:'Body Roll / Wave · 바디롤·웨이브'},
  {id:'bounce',name:'Bounce / Groove · 바운스·그루브'},
  {id:'footwork',name:'Footwork · 풋워크'},
  {id:'armmovement',name:'Arm Movement · 팔동작'},
  {id:'gaze',name:'Gaze / Pose · 시선·포즈'}
];
const VIDEO_GENRE_TABS={
  "isolation": [
    "벨리댄스",
    "팝핑",
    "애니",
    "힙합",
    "재즈펑크"
  ],
  "bodyroll": [
    "재즈펑크",
    "힐댄스",
    "벨리댄스",
    "팝핑",
    "바차타"
  ],
  "bounce": [
    "힙합",
    "하우스",
    "댄스홀",
    "아프로",
    "셔플"
  ],
  "footwork": [
    "하우스",
    "셔플",
    "브레이킹",
    "힙합",
    "락킹"
  ],
  "armmovement": [
    "왁킹",
    "보깅",
    "터팅",
    "락킹",
    "재즈펑크"
  ],
  "gaze": [
    "보깅",
    "재즈펑크",
    "힐댄스",
    "왁킹",
    "케이팝"
  ]
};
const TABS=[{id:'inbox',name:'영상 인박스'},{id:'techniques',name:'기술 라이브러리'},{id:'timer',name:'타이머'},{id:'records',name:'기록'}];
const CACHE='dance-flow-v2:';
const ISOLATION_INBOX_SEED_VERSION=1;
const ISOLATION_TECHNIQUE_SEED_VERSION=1;
const BODYROLL_CATALOG_SEED_VERSION=1;
const FOUR_GENRE_CATALOG_SEED_VERSION=1;
const FOUR_GENRE_IDS=['bounce','footwork','armmovement','gaze'];
function seedIsolationInbox(items){
 // Seed five genre tabs using the already-curated search checklist catalog.
 // Existing user-created records, linked videos and archives are left untouched.
 const next=[...items];
 for(const [slot,section] of ISOLATION_SEARCH_SECTIONS.entries()){
  const matching=next.filter(item=>item.area==='isolation'&&item.group==='massage'&&Number(item.level||1)===slot+1);
  const existing=new Set(matching.map(item=>String(item.en||item.title||item.ko||'').trim().toLocaleLowerCase()));
  let sort=Math.max(999,...matching.map(item=>Number(item.sort)||0))+1;
  for(const [body,names] of section.rows){
   for(const [position,original] of names.split(',').entries()){
    const name=original.trim(),key=name.toLocaleLowerCase();
    if(!name||existing.has(key))continue;
    next.push({id:'dance:isolation:inbox:v1:'+slot+':'+body.replace(/[^a-z]/gi,'').toLowerCase()+':'+position,
     area:'isolation',group:'massage',level:slot+1,sort:sort++,archived:false,
     title:name,en:name,ko:'',note:'',videos:[]});
    existing.add(key);
   }
  }
 }
 return next;
}
const ISOLATION_BODY_CATEGORIES=['Head','Neck','Shoulders','Chest / Rib Cage','Abdomen','Pelvis / Hips','Arms','Legs'];
function seedIsolationTechniques(existingTechniques){
 // Combine the five genre-specific lists into one unique set for each body part.
 // Do not alter previously saved, user-entered technique objects.
 const union=ISOLATION_BODY_CATEGORIES.map(()=>new Map());
 ISOLATION_SEARCH_SECTIONS.forEach((section,genreIndex)=>{
  const genre=section.name.split(' — ')[0];
  section.rows.forEach(([body,names])=>{
   const category=ISOLATION_BODY_CATEGORIES.indexOf(body);
   if(category<0)return;
   names.split(',').map(x=>x.trim()).filter(Boolean).forEach(name=>{
    const key=name.toLocaleLowerCase();
    if(!union[category].has(key))union[category].set(key,{name,genres:[genre],seedGenreIndex:genreIndex});
    else {
     const item=union[category].get(key);
     if(!item.genres.includes(genre))item.genres.push(genre);
    }
   });
  });
 });
 const result=[...existingTechniques];
 const existing=ISOLATION_BODY_CATEGORIES.map(()=>new Set());
 result.forEach(t=>{
  const category=Number(t?.category);
  if(category>=0&&category<existing.length){
   const name=String(t.name||t.en||'').trim().toLocaleLowerCase();
   if(name)existing[category].add(name);
  }
 });
 union.forEach((part,category)=>{
  for(const [key,entry] of part){
   if(existing[category].has(key))continue;
   result.push({
    id:'dance:isolation:technique:v1:'+category+':'+Array.from(part.keys()).indexOf(key),
    name:entry.name,en:'',category,posture:'',muscles:'',description:'',
    tags:[],danceGenres:entry.genres,
    imageUrl:'',imagePath:'',imageRemoved:false,
    references:[],removedReferenceIds:[],notes:''
   });
   existing[category].add(key);
  }
 });
 return result;
}
// Insert genre-specific video inbox titles and merge shared techniques by category.
function seedBodyRollCatalog(items,techniques){
 const nextItems=[...items],nextTechniques=[...techniques];
 const categoryNames=new Map();
 nextTechniques.forEach(row=>{
  const category=Number(row?.category);
  if(!categoryNames.has(category))categoryNames.set(category,new Set());
  const name=String(row?.name||row?.en||'').trim().toLocaleLowerCase();
  if(name)categoryNames.get(category).add(name);
 });
 const catalog=new Map();
 BODYROLL_STYLE_SECTIONS.forEach((section,genreIndex)=>{
  const level=genreIndex+1;
  const existing=nextItems.filter(row=>row.area==='bodyroll'&&row.group==='massage'&&Number(row.level||1)===level);
  const present=new Set(existing.map(row=>String(row.en||row.title||row.ko||'').trim().toLocaleLowerCase()));
  let sort=Math.max(999,...existing.map(row=>Number(row.sort)||0))+1;
  section.items.forEach(([category,name],position)=>{
   const key=name.toLocaleLowerCase();
   if(!present.has(key)){
    nextItems.push({
     id:'dance:bodyroll:inbox:v1:'+genreIndex+':'+position,
     area:'bodyroll',group:'massage',level,sort:sort++,archived:false,
     title:name,en:name,ko:'',note:'',videos:[]
    });
    present.add(key);
   }
   const group=category+':'+key;
   if(!catalog.has(group))catalog.set(group,{category,name,genres:[]});
   if(!catalog.get(group).genres.includes(section.genre))catalog.get(group).genres.push(section.genre);
  });
 });
 let position=0;
 for(const item of catalog.values()){
  const key=item.name.toLocaleLowerCase();
  const present=categoryNames.get(item.category)||new Set();
  if(present.has(key))continue;
  nextTechniques.push({
   id:'dance:bodyroll:technique:v1:'+position,
   name:item.name,en:'',category:item.category,
   posture:'',muscles:'',description:'',tags:[],danceGenres:item.genres,
   imageUrl:'',imagePath:'',imageRemoved:false,references:[],removedReferenceIds:[],notes:''
  });
  present.add(key);categoryNames.set(item.category,present);position++;
 }
 return {items:nextItems,techniques:nextTechniques};
}
// One-time, non-destructive catalog migration for four movement genres.
// Existing video links, manual rows, image references, notes and archived rows are untouched.
function seedMovementCatalog(area,items,techniques){
 const styleGroups=MOVEMENT_CATALOGS[area].styles;
 const nextItems=[...items],nextTechniques=[...techniques];
 const namesByCategory=new Map();
 nextTechniques.forEach(row=>{
  const category=Number(row?.category),label=String(row?.name||row?.en||'').trim().toLocaleLowerCase();
  if(!namesByCategory.has(category))namesByCategory.set(category,new Set());
  if(label)namesByCategory.get(category).add(label);
 });
 const merged=new Map();
 styleGroups.forEach((style,genreIndex)=>{
  const level=genreIndex+1;
  const sameLevel=nextItems.filter(row=>row.area===area&&row.group==='massage'&&Number(row.level||1)===level);
  const existing=new Set(sameLevel.map(row=>String(row.en||row.title||row.ko||'').trim().toLocaleLowerCase()));
  let sort=Math.max(999,...sameLevel.map(row=>Number(row.sort)||0))+1;
  style.items.forEach(([category,name],position)=>{
   const key=name.trim().toLocaleLowerCase();
   if(!key)return;
   if(!existing.has(key)){
    nextItems.push({
     id:'dance:'+area+':inbox:v1:'+genreIndex+':'+position,
     area,group:'massage',level,sort:sort++,archived:false,
     title:name,en:name,ko:'',note:'',videos:[]
    });
    existing.add(key);
   }
   // Merge same technique within the same movement family, but preserve genre references.
   const identity=category+':'+key;
   if(!merged.has(identity))merged.set(identity,{category,name,genres:[]});
   const record=merged.get(identity);
   if(!record.genres.includes(style.genre))record.genres.push(style.genre);
  });
 });
 let position=0;
 for(const item of merged.values()){
  const key=item.name.toLocaleLowerCase();
  const present=namesByCategory.get(item.category)||new Set();
  if(present.has(key))continue;
  nextTechniques.push({
   id:'dance:'+area+':technique:v1:'+position++,
   name:item.name,en:'',category:item.category,
   posture:'',muscles:'',description:'',tags:[],danceGenres:item.genres,
   imageUrl:'',imagePath:'',imageRemoved:false,references:[],removedReferenceIds:[],notes:''
  });
  present.add(key);namesByCategory.set(item.category,present);
 }
 return {items:nextItems,techniques:nextTechniques};
}
const defaultStudio=()=>({
 version:2,items:[],isolationSearchChecklist:{},bodyRollSearchChecklist:{},movementSearchChecklists:{},fourGenreCatalogSeedVersion:FOUR_GENRE_CATALOG_SEED_VERSION,isolationTechniqueSeedVersion:ISOLATION_TECHNIQUE_SEED_VERSION,bodyRollCatalogSeedVersion:BODYROLL_CATALOG_SEED_VERSION,levelNames:Object.fromEntries(GENRES.map(g=>[g.id+':massage',[...VIDEO_GENRE_TABS[g.id]]])),
 groupNames:Object.fromEntries(GENRES.map(g=>[g.id+':massage','영상 인박스'])),
 studios:Object.fromEntries(GENRES.map(g=>[g.id,{techniques:[],yogaTechniques:[],massageTechniques:[],routines:[],logs:[]}]))
});
function normalizeStudio(source){
 const initial=defaultStudio(),raw=source&&typeof source==='object'?source:{};
 const shouldSeed=Number(raw.isolationInboxSeedVersion||0)<ISOLATION_INBOX_SEED_VERSION;
 const shouldSeedTechniques=Number(raw.isolationTechniqueSeedVersion||0)<ISOLATION_TECHNIQUE_SEED_VERSION;
 const shouldSeedBodyRoll=Number(raw.bodyRollCatalogSeedVersion||0)<BODYROLL_CATALOG_SEED_VERSION;
 const shouldSeedFourGenres=Number(raw.fourGenreCatalogSeedVersion||0)<FOUR_GENRE_CATALOG_SEED_VERSION;
 const studios={...initial.studios};
 for(const genre of GENRES){
  const s=raw.studios?.[genre.id]||{};
  studios[genre.id]=Object.fromEntries(['techniques','yogaTechniques','massageTechniques','routines','logs'].map(key=>[key,Array.isArray(s[key])?s[key]:[]]));
  if(genre.id==='isolation'&&shouldSeedTechniques)studios[genre.id].techniques=seedIsolationTechniques(studios[genre.id].techniques);
 }
 const existingItems=shouldSeed?seedIsolationInbox(Array.isArray(raw.items)?raw.items:[]):Array.isArray(raw.items)?raw.items:[];
 const bodyRollSeed=shouldSeedBodyRoll?seedBodyRollCatalog(existingItems,studios.bodyroll.techniques):null;
 if(bodyRollSeed)studios.bodyroll.techniques=bodyRollSeed.techniques;
 let items=bodyRollSeed?bodyRollSeed.items:existingItems;
 if(shouldSeedFourGenres){
  for(const area of FOUR_GENRE_IDS){
   const next=seedMovementCatalog(area,items,studios[area].techniques);
   items=next.items;studios[area].techniques=next.techniques;
  }
 }
 const savedNames=raw.levelNames&&typeof raw.levelNames==='object'&&!Array.isArray(raw.levelNames)?raw.levelNames:{};
 const levelNames={...initial.levelNames,...savedNames};
 // Map generic old Level 1-5 labels into the new genre labels without touching video items.
 for(const genre of GENRES){
  const key=genre.id+':massage',old=Array.isArray(savedNames[key])?savedNames[key]:[];
  levelNames[key]=VIDEO_GENRE_TABS[genre.id].map((name,index)=>{
   const stored=typeof old[index]==='string'?old[index].trim():'';
   return stored&&!/^Level\s*[1-5]$/i.test(stored)?stored:name;
  });
 }
 return {...initial,items,isolationInboxSeedVersion:ISOLATION_INBOX_SEED_VERSION,isolationTechniqueSeedVersion:ISOLATION_TECHNIQUE_SEED_VERSION,bodyRollCatalogSeedVersion:BODYROLL_CATALOG_SEED_VERSION,fourGenreCatalogSeedVersion:FOUR_GENRE_CATALOG_SEED_VERSION,movementSearchChecklists:Object.fromEntries(FOUR_GENRE_IDS.map(area=>[area,raw.movementSearchChecklists?.[area]&&typeof raw.movementSearchChecklists[area]==='object'&&!Array.isArray(raw.movementSearchChecklists[area])?Object.fromEntries(Object.entries(raw.movementSearchChecklists[area]).filter(([id,value])=>/^g[0-4]:t\d+$/.test(id)&&[0,1,2].includes(value))):{}])),isolationSearchChecklist:raw.isolationSearchChecklist&&typeof raw.isolationSearchChecklist==='object'&&!Array.isArray(raw.isolationSearchChecklist)?Object.fromEntries(Object.entries(raw.isolationSearchChecklist).filter(([id,value])=>/^g[0-4]:p[0-7]:t\d+$/.test(id)&&[0,1,2].includes(value))):{},bodyRollSearchChecklist:raw.bodyRollSearchChecklist&&typeof raw.bodyRollSearchChecklist==='object'&&!Array.isArray(raw.bodyRollSearchChecklist)?Object.fromEntries(Object.entries(raw.bodyRollSearchChecklist).filter(([id,value])=>/^g[0-4]:t\d+$/.test(id)&&[0,1,2].includes(value))):{},levelNames,groupNames:{...initial.groupNames,...(raw.groupNames||{})},studios};
}
async function openCache(){
 if(!('indexedDB' in window))return null;
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open('dance-flow-studio-v2',1);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('studio'))r.result.createObjectStore('studio')};
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
 });
}
async function writeCache(id,value){
 try{
  const db=await openCache();if(!db)return;
  await new Promise((resolve,reject)=>{
   const tx=db.transaction('studio','readwrite');
   tx.objectStore('studio').put(value,CACHE+id);
   tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });db.close();
 }catch(error){console.warn('IndexedDB cache save failed',error);}
}
async function readCache(id){
 try{
  const db=await openCache();if(!db)return null;
  const value=await new Promise((resolve,reject)=>{
   const req=db.transaction('studio','readonly').objectStore('studio').get(CACHE+id);
   req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
  });db.close();return value;
 }catch{return null;}
}
function downloadJson(data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='dance-flow-studio-v2-'+new Date().toISOString().slice(0,10)+'.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function DanceStudio(){
 const [genre,setGenre]=useState('isolation'),[tab,setTab]=useState('inbox');
 const [data,setData]=useState(defaultStudio),[userId,setUserId]=useState('');
 const [loaded,setLoaded]=useState(false),[sync,setSync]=useState('불러오는 중'),[notice,setNotice]=useState('');
 const baseline=useRef(null),pending=useRef(null),saving=useRef(false),blocked=useRef(false),skipFirst=useRef(true),importInput=useRef(null);
 const update=useCallback(fn=>setData(prev=>{const next=structuredClone(prev);fn(next);return next;}),[]);
 useEffect(()=>{
  let active=true;
  (async()=>{
   try{
    const {data:identity,error:authError}=await supabase.auth.getUser();
    if(authError)throw authError;
    const id=identity?.user?.id;if(!id)throw Error('로그인 계정을 확인하지 못했어.');
    setUserId(id);
    try{
     const remote=await getRemote(id);
     if(!active)return;
     baseline.current=remote?.payload??null;
     const remoteStudio=remote?.payload?.danceStudioV2;
     const incoming=normalizeStudio(remoteStudio);
     // Persist first-time catalog migration, but never overwrite a failed remote read.
     skipFirst.current=Number(remoteStudio?.isolationInboxSeedVersion||0)>=ISOLATION_INBOX_SEED_VERSION && Number(remoteStudio?.isolationTechniqueSeedVersion||0)>=ISOLATION_TECHNIQUE_SEED_VERSION && Number(remoteStudio?.bodyRollCatalogSeedVersion||0)>=BODYROLL_CATALOG_SEED_VERSION && Number(remoteStudio?.fourGenreCatalogSeedVersion||0)>=FOUR_GENRE_CATALOG_SEED_VERSION;
     setData(incoming);setLoaded(true);setSync('동기화됨');
     writeCache(id,incoming);
    }catch(error){
     const cached=await readCache(id);
     if(!active)return;
     blocked.current=true;skipFirst.current=true;
     setData(normalizeStudio(cached));setLoaded(true);
     setSync('서버 오류 · 저장 보호');
     setNotice('서버를 읽지 못해 기기 캐시만 표시하고 서버 덮어쓰기를 막았어. '+error.message);
    }
   }catch(error){if(active){setSync('로그인 오류');setNotice(error.message)}}
  })();
  return()=>{active=false};
 },[]);
 const flush=useCallback(async()=>{
  if(!userId||saving.current||blocked.current||!pending.current)return;
  saving.current=true;
  try{
   while(pending.current&&!blocked.current){
    const snapshot=pending.current;pending.current=null;
    const next={...(baseline.current||{}),danceStudioV2:snapshot};
    try{
     await saveRemote(userId,next,baseline.current);
     baseline.current=next;setSync('동기화됨');
    }catch(error){
     pending.current=pending.current||snapshot;
     if(error.code==='DANCE_CONFLICT'){
      blocked.current=true;setSync('기기 간 충돌 · 저장 중단');
      setNotice('다른 기기의 변경을 감지했어. 서버 데이터는 덮어쓰지 않았고 로컬 사본을 보존했어. JSON 백업 후 새로고침해 줘.');
     }else{
      setSync('전송 대기 · 로컬 보관');
      setNotice('서버 저장이 지연돼. 연결 후 재시도해 줘. '+(error.message||''));
     }
     break;
    }
   }
  }finally{saving.current=false;}
 },[userId]);
 useEffect(()=>{
  if(!loaded||!userId)return;
  writeCache(userId,data);
  if(skipFirst.current){skipFirst.current=false;return;}
  pending.current=data;
  if(blocked.current){setSync('저장 보호 중');return;}
  setSync('저장 대기');
  const timer=setTimeout(flush,700);
  return()=>clearTimeout(timer);
 },[loaded,userId,data,flush]);
 useEffect(()=>{
  const online=()=>flush();
  const visible=()=>{if(document.visibilityState==='visible')flush()};
  window.addEventListener('online',online);document.addEventListener('visibilitychange',visible);
  return()=>{window.removeEventListener('online',online);document.removeEventListener('visibilitychange',visible)};
 },[flush]);
 const importJson=async(file)=>{
  if(!file)return;
  try{
   const raw=JSON.parse(await file.text());
   if(raw.format!=='dance-flow-studio-v2'||!raw.data||!Array.isArray(raw.data.items))throw Error('새 Dance Flow 백업 JSON만 가져올 수 있어.');
   if(!window.confirm('새 Dance Flow의 현재 내용을 백업 내용으로 교체할까?'))return;
   setData(normalizeStudio(raw.data));setNotice('백업을 불러왔어.');
  }catch(error){setNotice('JSON 가져오기 실패: '+error.message);}
 };
 if(!loaded)return <div className="loading"><p role="status">{notice||'댄스 스튜디오를 불러오는 중…'}</p></div>;
 return <div className="app">
  <header className="header">
   <label className="area-switch dance-genre-switch"><span className="sr-only">장르 선택</span><select aria-label="장르 선택" value={genre} onChange={e=>setGenre(e.target.value)}>{GENRES.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><ChevronDown size={15}/></label>
   <span className="sr-only" role="status">{sync}</span>
   <div className="header-right">
    <button type="button" className="icon-btn" title="JSON 백업" aria-label="JSON 백업" onClick={()=>downloadJson({format:'dance-flow-studio-v2',exportedAt:new Date().toISOString(),data})}><Download size={17}/></button>
    <button type="button" className="icon-btn" title="JSON 가져오기" aria-label="JSON 가져오기" onClick={()=>importInput.current?.click()}><Upload size={17}/></button>
    <input ref={importInput} type="file" accept=".json,application/json" className="sr-only" onChange={e=>{const file=e.target.files?.[0];e.target.value='';importJson(file)}}/>
    <button type="button" className="icon-btn" title="클라우드 저장 재시도" aria-label="클라우드 저장 재시도" onClick={()=>blocked.current?setNotice('저장 보호 중이야. JSON 백업 후 새로고침해 줘.'):flush()}><RefreshCw size={17}/></button>
    <button type="button" className="icon-btn" title="로그아웃" aria-label="로그아웃" onClick={()=>supabase.auth.signOut()}><LogOut size={17}/></button>

   </div>
  </header>
  {notice&&<p role="status" style={{maxWidth:900,margin:'10px auto',padding:'0 16px',fontSize:13,color:'#7c5399',lineHeight:1.5}}>{notice}</p>}
  <main className="content care-content" style={{maxWidth:900}}>
   <CoreStudio key={genre} area={genre} tab={tab} data={data} onUpdate={update} sync={sync} database={supabase} userId={userId}/>
  </main>
  <nav className="bottom-nav" aria-label="댄스 스튜디오 탭">{TABS.map(item=><button key={item.id} type="button" className={tab===item.id?'active':''} onClick={()=>setTab(item.id)}>{item.name}</button>)}</nav>
 </div>;
}
export default function App(){return <AuthGate client={supabase} appName="Dance Flow" description="나만의 움직임 기술을 모으고 연습해요."><DanceStudio/></AuthGate>}
