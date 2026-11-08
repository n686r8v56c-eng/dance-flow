
import React,{useEffect,useRef,useState,useCallback} from 'react';
import {Download,Upload,LogOut,RefreshCw,ChevronDown} from 'lucide-react';
import AuthGate from './AuthGate.jsx';
import CoreStudio from './CoreStudio.jsx';
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
const defaultStudio=()=>({
 version:2,items:[],isolationSearchChecklist:{},levelNames:Object.fromEntries(GENRES.map(g=>[g.id+':massage',[...VIDEO_GENRE_TABS[g.id]]])),
 groupNames:Object.fromEntries(GENRES.map(g=>[g.id+':massage','영상 인박스'])),
 studios:Object.fromEntries(GENRES.map(g=>[g.id,{techniques:[],yogaTechniques:[],massageTechniques:[],routines:[],logs:[]}]))
});
function normalizeStudio(source){
 const initial=defaultStudio(),raw=source&&typeof source==='object'?source:{};
 const studios={...initial.studios};
 for(const genre of GENRES){
  const s=raw.studios?.[genre.id]||{};
  studios[genre.id]=Object.fromEntries(['techniques','yogaTechniques','massageTechniques','routines','logs'].map(key=>[key,Array.isArray(s[key])?s[key]:[]]));
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
 return {...initial,items:Array.isArray(raw.items)?raw.items:[],isolationSearchChecklist:raw.isolationSearchChecklist&&typeof raw.isolationSearchChecklist==='object'&&!Array.isArray(raw.isolationSearchChecklist)?Object.fromEntries(Object.entries(raw.isolationSearchChecklist).filter(([id,value])=>/^g[0-4]:p[0-7]:t\d+$/.test(id)&&[0,1,2].includes(value))):{},levelNames,groupNames:{...initial.groupNames,...(raw.groupNames||{})},studios};
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
     const incoming=normalizeStudio(remote?.payload?.danceStudioV2);
     skipFirst.current=true;setData(incoming);setLoaded(true);setSync('동기화됨');
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
