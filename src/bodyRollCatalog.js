// Body Roll / Wave v1: dance-style discovery lists mapped to eight shared movement families.
// Some English names describe a movement for searching rather than a universally standardized dance term.
// Each term is placed in a single primary movement family to prevent duplicate library entries.
export const BODYROLL_CATEGORIES=[
 'Forward Body Roll','Backward Body Roll','Side Body Roll','Downward Body Wave',
 'Upward Body Wave','Lateral Body Wave','Circular Body Wave','Segmented Body Wave'
];
export const BODYROLL_STYLE_SECTIONS=[
 {genre:'Jazz Funk',label:'재즈펑크',items:[
  [0,'Forward Body Roll'],[1,'Reverse Body Roll'],[2,'Side Body Roll'],
  [3,'Chest-to-Hip Body Wave'],[4,'Hip-to-Chest Body Wave'],
  [5,'Side-to-Side Body Wave'],[6,'Circular Body Roll'],
  [7,'Body Ripple'],[7,'Segmented Body Wave']
 ]},
 {genre:'Heels Dance',label:'힐댄스',items:[
  [0,'Standing Body Roll'],[0,'Forward Body Roll'],[1,'Reverse Body Roll'],
  [2,'Side Body Roll'],[3,'Downward Body Wave'],
  [4,'Floor-to-Standing Body Wave'],[5,'Lateral Body Wave'],
  [6,'Circular Body Roll'],[7,'Floor Body Wave']
 ]},
 {genre:'Belly Dance',label:'벨리댄스',items:[
  [0,'Camel'],[0,'Walking Bodywave'],[1,'Reverse Camel'],
  [1,'Reverse Undulation'],[2,'Side Undulation'],
  [3,'Downward Undulation'],[4,'Upward Undulation'],
  [6,'Circular Undulation'],[7,'Belly Roll']
 ]},
 {genre:'Popping',label:'팝핑',items:[
  [0,'Forward Body Wave'],[1,'Reverse Body Wave'],[2,'Side Body Wave'],
  [3,'Top-to-Bottom Body Wave'],[4,'Bottom-to-Top Body Wave'],
  [5,'Lateral Body Wave'],[6,'Circular Body Wave'],
  [7,'Segmented Body Wave'],[7,'Ticking Body Wave']
 ]},
 {genre:'Bachata Sensual',label:'바차타',items:[
  [0,'Onda'],[0,'Forward Body Wave'],[1,'Reverse Onda'],
  [1,'Reverse Body Wave'],[2,'Onda Lateral'],[3,'Chest-Led Body Wave'],
  [4,'Hip-Led Body Wave'],[5,'Lateral Body Wave'],
  [6,'Continuous Body Undulation'],[7,'Body Wave with Pause']
 ]}
];
