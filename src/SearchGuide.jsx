import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import './SearchGuide.css';

const sections=[
 {name:'Belly Dance — 벨리댄스',intro:'아이솔레이션의 정밀도, 특히 가슴·복부·골반 조절에 강한 장르야.',rows:[
 ['Head','Head Slide, Head Circle'],['Neck','Neck Tilt, Head-Neck Isolation'],['Shoulders','Shoulder Shimmy, Shoulder Roll, Shoulder Lift'],
 ['Chest / Rib Cage','Chest Slide, Chest Lift & Drop, Chest Circle'],['Abdomen','Belly Roll, Abdominal Flutter, Upper & Lower Ab Isolation'],
 ['Pelvis / Hips','Hip Slide, Hip Drop, Hip Circle, Figure Eight, Omi'],['Arms','Snake Arms, Wrist Circle, Hand Undulation'],
 ['Legs','Knee Shimmy, Three-Quarter Shimmy']
 ],note:'특히 Chest Circle, Belly Roll, Hip Figure Eight는 영상 자료가 풍부해.'},
 {name:'Popping — 팝핑',intro:'순간적인 근육 수축과 분절, 정확한 타이밍에 집중해.',rows:[
 ['Head','Head Isolation, Head Tick'],['Neck','Neck Isolation, Neck Tick'],['Shoulders','Shoulder Pop, Shoulder Hit, Shoulder Tick'],
 ['Chest / Rib Cage','Chest Pop, Chest Hit, Chest Isolation'],['Abdomen','Abdominal Hit, Torso Contraction'],
 ['Pelvis / Hips','Hip Pop, Pelvic Hit, Hip Isolation'],['Arms','Arm Pop, Arm Hit, Arm Wave'],
 ['Legs','Leg Pop, Knee Pop, Leg Hit']
 ]},
 {name:'Animation — 애니메이션',intro:'한 관절씩 움직이거나 프레임을 끊어서 움직이는 착시 표현이 핵심이야.',rows:[
 ['Head','Head Slide, Head Tick, Head Tracking'],['Neck','Neck Isolation, Robotic Neck Movement'],
 ['Shoulders','Shoulder Tick, Shoulder Isolation'],['Chest / Rib Cage','Chest Tick, Chest Isolation, Segmented Chest Wave'],
 ['Abdomen','Segmented Torso Wave, Abdominal Isolation'],['Pelvis / Hips','Hip Tick, Robotic Hip Isolation'],
 ['Arms','Arm Wave, Finger Wave, Joint Isolation'],['Legs','Knee Isolation, Leg Wave, Robotic Leg Movement']
 ],note:'팝핑과 애니메이션은 근육 제어와 착시 기술이 겹치지만, 애니메이션에서는 Ticking, Strobing, Robot, Waving 같은 표현 방식도 중요해.'},
 {name:'Hip-Hop — 힙합',intro:'아이솔레이션을 그루브와 결합하는 데 강해.',rows:[
 ['Head','Head Nod, Head Isolation'],['Neck','Neck Groove, Neck Tilt'],
 ['Shoulders','Shoulder Bounce, Shoulder Roll, Shoulder Groove'],
 ['Chest / Rib Cage','Chest Pop, Chest Bounce, Chest Rock'],['Abdomen','Torso Contraction, Body Rock'],
 ['Pelvis / Hips','Hip Rock, Hip Bounce, Hip Isolation'],['Arms','Arm Groove, Shoulder-Arm Isolation'],
 ['Legs','Knee Bounce, Knee Isolation, Leg Groove']
 ]},
 {name:'Jazz Funk — 재즈펑크',intro:'신체 부위의 분리를 강한 라인, 속도 변화, 표현력으로 연결하는 장르야.',rows:[
 ['Head','Head Roll, Head Whip, Head Isolation'],['Neck','Neck Tilt, Neck Isolation'],
 ['Shoulders','Shoulder Roll, Shoulder Hit, Shoulder Isolation'],
 ['Chest / Rib Cage','Chest Pop, Rib Cage Slide, Chest Circle'],['Abdomen','Torso Contraction, Body Ripple'],
 ['Pelvis / Hips','Hip Roll, Hip Circle, Hip Accent'],['Arms','Arm Isolation, Wrist Roll, Elbow Isolation'],
 ['Legs','Knee Isolation, Knee Twist, Leg Accent']
 ],note:'재즈 계열의 기술 교육에서도 Head Isolation, Rib Isolation, Rib Rotation, Knee Isolation, Shoulder Roll을 다뤄.'}
];
const common=[
 ['Head Slide','벨리댄스 · 애니메이션'],
 ['Shoulder Isolation','벨리댄스 · 팝핑 · 재즈펑크'],
 ['Chest Isolation','벨리댄스 · 팝핑 · 애니메이션'],
 ['Abdominal Isolation','벨리댄스 · 애니메이션'],
 ['Hip Isolation','벨리댄스 · 힙합 · 재즈펑크'],
 ['Arm Isolation','팝핑 · 애니메이션 · 재즈펑크'],
 ['Knee Isolation','팝핑 · 애니메이션 · 재즈펑크']
];
const Table=({head,rows})=><div className="dance-guide-table-scroll"><table className="dance-guide-table"><thead><tr>{head.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(([left,right])=><tr key={left}><th scope="row">{left}</th><td>{right}</td></tr>)}</tbody></table></div>;
export default function SearchGuide({onClose}){
 const closeRef=useRef(null);
 useEffect(()=>{
  const key=e=>{if(e.key==='Escape')onClose()};
  window.addEventListener('keydown',key);
  closeRef.current?.focus();
  return()=>window.removeEventListener('keydown',key);
 },[onClose]);
 return <div className="dance-guide-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="dance-guide-dialog" role="dialog" aria-modal="true" aria-label="Isolation 검색가이드" aria-describedby="dance-guide-intro">
   <header className="dance-guide-header"><h2>Isolation 검색가이드</h2><button ref={closeRef} type="button" aria-label="검색가이드 닫기" onClick={onClose}><X size={21}/></button></header>
   <div className="dance-guide-body">
    <p id="dance-guide-intro">ㅋㅋㅋㅋㅋ 💜 이거 완전 재미있다!!! 이제 <strong>Isolation의 신체 대분류 8개 × 댄스 장르 5개</strong>로 기술 이름을 찾아보자.</p>
    <p>네가 유튜브에서 직접 검색할 수 있도록 영어 이름으로 정리했어. <strong>실제로 많이 쓰이는 동작명</strong>을 우선 넣고, 고유 명칭이 없는 경우에는 검색하기 쉬운 설명식 이름을 사용했어.</p>
    {sections.map((section,i)=><section key={section.name} className="dance-guide-section">
     <h3>{i+1}. {section.name}</h3><p>{section.intro}</p>
     <Table head={['대분류','관련 기술']} rows={section.rows}/>
     {section.note&&<p>{section.note}</p>}
    </section>)}
    <section className="dance-guide-section"><h3>내가 특히 주목하는 공통 기술</h3>
     <p>장르가 달라도 반복 등장하는 기술이 있어. 이건 Dance Flow에 하나의 기술로 등록하고 장르별 영상을 비교해 보기 좋아.</p>
     <Table head={['공통 기술','비교하기 좋은 장르']} rows={common}/>
    </section>
    <p className="dance-guide-note">참고: 위의 일부 이름, 특히 Animation과 Hip-Hop의 세부 아이솔레이션 명칭은 공식적으로 통일된 기술명이 아니라 동작을 찾기 위한 검색어야. Neck 관련 동작도 Head Isolation과 중복되는 경우가 있어.</p>
    <p><strong>여기서 중요한 발견이 하나 있어. 💜</strong></p>
    <p>영상 인박스는 네가 정한 <strong>벨리댄스 / 팝핑 / 애니 / 힙합 / 재즈펑크</strong> 기준으로 수집하고, 기술 라이브러리는 <strong>Head / Neck / Shoulders / Chest / Abdomen / Pelvis / Arms / Legs</strong> 기준으로 정리하면 돼.</p>
    <p>그러면 같은 Chest Isolation 기술에 벨리댄스 영상과 팝핑 영상을 함께 연결해서 비교할 수 있어.</p>
    <p>아직 이 기술명들은 앱에 등록하지 않았어. 네가 직접 찾아보고 마음에 드는 동작 이름을 골라서 확정하면 좋겠어. ㅋㅋㅋ</p>
   </div>
  </section>
 </div>;
}
