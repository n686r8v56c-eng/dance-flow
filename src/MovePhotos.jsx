import React,{useState} from 'react';
import {Upload,Trash2,Star} from 'lucide-react';
import {supabase} from './supabase';
import {uid} from './data';
import './move-photos.css';
const BUCKET='dance-move-photos';
export default function MovePhotos({images=[],moveId,onChange,notify}){
 const [busy,setBusy]=useState(false);
 const list=Array.isArray(images)?images:[];
 const add=async e=>{
  const files=[...(e.target.files||[])];e.target.value='';
  if(!files.length)return;
  if(!supabase){notify('사진 동기화를 위해 Supabase 연결이 필요해.');return}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){notify('사진을 올리려면 먼저 로그인해 줘.');return}
  setBusy(true);
  const next=[...list];
  for(const file of files){
   if(!file.type.startsWith('image/')){notify('이미지 파일만 업로드할 수 있어.');continue}
   if(file.size>8*1024*1024){notify('사진은 한 장당 8MB 이하로 선택해 줘.');continue}
   const extension=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
   const path=user.id+'/'+moveId+'/'+uid()+'.'+extension;
   const result=await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
   if(result.error){notify('사진 업로드 실패: '+result.error.message);continue}
   next.push({id:uid(),path,primary:next.length===0});
  }
  onChange(next);setBusy(false);
 };
 const show=path=>supabase?.storage.from(BUCKET).getPublicUrl(path).data.publicUrl||'';
 const remove=async id=>{const photo=list.find(x=>x.id===id);if(!photo)return;const next=list.filter(x=>x.id!==id);if(next.length&&!next.some(x=>x.primary))next[0]={...next[0],primary:true};onChange(next);if(photo.path&&supabase){const {error}=await supabase.storage.from(BUCKET).remove([photo.path]);if(error)notify('사진 목록에서는 제거했지만 저장소 파일 삭제는 실패했어: '+error.message)}};
 return <div className="move-photos"><div className="move-photos-header"><strong>동작 사진 ({list.length})</strong><label className="move-photo-upload"><Upload size={14}/> {busy?'업로드 중…':'사진 추가'}<input type="file" accept="image/*" multiple disabled={busy} onChange={add}/></label></div>
  {list.length>0&&<div className="move-photo-gallery">{list.map(photo=><div className="move-photo-card" key={photo.id}><img src={show(photo.path)} alt="동작 사진"/><div className="move-photo-actions"><button type="button" aria-label="대표 사진" className={photo.primary?'primary-photo':''} onClick={()=>onChange(list.map(x=>({...x,primary:x.id===photo.id})))}><Star size={13}/></button><button type="button" aria-label="사진 목록에서 삭제" onClick={()=>remove(photo.id)}><Trash2 size={13}/></button></div></div>)}</div>}
  <small>대표 사진은 목록에 표시돼. 사진은 계정에 연결되어 기기 간 동기화돼.</small></div>
}