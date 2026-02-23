# FloraPhony 구현 로드맵

## Context

FloraPhony는 식물을 배치하여 시각적 정원을 꾸미는 동시에, 식물별 고유 사운드를 조합해 앰비언트 사운드스케이프를 만드는 웹 서비스다. 현재 프로젝트는 Next.js 16 + React 19 + Tailwind v4 + shadcn/ui 스캐폴드만 있는 그린필드 상태이며, PRD(`.claude/docs/prd.md`)를 기반으로 MVP를 구현한다.

**디자인 방향**: Organic Warm (따뜻한 종이 질감 + 수채화 느낌의 자연스러운 톤)
**다크 모드**: MVP 이후로 미루기 (토큰은 확장 가능하게 설계)
**모바일**: 데스크톱 우선 (기본적인 반응형만 지원)
**식물 리소스팩**: 추후 추가 예정 → Tone.js 신스 플레이스홀더 + SVG 플레이스홀더 사용

---

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────┐
│                    page.tsx (조합)                     │
│  ┌──────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  TopBar   │  │ GardenCanvas│  │  ControlPanel  │  │
│  └──────────┘  │  (Konva.js) │  │  - Volume      │  │
│                │             │  │  - Share/Export │  │
│                └─────────────┘  └────────────────┘  │
│  ┌──────────────────────────────────────────────┐    │
│  │              SeedBar (하단 플로팅)              │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

상태: Zustand (garden-store)
오디오: Tone.js (PlantSoundManager)
그래픽: react-konva (Canvas 렌더링)
연결: useAudioSync (Store → Audio 브릿지)
```

---

## 병렬 실행 트랙 (6개)

### 의존성 그래프

```
Track A: 디자인 시스템 ──────────────────────────────────┐
  A1 → A2 → A3 → A4                                     │
                                                         ├─→ Track E: 통합
Track B: 데이터 & 상태 ─────────────────────────────┐    │     E1 → E2
  B1 → B2 → B3 → B4                                │    │
                                                    ├────┤
Track C: 오디오 엔진 ──────────────────────────┐    │    │
  C1 → C2 → C3 → C4 → C5                      │    │    │
                                                ├────┘    │
Track D: 캔버스 & 인터랙션 ───────────────┐     │         │
  D1 → D2 → D3 → D4 → D5               ├─────┘         │
                                                          │
Track F: 내보내기 & 공유 ─────────────────────────────────┘
  F1 → F2 → F3
```

---

## 병렬 실행 스케줄

| Phase | 동시 실행 가능 스텝 | 선행 조건 |
|-------|-------------------|----------|
| **1** | A1, B1, C1 | 없음 |
| **2** | A2, A3, B2, B3, C2 | Phase 1 |
| **3** | A4, B4, C3, D1 | Phase 2 |
| **4** | C4, D2 | Phase 3 |
| **5** | C5, D3, F1 | Phase 4 |
| **6** | D4, F2 | Phase 5 |
| **7** | D5, F3 | Phase 6 |
| **8** | E1 | Phase 7 (전체 통합) |
| **9** | E2 | Phase 8 |

---

## Track A: 디자인 시스템 & 테마

### A1: 디자인 컨셉 문서 생성 + 커스텀 테마 토큰 [S]
- **설명**: frontend-design 스킬에 따라 디자인 컨셉 문서를 `.claude/design-concepts/flora-phony.md`에 생성. Organic Warm 톤의 커스텀 테마를 globals.css에 적용
- **디자인 방향**:
  - 배경: `#F9F7F2` (따뜻한 종이 질감의 off-white)
  - Primary Green: `#6B8E23` (Olive Drab, 차분한 자연의 녹색)
  - Accent: `#D4A373` (Terra Cotta, 부드러운 흙색)
  - Text: `#333333` (Dark Grey)
  - 폰트: 디스플레이용 개성있는 폰트 + Montserrat (본문) — 단, 스킬 원칙에 따라 generic 폰트(Inter, Roboto 등) 지양
  - 수채화 느낌의 텍스처, 노이즈 오버레이, 따뜻한 그라데이션 활용
