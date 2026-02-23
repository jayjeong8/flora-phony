# [PRD] FloraPhony: 시각과 청각의 조화, 나만의 음악 정원

## 1. 제품 개요 (Product Overview)

* **목적:** 사용자가 식물을 배치하여 시각적인 정원을 꾸미는 동시에, 식물별 고유 사운드를 조합해 자신만의 **앰비언트 사운드스케이프(Soundscape)**를 만드는 웹 서비스.
* **핵심 가치:** 디지털 디톡스, 개인화된 휴식(Relaxation), 시청각적 만족감.
* **타겟:** Lo-fi 비트를 즐겨 듣고 미니멀한 미학을 선호하는 북미/유럽 20대.

---

## 2. 사용자 경험 (User Journey)

1. **접속:** 웹사이트 접속 시 고요한 배경음과 함께 빈 정원(Canvas)이 나타남.
2. **선택:** 하단 툴바에서 서로 다른 음색을 가진 식물 씨앗을 선택.
3. **배치:** 드래그 앤 드롭으로 정원에 식물을 심음. 심는 순간 해당 식물의 악기 소리가 레이어링됨.
4. **조절:** 식물을 추가하거나 위치를 옮기며 사운드의 볼륨과 조화를 실시간으로 감상.
5. **저장/공유:** 완성된 정원의 이미지와 사운드 조합을 고유 링크나 이미지로 저장.

---

## 3. 주요 기능 (Core Features - MVP)

### ① 가상 가드닝 캔버스 (Visual Canvas)

* **드래그 앤 드롭:** 마우스나 터치로 식물을 자유롭게 배치.
* **비주얼 피드백:** 식물을 심을 때 가벼운 애니메이션(흔들림, 빛남) 효과.
* **식물 라이브러리 (최소 5종):** * 각 식물은 고유한 그래픽과 10~15초 분량의 매끄러운 **루프(Loop) 음원**을 가짐.

### ② 절차적 사운드 믹싱 (Procedural Audio Mixing)

* **자동 레이어링:** 식물이 캔버스에 추가될 때마다 해당 루프 음원이 전체 볼륨에 합쳐짐.
* **수량 비례 볼륨:** 동일한 종류의 식물을 많이 심을수록 해당 악기 소리의 볼륨이 단계별로 증폭 (최대 5단계).
* **패닝(Panning) 효과:** 식물의 가로 위치(축)에 따라 소리의 좌/우 밸런스 자동 조절.

### ③ 정원 익스포트 (Export)

* **스냅샷:** 현재 정원 모습을 `.png` 파일로 저장.
* **고유 URL 생성:** 현재 심어진 식물의 종류, 위치, 수량 데이터를 파라미터화하여 URL로 변환 (예: `floraphony.com/share?p1=3&p2=1...`).

---

## 4. 기술 스택 및 구현 가이드 (Technical Specs)

* **Graphics:** HTML5 Canvas 또는 리액트 기반의 가벼운 2D 라이브러리 (예: Konva.js).
* **Audio Engine:** **Tone.js** (웹 브라우저에서 오케스트레이션 및 오디오 스케줄링을 정밀하게 제어 가능).

---

## 5. 초기 식물/사운드 셋업 (Draft)

| 식물 이름 | 사운드 유형 | 청각적 느낌 | 시각적 특징 |
| --- | --- | --- | --- |
| **Rain Reed** | 화이트 노이즈 | 부드러운 빗소리, 안정감 | 가늘고 긴 갈대 |
| **Lofi Fern** | 일렉 피아노 | 몽글몽글한 코드 반주 | 넓은 잎의 고사리 |
| **Pulse Moss** | 신시사이저 베이스 | 심장 박동 같은 낮은 울림 | 바닥에 깔린 이끼 |
| **Bell Flower** | 고음역대 벨 | 맑고 영롱한 멜로디 포인트 | 작은 종 모양 꽃 |
| **Wind Wood** | 우드 퍼커션 | 나무 부딪히는 딱딱 소리 | 단단한 느낌의 작은 나무 |

