import React,{useState,useRef} from 'react';
import {Hand,RotateCcw} from 'lucide-react';
import './tap-bpm.css';
export default function TapBpm({onApply,min=20,max=240}){
 const [open,setOpen]=useState(false),[times,setTimes]=useState([]);
 const last=useRef(0);
 const tap=()=>{const now=performance.now();setTimes(prev=>now-last.current>2500?[now]:[...prev.slice(-11),now]);last.current=now};
 const intervals=times.slice(1).map((t,i)=>t-times[i]);
 const average=intervals.length?intervals.reduce((a,b)=>a+b,0)/intervals.length:0;
 const bpm=average?Math.round(60000/average):null;
 return <div className="tap-bpm">
  <button type="button" className={'tap-toggle'+(open?' selected':'')} onClick={()=>setOpen(x=>!x)}><Hand size={14}/> TAP</button>
  {open&&<div className="tap-panel">
   <div className="tap-heading"><strong>BPM 측정</strong><button type="button" onClick={()=>{setTimes([]);last.current=0}}><RotateCcw size={13}/> 초기화</button></div>
   <div className="tap-reading"><b>{bpm??'—'}</b><span>BPM</span></div>
   <small>음악 박자에 맞춰 5회 이상 탭해 줘.</small>
   <button type="button" className="tap-pad" onClick={tap}>TAP TAP TAP</button>
   <button type="button" className="tap-apply" disabled={!bpm||bpm<min||bpm>max||times.length<5} onClick={()=>{onApply(bpm);setOpen(false)}}>측정값 적용</button>
   {bpm&&(bpm<min||bpm>max)&&<small>설정 가능 범위: {min}–{max} BPM</small>}
  </div>}
 </div>
}