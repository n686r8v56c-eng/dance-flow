import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import './SearchGuide.css';

const observations=[
 {name:'Jazz Funk — 재즈펑크',focus:'강약 대비와 포즈로 이어지는 롤',points:[
  '가슴·복부·골반 중 어디에서 움직임을 시작하는지',
  '강한 Accent 뒤에 파동을 부드럽게 이어가는지',
  '손·시선·머리 라인이 롤의 시작과 끝을 강조하는지',
  '파동이 다음 동작이나 포즈로 자연스럽게 연결되는지'
 ]},
 {name:'Heels Dance — 힐댄스',focus:'중심 이동과 서 있는 자세·플로어워크 연결',points:[
  '힐을 신은 상태에서 발과 체중 중심이 안정적인지',
  '무릎 굴곡과 골반 기울임을 어떻게 사용해 파동을 만드는지',
  'Standing / Floor 동작 사이에 어떤 지지점을 사용하는지',
  '허리를 과하게 젖히지 않고 가슴·골반을 순서대로 조절하는지'
 ]},
 {name:'Belly Dance — 벨리댄스',focus:'흉곽·복부·골반의 세밀한 순차 조절',points:[
  'Camel 또는 Undulation에서 실제 시작 부위가 어디인지',
  'Upper Abdomen과 Lower Abdomen을 어떻게 분리하는지',
  'Reverse 방향에서도 부드러운 연결이 유지되는지',
  '가슴과 골반의 이동을 무릎의 굴곡·신전이 얼마나 보조하는지'
 ]},
 {name:'Popping — 팝핑',focus:'분절된 파동과 타이밍 착시',points:[
  'Wave가 각 관절을 지나갈 때 어느 순간에 멈추는지',
  'Segmented Wave와 Ticking Wave에서 속도·정지의 차이가 무엇인지',
  'Pop / Hit을 파동 중 어느 지점에 배치하는지',
  '부드러운 Wave와 기계적인 Wave를 어떻게 구별하는지'
 ]},
 {name:'Bachata Sensual — 바차타',focus:'Onda의 전달과 파트너 연결',points:[
  'Chest-led / Hip-led 중 무엇으로 움직임을 시작하는지',
  '파동의 크기를 줄여도 순서가 정확히 유지되는지',
  '파트너와의 프레임·거리·상호 신호를 어떻게 유지하는지',
  '리드·팔로우가 각각 독립적으로 수행할 수 있는 범위는 어디까지인지'
 ]}
];
const comparisons=[
 {name:'Forward vs Backward',description:'상체가 앞뒤로 이동하는 궤적과 파동이 위·아래로 전달되는 순서를 따로 봐. 같은 동작도 카메라 방향과 강사의 명명법에 따라 이름이 다를 수 있어.'},
 {name:'Downward vs Upward',description:'머리·가슴에서 골반으로 내려가는지, 골반에서 가슴으로 올라가는지 시작점과 종료점을 추적해. Reverse라는 이름만으로 방향을 단정하지 마.'},
 {name:'Side vs Lateral',description:'이 둘은 영상에 따라 같은 좌우 파동을 의미하기도 해. 몸통이 옆으로 굽는지, 파동 자체가 좌우로 전달되는지 구분해 봐.'},
 {name:'Circular vs Segmented',description:'Circular는 경로의 형태를, Segmented는 전달의 방식과 끊김을 뜻해. 하나의 롤에 두 특징이 동시에 나타날 수 있어.'},
 {name:'Camel · Onda · Body Wave',description:'벨리댄스 Camel, 바차타 Onda, 팝핑 Body Wave를 비교할 때 명칭보다 흉곽·복부·골반의 움직이는 순서와 리듬을 기록해.'}
];
const categories=[
 'Forward Body Roll','Backward Body Roll','Side Body Roll','Downward Body Wave',
 'Upward Body Wave','Lateral Body Wave','Circular Body Wave','Segmented Body Wave'
];
export default function BodyRollSearchGuide({onClose}){
 const closeRef=useRef(null);
 useEffect(()=>{
  const handleKey=e=>{if(e.key==='Escape')onClose()};
  window.addEventListener('keydown',handleKey);
  closeRef.current?.focus();
  return()=>window.removeEventListener('keydown',handleKey);
 },[onClose]);
 return <div className="dance-guide-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="dance-guide-dialog" role="dialog" aria-modal="true" aria-label="Body Roll / Wave 검색가이드" aria-describedby="bodyroll-guide-intro">
   <header className="dance-guide-header"><h2>검색가이드</h2><button ref={closeRef} type="button" aria-label="검색가이드 닫기" onClick={onClose}><X size={21}/></button></header>
   <div className="dance-guide-body">
    <p id="bodyroll-guide-intro"><strong>Body Roll / Wave</strong>는 신체 부위를 하나씩 분리하는 것에서 더 나아가, <strong>어디서 시작해 어떤 순서로 전달되고 어디서 끝나는지</strong> 관찰하는 게 핵심이야. 💜</p>
    <p>장르별 기술명과 실제 검색어, 검색 진행 상태는 옆의 <strong>체크리스트</strong>에서 확인해. 여기에는 중복 목록 대신 영상 비교 기준만 정리했어.</p>
    <section className="dance-guide-section">
     <h3>1. 장르별 관찰 포인트</h3>
     {observations.map(section=><div className="dance-guide-observation" key={section.name}>
      <h4>{section.name}</h4><p><strong>핵심:</strong> {section.focus}</p>
      <ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>
     </div>)}
    </section>
    <section className="dance-guide-section">
     <h3>2. 파동을 비교하는 다섯 가지 기준</h3>
     <ul>
      <li><strong>Initiation:</strong> 시작점이 머리, 흉곽, 복부, 골반 중 어디인지</li>
      <li><strong>Sequence:</strong> 신체 부위가 움직이는 정확한 순서</li>
      <li><strong>Path:</strong> 앞뒤·좌우·위아래·원형 중 실제 궤적</li>
      <li><strong>Quality:</strong> 부드러운 연속형, 순간 정지형, 분절형 중 어떤 질감인지</li>
      <li><strong>Timing:</strong> 파동 하나가 몇 박을 차지하고 어디에 강세가 오는지</li>
     </ul>
    </section>
    <section className="dance-guide-section">
     <h3>3. 헷갈리기 쉬운 기술 비교</h3>
     {comparisons.map(item=><div className="dance-guide-comparison" key={item.name}>
      <strong>{item.name}</strong><p>{item.description}</p>
     </div>)}
    </section>
    <section className="dance-guide-section">
     <h3>4. 영상 검색·연습 시 주의사항</h3>
     <ul>
      <li><strong>검색어는 탐색용:</strong> Walking Bodywave, Reverse Onda 같은 이름이 모든 강사에게 통용되는 공식 명칭은 아니야.</li>
      <li><strong>방향의 의미 확인:</strong> Forward / Backward는 몸통의 이동 방향, Upward / Downward는 파동 전달 방향으로 분류했지만 실제 영상은 다를 수 있어.</li>
      <li><strong>측면 영상 우선:</strong> 흉곽·골반의 전후 움직임은 측면에서 더 명확할 때가 많아.</li>
      <li><strong>속도를 나눠 보기:</strong> 느린 분절 시범과 실제 음악 속도 시범을 함께 비교해.</li>
      <li><strong>허리보다 분절:</strong> 요추만 과하게 꺾지 말고 흉곽·골반·무릎의 협응을 봐. 불편하거나 통증이 생기면 범위를 줄여.</li>
      <li><strong>파트너 동작 주의:</strong> 바차타는 동의와 편안한 범위에서 연결을 유지하고, 상대의 몸통을 억지로 밀어 파동을 만들지 않아.</li>
     </ul>
    </section>
    <p className="dance-guide-note">분류 기준: 공통 기술 라이브러리의 {categories.length}개 대분류는 비교를 위한 대표 경로야. 한 기술이 여러 방향·질감을 동시에 가질 수 있으며 실제 동작이 분류보다 우선이야.</p>
   </div>
  </section>
 </div>;
}
