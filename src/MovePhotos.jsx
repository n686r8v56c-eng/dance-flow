import React,{useState,useEffect} from 'react';
import {Upload,Trash2,Star} from 'lucide-react';
import {supabase} from './supabase';
import {uid} from './data';
import './move-photos.css';
const BUCKET='dance-move-photos';
const compressDanceImage=file=>new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const canvas=document.createElement('canvas'),scale=Math.min(1,1200/Math.max(img.width,img.height));canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);canvas.toBlob(blob=>blob?resolve(blob):reject(Error('이미지 압축 실패')),'image/jpeg',.76)};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('이미지를 불러올 수 없어.'))};img.src=url});

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
   let blob;try{blob=await compressDanceImage(file)}catch(err){notify('사진 압축 실패: '+err.message);continue}
   const path=user.id+'/'+moveId+'/'+uid()+'.jpg';
   const result=await supabase.storage.from(BUCKET).upload(path,blob,{contentType:'image/jpeg',upsert:false});
   if(result.error){notify('사진 업로드 실패: '+result.error.message);continue}
   next.push({id:uid(),path,primary:next.length===0});
  }
  onChange(next);setBusy(false);
 };
 const show=path=>supabase?.storage.from(BUCKET).getPublicUrl(path).data.publicUrl||'';
 const remove=async id=>{const photo=list.find(x=>x.id===id);if(!photo)return;const next=list.filter(x=>x.id!==id);if(next.length&&!next.some(x=>x.primary))next[0]={...next[0],primary:true};onChange(next);if(photo.path&&supabase){const {error}=await supabase.storage.from(BUCKET).remove([photo.path]);if(error)notify('사진 목록에서는 제거했지만 저장소 파일 삭제는 실패했어: '+error.message)}};
 return <div className="move-photos"><div className="move-photos-header"><strong>동작 사진 ({list.length})</strong><label className="move-photo-upload"><Upload size={14}/> {busy?'업로드 중…':'사진 추가'}<input type="file" accept="image/*" multiple disabled={busy} onChange={add}/></label></div>
  {list.length>0&&<div className="move-photo-gallery">{list.map(photo=><div className="move-photo-card" key={photo.id}><img src={show(photo.path)} alt="동작 사진"/><div className="move-photo-actions"><button type="button" aria-label="대표 사진" className={photo.primary?'primary-photo':''} onClick={()=>onChange(list.map(x=>({...x,primary:x.id===photo.id})))}><Star size={13}/></button><button type="button" aria-label="사진 목록에서 삭제" onClick={()=>remove(photo.id)}><Trash2 size={13}/></button></div></div>)}</div>}
  <small>대표 사진은 목록에 표시돼. 새 사진은 1200px·JPEG 76%로 압축해 Storage에 저장해.</small></div>
}
export function DancePhotoUsage(){const [stats,setStats]=useState(null);useEffect(()=>{let active=true;(async()=>{if(!supabase)return;const {data:{user}}=await supabase.auth.getUser();if(!user)return;let n=0,bytes=0,offset=0;while(offset<10000){const {data,error}=await supabase.storage.from(BUCKET).list(user.id,{limit:1000,offset});if(error)throw error;for(const folder of data||[]){if(!folder.id){let innerOffset=0;while(innerOffset<10000){const {data:files,error:innerError}=await supabase.storage.from(BUCKET).list(user.id+'/'+folder.name,{limit:1000,offset:innerOffset});if(innerError)throw innerError;for(const file of files||[]){if(file.id){n++;bytes+=Number(file.metadata?.size||0)}}if((files||[]).length<1000)break;innerOffset+=1000}}else{n++;bytes+=Number(folder.metadata?.size||0)}}if((data||[]).length<1000)break;offset+=1000}if(active)setStats({n,bytes})})().catch(()=>{});return()=>{active=false}},[]);return <div className="dance-photo-usage"><b>동작 사진 저장 공간</b><small>{stats?stats.n.toLocaleString()+'장 · '+(stats.bytes/1048576).toFixed(1)+' MB':'Storage 사용량 확인 중…'}</small></div>}
