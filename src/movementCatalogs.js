// Curated starter taxonomy for four Dance Flow movement genres.
// A category indexes a movement principle; names are discoverability labels, not guaranteed standardized terms.
// Individual styles retain their own named moves and cultural contexts.
export const MOVEMENT_CATALOGS={
  "bounce": {
    "title": "Bounce / Groove",
    "categories": [
      "Down Bounce",
      "Up Bounce",
      "Rock & Sway",
      "Pulse & Rebound",
      "Groove Step",
      "Traveling Groove",
      "Syncopated Groove",
      "Body Groove"
    ],
    "styles": [
      {
        "genre": "Hip-Hop",
        "label": "힙합",
        "items": [
          [
            0,
            "Down Bounce"
          ],
          [
            1,
            "Up Bounce"
          ],
          [
            2,
            "Side-to-Side Rock"
          ],
          [
            3,
            "Knee Pulse"
          ],
          [
            4,
            "Two Step"
          ],
          [
            4,
            "Running Man"
          ],
          [
            5,
            "Party Walk"
          ],
          [
            6,
            "Jack Groove"
          ],
          [
            7,
            "Chest Groove"
          ],
          [
            7,
            "Shoulder Groove"
          ],
          [
            6,
            "Brooklyn Bounce"
          ],
          [
            2,
            "Body Rock"
          ]
        ]
      },
      {
        "genre": "House Dance",
        "label": "하우스",
        "items": [
          [
            0,
            "House Down Bounce"
          ],
          [
            1,
            "House Up Bounce"
          ],
          [
            2,
            "Jack Groove"
          ],
          [
            3,
            "Jack Pulse"
          ],
          [
            4,
            "House Two Step"
          ],
          [
            4,
            "Pas de Bourrée"
          ],
          [
            5,
            "House Skating"
          ],
          [
            5,
            "House Stomp"
          ],
          [
            6,
            "Loose Legs Groove"
          ],
          [
            6,
            "House Shuffle Groove"
          ],
          [
            7,
            "House Jacking"
          ],
          [
            2,
            "Side Rock"
          ]
        ]
      },
      {
        "genre": "Dancehall",
        "label": "댄스홀",
        "items": [
          [
            0,
            "Dancehall Down Bounce"
          ],
          [
            1,
            "Dancehall Up Bounce"
          ],
          [
            2,
            "Bogle Groove"
          ],
          [
            3,
            "Knee Pulse"
          ],
          [
            4,
            "Bogle"
          ],
          [
            4,
            "Willie Bounce"
          ],
          [
            5,
            "Pon Di River"
          ],
          [
            5,
            "Signal Di Plane"
          ],
          [
            6,
            "Wacky Dip Rhythm"
          ],
          [
            6,
            "Gully Creeper"
          ],
          [
            7,
            "Hip Groove"
          ],
          [
            7,
            "Shoulder Groove"
          ]
        ]
      },
      {
        "genre": "Afro Dance",
        "label": "아프로",
        "items": [
          [
            0,
            "Afro Down Bounce"
          ],
          [
            1,
            "Afro Up Bounce"
          ],
          [
            2,
            "Afro Side Rock"
          ],
          [
            3,
            "Afro Pulse"
          ],
          [
            4,
            "Shaku Shaku"
          ],
          [
            4,
            "Zanku"
          ],
          [
            5,
            "Gwara Gwara"
          ],
          [
            5,
            "Legwork Groove"
          ],
          [
            6,
            "Azonto Groove"
          ],
          [
            6,
            "Amapiano Groove"
          ],
          [
            7,
            "Shoulder Groove"
          ],
          [
            7,
            "Hip Groove"
          ]
        ]
      },
      {
        "genre": "Shuffle Dance",
        "label": "셔플",
        "items": [
          [
            0,
            "Shuffle Down Bounce"
          ],
          [
            1,
            "Shuffle Up Bounce"
          ],
          [
            2,
            "Side Rock"
          ],
          [
            3,
            "Knee Rebound"
          ],
          [
            4,
            "Running Man"
          ],
          [
            4,
            "T-Step Groove"
          ],
          [
            5,
            "Traveling Running Man"
          ],
          [
            5,
            "Shuffle Side Travel"
          ],
          [
            6,
            "Shuffle Rhythm Switch"
          ],
          [
            6,
            "Double-Time Shuffle"
          ],
          [
            7,
            "Arm and Torso Groove"
          ],
          [
            3,
            "Heel Rebound"
          ]
        ]
      }
    ],
    "guide": {
      "focus": "무릎·발목의 탄성으로 리듬을 만들고, 몸통·골반의 그루브로 연결하는 방식",
      "observation": [
        [
          "힙합",
          "Down/Up의 무릎 타이밍, 상체의 Rock, 바운스를 유지한 채 스텝을 바꾸는지"
        ],
        [
          "하우스",
          "Jacking의 몸통 흐름, 발의 리듬과 무릎 펄스가 충돌하지 않는지"
        ],
        [
          "댄스홀",
          "개별 소셜 스텝의 원형을 존중하고 골반·어깨 그루브가 어떻게 연결되는지"
        ],
        [
          "아프로",
          "세부 스타일의 문화적 맥락, 무게 중심과 상·하체 폴리리듬을 어떻게 만드는지"
        ],
        [
          "셔플",
          "Running Man/T-Step에서 발의 미끄러짐과 무릎 반발을 어떻게 결합하는지"
        ]
      ],
      "comparisons": [
        [
          "Down vs Up",
          "Down은 박에 맞춰 중심이 내려가는 느낌, Up은 펴지는 반동에 강조점을 두는 느낌. 무릎·발목의 실제 움직임과 강조 박을 함께 확인해."
        ],
        [
          "Pulse vs Rebound",
          "Pulse는 작은 반복 진동, Rebound는 눌렀다가 튀어 오르는 반발. 춤마다 같은 말을 다르게 쓰기도 해."
        ],
        [
          "Groove vs Step",
          "Groove는 리듬의 질감이고 Step은 발의 패턴이야. 스텝을 외워도 바운스가 사라지면 장르 느낌이 달라져."
        ],
        [
          "동일 Running Man",
          "힙합 파티 스텝과 셔플 Running Man은 발의 사용 방식과 리듬 강세가 다를 수 있어."
        ]
      ],
      "cautions": [
        "Dancehall·Afro는 하나의 통일된 기술체계가 아니라 여러 지역·시대·창작자에 걸친 스타일이야. 원작자와 스타일 이름을 확인해.",
        "동작명이 공식 표준이 아닌 설명식 검색어도 있어. 검색 결과에서 실제 움직임을 확인해.",
        "무릎·발목은 반동을 강제로 키우지 말고 편안한 가동범위에서 연습해."
      ]
    }
  },
  "footwork": {
    "title": "Footwork",
    "categories": [
      "Basic Steps & Weight Shift",
      "Shuffle & Slide",
      "Heel-Toe & Pivot",
      "Cross & Switch",
      "Kick & Flick",
      "Traveling Steps",
      "Floor Footwork",
      "Rhythm & Syncopation"
    ],
    "styles": [
      {
        "genre": "House Dance",
        "label": "하우스",
        "items": [
          [
            0,
            "House Two Step"
          ],
          [
            0,
            "Pas de Bourrée"
          ],
          [
            1,
            "House Shuffle"
          ],
          [
            1,
            "Skating"
          ],
          [
            2,
            "Heel Toe"
          ],
          [
            2,
            "Pivot Step"
          ],
          [
            3,
            "Cross Step"
          ],
          [
            3,
            "Loose Legs"
          ],
          [
            4,
            "Stomp"
          ],
          [
            5,
            "Farmer"
          ],
          [
            5,
            "Salsa Step"
          ],
          [
            6,
            "House Floorwork"
          ],
          [
            7,
            "Jack Rhythm Step"
          ]
        ]
      },
      {
        "genre": "Shuffle Dance",
        "label": "셔플",
        "items": [
          [
            0,
            "Running Man"
          ],
          [
            0,
            "T-Step"
          ],
          [
            1,
            "Shuffle Slide"
          ],
          [
            1,
            "Gliding"
          ],
          [
            2,
            "Heel Toe"
          ],
          [
            2,
            "T-Step Pivot"
          ],
          [
            3,
            "Cross Running Man"
          ],
          [
            3,
            "Switch Step"
          ],
          [
            4,
            "Kick Step"
          ],
          [
            5,
            "Traveling Running Man"
          ],
          [
            5,
            "Traveling T-Step"
          ],
          [
            7,
            "Double Running Man"
          ],
          [
            7,
            "Shuffle Rhythm Variation"
          ]
        ]
      },
      {
        "genre": "Breaking",
        "label": "브레이킹",
        "items": [
          [
            0,
            "Toprock Basic Step"
          ],
          [
            0,
            "Indian Step"
          ],
          [
            1,
            "Toprock Slide"
          ],
          [
            2,
            "Toprock Pivot"
          ],
          [
            3,
            "Cross Step Toprock"
          ],
          [
            3,
            "Drop Step"
          ],
          [
            4,
            "Kick Out"
          ],
          [
            5,
            "Toprock Travel"
          ],
          [
            6,
            "Six Step"
          ],
          [
            6,
            "Three Step"
          ],
          [
            6,
            "CC"
          ],
          [
            6,
            "Coffee Grinder"
          ],
          [
            7,
            "Footwork Rhythm Change"
          ]
        ]
      },
      {
        "genre": "Hip-Hop",
        "label": "힙합",
        "items": [
          [
            0,
            "Two Step"
          ],
          [
            0,
            "Running Man"
          ],
          [
            1,
            "Slide Step"
          ],
          [
            1,
            "Heel Slide"
          ],
          [
            2,
            "Heel Toe"
          ],
          [
            2,
            "Toe Pivot"
          ],
          [
            3,
            "Criss Cross"
          ],
          [
            3,
            "Roger Rabbit"
          ],
          [
            4,
            "Kick Ball Change"
          ],
          [
            5,
            "Party Walk"
          ],
          [
            5,
            "Walk It Out"
          ],
          [
            7,
            "Reebok Step"
          ],
          [
            7,
            "Rhythm Step"
          ]
        ]
      },
      {
        "genre": "Locking",
        "label": "락킹",
        "items": [
          [
            0,
            "Locking Basic Step"
          ],
          [
            0,
            "Scooby Doo"
          ],
          [
            1,
            "Slide Step"
          ],
          [
            2,
            "Heel Toe"
          ],
          [
            2,
            "Locking Pivot"
          ],
          [
            3,
            "Cross Step"
          ],
          [
            3,
            "Which-A-Way"
          ],
          [
            4,
            "Kick Walk"
          ],
          [
            4,
            "Scoobot"
          ],
          [
            5,
            "Stop and Go"
          ],
          [
            5,
            "Locking Walk"
          ],
          [
            7,
            "Skeeter Rabbit"
          ],
          [
            7,
            "Locking Rhythm Step"
          ]
        ]
      }
    ],
    "guide": {
      "focus": "발의 모양보다 체중이동·접지 순서·리듬을 우선 관찰",
      "observation": [
        [
          "하우스",
          "발바닥 전체와 앞꿈치의 체중 이동, 스텝 사이 Jacking의 유지"
        ],
        [
          "셔플",
          "Running Man과 T-Step에서 발의 이동 경로·슬라이드·반발"
        ],
        [
          "브레이킹",
          "Toprock에서 Downrock으로 내려가는 전환, 손 지지와 발의 순서"
        ],
        [
          "힙합",
          "파티 스텝의 박자·중심 이동·상체 그루브가 발 동작과 결합되는지"
        ],
        [
          "락킹",
          "Lock의 정지와 다음 발 스텝의 리듬, 손·팔 제스처와의 동시성"
        ]
      ],
      "comparisons": [
        [
          "Running Man",
          "셔플의 Running Man과 힙합의 Running Man을 발을 끄는 방식·강세·몸통 위치로 비교해."
        ],
        [
          "Heel-Toe",
          "발끝·뒤꿈치의 회전 방향, 지지발을 고정하는지 이동하는지 확인해."
        ],
        [
          "Cross & Switch",
          "발을 교차하는 것과 체중 지지발을 바꾸는 것은 별개의 동작이야."
        ],
        [
          "Toprock vs Floor Footwork",
          "같은 Breaking에서도 선 자세의 리듬 발동작과 바닥 지지 움직임은 별도 기준으로 봐."
        ]
      ],
      "cautions": [
        "장르가 다른 같은 이름은 움직임이 반드시 같다는 뜻이 아니야.",
        "브레이킹 바닥 동작은 손목과 어깨 지지를 무리해서 늘리지 않고 천천히 단계별로 연습해.",
        "발 동작의 모양만 따라 하지 말고 체중이 어느 발에 있는지 확인해."
      ]
    }
  },
  "armmovement": {
    "title": "Arm Movement",
    "categories": [
      "Arm Lines & Extensions",
      "Arm Swings & Circles",
      "Arm Waves & Rolls",
      "Wrist & Hand Articulation",
      "Angles & Geometry",
      "Hits & Accents",
      "Tracing & Framing",
      "Continuous Arm Flow"
    ],
    "styles": [
      {
        "genre": "Waacking",
        "label": "왁킹",
        "items": [
          [
            0,
            "Waacking Arm Line"
          ],
          [
            0,
            "Arm Extension"
          ],
          [
            1,
            "Waacking Arm Swing"
          ],
          [
            1,
            "Overhead Arm Circle"
          ],
          [
            2,
            "Arm Roll"
          ],
          [
            2,
            "Arm Wave"
          ],
          [
            3,
            "Wrist Roll"
          ],
          [
            3,
            "Hand Flick"
          ],
          [
            4,
            "Angular Arm Position"
          ],
          [
            5,
            "Arm Hit"
          ],
          [
            5,
            "Arm Accent"
          ],
          [
            6,
            "Face Framing"
          ],
          [
            7,
            "Continuous Waacking Arms"
          ],
          [
            7,
            "Arm Combination"
          ]
        ]
      },
      {
        "genre": "Voguing",
        "label": "보깅",
        "items": [
          [
            0,
            "Vogue Arm Line"
          ],
          [
            0,
            "Arm Extension"
          ],
          [
            1,
            "Arm Circle"
          ],
          [
            2,
            "Arm Wave"
          ],
          [
            3,
            "Hand Performance"
          ],
          [
            3,
            "Wrist Rotation"
          ],
          [
            3,
            "Finger Articulation"
          ],
          [
            4,
            "Angular Arm Position"
          ],
          [
            4,
            "Vogue Lines"
          ],
          [
            5,
            "Hand Accent"
          ],
          [
            6,
            "Face Framing"
          ],
          [
            6,
            "Hand Tracing"
          ],
          [
            7,
            "Continuous Hand Performance"
          ]
        ]
      },
      {
        "genre": "Tutting",
        "label": "터팅",
        "items": [
          [
            0,
            "Straight Arm Line"
          ],
          [
            1,
            "Arm Rotation"
          ],
          [
            2,
            "Arm Wave"
          ],
          [
            3,
            "Wrist Rotation"
          ],
          [
            3,
            "Finger Tutting"
          ],
          [
            4,
            "Box Tutting"
          ],
          [
            4,
            "Right Angle Tutting"
          ],
          [
            4,
            "King Tut Position"
          ],
          [
            4,
            "Arm Geometry"
          ],
          [
            5,
            "Angle Hit"
          ],
          [
            6,
            "Arm Tracing"
          ],
          [
            6,
            "Frame Transition"
          ],
          [
            7,
            "Tutting Combination"
          ]
        ]
      },
      {
        "genre": "Locking",
        "label": "락킹",
        "items": [
          [
            0,
            "Point"
          ],
          [
            0,
            "Arm Extension"
          ],
          [
            1,
            "Wrist Roll"
          ],
          [
            1,
            "Arm Swing"
          ],
          [
            2,
            "Arm Roll"
          ],
          [
            3,
            "Wrist Twirl"
          ],
          [
            3,
            "Hand Clap"
          ],
          [
            4,
            "Lock Position"
          ],
          [
            5,
            "Lock"
          ],
          [
            5,
            "Double Lock"
          ],
          [
            6,
            "Pointing Gesture"
          ],
          [
            7,
            "Locking Arm Combination"
          ]
        ]
      },
      {
        "genre": "Jazz Funk",
        "label": "재즈펑크",
        "items": [
          [
            0,
            "Jazz Funk Arm Line"
          ],
          [
            0,
            "Arm Extension"
          ],
          [
            1,
            "Arm Sweep"
          ],
          [
            1,
            "Arm Circle"
          ],
          [
            2,
            "Arm Wave"
          ],
          [
            2,
            "Arm Roll"
          ],
          [
            3,
            "Wrist Flick"
          ],
          [
            3,
            "Hand Articulation"
          ],
          [
            4,
            "Angular Arm Position"
          ],
          [
            5,
            "Arm Hit"
          ],
          [
            5,
            "Sharp Arm Accent"
          ],
          [
            6,
            "Face Framing"
          ],
          [
            7,
            "Fluid Arm Combination"
          ]
        ]
      }
    ],
    "guide": {
      "focus": "어깨에서 손끝까지의 관절 순서, 라인, 각도, 속도와 시선을 연결하는 기술",
      "observation": [
        [
          "왁킹",
          "어깨 중심 회전·팔의 궤적·손목 연속 움직임, 과긴장 없이 빠르게 반복되는지"
        ],
        [
          "보깅",
          "Hand Performance와 프레이밍, 각도·시선·포즈가 하나의 표현으로 이어지는지"
        ],
        [
          "터팅",
          "팔꿈치·손목의 각도, 2D·3D 공간의 선과 사각형이 정확한지"
        ],
        [
          "락킹",
          "Point, Wrist Roll, Lock의 타이밍과 정지 이후 재출발의 대비"
        ],
        [
          "재즈펑크",
          "길게 뻗는 라인과 Sharp Accent, 몸통·헤드 동작과 동시 표현"
        ]
      ],
      "comparisons": [
        [
          "Waacking vs Voguing",
          "왁킹은 빠른 회전 궤적·음악적 표현, 보깅은 Hand Performance·라인·포즈와 문화적 맥락을 함께 봐."
        ],
        [
          "Wrist Roll vs Wrist Twirl",
          "손목 회전이 팔의 회전과 연결되는지, 제스처처럼 독립적인지 구분해."
        ],
        [
          "Wave vs Geometry",
          "Arm Wave는 관절 순차 전달, Tutting의 Geometry는 정확한 각도와 프레임이 핵심이야."
        ],
        [
          "Lock vs Hit",
          "Lock은 자세를 순간적으로 잡아 고정하는 효과, Hit은 순간 수축/강조로 볼 수 있어."
        ]
      ],
      "cautions": [
        "Voguing·Waacking의 문화적 뿌리와 장르 관습을 존중하고 영상의 스타일 명칭을 확인해.",
        "손목·어깨에 통증이 생기는 과회전은 피하고 부드럽게 단계별 연습해.",
        "기술명 중 일부는 설명식 라벨이므로 실제 강사의 표현과 대조해."
      ]
    }
  },
  "gaze": {
    "title": "Gaze / Pose",
    "categories": [
      "Eye Direction & Tracking",
      "Head Turns & Direction",
      "Facial Expression",
      "Static Poses & Lines",
      "Angular & Geometric Poses",
      "Pose Transitions",
      "Performance Focus",
      "Partner & Camera Focus"
    ],
    "styles": [
      {
        "genre": "Voguing",
        "label": "보깅",
        "items": [
          [
            0,
            "Eye Tracking"
          ],
          [
            0,
            "Side Glance"
          ],
          [
            1,
            "Head Turn"
          ],
          [
            1,
            "Chin Lift"
          ],
          [
            2,
            "Runway Expression"
          ],
          [
            2,
            "Facial Attitude"
          ],
          [
            3,
            "Vogue Pose"
          ],
          [
            3,
            "Runway Pose"
          ],
          [
            4,
            "Angular Pose"
          ],
          [
            4,
            "Vogue Lines"
          ],
          [
            5,
            "Pose Transition"
          ],
          [
            5,
            "Dip Preparation"
          ],
          [
            6,
            "Performance Focus"
          ],
          [
            7,
            "Runway Focus"
          ]
        ]
      },
      {
        "genre": "Jazz Funk",
        "label": "재즈펑크",
        "items": [
          [
            0,
            "Eye Focus Shift"
          ],
          [
            0,
            "Side Glance"
          ],
          [
            1,
            "Head Whip"
          ],
          [
            1,
            "Head Turn"
          ],
          [
            2,
            "Facial Expression Change"
          ],
          [
            2,
            "Lip Sync Expression"
          ],
          [
            3,
            "Jazz Funk Pose"
          ],
          [
            3,
            "Body Line Pose"
          ],
          [
            4,
            "Angular Pose"
          ],
          [
            5,
            "Sharp Pose Transition"
          ],
          [
            5,
            "Slow Pose Transition"
          ],
          [
            6,
            "Audience Focus"
          ],
          [
            7,
            "Camera Look"
          ]
        ]
      },
      {
        "genre": "Heels Dance",
        "label": "힐댄스",
        "items": [
          [
            0,
            "Eye Focus Shift"
          ],
          [
            0,
            "Over-the-Shoulder Look"
          ],
          [
            1,
            "Chin Lift"
          ],
          [
            1,
            "Head Turn"
          ],
          [
            2,
            "Facial Confidence"
          ],
          [
            2,
            "Soft Gaze"
          ],
          [
            3,
            "Heels Pose"
          ],
          [
            3,
            "S-Curve Pose"
          ],
          [
            4,
            "Angular Pose"
          ],
          [
            5,
            "Pose Walk Transition"
          ],
          [
            5,
            "Floor-to-Stand Pose"
          ],
          [
            6,
            "Stage Focus"
          ],
          [
            7,
            "Camera Look"
          ]
        ]
      },
      {
        "genre": "Waacking",
        "label": "왁킹",
        "items": [
          [
            0,
            "Eye Tracking"
          ],
          [
            0,
            "Side Glance"
          ],
          [
            1,
            "Head Turn"
          ],
          [
            1,
            "Head Accent"
          ],
          [
            2,
            "Expressive Face"
          ],
          [
            2,
            "Facial Attitude"
          ],
          [
            3,
            "Waacking Pose"
          ],
          [
            3,
            "Arm Frame Pose"
          ],
          [
            4,
            "Angular Pose"
          ],
          [
            5,
            "Musical Pose Hit"
          ],
          [
            5,
            "Pose Transition"
          ],
          [
            6,
            "Audience Focus"
          ],
          [
            7,
            "Camera Look"
          ]
        ]
      },
      {
        "genre": "K-Pop",
        "label": "케이팝",
        "items": [
          [
            0,
            "Camera Eye Contact"
          ],
          [
            0,
            "Eye Focus Shift"
          ],
          [
            1,
            "Head Turn"
          ],
          [
            1,
            "Head Tilt"
          ],
          [
            2,
            "Facial Expression Change"
          ],
          [
            2,
            "Lip Sync Expression"
          ],
          [
            3,
            "Ending Fairy Pose"
          ],
          [
            3,
            "K-Pop Point Pose"
          ],
          [
            4,
            "Angular Pose"
          ],
          [
            5,
            "Ending Pose Transition"
          ],
          [
            5,
            "Formation Pose Change"
          ],
          [
            6,
            "Performance Focus"
          ],
          [
            7,
            "Camera Look"
          ],
          [
            7,
            "Camera Angle Awareness"
          ]
        ]
      }
    ],
    "guide": {
      "focus": "시선·얼굴·머리·정지 포즈·카메라의 관계를 리듬과 함께 관찰",
      "observation": [
        [
          "보깅",
          "Runway와 Hand/Face 표현, 포즈 각도, 관객과의 시선 교환"
        ],
        [
          "재즈펑크",
          "Head Accent 이후 시선을 멈추는 지점, 표정과 날카로운 포즈의 대비"
        ],
        [
          "힐댄스",
          "보행·체중 중심을 유지한 채 상체·시선·포즈가 이어지는지"
        ],
        [
          "왁킹",
          "팔 프레임과 시선이 맞물리는 순간, 음악의 강조점에서 포즈를 정확히 멈추는지"
        ],
        [
          "케이팝",
          "카메라 위치·표정 전환·엔딩 포즈·포메이션 변화와 시선 설계"
        ]
      ],
      "comparisons": [
        [
          "Look vs Head Turn",
          "눈동자만 이동하는지 머리 전체를 돌리는지 구분하고, 변화가 어느 박에 일어나는지 봐."
        ],
        [
          "Expression vs Pose",
          "표정은 얼굴의 감정 전달이고 Pose는 몸의 정지 형태야. 둘은 함께 쓰여도 별도로 관찰 가능해."
        ],
        [
          "Audience vs Camera Focus",
          "실제 관객·파트너·렌즈 중 누구에게 초점을 맞추는지에 따라 시선의 의미가 달라져."
        ],
        [
          "Angular vs Flowing Pose",
          "각진 라인의 정지와 부드러운 연결을 비교하되, 카메라 각도 때문에 생기는 착시를 확인해."
        ]
      ],
      "cautions": [
        "보깅의 용어는 Ballroom의 역사·스타일에 따라 의미가 달라져. 'Dip'을 무조건 Death Drop으로 부르지 않아.",
        "시선·포즈는 단일 공식 기술 목록이 없으므로 여러 이름이 검색을 위한 설명식 라벨이야.",
        "머리·목을 급하게 꺾는 동작은 줄이고 표정은 과도한 긴장보다 전달력을 우선해."
      ]
    }
  }
};