- **수정 파일**:
  - `src/app/globals.css` — shadcn CSS 변수를 PRD 팔레트로 오버라이드
  - `src/app/layout.tsx` — Geist 폰트를 커스텀 폰트로 교체 (next/font/google), 메타데이터 업데이트
  - `.claude/design-concepts/flora-phony.md` — 디자인 컨셉 문서 생성
- **설치**: 없음
- **검증**: `pnpm build` 성공, 브라우저에서 새 폰트와 배경색 확인

### A2: shadcn/ui 프리미티브 설치 [S]
- **설명**: 앱 전반에 필요한 shadcn/ui 컴포넌트 추가
- **생성 파일**:
  - `src/components/ui/button.tsx`
  - `src/components/ui/slider.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/tooltip.tsx`
- **설치**: `pnpm dlx shadcn@latest add button slider dialog tooltip`
- **선행**: A1
- **검증**: 각 컴포넌트 import 가능, `pnpm biome check .` 통과

### A3: 식물 SVG 플레이스홀더 + 에셋 레지스트리 [M]
- **설명**: 5종 식물의 라인아트 SVG 플레이스홀더와 타입 정의, 레지스트리 생성. **추후 실제 리소스팩으로 교체할 수 있는 에셋 계약(Contract) 패턴 적용**
- **생성 파일**:
  - `src/types/plant.ts` — `PlantType` enum, `PlantDefinition` interface 정의
  - `src/data/plant-registry.ts` — 5종 식물 정의 (id, name, label, svgPath, audioPath, color, description)
  - `src/assets/plants/rain-reed.svg`
  - `src/assets/plants/lofi-fern.svg`
  - `src/assets/plants/pulse-moss.svg`
  - `src/assets/plants/bell-flower.svg`
  - `src/assets/plants/wind-wood.svg`
- **에셋 교체 전략**: `plant-registry.ts`의 경로만 변경하면 실제 리소스팩으로 전환 가능
- **선행**: A1
- **검증**: SVG가 React 컴포넌트로 렌더링, TypeScript 컴파일 성공

### A4: TopBar + SeedBar 셸 컴포넌트 [M]
- **설명**: 정적 레이아웃 셸 구축. 인터랙션은 아직 없이 시각적 레이아웃만 완성
- **생성 파일**:
  - `src/components/layout/top-bar.tsx` — 로고, About 버튼, Clear 버튼
  - `src/components/layout/seed-bar.tsx` — 하단 플로팅 바, 5종 식물 아이콘 수평 배치
  - `src/components/layout/garden-layout.tsx` — TopBar + Canvas 영역 + SeedBar 조합 레이아웃
  - `src/app/page.tsx` — "Hello, World!" 플레이스홀더를 GardenLayout으로 교체
- **선행**: A2, A3
- **검증**: 페이지에 TopBar, 빈 캔버스 영역, SeedBar가 렌더링. 기본 반응형 확인

---

## Track B: 데이터 레이어 & 상태 관리

### B1: 핵심 타입 + Zustand 스토어 [M]
- **설명**: 정원의 중앙 상태 저장소 생성. 식물 인스턴스, 선택 상태, 오디오 상태 관리
- **생성 파일**:
  - `src/types/garden.ts` — `PlantInstance` (id, plantType, x, y, createdAt), `GardenState` interface
  - `src/stores/garden-store.ts` — Zustand store: `addPlant`, `removePlant`, `movePlant`, `clearAll`, `setSelectedPlantType`, `selectPlant`, `deselectPlant`. **최대 20개 제한** 적용
- **설치**: `pnpm add zustand`
- **검증**: 스토어 액션 동작 확인, `pnpm biome check .` 통과

### B2: 파생 상태 셀렉터 + 커스텀 훅 [S]
- **설명**: 오디오 엔진과 캔버스가 소비할 효율적인 셀렉터 생성
- **생성 파일**:
  - `src/stores/selectors.ts` — `selectPlantCountByType(type)`, `selectPanValue(x, canvasWidth)`, `selectVolumeForType(count)` (로그 스케일: `baseVolume * log2(count + 1) / log2(6)`)
  - `src/hooks/use-garden.ts` — 편의 훅: `useGardenPlants()`, `useSelectedPlantType()`, `usePlantCounts()`