---

## 6. 성공 지표 (Success Metrics)

* **Session Duration:** 사용자가 한 세션 동안 정원을 유지하며 음악을 듣는 평균 시간 (목표: 10분 이상).
* **Share Rate:** 생성된 고유 URL이 SNS(X, Instagram)를 통해 공유되는 횟수.

---

PRD를 바탕으로 개발자가 즉시 구현 로직을 설계할 수 있도록 정리한 **상세 기능 명세서(Functional Specification)**입니다.

이 명세서는 **Web Audio API**와 **Canvas API**를 활용한 최소 구현(MVP)에 초점을 맞췄습니다.

---

## 1. 캔버스 및 객체 관리 (Visual Layer)

### 1.1 가상 정원 캔버스

* **좌표 시스템:** 캔버스 중심을 으로 설정하거나, 좌측 상단을 기준으로 상대 좌표(%)를 사용하여 해상도 대응.
* **식물 인스턴스:** 식물을 심을 때마다 고유 ID, 종류(Type), 위치() 데이터를 포함한 객체 생성.
* **최대 개수 제한:** 성능 및 음향 혼선 방지를 위해 화면당 최대 식물 개수 제한 (예: 20개).

### 1.2 드래그 앤 드롭 로직

* **상태 1 (선택):** 하단 에셋 바에서 식물 아이콘 클릭 시 'Hold' 상태 진입.
* **상태 2 (배치):** 캔버스 위 클릭/드롭 시 해당 좌표에 식물 스프라이트 렌더링.
* **상태 3 (삭제):** 배치된 식물을 다시 클릭하거나 캔버스 밖으로 드래그하면 제거 (연결된 사운드 즉시 페이드아웃).

---

## 2. 오디오 엔진 로직 (Audio Layer)

### 2.1 사운드 뱅크 (Asset Management)

* 모든 식물은 **BPM 80, C Major 키**로 통일된 8마디(약 15~20초) 루프 파일을 가짐.
* 파일 포맷: `.ogg` 또는 `.mp3` (브라우저 호환성 및 용량 최적화).

### 2.2 실시간 믹싱 알고리즘

* **Master Clock:** 페이지 로드 시 무음 상태의 마스터 클록 시작. 모든 루프는 이 클록에 맞춰 **동기화(Sync)**되어 재생됨.
* **동적 볼륨 (Gain Control):**
* 동일 종류 식물 개수()에 따른 볼륨 계산: .
* 개수가 늘어날수록 소리가 커지되, 귀가 아프지 않게 로그 함수형태로 제어.


* **스테레오 패닝 (Panning):**
* 식물의  좌표값을 (좌)에서 (우) 사이의 값으로 변환하여 `PannerNode`에 전달.
* 화면 왼쪽에 심으면 왼쪽 스피커에서, 오른쪽에 심으면 오른쪽에서 소리가 남.



---

## 3. UI/UX 컴포넌트 명세

### 3.1 하단 에셋 바 (Seed Bar)

* 5종의 식물 아이콘 배치.
* 각 아이콘 아래에 해당 식물의 악기 이름(예: "Lofi Piano", "Rain") 표시.
* 선택 시 시각적 강조(Highlight) 효과.

### 3.2 컨트롤 패널 (Global Control)

* **Master Volume:** 전체 사운드 크기 조절 슬라이더.
* **Clear All:** 캔버스 초기화 (모든 사운드 중지).
* **Snapshot:** 현재 화면 캡처 및 이미지 다운로드 버튼.

---

## 4. 데이터 및 공유 (Data Layer)

### 4.1 상태 직렬화 (State Serialization)

