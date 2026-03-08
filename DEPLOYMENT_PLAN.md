# FloraPhony 앱 배포 계획

FloraPhony를 모바일(iOS/Android) 및 데스크톱(Windows/Mac/Linux) 앱으로 배포하기 위한 전략을 정리합니다.

---

## 현재 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Konva.js, shadcn/ui |
| 오디오 | Tone.js (Web Audio API) |
| 상태관리 | Zustand |
| 배포 | Vercel |

---

## 옵션 비교

### 옵션 1: PWA (Progressive Web App) — 추천

**난이도: ★☆☆ (가장 쉬움)**

기존 웹앱을 PWA로 전환하여 모바일/PC에서 "앱처럼" 설치할 수 있게 합니다.

**장점:**
- 기존 코드 변경 최소 (manifest + service worker 추가만)
- 단일 코드베이스 유지
- 앱스토어 심사 없이 즉시 배포
- Tone.js, Konva.js 모두 그대로 동작
- 자동 업데이트

**단점:**
- iOS에서 일부 Web Audio 제약 (사용자 터치 후 오디오 시작 필요 — 이미 audio-gate로 처리됨)
- 앱스토어 검색 노출 불가 (PWABuilder로 스토어 등록은 가능)
- 푸시 알림 등 네이티브 기능 일부 제한

**필요한 작업:**
1. `public/manifest.json` 생성 (앱 이름, 아이콘, 테마 색상 등)
2. Service Worker 설정 (`next-pwa` 또는 `@serwist/next` 패키지 사용)
3. `<head>`에 메타 태그 추가
4. 앱 아이콘 제작 (192x192, 512x512)
5. 오프라인 캐싱 전략 설정

**예상 manifest.json:**
```json
{
  "name": "FloraPhony",
  "short_name": "FloraPhony",
  "description": "Interactive music garden - create lo-fi ambient soundscapes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#16a34a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

### 옵션 2: Capacitor (모바일 앱) — 모바일 스토어 배포 시 추천

**난이도: ★★☆**

Ionic Capacitor를 사용하여 웹앱을 네이티브 iOS/Android 앱으로 래핑합니다.

**장점:**
- 웹 코드 대부분 재사용
- App Store / Google Play 등록 가능
- 네이티브 API 접근 (진동, 알림 등)
- Web Audio API 지원 양호

**단점:**
- Next.js SSR 기능 사용 불가 → Static Export(`output: 'export'`) 필요
- API Routes 사용 시 별도 백엔드 필요
- 앱스토어 심사 필요
- iOS 개발자 계정 연 $99, Google Play 일회성 $25

**필요한 작업:**
1. `next.config.ts`에 `output: 'export'` 추가
2. API Routes가 있다면 외부 API로 분리
3. Capacitor 설치 및 설정:
   ```bash
   pnpm add @capacitor/core @capacitor/cli
   npx cap init FloraPhony com.floraphony.app
   npx cap add ios
   npx cap add android
   ```
4. 빌드 후 동기화:
   ```bash
   pnpm build
   npx cap sync
   npx cap open ios    # Xcode에서 열기
   npx cap open android # Android Studio에서 열기
   ```
5. CSP 헤더를 Capacitor 환경에 맞게 조정
6. `@vercel/analytics` 조건부 로딩 (앱에서는 비활성화)

---

### 옵션 3: Tauri (데스크톱 앱) — PC 앱 배포 시 추천

**난이도: ★★☆**

Tauri를 사용하여 가벼운 네이티브 데스크톱 앱을 만듭니다.

**장점:**
- Electron보다 훨씬 가벼움 (~10MB vs ~150MB)
- 시스템 WebView 사용으로 메모리 효율적
- Windows, macOS, Linux 지원
- 보안이 뛰어남

**단점:**
- Rust 툴체인 설치 필요
- Next.js Static Export 필요
- Windows 구버전에서 WebView2 필요 (자동 설치 가능)

**필요한 작업:**
1. Rust 설치
2. Tauri CLI 설치 및 초기화:
   ```bash
   pnpm add -D @tauri-apps/cli @tauri-apps/api
   npx tauri init
   ```
3. `next.config.ts`에 `output: 'export'` 추가
4. `tauri.conf.json` 설정 (창 크기, 앱 이름 등)
5. 빌드:
   ```bash
   npx tauri build
   ```

---

### 옵션 4: Electron (데스크톱 앱)

**난이도: ★★☆**

Electron으로 데스크톱 앱을 만듭니다. Chromium을 내장하여 Web Audio 호환성이 가장 좋습니다.

**장점:**
- Web Audio API 완벽 지원 (Chromium 내장)
- 크로스 플랫폼 (Windows, macOS, Linux)
- 파일 시스템 접근 등 네이티브 기능

**단점:**
- 앱 크기가 큼 (~150MB+)
- 메모리 사용량 높음
- 보안 취약점 관리 필요

---

## 추천 전략

### 단기 (즉시 적용 가능)
> **PWA 전환** — 최소한의 작업으로 모바일/PC에서 앱처럼 사용 가능

### 중기 (스토어 배포 필요 시)
> **PWA + Capacitor** — 모바일 앱스토어 등록
> **PWA + Tauri** — 데스크톱 앱 배포

### 조합 추천
```
웹 (Vercel)  ←  기존 유지
     ↓
    PWA      ←  manifest + service worker 추가
     ↓
 Capacitor   ←  iOS/Android 스토어 배포
     +
   Tauri     ←  데스크톱 앱 배포