- **선행**: B1
- **검증**: 셀렉터가 mock 데이터에 대해 정확한 값 반환. 볼륨 계산이 로그 스케일 스펙 충족

### B3: 상태 직렬화 & 역직렬화 [S]
- **설명**: PRD에 명시된 파이프 구분 형식으로 직렬화 구현
- **생성 파일**:
  - `src/lib/garden-serializer.ts` — `serialize(plants): string` → `typeId:x:y|typeId:x:y`, `deserialize(encoded): PlantInstance[]`. 좌표는 퍼센트 정수(0-100)
- **선행**: B1 (타입 정의)
- **검증**: 라운드트립 테스트 (직렬화 → 역직렬화 → 동일 상태). 엣지케이스: 빈 정원, 20개 최대, 잘못된 문자열

### B4: URL 파라미터 공유 & 복원 [S]
- **설명**: `?garden=` 파라미터에서 상태를 파싱하여 스토어에 hydrate
- **생성 파일**:
  - `src/hooks/use-garden-url.ts` — 마운트 시 searchParams 파싱, `generateShareUrl()` 제공
- **수정 파일**:
  - `src/app/page.tsx` — URL 복원 훅 통합
- **선행**: B2, B3
- **검증**: `?garden=0:20:50|1:45:10` URL 방문 → 스토어에 식물 복원 확인

---

## Track C: 오디오 엔진

### C1: Tone.js 설치 + 오디오 컨텍스트 매니저 [M]
- **설명**: Tone.js 설치 및 기반 오디오 컨텍스트 관리. 브라우저 자동재생 정책 대응
- **생성 파일**:
  - `src/lib/audio/audio-context.ts` — `AudioContextManager` 싱글턴: `Tone.start()`, `Tone.Transport` 설정 (BPM 80), 마스터 리미터, 마스터 볼륨 노드
  - `src/hooks/use-audio-context.ts` — `isAudioReady` 상태 추적 훅
  - `src/components/audio-gate-modal.tsx` — "Click to Start" 모달 (shadcn Dialog). 첫 방문 시 노출, 클릭 시 `Tone.start()` 호출 후 dismiss
- **설치**: `pnpm add tone`
- **검증**: 모달 노출 → 클릭 → `Tone.context.state === 'running'` 확인

### C2: 플레이스홀더 오디오 에셋 (신스 기반) [M]
- **설명**: 실제 오디오 파일 없이 Tone.js 내장 신시사이저로 5종 식물 소리 생성. **추후 샘플 파일로 교체 가능한 오디오 에셋 계약 패턴**
- **생성 파일**:
  - `src/types/audio.ts` — `AudioAsset` interface: `{ mode: 'synth' | 'sample', sampleUrl?: string, createSynth?: () => ToneAudioNode }`
  - `src/lib/audio/synth-placeholders.ts` — 5종 신스 플레이스홀더:
    - Rain Reed: 화이트 노이즈 (filtered noise)
    - Lofi Fern: FM 신스 코드 프로그레션
    - Pulse Moss: 저음 사인파 오실레이터
    - Bell Flower: 고음 벨 신스
    - Wind Wood: 노이즈 버스트 퍼커션
  - `src/data/audio-registry.ts` — `PlantType → AudioAsset` 매핑. 초기에는 synth, 추후 sample로 교체
  - `public/audio/.gitkeep` — 미래 오디오 파일 디렉토리
- **오디오 교체 전략**: `audio-registry.ts`에서 `mode`를 `'sample'`로 변경하고 `sampleUrl` 제공
- **선행**: C1
- **검증**: 각 신스가 브라우저에서 청취 가능한 소리 생성