* 현재 정원의 상태를 짧은 문자열로 압축.
* 형식: `식물ID:X좌표:Y좌표|식물ID:X좌표:Y좌표...`
* 예: `1:20:50|2:45:10|1:80:30` (1번 식물 두 개, 2번 식물 하나 배치됨).

### 4.2 URL 파라미터 공유

* 사용자가 'Share' 클릭 시 위 직렬화된 데이터를 URL 뒤에 붙여 생성.
* `https://floraphony.com/?garden=1:20:50|2:45:10`
* 해당 URL로 접속 시, 스크립트가 파라미터를 파싱하여 자동으로 식물을 배치하고 사운드 재생.

---

## 5. 예외 처리 (Exception Handling)

* **브라우저 정책:** 사용자의 첫 클릭(Interaction) 전까지 오디오 재생 차단 (Chrome 정책 대응 'Click to Start' 모달 필요).
* **모바일 최적화:** 모바일 웹 환경에서는 멀티 터치 및 성능 저하를 고려해 식물 배치 시 애니메이션 프레임 드랍 방지.

---

디자인 가이드와 기술적 구현의 핵심인 `Tone.js` 샘플 코드를 정리해 드립니다. 이 두 자료는 개발자와 디자이너가 프로젝트의 '톤앤매너'와 '작동 원리'를 즉시 이해하는 데 큰 도움이 될 것입니다.

---

## 1. UI/UX 디자인 가이드 (Visual Identity)

20대 타겟의 미니멀하고 감성적인 웹 앱을 위한 가이드입니다.

### **Color Palette**

* **Background (Canvas):** `#F9F7F2` (Off-white / 따뜻한 종이 질감)
* **Primary Plant Green:** `#6B8E23` (Olive Drab / 차분한 자연의 녹색)
* **Accent (UI Elements):** `#D4A373` (Terra Cotta / 부드러운 흙색)
* **Text:** `#333333` (Dark Grey / 가독성 높은 짙은 회색)

### **Typography**

* **Main Title:** *Gaegu* 또는 *Quicksand* (둥글고 친근한 느낌의 구글 폰트)
* **Body/UI:** *Montserrat* 

### **Layout Structure**

1. **Top Bar:** 로고와 'About', 'Clear' 버튼 배치.
2. **Center Canvas:** 식물이 심어지는 넓은 여백의 공간.
3. **Bottom Seed Bar:** 식물 아이콘들이 가로로 나열된 플로팅 바. 아이콘은 단순한 선(Line art) 위주로 구성.
4. **Interaction:** 식물을 캔버스에 드롭할 때 미세한 파동(Ripple) 효과 발생.

---

## 2. Tone.js 기반 사운드 구현 코드 (Technical Sample)

식물을 심었을 때 소리가 동기화되어 재생되고, 위치에 따라 소리가 좌우로 나뉘는 핵심 로직입니다.

```javascript
// 1. 오디오 엔진 초기화 및 마스터 볼륨 설정
const limiter = new Tone.Limiter(-1).toDestination(); // 소리 깨짐 방지
const mainVolume = new Tone.Volume(-10).connect(limiter);

// 2. 식물별 사운드 플레이어 생성 (예시: Lofi Piano)
// 모든 루프는 동일한 BPM(80)과 길이를 가져야 함
const plantSounds = {
  'p1': {
    url: '/assets/audio/piano_loop.mp3',
    player: new Tone.Player().cache = true,
    panner: new Tone.Panner(0).connect(mainVolume) // 초기 위치 중앙
  },
  'p2': {
    url: '/assets/audio/rain_loop.mp3',
    player: new Tone.Player().cache = true,
    panner: new Tone.Panner(0).connect(mainVolume)
  }
};

// 3. 식물 배치 함수 (드롭 이벤트 시 호출)
async function addPlant(type, xPercent) {
  await Tone.start(); // 브라우저 오디오 정책 대응
  
  const sound = plantSounds[type];
  
  // X 좌표에 따른 스테레오 패닝 설정 (-1 ~ 1)
  const panValue = (xPercent / 100) * 2 - 1; 
  sound.panner.pan.rampTo(panValue, 0.5);

  // 루프 설정 및 마스터 클록에 맞춰 재생
  if (sound.player.state !== 'started') {
    sound.player.load(sound.url).then(() => {
      sound.player.loop = true;
      sound.player.connect(sound.panner);
      sound.player.start(Tone.Transport.nextSubdivision("4n")); // 박자에 맞춰 시작
    });
  } else {
    // 이미 재생 중이라면 개수에 따른 볼륨 증가 로직 추가 가능
    sound.player.volume.value += 2; 
  }
}

// 4. 전체 시작 버튼 (Transport 제어)
Tone.Transport.bpm.value = 80;
Tone.Transport.start();

```

