# Claude Code Agent Teams — FloraPhony 마케팅팀 가이드

## 개요

이 폴더에는 Claude Code Agent Teams로 운영되는 전문 에이전트들의 역할 스펙이 정의되어 있습니다.

- **Agent Teams 활성화**: `settings.json`의 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **마케팅팀 출력 경로**: `marketing/flora-phony.md`

---

## 등록된 에이전트

| 파일 | 역할 | 담당 섹션 |
|------|------|-----------|
| `content-strategist.md` | 타겟 오디언스, 포지셔닝, 핵심 메시지 분석 | `## Positioning` |
| `copywriter.md` | 헤드라인, 제품 설명, CTA 작성 | `## Copy` |
| `social-media-manager.md` | Twitter/X · Instagram · LinkedIn 포스트 | `## Social Posts` |
| `seo-specialist.md` | 키워드, 메타 태그, 콘텐츠 구조 | `## SEO` |

---

## 마케팅팀 표준 소환 프롬프트

### 전체 마케팅 패키지 생성

```
마케팅팀 소환: FloraPhony 홍보 자료 만들어줘.
- content-strategist: 타겟 오디언스와 포지셔닝 분석
- copywriter: 카피 작성 (전략팀 결과 참조)
- social-media-manager: SNS 포스트 작성
- seo-specialist: SEO 최적화 작업
결과를 marketing/flora-phony.md에 저장해줘
```

### 단일 에이전트 호출

```
content-strategist 에이전트: FloraPhony 타겟 오디언스와 포지셔닝 분석해줘.
결과를 marketing/flora-phony.md의 Positioning 섹션에 저장해줘.
```

```
seo-specialist 에이전트: FloraPhony 키워드 리서치하고
marketing/flora-phony.md SEO 섹션 업데이트해줘.
기존 src/app/layout.tsx 메타데이터도 참조해줘.
```

### 병렬 팀 작업 (Agent Teams 기능 활용)

```
마케팅팀 병렬 작업:
- content-strategist → FloraPhony 포지셔닝 분석 → marketing/flora-phony.md
- seo-specialist → FloraPhony SEO 패키지 → 같은 파일

두 에이전트가 동시에 작업하되 서로 다른 섹션을 담당합니다.
copywriter는 content-strategist 완료 후 결과 참조해서 카피 작성.
```

---

## 마케팅 패키지 파일 구조

`marketing/flora-phony.md` 파일은 다음 4개 섹션으로 구성됩니다:

```markdown
# FloraPhony Marketing Package

## Positioning (Content Strategist)
- Target Audience (Primary / Secondary)
- Key Messages (3가지)
- Competitive Angle

## Copy (Copywriter)
- Headline + Subheadline
- Product Description (100자 이내)
- CTA Variants (3가지)

## Social Posts (Social Media Manager)
### Twitter/X (3 posts)
### Instagram (3 captions + hashtags)
### LinkedIn (1 post)

## SEO (SEO Specialist)
- Primary Keywords (5개) + 검색 의도
- Meta Title & Description
- Content Outline (H1-H3)
- Internal Linking Opportunities
```

---

## 서비스 정보

| 항목 | 내용 |
|------|------|
| 서비스명 | FloraPhony |
| URL | https://flora-phony.vercel.app |
| 슬로건 | "Plants don't just grow. They sing." |
| 설명 | 가상 정원에 음악 식물을 배치하여 lo-fi ambient 사운드스케이프를 만드는 웹 앱 |
| 마케팅 파일 | `marketing/flora-phony.md` |

---

## Agent Teams vs Subagents

| 항목 | Subagents (Task 도구) | Agent Teams (실험적) |
|------|----------------------|----------------------|
| 실행 방식 | 순차적 | 병렬 |
| 통신 | 오케스트레이터에게만 | 팀원 간 직접 |
| 토큰 비용 | 낮음 | 높음 |
| 설정 | 없음 (기본 제공) | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
