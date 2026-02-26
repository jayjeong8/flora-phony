# FloraPhony 비주얼 퀄리티 업그레이드 마일스톤

> 마케팅팀 4개 에이전트(콘텐츠 전략가, 카피라이터, SNS 매니저, SEO 전문가) 합의 기반
> 작성일: 2026-02-26 | 브랜치: `feat/marketing-team`

---

## 현황 요약

| 항목 | 현재 상태 | 목표 |
|------|-----------|------|
| 식물 SVG | 32×40 단색 선화, 6~14개 요소, 평균 808바이트 | 투톤 필 + 하이라이트, 읽히는 실루엣 |
| 배경 불투명도 | 0.05~0.18 (거의 안 보임) | 0.20~0.35 (공간감 있는 정원) |
| 식물 그림자 | 없음 | Konva 지면 그림자(shadow ellipse) |
| OG 이미지 | 텍스트 전용 | 식물 SVG 임베딩 |
| `/plants` 페이지 | 미존재 | SEO 롱테일용 카탈로그 페이지 |
| 이미지 캐시 | 없음 | 모듈 레벨 SVG Image 캐시 |

---

## MS-1: 식물 SVG 리디자인 (최우선)

### 목표

현재 stroke-only 선화 → **투톤 필(base color + lighter highlight)** 보태니컬 필드 스케치 스타일로 업그레이드.
48×60px 렌더 사이즈에서 **한눈에 식별 가능한 실루엣**을 확보한다.

### 현재 상태 분석

```
rain-reed.svg (540B)  — 줄기 1 + 꽃머리 1 + 액센트 원 4개, 단색 #7BA7BC, fill 없음(머리만 fill)
lofi-fern.svg (835B)  — 줄기 1 + 잎 6개, 완전 stroke-only, fill="none"
bell-flower.svg (627B) — 3색 사용(#9B7DB8/#C9A0DC/#E8D5F0), 가장 완성도 높음
ember-thorn.svg (921B) — 이중 원 글로우, 가시 패턴, opacity 레이어링 활용
```

- **viewBox**: 전 식물 `32×40` 통일
- **색상**: 식물당 1~3색 사용, 대부분 단색(monochromatic)
- **그라디언트**: 미사용 (SVG gradient 없음)
- **Fill 비율**: 대부분 `fill="none"` stroke-only, 일부만 닫힌 path에 fill 적용

### 아트 디렉션

- **스타일**: Botanical field sketch, two-tone fill, grain-aware
- **필 구조**: 닫힌 바디 쉐이프 + base color 필 + 밝은 하이라이트 영역
- **그라디언트**: 불필요 — flat two-tone으로 충분
- **최대 요소 수**: 기존 6~14 → 15~25개 이내 (파일 사이즈 2KB 이하 유지)
- **viewBox**: `32×40` 유지 (렌더 사이즈 48×60은 캔버스 단에서 처리)

### 우선 업그레이드 대상 (약한 식물 6종)

| # | 식물 | 현재 크기 | 문제점 |
|---|------|-----------|--------|
| 1 | `rain-reed.svg` | 540B | 가장 단순, 꽃 형태 불분명 |
| 2 | `pulse-moss.svg` | 512B | 최소 크기, 이끼 형태 인지 불가 |
| 3 | `shimmer-sage.svg` | 614B | 실루엣 약함 |
| 4 | `rustle-ivy.svg` | 621B | 덩굴 형태 불분명 |
| 5 | `lofi-fern.svg` | 835B | 완전 stroke-only, 잎 필 없음 |
| 6 | `wind-wood.svg` | 695B | 나무 형태 인지 어려움 |

### 작업 항목

- [ ] **MS-1-1**: 아트 디렉션 레퍼런스 보드 확정 (스타일 가이드 1장)
- [ ] **MS-1-2**: 우선 6종 SVG 리디자인 (투톤 필 적용)
- [ ] **MS-1-3**: 나머지 14종 SVG 리디자인
- [ ] **MS-1-4**: 전 식물 48×60 렌더에서 실루엣 QA
- [ ] **MS-1-5**: 파일 사이즈 회귀 테스트 (식물당 2KB 이하)

### 수용 기준

