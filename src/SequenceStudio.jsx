import React,{useCallback,useEffect,useRef,useState} from 'react';
import {Play,Pause,Square,Volume2,VolumeX,ChevronLeft,ChevronRight,Check,ArrowUp,ArrowDown,Trash2,Plus} from 'lucide-react';
import {uid} from './data';
import './sequence-studio.css';
import TapBpm from './TapBpm';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||min));
export default function SequenceStudio({item,initialGenre,data,onSave,onDelete,notify}){
  const [v,setV]=useState(()=>({id:uid(),genre:initialGenre,name:'',bpm:90,repeat:2,steps:[],...(item||{})}));
  const [mode,setMode]=useState(item?'practice':'edit');
  const [running,setRunning]=useState(false);
  const [phase,setPhase]=useState('idle');
  const [stepIndex,setStepIndex]=useState(0);
  const [beat,setBeat]=useState(0);
  const [round,setRound]=useState(1);
  const [countdown,setCountdown]=useState(5);
  const [metronome,setMetronome]=useState(true);
  const [voice,setVoice]=useState(true);
  const [metronomeVolume,setMetronomeVolume]=useState(.45);
  const [voiceVolume,setVoiceVolume]=useState(.8);
  const [finished,setFinished]=useState(false);
  const audio=useRef(null),clock=useRef(null),state=useRef({elapsed:0,start:0,running:false}),lastTick=useRef(-1),lastStep=useRef(-1),voiceOn=useRef(true),metroOn=useRef(true),voiceVol=useRef(.8),metroVol=useRef(.45),latest=useRef(v);
  latest.current=v;voiceOn.current=voice;metroOn.current=metronome;voiceVol.current=voiceVolume;metroVol.current=metronomeVolume;
  const current=v.steps[stepIndex];
  const moveName=id=>data.moves.find(m=>m.id===id)?.name||'삭제된 동작';
  const totalCounts=v.steps.reduce((sum,s)=>sum+clamp(s.counts,1,256),0);
  const totalBeats=totalCounts*clamp(v.repeat,1,108);
  const speak=useCallback((text)=>{
    if(!voiceOn.current||!('speechSynthesis' in window))return;
    try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=1.12;u.volume=voiceVol.current;window.speechSynthesis.speak(u)}catch{}
  },[]);
  const tick=useCallback((accent=false)=>{
    if(!metroOn.current)return;
    try{
      if(!audio.current)audio.current=new (window.AudioContext||window.webkitAudioContext)();
      if(audio.current.state==='suspended')audio.current.resume();
      const ctx=audio.current,osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime;
      osc.type='sine';osc.frequency.value=accent?990:740;
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(Math.max(.001,metroVol.current*.22),t+.004);
      gain.gain.exponentialRampToValueAtTime(.0001,t+.075);
      osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.085);
    }catch{}
  },[]);
  const stop=useCallback((complete=false)=>{
    state.current.running=false;state.current.elapsed=0;lastTick.current=-1;lastStep.current=-1;
    setRunning(false);setPhase('idle');setStepIndex(0);setBeat(0);setRound(1);setCountdown(5);setFinished(complete);
    try{window.speechSynthesis?.cancel()}catch{}
  },[]);
  useEffect(()=>()=>{state.current.running=false;try{window.speechSynthesis?.cancel();audio.current?.close()}catch{}},[]);
  const start=()=>{
    if(!v.steps.length){notify('편집 모드에서 동작을 추가해 줘.');setMode('edit');return}
    if(!totalCounts)return;
    setFinished(false);setPhase('countdown');setCountdown(5);setStepIndex(0);setBeat(0);setRound(1);
    state.current={elapsed:0,start:performance.now(),running:true};lastTick.current=-1;lastStep.current=-1;
    setRunning(true);
    speak('준비');
  };
  const pause=()=>{
    const s=state.current;
    if(!s.running)return;
    s.elapsed+=performance.now()-s.start;s.running=false;setRunning(false);
    try{window.speechSynthesis?.cancel()}catch{}
  };
  const resume=()=>{
    state.current.start=performance.now();state.current.running=true;setRunning(true);
  };
  useEffect(()=>{
    if(!running)return;
    clock.current=setInterval(()=>{
      const s=state.current;if(!s.running)return;
      const ms=s.elapsed+performance.now()-s.start;
      const countdownMs=5000;
      if(ms<countdownMs){
        const i=Math.floor(ms/1000);
        setPhase('countdown');setCountdown(5-i);
        if(i!==lastTick.current){lastTick.current=i;tick(true);speak(String(5-i))}
        return;
      }
      const config=latest.current;
      const counts=config.steps.map(x=>clamp(x.counts,1,256));
      const length=counts.reduce((a,b)=>a+b,0);
      if(!length){stop();return}
      const bpm=clamp(config.bpm,20,240);
      const pulse=Math.floor((ms-countdownMs)/(60000/bpm));
      const rounds=clamp(config.repeat,1,108);
      if(pulse>=length*rounds){stop(true);notify('시퀀스 연습 완료!');return}
      setPhase('practice');
      if(pulse===lastTick.current)return;
      lastTick.current=pulse;
      const inRound=pulse%length;
      let consumed=0,index=0;
      while(index<counts.length-1&&consumed+counts[index]<=inRound){consumed+=counts[index];index++}
      const currentCount=inRound-consumed+1;
      const currentRound=Math.floor(pulse/length)+1;
      setStepIndex(index);setBeat(currentCount);setRound(currentRound);
      tick(currentCount===1||currentCount%8===1);
      const stepKey=currentRound+':'+index;
      if(lastStep.current!==stepKey){lastStep.current=stepKey;const step=config.steps[index];speak(moveName(step.moveId)+' '+(step.side||'양쪽'))}
      else if(currentCount===1||currentCount%8===1){speak(String(Math.floor((currentCount-1)/8)*8+1))}
    },30);
    return()=>clearInterval(clock.current);
  },[running,tick,speak,stop]);
  const resetOnEdit=()=>{if(state.current.running||phase!=='idle')stop();setMode('edit')};
  const change=(key,value)=>setV(old=>({...old,[key]:value}));
  const updateStep=(index,key,value)=>change('steps',v.steps.map((s,i)=>i===index?{...s,[key]:value}:s));
  const reorder=(i,dir)=>{const to=i+dir;if(to<0||to>=v.steps.length)return;const steps=[...v.steps];[steps[i],steps[to]]=[steps[to],steps[i]];change('steps',steps)};
  const save=()=>{
    if(!v.name.trim())return notify('시퀀스 이름을 입력해 줘.');
    if(v.steps.some(x=>!data.moves.find(m=>m.id===x.moveId&&m.genre===v.genre)))return notify('삭제된 동작이 있어. 동작을 다시 선택해 줘.');
    onSave({...v,bpm:clamp(v.bpm,20,240),repeat:clamp(v.repeat,1,108),steps:v.steps.map(s=>({...s,counts:clamp(s.counts,1,256)}))});
  };
  return <div className="seq-studio">
    <div className="seq-modes" role="tablist" aria-label="시퀀스 모드">
      <button type="button" role="tab" aria-selected={mode==='practice'} className={mode==='practice'?'active':''} onClick={()=>setMode('practice')}>연습 모드</button>
      <button type="button" role="tab" aria-selected={mode==='edit'} className={mode==='edit'?'active':''} onClick={resetOnEdit}>편집 모드</button>
    </div>
    {mode==='practice'?<>
      <div className="seq-stage" aria-live="polite">
        <span>{phase==='countdown'?'준비 카운트':finished?'연습 완료':phase==='practice'?('동작 '+(stepIndex+1)+' / '+v.steps.length):'연습 준비'}</span>
        <strong>{phase==='countdown'?countdown:finished?'완료!':current?moveName(current.moveId):'등록된 동작 없음'}</strong>
        <b>{phase==='practice'?beat+' / '+clamp(current?.counts,1,256)+' Counts':phase==='countdown'?'5 · 4 · 3 · 2 · 1':totalCounts+' Counts × '+clamp(v.repeat,1,108)}</b>
        <small>{phase==='practice'?('방향 '+(current?.side||'양쪽')+' · '+round+' / '+clamp(v.repeat,1,108)+'회'):clamp(v.bpm,20,240)+' BPM'}</small>
      </div>
      <div className="seq-player-buttons">
        <button type="button" className="primary" onClick={!running&&phase==='idle'?start:running?pause:resume}>{running?<><Pause size={16}/> 일시정지</>:phase==='idle'?<><Play size={16}/> 연습 시작</>:<><Play size={16}/> 계속</>}</button>
        <button type="button" className="secondary" onClick={()=>stop(false)}><Square size={14}/> 정지</button>
      </div>
      <div className="seq-options">
        <label><input type="checkbox" checked={metronome} onChange={e=>setMetronome(e.target.checked)}/> 메트로놈</label>
        <input aria-label="메트로놈 볼륨" type="range" min="0" max="1" step=".05" value={metronomeVolume} onChange={e=>setMetronomeVolume(Number(e.target.value))}/>
        <label><input type="checkbox" checked={voice} onChange={e=>setVoice(e.target.checked)}/> 음성 안내</label>
        <input aria-label="음성 안내 볼륨" type="range" min="0" max="1" step=".05" value={voiceVolume} onChange={e=>setVoiceVolume(Number(e.target.value))}/>
      </div>
      <div className="seq-practice-list">{v.steps.map((s,i)=><div key={i} className={'seq-practice-item '+(phase==='practice'&&i===stepIndex?'active':'')}><span>{i+1}. {moveName(s.moveId)}</span><small>{s.counts}박 · {s.side||'양쪽'}</small></div>)}</div>
    </>:<>
      <label className="field"><span>장르</span><select value={v.genre} onChange={e=>setV(old=>({...old,genre:e.target.value,steps:[]}))}>{data.genres.map(g=><option key={g}>{g}</option>)}</select></label>
      <label className="field"><span>시퀀스 이름</span><input value={v.name} onChange={e=>change('name',e.target.value)}/></label>
      <div className="cols">
        <div className="seq-bpm-row"><label className="field"><span>BPM</span><input type="number" min="20" max="240" value={v.bpm} onChange={e=>change('bpm',Number(e.target.value))}/></label><TapBpm onApply={n=>change('bpm',n)}/></div>
        <label className="field"><span>반복 횟수</span><input type="number" min="1" max="108" value={v.repeat} onChange={e=>change('repeat',Number(e.target.value))}/></label>
      </div>
      <div className="seq-edit-header"><strong>동작 순서</strong><button type="button" className="secondary compact" disabled={!data.moves.some(m=>m.genre===v.genre)} onClick={()=>change('steps',[...v.steps,{moveId:data.moves.find(m=>m.genre===v.genre).id,counts:8,side:'양쪽'}])}><Plus size={14}/> 동작</button></div>
      {v.steps.map((s,i)=><div className="seq-step" key={i}>
        <select aria-label={'동작 '+(i+1)} value={s.moveId} onChange={e=>updateStep(i,'moveId',e.target.value)}>{data.moves.filter(m=>m.genre===v.genre).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
        <div className="seq-step-controls">
          <input aria-label="카운트" type="number" min="1" max="256" value={s.counts ?? ''} onFocus={e=>e.target.select()} onChange={e=>updateStep(i,'counts',e.target.value===''?'':e.target.value)} onBlur={()=>updateStep(i,'counts',clamp(s.counts,1,256))}/>
          <select aria-label="방향" value={s.side||'양쪽'} onChange={e=>updateStep(i,'side',e.target.value)}>{['양쪽','왼쪽','오른쪽'].map(x=><option key={x}>{x}</option>)}</select>
          <button type="button" aria-label="위로" onClick={()=>reorder(i,-1)}><ArrowUp size={14}/></button>
          <button type="button" aria-label="아래로" onClick={()=>reorder(i,1)}><ArrowDown size={14}/></button>
          <button type="button" aria-label="삭제" onClick={()=>change('steps',v.steps.filter((_,j)=>i!==j))}><Trash2 size={14}/></button>
        </div>
      </div>)}
    </>}
    <button type="button" className="primary" onClick={save}><Check size={16}/> 저장</button>
    {item&&mode==='edit'&&<button type="button" className="danger-text" onClick={onDelete}><Trash2 size={14}/> 시퀀스 삭제</button>}
  </div>;
}