### C3: PlantSoundManager 핵심 오디오 엔진 [L]
- **설명**: 식물별 플레이어 관리, 루프 동기화, 볼륨/패닝 제어의 핵심 오디오 엔진
- **생성 파일**:
  - `src/lib/audio/plant-sound-manager.ts` — `PlantSoundManager` 클래스:
    - `PlantType → { source, panner: Tone.Panner, gain: Tone.Gain }` 맵 관리
    - `addPlantSound(type, panValue)`: 해당 타입 첫 번째면 노드 생성 + `Transport.nextSubdivision("1m")`에 동기화 시작, 이미 재생 중이면 gain 조정
    - `removePlantSound(type, newCount)`: gain 감소, count=0이면 페이드아웃 후 정지
    - `updatePan(type, panValue)`: 부드러운 패닝 ramp
    - `updateVolume(type, count)`: 로그 스케일 볼륨 공식 적용
    - `setMasterVolume(value)`: 마스터 볼륨
    - `dispose()`: 전체 정리
- **선행**: C1, C2
- **검증**: `addPlantSound` 여러 번 호출 → 소리 레이어링 확인, 볼륨 로그 증가 확인

### C4: 리액티브 오디오 브릿지 (Store → Audio) [M]
- **설명**: Zustand 스토어 변경을 구독하여 PlantSoundManager를 구동하는 React 훅. **상태와 오디오 간 브릿지 역할**
- **생성 파일**:
  - `src/hooks/use-audio-sync.ts` — 스토어 subscribe, 식물 추가 → `addPlantSound`, 제거 → `removePlantSound`, 이동 → `updatePan`. X좌표 기반 패닝 계산
  - `src/hooks/use-master-volume.ts` — 마스터 볼륨 슬라이더 바인딩 훅
- **선행**: C3, B2
- **검증**: 프로그래밍적으로 스토어에 식물 추가 → 소리 시작 확인. 제거 → 페이드아웃 확인

### C5: 마스터 볼륨 UI 컨트롤 [S]
- **설명**: 마스터 볼륨 슬라이더를 컨트롤 패널에 연결
- **생성 파일**:
  - `src/components/controls/master-volume-slider.tsx` — shadcn Slider + `useMasterVolume()` 훅
  - `src/components/controls/control-panel.tsx` — 마스터 볼륨, Clear All 버튼, Snapshot 버튼(플레이스홀더) 조합
- **선행**: C4, A2
- **검증**: 슬라이더 드래그 → 볼륨 변화 확인. Clear All → 모든 소리 정지

---

## Track D: 캔버스 & 인터랙션

### D1: react-konva 캔버스 셋업 [M]
- **설명**: Konva 설치 및 기본 정원 캔버스 컴포넌트 생성. 좌표 시스템 설정
- **생성 파일**:
  - `src/components/canvas/garden-canvas.tsx` — `Stage` + `Layer` from react-konva. 뷰포트 너비 반응형. 픽셀 ↔ 퍼센트 좌표 변환
  - `src/hooks/use-canvas-size.ts` — ResizeObserver 기반 컨테이너 크기 추적 훅
- **설치**: `pnpm add konva react-konva`
- **선행**: B2, A3
- **검증**: 빈 캔버스가 전체 너비로 렌더링, 리사이즈 시 적응

### D2: SeedBar → Canvas 드래그 앤 드롭 [L]
- **설명**: 씨앗 바에서 식물 선택 → 캔버스에 드롭하여 배치하는 핵심 인터랙션
- **수정 파일**:
  - `src/components/layout/seed-bar.tsx` — 드래그 시작 핸들러 추가, `selectedPlantType` 설정
  - `src/components/canvas/garden-canvas.tsx` — 드롭 핸들러: 클릭 위치에서 `addPlant` 호출
- **생성 파일**:
  - `src/hooks/use-plant-drag.ts` — 드래그 상태 머신 (idle → dragging → dropped), 마우스 + 터치
  - `src/components/canvas/drop-preview.tsx` — 드래그 중 커서 따라다니는 반투명 식물 미리보기
- **선행**: D1, A3, B1
- **검증**: 식물 선택 → 캔버스 클릭 → 식물 배치 + 스토어 반영. 20개 초과 시 거부

