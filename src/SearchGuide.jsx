import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import './SearchGuide.css';

export const ISOLATION_SEARCH_SECTIONS=[
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
const comparisonPoints=[
 {name:'Belly Dance — 벨리댄스',focus:'분리의 정밀도와 부드러운 연결',points:[
  '가슴과 골반 중 어떤 부위가 먼저 움직이는지',
  '다른 부위는 얼마나 안정적으로 고정하는지',
  '원·8자 동작이 끊기지 않고 이어지는지',
  '복부의 상부와 하부를 독립적으로 조절하는지'
 ]},
 {name:'Popping — 팝핑',focus:'수축의 선명도와 비트 타이밍',points:[
  'Hit / Pop이 정확히 어느 박자에서 발생하는지',
  '수축 직후 이완이 얼마나 분명한지',
  '관절 이동과 근육 수축을 어떻게 구분하는지',
  '같은 동작을 약한 강도와 강한 강도로 반복할 수 있는지'
 ]},
 {name:'Animation — 애니메이션',focus:'관절 분절과 움직임의 착시',points:[
  '한 번에 움직이는 관절이 몇 개인지',
  'Ticking / Strobing처럼 프레임을 끊는 방식인지',
  'Waving처럼 관절 움직임을 순서대로 전달하는지',
  '시선과 속도 변화가 착시를 어떻게 강화하는지'
 ]},
 {name:'Hip-Hop — 힙합',focus:'아이솔레이션과 그루브의 결합',points:[
  '가슴·어깨·골반이 Bounce / Rock과 어떻게 연결되는지',
  '상체를 움직일 때 무릎과 체중 중심이 어떻게 반응하는지',
  '강박과 약박 중 어디에 동작이 강조되는지',
  '동작의 정확성과 자연스러운 흐름이 어떻게 균형을 이루는지'
 ]},
 {name:'Jazz Funk — 재즈펑크',focus:'선명한 라인과 표현의 대비',points:[
  '머리·어깨·가슴·골반의 시작점과 끝점이 얼마나 선명한지',
  '빠른 Accent와 느린 연결 움직임의 대비가 있는지',
  '시선·팔 라인·몸통 분리가 동시에 조화되는지',
  '움직임이 포즈 또는 다음 동작으로 어떻게 연결되는지'
 ]}
];
const crossComparisons=[
 {name:'Chest Isolation',view:'벨리댄스의 부드러운 흉곽 이동 ↔ 팝핑의 순간적인 Chest Hit ↔ 애니메이션의 분절된 이동'},
 {name:'Shoulder Isolation',view:'벨리댄스의 Shoulder Shimmy ↔ 팝핑의 Shoulder Pop ↔ 재즈펑크의 선명한 Shoulder Accent'},
 {name:'Hip Isolation',view:'벨리댄스의 Hip Circle / Figure Eight ↔ 힙합의 Groove 기반 Hip Rock ↔ 재즈펑크의 Hip Accent'},
 {name:'Head / Neck Isolation',view:'애니메이션의 기계적 정지와 분절 ↔ 재즈펑크의 빠른 Head Accent ↔ 벨리댄스의 부드러운 Head Slide'},
 {name:'Arm Isolation',view:'팝핑의 Arm Hit ↔ 애니메이션의 관절별 Arm Wave ↔ 재즈펑크의 라인과 연결'}
];
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
   <header className="dance-guide-header"><h2>검색가이드</h2><button ref={closeRef} type="button" aria-label="검색가이드 닫기" onClick={onClose}><X size={21}/></button></header>
   <div className="dance-guide-body">
    <p id="dance-guide-intro">기술명 목록과 검색 진행 상태는 옆의 <strong>체크리스트</strong>에서 확인해. 여기서는 같은 아이솔레이션을 장르마다 <strong>어떻게 다르게 표현하는지</strong> 관찰해 보자. 💜</p>
    <section className="dance-guide-section">
     <h3>1. 장르별 관찰 포인트</h3>
     {comparisonPoints.map(item=><div className="dance-guide-observation" key={item.name}>
      <h4>{item.name}</h4><p><strong>핵심:</strong> {item.focus}</p>
      <ul>{item.points.map(point=><li key={point}>{point}</li>)}</ul>
     </div>)}
    </section>
    <section className="dance-guide-section">
     <h3>2. 같은 기술, 다른 표현</h3>
     <p>영상을 두세 개 나란히 보고 <strong>속도 · 강약 · 분리 범위 · 연결 · 리듬</strong>의 차이를 찾아봐.</p>
     {crossComparisons.map(item=><div className="dance-guide-comparison" key={item.name}><strong>{item.name}</strong><p>{item.view}</p></div>)}
    </section>
    <section className="dance-guide-section">
     <h3>3. 영상 선택할 때 주의할 점</h3>
     <ul>
      <li><strong>이름보다 움직임 확인:</strong> 같은 기술명도 강사와 장르에 따라 다른 동작을 가리킬 수 있어.</li>
      <li><strong>고정 부위 관찰:</strong> 움직이는 곳뿐 아니라 움직이지 않게 유지하는 신체 부위도 봐.</li>
      <li><strong>정면·측면 비교:</strong> 정면 영상만으로 회전이나 전후 이동을 판단하기 어려울 수 있어.</li>
      <li><strong>속도 조절:</strong> 가능하면 느린 시범과 실제 음악 속도 시범을 모두 찾아봐.</li>
      <li><strong>관절 가동범위 존중:</strong> 특히 목과 허리를 끝 범위까지 억지로 밀거나 꺾지 않아도 돼.</li>
      <li><strong>검색어와 공식 용어 구별:</strong> Animation·Hip-Hop의 일부 세부 기술명은 통일된 공식 명칭이 아니라 검색을 위한 설명식 표현이야.</li>
     </ul>
    </section>
    <p className="dance-guide-note">정리 기준: 영상은 장르별로 모으고, 기술 라이브러리는 신체 부위와 Movement Pattern별로 정리하면 서로 다른 장르의 표현을 비교하기 좋아. Head와 Neck처럼 범위가 겹치는 분류는 영상 속 움직임을 보고 판단해.</p>
   </div>
  </section>
 </div>;
}
