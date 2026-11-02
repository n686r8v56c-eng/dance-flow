import React,{useEffect,useState} from 'react';
import {Music2,Plus,Edit3,Trash2,ExternalLink,Check} from 'lucide-react';
import {uid,getYoutubeId,thumb} from './data';
import TapBpm from './TapBpm';
import './music-bookmarks.css';

function MusicForm({item,onSave,onCancel,notify}){
 const [v,setV]=useState(()=>({id:uid(),title:'',artist:'',url:'',bpm:'',half:false,memo:'',...item}));
 const [info,setInfo]=useState('');
 const change=(k,val)=>setV(p=>({...p,[k]:val}));
 useEffect(()=>{
  const id=getYoutubeId(v.url);if(!id){setInfo('');return}
  const controller=new AbortController();
  const timer=setTimeout(async()=>{
   setInfo('제목 불러오는 중…');
   try{const response=await fetch('https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id),{signal:controller.signal});
    const json=await response.json();
    if(json.title&&!json.error){setV(old=>old.url===v.url?{...old,title:item?.title?old.title:json.title,artist:old.artist||json.author_name||''}:old);setInfo('영상 제목 확인됨')}
    else setInfo('제목을 가져오지 못했어. 직접 입력 가능');
   }catch(e){if(e.name!=='AbortError')setInfo('자동 조회 실패 · 직접 입력 가능')}
  },550);
  return()=>{clearTimeout(timer);controller.abort()};
 },[v.url]);
 function submit(e){e.preventDefault();if(v.url&&!getYoutubeId(v.url))return notify('유효한 유튜브 영상 URL을 넣어줘');if(!v.title.trim())return notify('곡 제목을 입력해줘');onSave({...v,title:v.title.trim(),bpm:v.bpm===''?'':Math.min(240,Math.max(20,Number(v.bpm)||70))})}
 return <form className="music-form" onSubmit={submit}>
  <label className="field"><span>유튜브 URL</span><input type="url" placeholder="https://youtu.be/..." value={v.url} onChange={e=>change('url',e.target.value)}/></label>
  {getYoutubeId(v.url)&&<div className="music-preview"><img src={thumb(v.url)} alt="유튜브 썸네일"/><small>{info}</small></div>}
  <div className="cols"><label className="field"><span>곡 제목</span><input required value={v.title} onChange={e=>change('title',e.target.value)}/></label><label className="field"><span>아티스트</span><input value={v.artist} onChange={e=>change('artist',e.target.value)}/></label></div>
  <div className="music-bpm-row"><label className="field"><span>BPM · 선택</span><input type="number" min="20" max="240" value={v.bpm} onChange={e=>change('bpm',e.target.value)}/></label><TapBpm onApply={n=>change('bpm',n)}/></div>
  <label className="music-check"><input type="checkbox" checked={v.half} onChange={e=>change('half',e.target.checked)}/> 하프타임 {v.bpm?'· '+Math.round(v.bpm/(v.half?2:1))+' BPM':''}</label>
  <label className="field"><span>메모</span><textarea rows="2" value={v.memo} onChange={e=>change('memo',e.target.value)}/></label>
  <button className="primary" type="submit"><Check size={15}/> 저장</button><button className="secondary" type="button" onClick={onCancel}>취소</button>
 </form>
}
export default function MusicBookmarks({items,onSave,onDelete,onUse,notify}){
 const [editing,setEditing]=useState(null),[adding,setAdding]=useState(false),[expanded,setExpanded]=useState(null),[search,setSearch]=useState('');
 const list=(items||[]).filter(x=>(x.title+' '+x.artist+' '+(x.memo||'')).toLowerCase().includes(search.toLowerCase()));
 return <div className="music-library">
  <div className="section-title"><h2>음악 북마크</h2><button className="small-primary" onClick={()=>{setAdding(true);setEditing(null)}}><Plus size={15}/> 추가</button></div>
  {(adding||editing)&&<MusicForm key={editing?.id||'new'} item={editing} onSave={x=>{onSave(x);setAdding(false);setEditing(null)}} onCancel={()=>{setAdding(false);setEditing(null)}} notify={notify}/>}
  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="곡 제목·아티스트 검색"/>
  <div className="stack-list">{list.map(x=><div className="music-item" key={x.id}>
   <button className="music-art" onClick={()=>setExpanded(y=>y===x.id?null:x.id)}>{thumb(x.url)?<img src={thumb(x.url)} alt=""/>:<Music2 size={19}/>}</button>
   <button className="music-info" onClick={()=>setExpanded(y=>y===x.id?null:x.id)}><strong>{x.title}</strong><small>{x.artist}{x.bpm?' · '+x.bpm+' BPM'+(x.half?' · ½':''):''}</small></button>
   <button className="tiny-icon" aria-label="수정" onClick={()=>{setEditing(x);setAdding(false)}}><Edit3 size={15}/></button>
   {expanded===x.id&&<div className="music-expanded">{x.memo&&<p>{x.memo}</p>}
    {getYoutubeId(x.url)?<iframe title={x.title} loading="lazy" src={'https://www.youtube-nocookie.com/embed/'+getYoutubeId(x.url)} allow="autoplay;encrypted-media;picture-in-picture" allowFullScreen/>:<p className="hint">유튜브 영상 링크는 수정 버튼에서 추가할 수 있어.</p>}
    <div className="music-actions">{getYoutubeId(x.url)&&<a href={x.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/> 유튜브 열기</a>}<button onClick={()=>onUse(x)}><Plus size={14}/> 안무 만들기</button><button onClick={()=>onDelete(x.id)}><Trash2 size={14}/> 삭제</button></div>
   </div>}
  </div>)}{!list.length&&<p className="empty">해당 음악이 없어.</p>}</div>
 </div>
}