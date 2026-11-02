import {useEffect,useRef} from 'react';
import {uid} from './data';
// One record ID per mounted studio. Updates accumulate rather than create duplicate logs.
export default function usePracticeLog(active,genre,label,onRecord){
 const id=useRef(uid()),total=useRef(0),started=useRef(null),callback=useRef(onRecord),props=useRef({genre,label});
 callback.current=onRecord;props.current={genre,label};
 useEffect(()=>{
   const commit=()=>{
     if(started.current!==null){total.current+=Math.max(0,performance.now()-started.current);started.current=performance.now()}
     if(total.current<1000)return;
     const p=props.current;
     callback.current?.({id:id.current,genre:p.genre,date:new Date().toLocaleDateString('en-CA'),minutes:Math.round(total.current/600)/100,memo:'자동 기록 · '+p.label,auto:true});
   };
   if(active){
     started.current=performance.now();
     const interval=setInterval(commit,15000);
     return()=>{clearInterval(interval);commit();started.current=null};
   }else{started.current=null}
 },[active]);
 useEffect(()=>()=>{if(started.current!==null){total.current+=Math.max(0,performance.now()-started.current);started.current=null}
   if(total.current>=1000){const p=props.current;callback.current?.({id:id.current,genre:p.genre,date:new Date().toLocaleDateString('en-CA'),minutes:Math.round(total.current/600)/100,memo:'자동 기록 · '+p.label,auto:true})}
 },[]);
}