### D3: 캔버스에 배치된 식물 렌더링 [M]
- **설명**: 스토어의 식물들을 Konva 캔버스에 SVG 스프라이트로 렌더링 + 배치 애니메이션
- **생성 파일**:
  - `src/components/canvas/plant-sprite.tsx` — Konva Group, SVG 이미지 렌더링 + "심기" 애니메이션 (스케일 바운스 + 미세 발광)
  - `src/lib/canvas/animations.ts` — 재사용 가능한 애니메이션: plantingBounce, removalFade, idleSway
- **수정 파일**:
  - `src/components/canvas/garden-canvas.tsx` — 스토어 식물 매핑 → PlantSprite 렌더링
- **선행**: D2, A3
- **검증**: 식물이 올바른 위치에 애니메이션과 함께 렌더링

### D4: 식물 선택 & 제거 [M]
- **설명**: 배치된 식물 클릭 → 선택(하이라이트). 캔버스 밖 드래그 또는 Delete 키 → 제거 + 오디오 페이드아웃
- **수정 파일**:
  - `src/components/canvas/plant-sprite.tsx` — 클릭 선택 핸들러, 선택 시 하이라이트 링, 드래그 핸들러
  - `src/components/canvas/garden-canvas.tsx` — Delete 키 핸들링, 선택 식물 ID 관리
  - `src/stores/garden-store.ts` — `selectedPlantId` 상태 추가 (B1에서 이미 정의됨)
- **선행**: D3
- **검증**: 클릭 → 링 표시. Delete → 식물 제거 + 소리 페이드. 캔버스 밖 드래그 → 제거

### D5: 식물 재배치 + 실시간 패닝 [S]
- **설명**: 배치된 식물을 드래그하여 새 위치로 이동, 스테레오 패닝 실시간 업데이트
- **수정 파일**:
  - `src/components/canvas/plant-sprite.tsx` — `onDragEnd`에서 `movePlant(id, newX, newY)` 호출
- **선행**: D4, C4
- **검증**: 재생 중인 식물을 좌→우 드래그 → 패닝 변화 실시간 확인

---

## Track E: 통합 & 마무리

### E1: 전체 페이지 조합 [M]
- **설명**: 모든 트랙을 하나의 동작하는 페이지로 조립
- **수정 파일**:
  - `src/app/page.tsx` — AudioGateModal → GardenLayout (TopBar + GardenCanvas + SeedBar + ControlPanel). useGardenUrl() + useAudioSync() 통합
  - `src/components/layout/garden-layout.tsx` — z-index 정리 (SeedBar 플로팅, ControlPanel 위치)
- **선행**: A4, B4, C5, D5
- **검증**: 전체 유저 저니: 오디오 게이트 → 식물 선택 → 캔버스 드롭 → 소리 재생 → 추가 → 볼륨 증가 → 드래그 → 패닝 변화

### E2: About 모달 + Clear All 플로우 + 기본 반응형 [S]
- **설명**: About 다이얼로그, Clear All 확인 다이얼로그 구현, 기본 반응형 레이아웃 조정
- **생성 파일**:
  - `src/components/modals/about-modal.tsx` — 프로젝트 소개, 마케팅 카피 (PRD 참조)
- **수정 파일**:
  - `src/components/layout/top-bar.tsx` — About/Clear 버튼 연결
  - `src/components/layout/garden-layout.tsx` — 모바일 기본 반응형 (SeedBar 수평 스크롤)
  - `src/app/globals.css` — 반응형 유틸리티 클래스
- **선행**: E1
- **검증**: About 모달 열고 닫기, Clear All → 전체 초기화 + 소리 정지, 모바일 뷰포트에서 기본 사용 가능

---

## Track F: 내보내기 & 공유

### F1: 공유 URL 생성 [S]
- **설명**: Share 버튼 → 현재 정원 상태를 URL로 직렬화 → 클립보드 복사 + 토스트 알림
- **생성 파일**:
  - `src/components/controls/share-button.tsx` — `generateShareUrl()` 호출, 클립보드 복사, 토스트
- **설치**: `pnpm dlx shadcn@latest add sonner`
- **수정 파일**:
  - `src/components/controls/control-panel.tsx` — Share 버튼 추가
- **선행**: B4
- **검증**: 식물 배치 → Share 클릭 → URL 복사 → 새 탭에서 동일 정원 복원