```

---

## 웹뷰 기반 실시간 업데이트 전략

앱스토어 심사 없이 제품을 즉시 업데이트할 수 있는지 여부는 앱 구조에 따라 다릅니다.

### 옵션별 실시간 업데이트 가능 여부

| 옵션 | 실시간 업데이트 | 방법 |
|------|----------------|------|
| **PWA** | **가능** | 웹 배포만 하면 자동 반영 (Service Worker 캐시 갱신) |
| **Capacitor (로컬 번들)** | **불가** | 웹 에셋이 앱에 번들됨 → 스토어 재배포 필요 |
| **Capacitor (원격 URL)** | **가능** | 웹뷰가 원격 서버 로드 → 즉시 반영 |
| **Capacitor + Live Update** | **가능** | Capgo/Appflow로 OTA 업데이트 푸시 |
| **Tauri (로컬 번들)** | **불가** | 웹 에셋이 바이너리에 포함 → 재빌드 필요 |
| **Electron** | **부분 가능** | auto-updater로 자동 업데이트 가능하나 재빌드 필요 |

### 추천: 하이브리드 구조 (Capacitor 원격 URL 방식)

앱스토어 심사 없이 즉시 업데이트하려면, **Capacitor에서 로컬 번들 대신 원격 URL을 로드**하는 방식이 가장 효과적입니다.

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.floraphony.app',
  appName: 'FloraPhony',
  // 로컬 번들 대신 원격 URL 로드
  server: {
    url: 'https://flora-phony.vercel.app',
    cleartext: false,  // HTTPS만 허용
  },
};

export default config;
```

**이 방식의 장점:**
- Vercel에 배포하면 앱에 즉시 반영
- 앱스토어 재심사 불필요 (네이티브 코드 변경이 없는 한)
- 기존 Next.js SSR/API Routes 그대로 사용 가능 (Static Export 불필요!)
- OG 이미지 생성 API도 그대로 동작

**이 방식의 단점:**
- 오프라인 사용 불가 (인터넷 필수)
- Apple 가이드라인 주의: 앱의 핵심 기능이 단순 웹뷰 래핑이면 리젝 가능성 있음
- 네트워크 지연으로 네이티브 앱보다 느린 체감

**Apple 리젝 회피 전략:**
- 네이티브 기능 1-2개 추가 (진동 피드백, 로컬 알림 등)
- 오프라인 폴백 화면 제공
- 앱 아이콘, 스플래시 스크린 등 네이티브 UX 요소 적용

### 대안: Capacitor Live Update (OTA)

로컬 번들 + OTA 업데이트를 조합하면 오프라인 지원과 실시간 업데이트를 모두 달성할 수 있습니다.

```bash
# Capgo (오픈소스 OTA 서비스) 설치
pnpm add @capgo/capacitor-updater
npx cap sync
```

- 앱이 로컬 번들로 시작 → 백그라운드에서 새 버전 확인 → 다음 실행 시 적용
- 네이티브 코드 변경 없이 웹 에셋만 교체 가능
- Apple/Google 가이드라인 준수

---

## 주의사항

### FloraPhony 특화 고려사항

1. **Web Audio API (Tone.js)**
   - 모든 옵션에서 사용자 인터랙션 후 AudioContext 시작 필요 (이미 `audio-gate` 모달로 처리됨)
   - Capacitor iOS에서는 WebView의 오디오 세션 설정 확인 필요

2. **Canvas (Konva.js)**
   - 모든 옵션에서 정상 동작
   - 모바일에서 터치 이벤트 이미 지원됨

3. **Static Export 전환 시 확인사항 (Capacitor 로컬 번들 / Tauri 사용 시)**
   - `src/app/api/og/route.tsx` — OG 이미지 동적 생성 API (`force-dynamic`). Static Export 불가 → Vercel에 OG 전용 서버로 유지하거나, 빌드 타임에 정적 OG 이미지 생성으로 대체
   - `src/app/opengraph-image.tsx` — `fs.readFileSync()` 사용 (서버 전용). Static Export 시 제거 필요 (앱 내에서는 OG 이미지 불필요)
   - `src/app/page.tsx`의 `generateMetadata()` — `searchParams`로 동적 메타데이터 생성. Static Export 시 제거하거나 클라이언트 사이드로 대체 필요
   - `next.config.ts`의 `headers()` 함수 — Static Export와 호환 불가. 제거하거나 `vercel.json`으로 이전 필요
   - `@vercel/analytics` (`src/app/layout.tsx`) — 앱 환경에서는 동작하지 않음. 환경 변수로 조건부 렌더링 처리 필요
   - **참고:** 동적 라우트(`[slug]` 등)는 없으므로 `generateStaticParams`는 불필요

   > **원격 URL 방식(하이브리드)을 사용하면 위 항목들을 모두 신경 쓸 필요 없음**

4. **오프라인 지원 (PWA)**
   - Tone.js는 별도 CDN 리소스 불필요 (번들에 포함)
   - 폰트 파일 로컬 번들링 권장
   - localStorage 기반 garden persistence 이미 구현되어 있어 오프라인 사용에 유리
