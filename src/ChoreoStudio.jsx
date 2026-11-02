import React,{useEffect,useRef,useState} from 'react';
import {Play,Pause,Repeat,ExternalLink,Plus,ArrowUp,ArrowDown,Trash2,Check,Music2} from 'lucide-react';
import {uid,getYoutubeId,safeLink} from './data';
import './studio.css';
import TapBpm from './TapBpm';
import AudioCoach from './AudioCoach';
import usePracticeLog from './usePracticeLog';

const states=['미시작','동작 암기 중','음악 연습 중','완성'];
const toSeconds=(s)=>{const m=String(s||'').trim().match(/^(\d+):([0-5]\d)$/);return m?Number(m[1])*60+Number(m[2]):NaN};
const format=(s)=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');
const positive=(n,fallback)=>Number.isFinite(Number(n))&&Number(n)>0?Number(n):fallback;
const calcSeconds=(eights,bpm,half)=>Math.round(eights*8*60/(bpm/(half?2:1)));
const countStart=(sections,i)=>1+sections.slice(0,i).reduce((n,s)=>n+positive(s.eightCounts,1),0);

function YoutubePlayer({videoId,playerRef,onReady}) {
  const mount=useRef(null);
  useEffect(()=>{
    if(!videoId){playerRef.current=null;return;}
    let disposed=false,p=null;
    const create=()=>{
      if(disposed||!mount.current||!window.YT?.Player)return;
      p=new window.YT.Player(mount.current,{videoId,playerVars:{playsinline:1,rel:0,enablejsapi:1,origin:location.origin},events:{onReady:e=>{if(!disposed){playerRef.current=e.target;onReady(true)}},onError:()=>onReady(false)}});
    };
    if(window.YT?.Player)create();
    else{
      const previous=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=()=>{if(typeof previous==='function')previous();create()};
      if(!document.querySelector('script[data-dance-youtube]')){
        const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.dataset.danceYoutube='1';document.head.appendChild(script);
      }
    }
    return()=>{disposed=true;onReady(false);playerRef.current=null;try{p?.destroy()}catch{}};
  },[videoId,playerRef,onReady]);
  return <div className="studio-video-frame">{videoId?<div ref={mount} className="studio-video-mount"/>:<div className="studio-video-empty"><Music2 size={28}/>유튜브 영상 링크를 등록해 줘.</div>}</div>;
}
export default function ChoreoStudio({item,initialGenre,data,onSave,onDelete,notify,onPracticeRecord}) {
  const [v,setV]=useState(()=>({id:uid(),genre:initialGenre,name:'',music:'',url:'',segments:[],...(item||{})}));
  const [mode,setMode]=useState(item?'practice':'edit');
  const [source,setSource]=useState(item?.audioSource==='file'?'file':'youtube');
  const [musicPicker,setMusicPicker]=useState(false);
  const [musicSearch,setMusicSearch]=useState('');
  const [choreoPicker,setChoreoPicker]=useState(false);
  const [choreoSearch,setChoreoSearch]=useState('');
  const [view,setView]=useState('time');
  const [bpm,setBpm]=useState(()=>positive(item?.countSettings?.bpm,70));
  const [half,setHalf]=useState(()=>Boolean(item?.countSettings?.half));
  const [offset,setOffset]=useState(()=>Math.max(0,Number(item?.countSettings?.offset)||0));
  const [selected,setSelected]=useState(0);
  const [loop,setLoop]=useState(false);
  const [speed,setSpeed]=useState(1);
  const [playing,setPlaying]=useState(false);
  const [ready,setReady]=useState(false);
  const [filePlaying,setFilePlaying]=useState(false);
  const [youtubePlaying,setYoutubePlaying]=useState(false);
  usePracticeLog(mode==='practice'&&(source==='file'?filePlaying:youtubePlaying),v.genre,'안무 · '+(v.name||'이름 없음'),onPracticeRecord);
  const player=useRef(null);
  const readyChange=React.useCallback(x=>setReady(x),[]);
  const id=getYoutubeId(v.url);
  useEffect(()=>{if(mode!=='practice'||source!=='youtube'||!ready){setYoutubePlaying(false);return}const check=()=>{try{setYoutubePlaying(player.current?.getPlayerState?.()===1)}catch{setYoutubePlaying(false)}};check();const poll=setInterval(check,450);return()=>clearInterval(poll)},[mode,source,ready,id]);
  const seg=v.segments?.[selected];
  const defaultEights=(s)=>Math.max(1,Math.round(((toSeconds(s?.end)||0)-(toSeconds(s?.start)||0))/calcSeconds(1,bpm,half))||1);
  const eights=(s)=>positive(s?.eightCounts,defaultEights(s));
  const syncCounts=(list,nextBpm=bpm,nextHalf=half,nextOffset=offset)=> {
    let at=nextOffset;
    return list.map(s=>{const count=positive(s.eightCounts,defaultEights(s));const start=format(at);at+=calcSeconds(count,nextBpm,nextHalf);return {...s,eightCounts:count,start,end:format(at)};});
  };
  const setCount=(index,count)=>segments(old=>syncCounts(old.map((s,i)=>i===index?{...s,eightCounts:Math.max(1,Math.min(128,Number(count)||1))}:s)));
  const configure=(key,value)=>{
    const b=key==='bpm'?value:bpm,h=key==='half'?value:half,o=key==='offset'?value:offset;
    if(key==='bpm')setBpm(value);if(key==='half')setHalf(value);if(key==='offset')setOffset(value);
    segments(old=>syncCounts(old,b,h,o));
  };
  const patch=(key,value)=>setV(p=>({...p,[key]:value}));
  const segments=(updater)=>setV(p=>({...p,segments:updater(p.segments||[])}));
  const editSeg=(key,value)=>segments(a=>a.map((s,i)=>i===selected?{...s,[key]:value}:s));
  const jump=(index,autoPlay=true)=>{
    setSelected(index);
    const target=v.segments[index],at=toSeconds(target?.start);
    if(Number.isFinite(at)&&player.current?.seekTo){player.current.seekTo(at,true);if(autoPlay){player.current.playVideo();setPlaying(true)}}
  };
  useEffect(()=>{
    if(!loop||mode!=='practice'||!ready||!id)return;
    const timer=setInterval(()=>{
      const p=player.current,segment=v.segments[selected];
      if(!p||!segment)return;
      const start=toSeconds(segment.start),end=toSeconds(segment.end);
      if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return;
      try{if(p.getPlayerState()===1&&p.getCurrentTime()>=end-.12)p.seekTo(start,true)}catch{}
    },250);
    return()=>clearInterval(timer);
  },[loop,mode,ready,id,selected,v.segments]);
  function save(){
    if(!v.name.trim()){notify('안무 이름을 입력해 줘.');setMode('edit');return}
    if(v.url&&!safeLink(v.url)){notify('올바른 영상 링크를 입력해 줘.');setMode('edit');return}
    for(const s of v.segments){
      const a=toSeconds(s.start),b=toSeconds(s.end);
      if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a){notify('구간 시간은 mm:ss 형식이고 끝이 시작보다 뒤여야 해.');setMode('edit');return}
    }
    onSave({...v,audioSource:source,countSettings:{bpm,half,offset}});
  }
  function addSegment(){
    const prev=v.segments.at(-1),start=prev?.end||'00:00';
    segments(a=>[...a,{id:uid(),name:'구간 '+(a.length+1),start,end:format((toSeconds(start)||0)+30),status:'미시작',sequenceId:'',eightCounts:Math.max(1,Math.round(30/calcSeconds(1,bpm,half)))}]);
    setSelected(v.segments.length);
  }
  function moveSegment(direction){
    const j=selected+direction;if(j<0||j>=v.segments.length)return;
    segments(a=>{const copy=[...a];[copy[selected],copy[j]]=[copy[j],copy[selected]];return copy});setSelected(j);
  }
  function setPlaybackSpeed(n){setSpeed(n);try{player.current?.setPlaybackRate(n)}catch{notify('이 영상에서는 해당 속도가 지원되지 않아.')}}
  return <div className="studio-root">
    <div className="studio-modes" role="tablist" aria-label="안무 스튜디오 모드">
      <button type="button" className={mode==='practice'?'active':''} onClick={()=>setMode('practice')} role="tab" aria-selected={mode==='practice'}>연습 모드</button>
      <button type="button" className={mode==='edit'?'active':''} onClick={()=>setMode('edit')} role="tab" aria-selected={mode==='edit'}>편집 모드</button>
    </div>
    <div className="studio-modes"><button type="button" className={source==='youtube'?'active':''} onClick={()=>setSource('youtube')}>유튜브</button><button type="button" className={source==='file'?'active':''} onClick={()=>setSource('file')}>내 음악 파일</button></div>
    {source==='youtube'?<YoutubePlayer videoId={id} playerRef={player} onReady={readyChange}/>:mode==='practice'?<AudioCoach choreo={v} sequences={data.sequences} moves={data.moves} bpm={bpm} half={half} offset={offset} selected={selected} onSelect={setSelected} loop={loop} notify={notify} onTrackName={name=>patch('music',name)} onPlaybackChange={setFilePlaying}/>:<p className="studio-hint">연습 모드에서 음악 파일을 선택하면 이 기기에 저장돼.</p>}
    {source==='youtube'&&v.url&&<a className="studio-external" href={safeLink(v.url)||'#'} target="_blank" rel="noopener noreferrer"><ExternalLink size={13}/> 유튜브에서 열기 (임베드 제한 영상)</a>}
    {mode==='practice'&&source==='youtube'?<div className="studio-practice">
      <div className="studio-controls">
        <button type="button" disabled={!ready} onClick={()=>{if(playing){player.current?.pauseVideo();setPlaying(false)}else{player.current?.playVideo();setPlaying(true)}}}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'일시정지':'재생'}</button>
        <button type="button" className={loop?'active':''} aria-pressed={loop} onClick={()=>setLoop(x=>!x)}><Repeat size={16}/> 반복 {loop?'ON':'OFF'}</button>
        <select aria-label="재생 속도" value={speed} onChange={e=>setPlaybackSpeed(Number(e.target.value))}>{[.5,.75,1,1.25,1.5,2].map(n=><option key={n} value={n}>{n}×</option>)}</select>
      </div>
      <p className="studio-hint">구간 선택 시 시작 시간으로 이동해. 반복 ON은 해당 구간을 계속 재생해.</p>
    </div>:<div className="studio-edit">
      <label className="field"><span>장르</span><select value={v.genre} onChange={e=>{const genre=e.target.value;setV(p=>({...p,genre,segments:p.segments.map(s=>({...s,sequenceId:''}))}))}}>{data.genres.map(g=><option key={g}>{g}</option>)}</select></label>
      <label className="field"><span>안무 이름</span><input value={v.name} onChange={e=>patch('name',e.target.value)}/></label>
      <label className="field"><span>음악 / 곡 이름</span><input value={v.music} onChange={e=>patch('music',e.target.value)}/></label>
      {source==='youtube'&&<>
        <label className="field"><span>유튜브 링크</span><input type="url" value={v.url} onChange={e=>patch('url',e.target.value)} placeholder="https://youtu.be/..."/></label>
        <button type="button" className="secondary compact" onClick={()=>setChoreoPicker(x=>!x)} aria-expanded={choreoPicker}>▣ 안무 북마크에서 가져오기 ({(data.choreoBookmarks||[]).length})</button>
        {choreoPicker&&<div className="studio-music-picker">
          <input aria-label="안무 북마크 검색" placeholder="안무 제목·분류 검색" value={choreoSearch} onChange={e=>setChoreoSearch(e.target.value)}/>
          <div className="studio-music-results">{(data.choreoBookmarks||[]).filter(bookmark=>[bookmark.title,bookmark.genre,bookmark.category,bookmark.subcategory,bookmark.memo].join(' ').toLowerCase().includes(choreoSearch.toLowerCase())).map(bookmark=><button type="button" key={bookmark.id} className="studio-music-result" onClick={()=>{
            setV(prev=>({...prev,name:prev.name||bookmark.title||'',url:bookmark.url||'',sourceBookmarkId:bookmark.id}));
            setChoreoPicker(false);
            notify('안무 북마크의 영상 링크를 가져왔어.');
          }}><strong>{bookmark.title||'제목 없는 안무'}</strong><small>{[bookmark.genre,bookmark.category,bookmark.subcategory].filter(Boolean).join(' · ')}</small></button>)}</div>
          {!(data.choreoBookmarks||[]).length&&<p className="studio-hint">안무 → 안무 북마크에서 영상을 먼저 저장해 줘.</p>}
        </div>}
        <button type="button" className="secondary compact" onClick={()=>setMusicPicker(x=>!x)} aria-expanded={musicPicker}>♫ 음악 북마크에서 가져오기 ({(data.musicBookmarks||[]).length})</button>
        {musicPicker&&<div className="studio-music-picker">
          <input aria-label="음악 북마크 검색" placeholder="곡 제목·아티스트 검색" value={musicSearch} onChange={e=>setMusicSearch(e.target.value)}/>
          <div className="studio-music-results">{(data.musicBookmarks||[]).filter(song=>[song.title,song.artist,song.memo].join(' ').toLowerCase().includes(musicSearch.toLowerCase())).map(song=><button type="button" key={song.id} className="studio-music-result" onClick={()=>{
            setV(prev=>({...prev,music:[song.artist,song.title].filter(Boolean).join(' — '),url:song.url||''}));
            const nextBpm=Number(song.bpm)>=20&&Number(song.bpm)<=240?Number(song.bpm):bpm;
            const nextHalf=typeof song.half==='boolean'?song.half:half;
            setBpm(nextBpm);setHalf(nextHalf);segments(old=>syncCounts(old,nextBpm,nextHalf,offset));
            setMusicPicker(false);
            notify('음악 북마크를 가져왔어.');
          }}><strong>{song.title}</strong><small>{song.artist}{song.bpm?' · '+song.bpm+' BPM':''}{song.half?' · 하프타임':''}</small></button>)}</div>
          {!(data.musicBookmarks||[]).length&&<p className="studio-hint">안무 → 음악에서 먼저 북마크를 저장해 줘.</p>}
        </div>}
      </>}
      {source==='youtube'&&<>
        <button type="button" className="secondary compact" onClick={()=>setChoreoPicker(x=>!x)} aria-expanded={choreoPicker}>▤ 안무 북마크에서 가져오기 ({(data.choreoBookmarks||[]).length})</button>
        {choreoPicker&&<div className="studio-music-picker">
          <input aria-label="안무 북마크 검색" placeholder="영상 제목·메모 검색" value={choreoSearch} onChange={e=>setChoreoSearch(e.target.value)}/>
          <div className="studio-music-results">{(data.choreoBookmarks||[]).filter(b=>[b.title,b.memo,b.genre,b.category,b.subcategory].join(' ').toLowerCase().includes(choreoSearch.toLowerCase())).map(b=><button type="button" key={b.id} className="studio-music-result" onClick={()=>{
            setV(prev=>({...prev,url:b.url||'',music:b.title||prev.music}));
            setChoreoPicker(false);
            notify('안무 북마크 영상 링크를 가져왔어.');
          }}><strong>{b.title||'제목 없는 영상'}</strong><small>{[b.genre,b.category,b.subcategory].filter(Boolean).join(' · ')}</small></button>)}</div>
          {!(data.choreoBookmarks||[]).length&&<p className="studio-hint">안무 → 안무 북마크에서 먼저 영상을 저장해 줘.</p>}
        </div>}
      </>}
    </div>}
    {mode==='edit'&&<div className="studio-count-panel">
      <div className="studio-modes" role="tablist" aria-label="시간과 카운트 보기"><button type="button" role="tab" aria-selected={view==='time'} className={view==='time'?'active':''} onClick={()=>setView('time')}>시간 보기</button><button type="button" role="tab" aria-selected={view==='counts'} className={view==='counts'?'active':''} onClick={()=>setView('counts')}>카운트 보기</button></div>
      {view==='counts'&&<>
        <div className="studio-bpm-row"><label className="field"><span>음악 BPM</span><input type="number" min="20" max="240" value={bpm} onChange={e=>{const n=Number(e.target.value);if(n>=20&&n<=240)configure('bpm',n)}}/></label><TapBpm onApply={n=>configure('bpm',n)}/></div>
        <div className="studio-modes"><button type="button" className={!half?'active':''} onClick={()=>configure('half',false)}>일반 카운트</button><button type="button" className={half?'active':''} onClick={()=>configure('half',true)}>하프타임</button></div>
        <label className="field"><span>첫 카운트 시작 위치 (초)</span><input type="number" min="0" max="3600" value={offset} onChange={e=>configure('offset',Math.max(0,Math.min(3600,Number(e.target.value)||0)))}/></label>
        <p className="studio-hint">카운트 속도 {bpm/(half?2:1)} BPM · 8카운트 약 {(480/(bpm/(half?2:1))).toFixed(1)}초. 값을 변경하면 뒤 구간 시간도 다시 계산돼.</p>
      </>}
    </div>}
    <div className="studio-heading"><strong>안무 구간</strong>{mode==='edit'&&<button type="button" className="secondary compact" onClick={addSegment}><Plus size={14}/> 구간</button>}</div>
    <div className="segment-strip studio-strip">{v.segments.map((s,i)=><button type="button" key={s.id} className={i===selected?'selected':''} onClick={()=>mode==='practice'?jump(i):setSelected(i)}>{s.name}<small>{mode==='edit'&&view==='counts'?countStart(v.segments,i)+'번째 8카운트':s.start}</small></button>)}</div>
    {!v.segments.length&&<p className="studio-hint">편집 모드에서 첫 번째 구간을 추가해 줘.</p>}
    {seg&&(mode==='practice'?<div className="studio-segment studio-summary">
      <div className="studio-segment-title"><strong>{seg.name}</strong><span>{seg.start} – {seg.end}</span></div>
      {seg.sequenceId?<div className="studio-steps">{(data.sequences.find(s=>s.id===seg.sequenceId)?.steps||[]).map((s,i)=><div key={i}>{i+1}. {data.moves.find(m=>m.id===s.moveId)?.name||'삭제된 동작'} · {s.counts}박</div>)}</div>:<p className="studio-hint">연결된 시퀀스가 없어.</p>}
      <label className="field"><span>구간 숙련도</span><select value={seg.status} onChange={e=>editSeg('status',e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></label>
      <button type="button" className="secondary compact" onClick={()=>jump(selected)}>이 구간 재생</button>
    </div>:<div className="studio-segment">
      <div className="editor-tools"><button type="button" onClick={()=>moveSegment(-1)} aria-label="위로"><ArrowUp size={15}/></button><button type="button" onClick={()=>moveSegment(1)} aria-label="아래로"><ArrowDown size={15}/></button><button type="button" onClick={()=>{segments(a=>a.filter((_,i)=>i!==selected));setSelected(Math.max(0,selected-1))}} aria-label="구간 삭제"><Trash2 size={15}/></button></div>
      <label className="field"><span>구간 이름</span><input value={seg.name} onChange={e=>editSeg('name',e.target.value)}/></label>
      {view==='counts'?<>
        <div className="studio-count-edit"><span>{countStart(v.segments,selected)} – {countStart(v.segments,selected)+eights(seg)-1}번째 8카운트</span><label>8카운트 묶음 <input type="number" min="1" max="128" value={seg.eightCounts??eights(seg)} onChange={e=>setCount(selected,e.target.value)} onFocus={e=>e.target.select()}/></label></div>
        <p className="studio-hint">예상 시간 {seg.start} – {seg.end} · 약 {calcSeconds(eights(seg),bpm,half)}초</p>
      </>:<div className="cols"><label className="field"><span>시작 (mm:ss)</span><input value={seg.start} onChange={e=>editSeg('start',e.target.value)}/></label><label className="field"><span>끝 (mm:ss)</span><input value={seg.end} onChange={e=>editSeg('end',e.target.value)}/></label></div>}
      <label className="field"><span>연결 시퀀스</span><select value={seg.sequenceId||''} onChange={e=>editSeg('sequenceId',e.target.value)}><option value="">없음</option>{data.sequences.filter(s=>s.genre===v.genre).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label className="field"><span>진행 상황</span><select value={seg.status} onChange={e=>editSeg('status',e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></label>
      <button type="button" className="secondary compact" onClick={()=>jump(selected)}>이 구간 미리 재생</button>
    </div>)}
    <button type="button" className="primary studio-save" onClick={save}><Check size={16}/> 저장</button>
    {item&&mode==='edit'&&<button type="button" className="danger-text" onClick={onDelete}><Trash2 size={14}/> 안무 삭제</button>}
  </div>;
}