- 모든 SVG에 닫힌 바디 쉐이프 + fill 적용
- 식물당 최소 2색 사용 (base + highlight)
- 48×60px 렌더에서 식물 종류 식별 가능
- 총 SVG 페이로드 40KB 이하 (현재 16KB)

---

## MS-2: 배경 불투명도 조정 (중간 우선)

### 목표

현재 거의 보이지 않는 배경 요소의 불투명도를 올려 **정원이라는 공간감**을 만든다.
구조 변경 없이 **opacity 값만 수정**.

### 현재 opacity 맵

| 요소 | 파일 | 현재 값 | 목표 값 |
|------|------|---------|---------|
| 토양 마운드 #1 | `garden-background.tsx:22` | 0.08 | **0.20** |
| 토양 마운드 #2 | `garden-background.tsx:27` | 0.06 | **0.15** |
| 잔디 (전경) | `garden-background.tsx:31` | 0.18 | **0.30** |
| 잔디 (배경) | `garden-background.tsx:67` | 0.1 | **0.20** |
| 들꽃 | `garden-background.tsx:83~114` | 0.22~0.30 | **0.35~0.45** |
| 조약돌 | `garden-background.tsx:118` | 0.07 | **0.15** |
| 코너 덩굴 (좌/우) | `garden-background.tsx:154,182` | 0.15 | **0.25** |
| 흩뿌린 잎 | `garden-background.tsx:209` | 0.06 | **0.12** |
| 씨앗/꽃잎 | `garden-background.tsx:219` | 0.05 | **0.10** |
| CSS 워시 | `globals.css` | 0.10~0.14 | **0.16~0.22** |
| CSS 도트 | `globals.css` | 0.15~0.18 | **0.22~0.28** |
| CSS 파티클 | `globals.css` | 0.15~0.25 | **0.25~0.35** |

### 작업 항목

- [ ] **MS-2-1**: `garden-background.tsx` SVG 요소 opacity 일괄 조정
- [ ] **MS-2-2**: `globals.css` 배경 레이어 opacity 조정
- [ ] **MS-2-3**: 라이트/다크 환경 비교 스크린샷 QA

### 수용 기준

- 배경에서 잔디, 토양, 들꽃이 시각적으로 인지 가능
- 식물 스프라이트와 배경 간 계층 분리 유지 (배경이 식물을 가리지 않음)
- `garden-bg-noise` opacity(0.4)는 변경하지 않음 (텍스처 유지)

---

## MS-3: 식물 지면 그림자 추가

### 목표

각 식물 하단에 **타원형 지면 그림자**를 추가해 정원 위에 **서 있는 느낌**을 준다.

### 구현 위치

`src/components/canvas/plant-sprite.tsx`

### 현재 렌더 구조

```
<Group> (outer: position, draggable, spawnScale)
  ├─ <Circle> (선택 링 — 선택 시만)
  ├─ <Group> (삭제 버튼 — 선택 시만)
  └─ <Group ref={animRef}> (애니메이션 컨테이너)
      └─ <KonvaImage> (48×60px 식물 SVG)
```

### 목표 렌더 구조

```
<Group> (outer: position, draggable, spawnScale)
  ├─ <Ellipse> (지면 그림자 — 항상 표시)     ← 신규
  ├─ <Circle> (선택 링 — 선택 시만)
  ├─ <Group> (삭제 버튼 — 선택 시만)
  └─ <Group ref={animRef}> (애니메이션 컨테이너)
      └─ <KonvaImage> (48×60px 식물 SVG)
```

### 그림자 스펙

| 속성 | 값 |
|------|-----|
| 컴포넌트 | Konva `<Ellipse>` |
| 위치 (y) | `SPRITE_HEIGHT / 2 + 2` (식물 바닥 바로 아래) |
| 가로 반지름 (radiusX) | `SPRITE_WIDTH / 2 - 4` (20px) |
| 세로 반지름 (radiusY) | `4~6px` |
| 색상 (fill) | `#3a3a2a` |
| 불투명도 (opacity) | `0.12~0.18` |
| 블러 필터 | `shadowBlur: 4` 또는 Konva Blur 필터 |
| 애니메이션 연동 | scale 애니메이션에 따라 radiusX 미세 변동 |

### 작업 항목