---

## 3. 구현 팁 (Pro-tip)

* **Seamless Looping:** 사운드 파일의 시작과 끝이 튀지 않도록 제로 크로싱(Zero-crossing) 처리가 된 파일이어야 합니다.
* **Performance:** 식물이 많아질수록 CPU 점유율이 올라가므로, 동일 식물은 `Player` 인스턴스를 늘리는 대신 기존 `Player`의 볼륨만 조절하는 방식을 추천합니다.

---

북미와 유럽의 20대(Gen Z)는 **'감성적인 비주얼'**과 **'기능적 휴식(Functional Relaxation)'**에 민감합니다. 화려한 광고 문구보다는 담백하면서도 세련된, SNS 공유 욕구를 자극하는 영문 마케팅 카피를 제안합니다.

---

## 1. 메인 헤드라인 (Hero Section)

사용자가 웹사이트에 접속하자마자 가장 먼저 보게 될 강렬한 한 줄입니다.

* **Option A (감성형):** "Plants don't just grow. They sing."
* **Option B (기능형):** "Craft your own Lo-fi garden. Let the nature play your mood."
* **Option C (미니멀):** "Your Garden, Your Soundscape, Your Peace."

---

## 2. 서브 카피 (Sub-headline)

서비스의 핵심 가치를 짧게 설명하여 체류 시간을 늘립니다.

* "Drag, drop, and listen. Every sprout adds a beat, every leaf adds a melody. Build a living orchestra in your browser."
* "No green thumb required. Just a soul that needs a break. Create a unique ambient mix by simply planting a virtual garden."

---

## 3. 핵심 기능 설명 (Key Features - 3-Column Layout)

웹사이트 중간 섹션에 아이콘과 함께 배치할 짧은 문구입니다.

| **Visual Harmony** | **Procedural Audio** | **Share Your Zen** |
| --- | --- | --- |
| 미니멀한 일러스트로 나만의 디지털 오아시스를 디자인하세요. | 심는 위치와 양에 따라 실시간으로 변하는 입체 음향을 경험하세요. | 당신만의 유니크한 가든 사운드 링크를 친구들에게 선물하세요. |
| *Design your digital oasis with minimalist aesthetics.* | *Experience 3D audio that evolves with every seed you sow.* | *Send your unique garden link to anyone, anywhere.* |

---

## 4. 행동 유도 버튼 (Call to Action - CTA)

클릭을 유도하는 버튼 문구입니다.

* **[ Plant Your First Note ]** (음악적 컨셉 강조)
* **[ Enter the Harmony ]** (몰입감 강조)

---

## 💡 마케팅 팁 (Gen Z 타겟팅)

* **'Lo-fi' 키워드 활용:** 미국 20대에게 Lo-fi는 '집중'과 '휴식'의 대명사입니다. 검색 엔진 최적화(SEO)나 태그에 반드시 포함하세요.
* **다크 모드 지원:** 저녁 시간에 휴식을 취하며 접속하는 사용자가 많으므로, 눈이 편안한 테마임을 강조하는 것도 좋습니다.

---