### F2: PNG 스냅샷 내보내기 [M]
- **설명**: 현재 캔버스를 PNG 이미지로 캡처하여 다운로드
- **생성 파일**:
  - `src/lib/canvas/snapshot.ts` — `captureGardenSnapshot(stageRef): Promise<Blob>` using Konva `stage.toBlob()`
  - `src/components/controls/snapshot-button.tsx` — 캡처 트리거 + `<a download>` 다운로드
- **수정 파일**:
  - `src/components/controls/control-panel.tsx` — Snapshot 버튼 연결
- **선행**: D4
- **검증**: 식물 배치 → Snapshot 클릭 → PNG 다운로드, 정원 이미지 정확히 반영

### F3: Open Graph 메타데이터 [S]
- **설명**: 공유 URL의 소셜 미리보기 최적화
- **수정 파일**:
  - `src/app/layout.tsx` — `?garden=` 파라미터 존재 시 동적 OG 메타데이터 생성
- **선행**: F1
- **검증**: 공유 URL을 소셜 미디어 미리보기 도구에서 확인

---

## 핵심 파일 목록

| 파일 | 역할 |
|------|------|
| `src/stores/garden-store.ts` | 중앙 Zustand 스토어 — 모든 기능의 백본 |
| `src/lib/audio/plant-sound-manager.ts` | 핵심 오디오 엔진 — 루프 재생, 볼륨, 패닝, 동기화 |
| `src/data/plant-registry.ts` | 식물 정의 싱글 소스 — 에셋 교체 계약 |
| `src/data/audio-registry.ts` | 오디오 에셋 매핑 — 신스↔샘플 교체 지점 |
| `src/components/canvas/garden-canvas.tsx` | Konva 캔버스 — 드래그드롭, 렌더링, 좌표 관리 |
| `src/hooks/use-audio-sync.ts` | 리액티브 브릿지 — Store 변경 → Audio 엔진 구동 |
| `src/lib/garden-serializer.ts` | 상태 직렬화 — URL 공유의 핵심 |

## 라이브러리 설치 요약

| 라이브러리 | 트랙 | 스텝 | 명령 |
|-----------|------|------|------|
| `zustand` | B | B1 | `pnpm add zustand` |
| `tone` | C | C1 | `pnpm add tone` |
| `konva` + `react-konva` | D | D1 | `pnpm add konva react-konva` |
| shadcn 컴포넌트 | A | A2 | `pnpm dlx shadcn@latest add button slider dialog tooltip` |
| sonner (토스트) | F | F1 | `pnpm dlx shadcn@latest add sonner` |

## 에셋 교체 전략 (식물 리소스팩)

리소스팩 추후 추가를 위한 **에셋 계약(Contract) 패턴**:

1. **비주얼**: `src/assets/plants/*.svg` 파일을 교체하고 `plant-registry.ts`의 `svgPath` 업데이트
2. **오디오**: `public/audio/*.ogg` 파일 추가 후 `audio-registry.ts`에서 `mode: 'synth'` → `mode: 'sample'` + `sampleUrl` 제공
3. **로직 변경 없음**: 레지스트리 파일만 수정하면 전체 앱에 즉시 반영

## 검증 계획 (End-to-End)

1. 브라우저에서 `http://localhost:3000` 접속
2. "Click to Start" 모달 확인 → 클릭
3. SeedBar에서 Rain Reed 선택 → 캔버스 좌측에 드롭 → 왼쪽에서 소리 시작
4. Lofi Fern 선택 → 캔버스 우측에 드롭 → 오른쪽에서 새 소리 레이어링
5. Rain Reed 2개 더 추가 → 해당 소리 볼륨 증가 확인
6. 배치된 식물 좌→우 드래그 → 패닝 실시간 변화
7. 식물 선택 → Delete 키 → 제거 + 소리 페이드아웃
8. Master Volume 슬라이더 조절 → 전체 볼륨 변화
9. Share 클릭 → URL 복사 → 새 탭에서 동일 정원 복원
10. Snapshot 클릭 → PNG 다운로드
11. Clear All → 전체 초기화
12. `pnpm build` 에러 없이 성공