- [ ] **MS-3-1**: `plant-sprite.tsx`에 `<Ellipse>` 지면 그림자 추가
- [ ] **MS-3-2**: idle 애니메이션(scale)에 그림자 크기 연동
- [ ] **MS-3-3**: spawn 애니메이션에 그림자 페이드인 추가

### 수용 기준

- 식물이 캔버스 위에 "떠 있는" 느낌 제거
- 그림자가 식물 아래에 자연스럽게 위치
- 드래그 중에도 그림자가 함께 이동
- 성능: 식물 50개 배치 시 60fps 유지

---

## MS-4: OG 이미지에 식물 SVG 임베딩

### 목표

공유 시 생성되는 OG 이미지에 **실제 식물 시각 요소**를 포함해 SNS 클릭률을 높인다.

### 현재 상태

`src/app/opengraph-image.tsx` — 텍스트 전용 (1200×630px PNG, Edge Runtime)

```
현재: 🌿 이모지 + "FloraPhony" 텍스트 + 식물 개수/이름 텍스트
목표: 🌿 이모지 + "FloraPhony" 텍스트 + 식물 SVG 미리보기 행
```

### 구현 방안

- Next.js `ImageResponse` 내에서 SVG를 `<img src="data:image/svg+xml;base64,..." />` 형태로 인라인
- 공유 가든의 고유 식물 최대 8종을 가로 행으로 배치
- 식물별 렌더 사이즈: 60×75px (OG 이미지 내)
- 배경: 현재 `#F9F7F2` 유지, 하단에 연한 토양 색상 스트라이프 추가

### 작업 항목

- [ ] **MS-4-1**: SVG 파일을 base64 인코딩하는 유틸 함수 작성
- [ ] **MS-4-2**: `opengraph-image.tsx`에 식물 미리보기 행 추가
- [ ] **MS-4-3**: 빈 가든 / 식물 1개 / 식물 20개 케이스 QA

### 수용 기준

- 공유 URL에 가든 데이터가 있을 때 식물 시각 미리보기 표시
- Edge Runtime 호환 (Node.js `fs` 사용 불가 → 빌드타임 인라인 또는 fetch)
- OG 이미지 생성 시간 500ms 이내

---

## MS-5: `/plants` 카탈로그 페이지 (SEO)

### 목표

20종 식물 정보를 보여주는 **정적 카탈로그 페이지**를 만들어 SEO 롱테일 트래픽을 확보한다.

### 타겟 키워드

- `lofi plant sounds`, `ambient garden music generator`, `free lo-fi soundscape plants`
- 식물별: `rain reed ambient sound`, `bell flower lofi music`, `crystal cactus sound generator`

### 페이지 구조

```
/plants (정적 생성, SSG)
├─ 히어로 섹션: "The FloraPhony Plant Collection"
├─ 카테고리 필터: Ambient / Melodic / Rhythmic / Pads
├─ 식물 카드 그리드 (20종)
│   ├─ SVG 이미지 (80×100px)
│   ├─ 이름 + 라벨
│   ├─ 카테고리 배지
│   ├─ 설명 텍스트
│   └─ 색상 스워치
└─ CTA: "Start your garden →" (메인 페이지 링크)
```

### 기술 명세

| 항목 | 값 |
|------|-----|
| 라우트 | `src/app/plants/page.tsx` |
| 렌더링 | 정적 생성 (SSG, `export const dynamic = "force-static"`) |
| 데이터 소스 | `PLANT_REGISTRY` + `PLANT_CATEGORIES` |
| 메타데이터 | 페이지 전용 title, description, keywords |
| JSON-LD | `ItemList` 스키마 (20종 아이템) |

### 작업 항목

- [ ] **MS-5-1**: `src/app/plants/page.tsx` 페이지 생성
- [ ] **MS-5-2**: 식물 카드 컴포넌트 구현
- [ ] **MS-5-3**: 카테고리 필터 UI 구현
- [ ] **MS-5-4**: 페이지 메타데이터 + JSON-LD `ItemList` 스키마
- [ ] **MS-5-5**: 메인 네비게이션에 `/plants` 링크 추가

### 수용 기준

- 20종 식물 모두 표시, 카테고리 필터 동작
- Lighthouse SEO 점수 90+ 유지
- `next build`에서 정적 생성 확인
- 메인 페이지 `layout.tsx`에서 접근 가능

