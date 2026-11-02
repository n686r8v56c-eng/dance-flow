import React,{useCallback,useEffect,useRef,useState} from 'react';
import {Play,Pause,Upload,Music2,Repeat,Volume2} from 'lucide-react';
import './audio-coach.css';
const storage='dance-flow-audio-v1';
const openDb=()=>new Promise((resolve,reject)=>{const request=indexedDB.open(storage,1);request.onupgradeneeded=()=>request.result.createObjectStore('tracks');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
const readTrack=async id=>{const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction('tracks');const r=tx.objectStore('tracks').get(id);r.onsuccess=()=>{resolve(r.result);db.close()};r.onerror=()=>{reject(r.error);db.close()}})};
const storeTrack=async(id,file)=>{const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction('tracks','readwrite');tx.objectStore('tracks').put(file,id);tx.oncomplete=()=>{resolve();db.close()};tx.onerror=()=>{reject(tx.error);db.close()}})};
const seconds=s=>{const m=String(s||'').match(/^(\d+):([0-5]\d)$/);return m?Number(m[1])*60+Number(m[2]):NaN};
const number=(v,fallback)=>Number.isFinite(Number(v))&&Number(v)>0?Number(v):fallback;
export default function AudioCoach({choreo,sequences,moves,bpm,half,offset,selected,onSelect,loop,notify,onTrackName}){
 const audio=useRef(null),ctx=useRef(null),objectUrl=useRef(null),tickRef=useRef(-1),cueRef=useRef(''),timeRef=useRef(0);
 const [track,setTrack]=useState(null),[loaded,setLoaded]=useState(false),[running,setRunning]=useState(false);
 const [sound,setSound]=useState('clap'),[voice,setVoice]=useState(true),[counts,setCounts]=useState(false);
 const [musicVol,setMusicVol]=useState(.9),[soundVol,setSoundVol]=useState(.5),[voiceVol,setVoiceVol]=useState(.8);
 const [time,setTime]=useState(0),[duration,setDuration]=useState(0);
 const [activeSection,setActiveSection]=useState(0);
 const effectiveBpm=number(bpm,70)/(half?2:1),beatSeconds=60/effectiveBpm;
 const sections=choreo.segments||[];
 const allMoves=sections.map(seg=>({seg,steps:sequences.find(s=>s.id===seg.sequenceId)?.steps||[]}));
 const sectionAt=t=>{let i=sections.findIndex(s=>t>=seconds(s.start)&&t<seconds(s.end));if(i<0)i=sections.findIndex(s=>t<seconds(s.end));return i<0?Math.max(0,sections.length-1):i};
 const infoAt=t=>{
  const index=sectionAt(t),entry=allMoves[index],start=seconds(entry?.seg?.start)||0;
  const count=Math.max(0,Math.floor((t-Math.max(start,offset))/beatSeconds));
  const steps=entry?.steps||[];let used=0,stepIndex=0;
  while(stepIndex<steps.length-1&&used+number(steps[stepIndex].counts,8)<=count){used+=number(steps[stepIndex].counts,8);stepIndex++}
  const step=steps[stepIndex],next=steps[stepIndex+1]||allMoves[index+1]?.steps?.[0];
  const moveName=s=>moves.find(m=>m.id===s?.moveId)?.name||(s?'삭제된 동작':'동작 미지정');
  return {index,beat:((Math.max(0,Math.floor((t-offset)/beatSeconds)))%8)+1,section:entry?.seg?.name||'구간 미지정',move:moveName(step),next:moveName(next),cue:step?index+':'+stepIndex:index+':section',cueBeat:used+number(step?.counts,8)-count};
 };
 const info=infoAt(time);
 useEffect(()=>{let active=true;const id=choreo.id;if(!id)return;readTrack(id).then(file=>{if(active&&file instanceof Blob){const u=URL.createObjectURL(file);objectUrl.current=u;setTrack({url:u,name:file.name||'저장된 음악',file})}}).catch(()=>{});return()=>{active=false;if(objectUrl.current){URL.revokeObjectURL(objectUrl.current);objectUrl.current=null}}},[choreo.id]);
 useEffect(()=>{if(audio.current)audio.current.volume=musicVol},[musicVol]);
 useEffect(()=>{if(!track)return;const a=audio.current;if(a)a.load()},[track?.url]);
 const upload=async e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('audio/')&&!/\.(mp3|m4a|wav|aac|ogg)$/i.test(file.name)){notify('음악 파일을 선택해 줘.');return}
  try{await storeTrack(choreo.id,file);if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);const url=URL.createObjectURL(file);objectUrl.current=url;setTrack({url,name:file.name,file});setTime(0);setRunning(false);onTrackName?.(file.name);notify('이 기기에 음악을 저장했어.')}catch{notify('저장 공간이 부족하거나 기기 저장이 제한됐어. 새로 열면 다시 선택해야 할 수 있어.');if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);const url=URL.createObjectURL(file);objectUrl.current=url;setTrack({url,name:file.name,file})}
 };
 const playTick=useCallback((clap,volume)=>{if(volume<=0)return;try{if(!ctx.current)ctx.current=new (window.AudioContext||window.webkitAudioContext)();const c=ctx.current;if(c.state==='suspended')c.resume();const t=c.currentTime;
  if(clap){const length=Math.floor(c.sampleRate*.095),buf=c.createBuffer(1,length,c.sampleRate),data=buf.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,2);const source=c.createBufferSource(),high=c.createBiquadFilter(),gain=c.createGain();high.type='highpass';high.frequency.value=1000;gain.gain.value=volume*.55;source.buffer=buf;source.connect(high);high.connect(gain);gain.connect(c.destination);source.start(t)}
  else{const oscillator=c.createOscillator(),gain=c.createGain();oscillator.frequency.value=880;gain.gain.setValueAtTime(volume*.15,t);gain.gain.exponentialRampToValueAtTime(.001,t+.075);oscillator.connect(gain);gain.connect(c.destination);oscillator.start(t);oscillator.stop(t+.08)}
 }catch{}},[]);
 const speak=useCallback((phrase)=>{if(!('speechSynthesis' in window))return;try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(phrase);u.lang='ko-KR';u.rate=1.12;u.volume=voiceVol;window.speechSynthesis.speak(u)}catch{}},[voiceVol]);
 const seek=t=>{if(audio.current){audio.current.currentTime=Math.max(0,t);setTime(audio.current.currentTime);tickRef.current=-1;cueRef.current=''}};
 const toggle=()=>{const a=audio.current;if(!a||!track)return;if(a.paused){ctx.current?.resume().catch(()=>{});a.play().then(()=>setRunning(true)).catch(()=>notify('재생 버튼을 다시 눌러 줘.'))}else{a.pause();setRunning(false);window.speechSynthesis?.cancel()}};
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>{const a=audio.current;if(!a||a.paused)return;const t=a.currentTime;timeRef.current=t;setTime(t);
  const i=sectionAt(t);setActiveSection(i);
  if(loop&&selected===i){const end=seconds(sections[i]?.end),start=seconds(sections[i]?.start);if(Number.isFinite(end)&&Number.isFinite(start)&&end>start&&t>=end-.06){a.currentTime=start;tickRef.current=-1;cueRef.current='';return}}
  if(t<offset)return;
  const beat=Math.floor((t-offset)/beatSeconds);if(beat!==tickRef.current){tickRef.current=beat;if(sound!=='off')playTick(sound==='clap',soundVol);if(counts&&beat%8===0)speak('하나')}
  const info=infoAt(t);if(info.cue!==cueRef.current){cueRef.current=info.cue;if(voice&&info.move!=='동작 미지정')speak(info.move)}
 },40);return()=>clearInterval(timer)},[running,sections,bpm,half,offset,sound,soundVol,voice,counts,voiceVol,selected,loop]);
 useEffect(()=>()=>{window.speechSynthesis?.cancel();ctx.current?.close()},[]);
 return <div className="coach-root">
  <label className="coach-upload"><Upload size={15}/> 음악 파일 선택 · 이 기기에 저장<input type="file" accept="audio/*,.mp3,.m4a,.wav" onChange={upload}/></label>
  {track?<><div className="coach-track"><Music2 size={18}/><strong>{track.name}</strong></div><audio ref={audio} src={track.url} preload="metadata" onLoadedMetadata={e=>{setLoaded(true);setDuration(e.currentTarget.duration||0)}} onPause={()=>setRunning(false)} onPlay={()=>setRunning(true)} onEnded={()=>setRunning(false)}/>
   <div className="coach-player"><button type="button" onClick={toggle}><span>{running?'❚❚':'▶'}</span> {running?'일시정지':'재생'}</button><input aria-label="재생 위치" type="range" min="0" max={duration||1} step=".1" value={Math.min(time,duration||1)} onChange={e=>seek(Number(e.target.value))}/><small>{Math.floor(time/60)}:{String(Math.floor(time%60)).padStart(2,'0')}</small></div>
  </>:<p className="studio-hint">음악 파일은 이 기기에만 저장돼. 다른 기기에서는 파일을 다시 선택해야 해.</p>}
  <div className="coach-guide"><div className="coach-guide-head"><strong>{info.section}</strong><small>{effectiveBpm} BPM · {half?'하프타임':'일반'}</small></div><small>현재 동작</small><strong className="coach-current">{info.move}</strong><small>다음 · {info.next}</small><div className="coach-dots">{Array.from({length:8},(_,i)=><span key={i} className={info.beat===i+1?'active':''}>{i+1}</span>)}</div></div>
  <div className="coach-settings"><div className="coach-choices">{[['off','끄기'],['tick','메트로놈'],['clap','박수']].map(([key,title])=><button type="button" key={key} className={sound===key?'active':''} onClick={()=>setSound(key)}>{title}</button>)}</div>
   <label><input type="checkbox" checked={voice} onChange={e=>setVoice(e.target.checked)}/> 동작 안내 음성</label><label><input type="checkbox" checked={counts} onChange={e=>setCounts(e.target.checked)}/> 8카운트 시작 안내</label>
   {[['음악',musicVol,setMusicVol],['박자 소리',soundVol,setSoundVol],['안내 음성',voiceVol,setVoiceVol]].map(([name,value,update])=><label className="coach-volume" key={name}><span>{name}</span><input type="range" min="0" max="1" step=".05" value={value} onChange={e=>update(Number(e.target.value))}/><small>{Math.round(value*100)}%</small></label>)}
  </div>
  <p className="studio-hint">소리는 음악 재생 시간 기준으로 맞춰져. 첫 박이 어긋나면 편집 모드에서 시작 위치를 조정해 줘. iPhone 음성 안내는 기기 설정에 따라 늦게 들릴 수 있어.</p>
 </div>;
}