---

## MS-6: SVG Image 캐시 최적화

### 목표

현재 식물마다 `new Image()` → `img.src = svgPath`로 매번 로드하는 구조를
**모듈 레벨 캐시**로 교체해 동일 식물 다중 배치 시 중복 로드를 제거한다.

### 현재 구현

```typescript
// plant-sprite.tsx:13-26 — 식물마다 독립 로드
function usePlantImage(svgPath: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.src = svgPath;
    img.onload = () => setImage(img);
    return () => { img.onload = null; };
  }, [svgPath]);
  return image;
}
```

**문제**: 같은 식물(예: Rain Reed) 5개 배치 시 `Image` 객체 5개 생성

### 목표 구현

```typescript
// lib/plant-image-cache.ts — 모듈 싱글턴
const cache = new Map<string, HTMLImageElement>();
const loading = new Map<string, Promise<HTMLImageElement>>();

export function loadPlantImage(svgPath: string): Promise<HTMLImageElement> {
  if (cache.has(svgPath)) return Promise.resolve(cache.get(svgPath)!);
  if (loading.has(svgPath)) return loading.get(svgPath)!;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => { cache.set(svgPath, img); loading.delete(svgPath); resolve(img); };
    img.onerror = reject;
    img.src = svgPath;
  });
  loading.set(svgPath, promise);
  return promise;
}
```

### 작업 항목

- [ ] **MS-6-1**: `src/lib/plant-image-cache.ts` 모듈 생성
- [ ] **MS-6-2**: `usePlantImage` 훅을 캐시 기반으로 교체
- [ ] **MS-6-3**: 동일 식물 10개 배치 시 네트워크 요청 1회 확인

### 수용 기준

- 동일 SVG에 대해 `HTMLImageElement` 1개만 생성
- 기존 렌더 동작 변경 없음 (Konva Image에 동일 객체 참조 전달)
- 캐시 크기: 식물 20종 고정이므로 메모리 상한 불필요

---

## 우선순위 & 의존성 다이어그램

```
MS-1 식물 SVG 리디자인      ← 최우선, 다른 MS의 시각 품질 기반
  │
  ├── MS-4 OG 이미지 식물 임베딩 (MS-1 완료 후 의미 있음)
  ├── MS-5 /plants 카탈로그   (MS-1 완료 후 시각 임팩트 극대화)
  │
MS-2 배경 opacity 조정       ← MS-1과 병렬 가능
MS-3 지면 그림자 추가         ← MS-1과 병렬 가능
MS-6 이미지 캐시             ← 독립, 언제든 가능
```

### 추천 실행 순서

| 순서 | 마일스톤 | 의존성 | 예상 규모 |
|------|----------|--------|-----------|
| 1 | **MS-2** 배경 opacity | 없음 | 소 (값 변경만) |
| 2 | **MS-3** 지면 그림자 | 없음 | 소~중 |
| 3 | **MS-6** 이미지 캐시 | 없음 | 소 |
| 4 | **MS-1** SVG 리디자인 | 없음 | 대 (20종 아트워크) |
| 5 | **MS-4** OG 식물 임베딩 | MS-1 | 중 |
| 6 | **MS-5** /plants 페이지 | MS-1 | 중 |

> **MS-2, MS-3, MS-6**은 코드 변경만으로 즉시 효과가 있으므로 먼저 실행.
> **MS-1**은 아트워크 작업이 필요하므로 가장 큰 블로커.
> **MS-4, MS-5**는 MS-1 완료 후 시각 효과가 극대화됨.

---

## 금지 사항 (Do NOT)

- SVG에 `<linearGradient>`, `<radialGradient>` 사용 금지 — flat two-tone으로 충분
- `viewBox` 변경 금지 — 전 식물 `32×40` 통일 유지
- 배경 구조(HTML/CSS 레이어) 변경 금지 — opacity 값만 조정
- `garden-bg-noise` opacity(0.4) 변경 금지 — 텍스처 무결성 유지
- 식물 SVG 파일 2KB 초과 금지
- 비디오/소셜 콘텐츠 론칭은 비주얼 업그레이드 완료 전까지 보류
