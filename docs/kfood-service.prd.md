# PRD — K푸드 큐레이션 플랫폼 (kfood-service)

> 한국 방문 외국인을 위한 K푸드 Travel Tracker + SEO 콘텐츠 플랫폼
> **Version**: 1.0 (PM Agent Team 분석) · **Date**: 2026-06-07
> **Status**: Phase 1 본진 설계 확정 → Plan 단계 진입 대기

---

## 0. Source of Truth

본 PRD는 다음 원본 산출물을 **검증·구체화**하는 문서다. 원본의 7대 결정을 재도출하지 않는다.

| 참조 | 위치 | 역할 |
|---|---|---|
| Spec (Deep-Dive 7단계) | `서비스기획/spec-service-bm.md` | 7대 결정·5개 리뷰어 우려·전제 (C)(F) 흔들림 |
| Workflow Blueprint | `kfood_workflow.html` | 6단계 BM 흐름·3개 모듈·5단계 제작·전환 퍼널 |
| Project CLAUDE.md | `CLAUDE.md` | 서비스 정체성·톤·디자인(#4D2475·Pretendard)·현재 상태 |

검증 인용 규칙: 프레임워크 적용 결과는 각 섹션 말미 **"Spec validation"** 블록에서 "지지 / 정련 / 도전" 중 하나로 평가한다.

---

## 1. Executive Summary

| 관점 | 내용 |
|---|---|
| **Problem** | 한국 방문 외국인은 K푸드 정보를 인스타·구글·블로그에 분산해서 모은다. 여행 중 음식을 "기록"하고 "친구에게 추천"할 단일 도구가 없다. |
| **Solution** | 50종+ K푸드 도감을 체크리스트로 만들고 여행 종료 시 자동 인포그래픽을 생성하는 Travel Tracker (회원) + 음식·지역별 SEO 페이지(비회원). SNS 5채널이 두 자산으로 트래픽을 깔때기. |
| **Function-UX Effect** | 비회원 SEO 페이지 → 회원 도감/챌린지 → 여행 종료 인포그래픽 공유 → 친구 추천 도구 = 게이미피케이션 + viral 루프 일체화. 모바일 First, 영어 우선, SNS OAuth로 가입 마찰 제거. |
| **Core Value** | "한국 여행의 K푸드 경험을 기록·공유 가능한 자산으로 바꾼다." 단순 맛집 정보가 아니라 **여행자의 기억을 형상화하는 도구**. |

---

## 2. Context Anchor

| 키 | 값 |
|---|---|
| **WHY** | 한국 방문 외국인 시장(2026 1,700만명 예상) BM 받침 + SNS→자사 사이트→재방문 퍼널 검증 (spec §Premises A·B) |
| **WHO** | Phase 1 = 한국 방문 외국인(여행 중심). Phase 2 = 한식 관심 해외 거주 외국인 (spec §Tradeoffs) |
| **RISK** | 게임화 가입 동기 부족 (전제 C 흔들림) · 한빛 어플 의존 single point of failure · 콜드 스타트 첫 100명 확보 미정 (Reviewer Concerns 1·2) |
| **SUCCESS** | 6개월 게이트: 외국인 UV·가입 전환율·D7/D30 retention 임계 도달. 미달 시 본진 메커니즘 재설계 (spec §Phase 1 측정 지표) |
| **SCOPE** | In: A 풀버전+C 비회원+SNS 5채널. Out: 내부 대시보드, 캐릭터/브랜딩, 한국인·재한 외국인 단골 (spec §Scope) |

---

## 3. Discovery — Teresa Torres OST (Opportunity Solution Tree)

### Outcome (북극성)
**"6개월 내 한국 방문 외국인 1만 UV / 회원 1,000명 / D30 retention 20% 달성"**
(spec의 [TBD] 퍼널을 §14에서 구체 수치로 제안)

### Opportunities (사용자 행동·욕구 기반)

| ID | Opportunity | 근거 |
|---|---|---|
| O1 | "여행 중 먹은 K푸드를 단일 공간에 기록하고 싶다" | 외국인 인스타 #seoulfood 행태 — 분산 저장 (spec Reviewer #4) |
| O2 | "여행 후 자랑할 수 있는 시각 자료가 필요하다" | 인스타 Year-in-Review·Spotify Wrapped 행태 (spec Failure Mode 5 대응) |
| O3 | "한국 가기 전 음식·지역별 정보를 한 번에 보고 싶다" | TasteAtlas·VisitKorea 사용 행태 |
| O4 | "친구가 한국 가면 내 리스트를 통째로 추천하고 싶다" | spec §Functional A — viral 후크 |
| O5 | "비행기/공항 이동 중에도 빠르게 다음 식당을 찾고 싶다" | 모바일 First 요구 (spec §Non-functional) |
| O6 | "한국어 못 읽어도 메뉴를 알 수 있게 해줘" | 외국인 식당 진입 마찰 핵심 |

### Solutions (각 Opportunity별 1~2개)

| Opportunity | Solution | Spec 연결 |
|---|---|---|
| O1 | 50종 K푸드 도감 그리드 + 체크/사진/메모 | A 본진 풀버전 |
| O2 | 여행 종료 자동 인포그래픽 (Canvas 렌더링) | A — 가장 강한 viral 후크 |
| O3 | `/food/{name}` `/region/{name}` SEO 페이지 | C 비회원 콘텐츠 |
| O4 | 공유 URL → 친구 받는 추천 시트 | A — viral 루프 |
| O5 | PWA + 오프라인 캐시 (지하철·기내 대응) | 신규 — spec 미명시, 우선순위 ↑ |
| O6 | 음식 상세 페이지 한/영 메뉴명 + 발음 가이드 | C 강화 항목 |

### Experiments (검증 우선순위 — Impact × Risk Hi)

| # | 실험 | 검증 가설 | 표본·기간·합격 기준 |
|---|---|---|---|
| E1 | 인포그래픽 시안 3종 A/B 테스트 | "디자인 1순위가 가입 동기" 검증 (전제 C) | 외국인 베타 30명 / 2주 / "가입하겠다" CTR ≥ 40% |
| E2 | 챌린지 페이지 비회원 → 가입 전환율 | "챌린지 후크가 강하다" 검증 | 트래픽 500UV / 2주 / 가입 전환 ≥ 8% |
| E3 | 친구 추천 URL 공유율 | "viral 계수 K ≥ 0.3" 검증 | 회원 100명 / 4주 / 평균 공유 ≥ 0.3건 |
| E4 | SEO 페이지 검색 유입 | "/food/{name} 6주 후 long-tail 노출 시작" | 50종 페이지 / 6주 / GSC impression ≥ 1만 |

### Spec validation
- **지지**: OST는 spec §Functional A·C와 정확히 매핑된다. 결정을 흔들지 않는다.
- **정련**: O5 (PWA·오프라인)는 spec에 없으나 "모바일 First + 여행 중 사용" 맥락에서 추가 가치. 우선순위 검토 대상.
- **도전**: 전제 (C) 게임화 동기 — E1 실험은 spec §Open Questions의 검증 방법 공백을 메운다 (인터뷰+행태관찰+베타 6주 중 **베타 30명 인포그래픽 A/B**로 좁힘).

---

## 4. Strategy

### 4.1 Value Proposition — JTBD 6-Part (한국 방문 외국인)

| 파트 | 내용 |
|---|---|
| **Job (해결할 일)** | 한국 여행 중 K푸드 경험을 기록하고, 여행 후 친구들에게 자랑·공유하기 |
| **Job Executor** | 첫 한국 여행자 또는 K-Pop·K-Drama로 K푸드에 호기심 있는 20-35세 외국인 |
| **When (Trigger)** | 항공권 결제 직후 + 여행 D-7 정보 검색 단계 + 식당 입장 직전 메뉴 확인 |
| **Where (Context)** | 모바일 (지하철·식당 앞·기내), 영어 환경, 한국어 미숙 |
| **Why (Outcome)** | "이번 여행에서 ○○종의 K푸드를 먹었다"는 시각화된 성취 + 친구에게 줄 수 있는 추천 자산 |
| **Pain (대안의 한계)** | 인스타 저장은 무질서, 구글 마이리스트는 음식 컨텍스트 없음, 블로그는 한국어, TasteAtlas는 평점만 |

### 4.2 Lean Canvas

| 블록 | 내용 |
|---|---|
| **Problem** | 1) K푸드 정보 분산 저장. 2) 여행 후 추억 시각화 부재. 3) 친구 추천 자산 부재. |
| **Customer Segments** | 한국 방문 첫 여행 외국인 20-35세 (Phase 1). 얼리어답터 = K-Pop/K-Drama 팬덤 출신. |
| **Unique Value Proposition** | "여행 종료 시점에 자랑할 인포그래픽이 자동 생성되는 K푸드 트래커" |
| **Solution** | A) 50종 도감+챌린지 트래커 B) 자동 인포그래픽 C) 친구 추천 시트 D) SEO 음식/지역 페이지 |
| **Channels** | 1) 유튜브·인스타·틱톡 5채널 콘텐츠 2) SEO long-tail (`/food/{name}`) 3) 외국인 인플루언서 협업 4) Reddit r/koreatravel 침투 |
| **Revenue Streams** | Phase 1: 0원 (의도적). Phase 2: 제휴 (식당·체험). Phase 3: 광고+예약 수수료. |
| **Cost Structure** | 개발(한빛 어플 활용)·콘텐츠 촬영비·SNS 운영비·정적 호스팅($20/mo)·영문 검수 외주 |
| **Key Metrics** | UV / 가입전환율 / 인증 사용자비율 / D7·D30 / viral K계수 |
| **Unfair Advantage** | 내부 대시보드(Module 01~03)로 SNS 트렌드→콘텐츠 제작 파이프라인 보유 — 경쟁사 없음 |

### 4.3 SWOT

| | 도움 | 방해 |
|---|---|---|
| **내부** | **S**: 내부 대시보드 콘텐츠 생산 인프라, BM 단계 결정 명확, 디자인 자산(#4D2475 시스템) | **W**: 한빛 어플 의존 SPOF, 콜드 스타트 채널 미정, 영문 운영 역량 미검증 |
| **외부** | **O**: 2026 외국인 여행객 1,700만명 회복, K-Pop·K-Drama 글로벌 인지도, AI 인포그래픽 진입장벽 낮음 | **T**: r/koreanfood 7만명·VisitKorea·TasteAtlas 선점, SNS 알고리즘 한국 IP 외국인 노출 제한 |

**SO 전략**: 내부 대시보드 트렌드를 바탕으로 K-Pop 팬덤·드라마 핫이슈 음식부터 콘텐츠 집중 → 외국인 알고리즘 노출 우회.
**WT 전략**: 콜드 스타트 채널은 외국인 인플루언서 2명 + Reddit r/koreatravel 1개 채널로 좁히고 비용·CPL 측정 → 채널 선택지 좁힘.

### Spec validation
- **지지**: Lean Canvas 모든 9블록이 spec과 충돌하지 않는다. 특히 "Unfair Advantage = 내부 대시보드"는 spec에서 명시하지 않았으나 콘텐츠 운영 차별점으로 명백하다.
- **정련**: spec §Open Questions의 "콜드 스타트 첫 100명"에 대해 SWOT WT 전략이 구체 채널 3가지로 좁힘 (외국인 인플루언서 2 + Reddit 1).
- **도전**: spec §Tradeoffs는 "B 커뮤니티 미룸 — Reddit r/koreanfood 선점"이라 명시했으나, SWOT 분석상 **Reddit r/koreatravel(여행 중심)은 미점유 영역**이다. r/koreanfood가 아닌 r/koreatravel을 콜드 스타트 침투 채널로 재정의 권고.

---

## 5. Market Research

### 5.1 Personas (한국 방문 외국인 내 3종)

#### Persona A — "First-Timer Mia" (35%)
- 28세, 미국 LA 거주, K-Drama 5년 시청자, 한국 첫 여행 (5박 6일)
- **JTBD**: "드라마에서 본 음식을 다 먹고 싶고, 친구들에게 자랑하고 싶다"
- **Pains**: 어디서 먹어야 진짜인지 모름. 메뉴판 못 읽음. 식당 줄 너무 길음.
- **현재 대안**: 인스타 저장(무질서), 친구 추천 카톡 캡처
- **MVP 가치**: 도감·챌린지·인포그래픽 = 핵심 후크 강함

#### Persona B — "Repeat Foodie Liam" (25%)
- 34세, 영국 런던 거주, 한국 3회째 방문, K-푸드 블로거(취미)
- **JTBD**: "지난 여행에서 못 가본 지역 음식과 숨은 식당을 찾고 싶다"
- **Pains**: 지난 여행 기록이 인스타에 흩어져 정리 안 됨. 새 음식 발굴 어려움.
- **현재 대안**: TasteAtlas, 한국 블로그 번역
- **MVP 가치**: 도감 + 지역 페이지 + 친구 추천 시트(자신이 자랑하는 추천자 역할)

#### Persona C — "Solo Backpacker Yuki" (20%)
- 24세, 일본 도쿄 거주, 혼자 부산·서울 7박, 예산 빠듯
- **JTBD**: "혼자 들어가도 어색하지 않은 식당, 가성비 좋은 K푸드 찾기"
- **Pains**: 혼밥 식당 정보 없음. 한국어 미숙. 비싼 관광지 식당 회피 원함.
- **현재 대안**: 일본어 한국 블로그, 트위터/X 해시태그
- **MVP 가치**: 가성비 챌린지("야시장 6종"), 음식 페이지 한/영 메뉴명

(나머지 20%는 단체·가족 여행자 등 — Phase 1 비주류)

### 5.2 Competitors (5종 Battlecard)

| 경쟁사 | 분류 | 강점 | 약점 | 우리 우위 |
|---|---|---|---|---|
| **VisitKorea (관광공사)** | 종합 한국 여행 | 공식 정보·신뢰도·다국어 풍부 | 음식 큐레이션 약함, 트래커 기능 없음, UX 관공서 | 음식 특화 + 게이미피케이션 + 모바일 UX |
| **Klook** | 예약 OTA | 예약 인프라·결제·할인 | 큐레이션 아닌 판매, 가입 후 행동 트리거 약함 | 정보 신뢰 + 가입 후 콘텐츠 자산 |
| **TripAdvisor** | 리뷰 플랫폼 | 식당 리뷰 방대·다국어 | 가짜 리뷰·SNS 세대 외면·트래커 없음 | 큐레이션된 50종+게임화 도감 |
| **TasteAtlas** | 음식 위키 | 음식 정보 깊이·세계 음식 비교 | 식당 추천 약함·여행 동선 연결 없음 | 음식 정보 + 여행 동선 연결 + 인증 후크 |
| **Reddit r/koreanfood** | 커뮤니티 | 7만명·진정성·해외 거주 외국인 강세 | 검색 약함·즉시성 약함·여행 중 비활용 | Phase 1 회피 (B 커뮤니티 미룸 — spec 결정 존중), Phase 2 보완 |

### 5.3 TAM / SAM / SOM (2026 기준 — Top-Down + Bottom-Up 듀얼)

**Top-Down**
- TAM: 2026 한국 외국인 입국 예상 **1,700만명** (한국관광공사 회복 전망 기준)
- SAM: K푸드를 여행 활동으로 우선 고려하는 비율 — 한국관광공사 외국인 만족도 조사 "음식 1순위" 약 **41%** → **697만명**
- SOM (Year 1): 디지털 사전 정보 검색 활성 + 영어권/일·중·동남아 핵심 → SAM의 **15%** = **104만명** 도달 가능 모집단 (=impression 도달 영역)

**Bottom-Up**
- SNS 5채널 누적 외국인 도달 목표 (12개월): 500만 impressions (월 평균 42만)
- impression → site UV 전환 0.5% = 2.5만 UV
- site UV → 가입 8% = 2,000명 (Year 1 회원)
- 회원 1인당 viral 공유 K=0.3, 6사이클 → 누적 ~5,400명

**현실 SOM (Year 1 가입자 베이스)**: **2,000~5,400명** 범위
(보수: 2,000 / 베이스: 3,500 / 스트레치: 5,400)

### 5.4 Customer Journey Map — Persona A (Mia, First-Timer)

| 단계 | 행동 | 감정 | Touchpoint | 우리 개입 |
|---|---|---|---|---|
| **Pre-trip (D-30~D-1)** | "Korea food list" 구글 검색 → 유튜브 시청 | 기대·정보 과다 | 유튜브·인스타·구글 | C 페이지 SEO 노출 → 챌린지 페이지 가입 후크 |
| **Pre-trip (D-3)** | 항공권 출력 + "must eat" 리스트 캡처 | 약간 불안 | 인스타 저장·메모앱 | 챌린지 페이지 "다운로드 PDF" 미끼 → 가입 |
| **In-trip (D1~D5)** | 매 끼니 식당 검색·메뉴 사진 | 흥분·결정 피로 | 구글 맵·블로그 | A 도감 체크·인증·지역 페이지 빠른 검색 |
| **In-trip (마지막 날)** | 못 먹은 거 아쉬움 + 사진 정리 | 아쉬움 | 인스타 스토리 | 자동 인포그래픽 알림 — "이번 여행 K푸드 ○○종 완료" |
| **Post-trip (D+1~D+7)** | 친구·동료에게 자랑 | 만족·자랑 | SNS 공유, 카톡 | 인포그래픽 공유 + 친구 추천 시트 URL |
| **Post-trip (D+30~D+180)** | 다음 여행 계획·드라마 새 음식 발견 | 호기심 | 알림 이메일 | 새 음식·새 챌린지 푸시 (Phase 1 후반 도입) |

### Spec validation
- **지지**: spec §UI/UX의 7개 화면 구조는 Persona A·C의 Journey와 정확히 매핑된다.
- **정련**: 5경쟁사 분석 결과 spec §Alternatives Considered의 "B 거부 — Reddit r/koreanfood 선점"이 정확함을 재확인. 단, **Reddit r/koreatravel**(여행 중심)은 별개 영역.
- **도전**: SAM 계산 결과 Persona B(Repeat Foodie)는 35만~50만명에 불과 — Phase 1 우선순위에서 후순위 명확. Persona A(First-Timer)에 자원 70% 이상 집중 권고.

---

## 6. Beachhead Segment (Geoffrey Moore Bowling-Pin)

### 4-Criteria Scoring (한국 방문 외국인 내 세그먼트)

| 세그먼트 | 1. 접근성 | 2. 자금/시간 | 3. 절박함 | 4. 레퍼런스 가치 | 합계 |
|---|---|---|---|---|---|
| K-Drama·K-Pop 팬덤 출신 첫 여행자 (20-30세, 영어권) | 9 (인플루언서·유튜브·해시태그 명확) | 8 (여행 자금 충분) | 9 (드라마 음식 도전 욕구 강함) | 9 (SNS 자발적 공유 高) | **35/40** |
| 일본·대만 첫 여행자 (20-30세) | 7 (현지 일본어 채널 필요) | 7 | 7 | 7 | **28/40** |
| 동남아 첫 여행자 (20-35세) | 6 (다국어·예산 다양) | 5 | 6 | 6 | **23/40** |
| 유럽 가족·중장년 여행자 | 4 (콘텐츠 채널 다름) | 6 | 4 | 4 | **18/40** |

### Beachhead 선정
**Phase 1 첫 100명 표적 = "K-Drama/K-Pop 팬덤 출신 영어권 20-30세 첫 한국 여행자"**

이유:
1. 외국인 인플루언서·유튜버 풀이 명확히 존재 (Korean Englishman, Sam Hammington 등 영어권 K푸드 채널)
2. K-Pop·K-Drama 음식("치맥", "라면", "떡볶이") 트리거가 콘텐츠 후크와 일치
3. SNS 자발 공유 행동이 viral 루프 핵심 가설(E3)과 직결

**다음 핀(Pin 2)**: 일본·대만 (6개월 시점). Pin 3: 동남아 (12개월).

### Spec validation
- **정련**: spec은 "한국 방문 외국인" 전체를 Phase 1 타겟으로 명시했으나, 첫 100명 콜드 스타트 관점에서는 **K-Pop·K-Drama 팬덤 영어권**으로 더 좁혀야 한다. Reviewer Concern #2 (콜드 스타트 구체성 부재)에 대한 직접 답.

---

## 7. GTM Strategy (Phase 1 — 0~6개월)

### 7.1 Cold Start Channels (첫 100명 → 첫 1,000명)

| 채널 | 활동 | 예상 CPL | 6개월 예산 비율 | 측정 지표 |
|---|---|---|---|---|
| **외국인 K푸드 유튜버 협업** | 3명 마이크로 인플루언서(10만 이하) 영상 협찬 — Travel Tracker 시연 | $5~10 | 35% | 영상→사이트 클릭률, 가입 전환 |
| **Reddit r/koreatravel + r/seoul** | 주 1회 가치 콘텐츠 게시 + 본인 공개(자기 홍보 비율 10%) | $0 (시간) | 시간 20% | 게시물 upvote, 사이트 referral |
| **인스타 K-푸드 해시태그 SEO** | #KoreanFood #SeoulFood 영문 컨테스트 — "Tag your trip list" | $1~2 | 20% | 해시태그 사용 수, UGC 생성 |
| **무료 PDF 가이드 배포** | "K-Drama Food 30: Seoul Edition" 메일 캡처 | $0 | 시간 10% | 다운로드→가입 전환율 |
| **K-Drama 서브레딧 (r/kdrama)** | 드라마 음식 위주 콘텐츠 (드라마 마니아 진입점) | $0 | 시간 10% | referral 트래픽 |
| **여분(예비)** | 미달 시 인플루언서 추가 협찬 | - | 5% | - |

### 7.2 Phase 1 단계별 KPI Gate

| 시점 | 1차 게이트 (트래픽 가설) | 2차 게이트 (전환 가설) | Decision |
|---|---|---|---|
| **3개월** | impressions ≥ 100만 / 콘텐츠당 평균 좋아요 ≥ 50 | UV ≥ 5,000 | 미달 시 콘텐츠 톤·채널 재조정 |
| **6개월** | impressions ≥ 300만 / 평균 좋아요 ≥ 100 | UV ≥ 1.5만 / 누적 회원 800 / D30 retention 15% | 통과 시 Phase 2 진입 (B 커뮤니티 시드 + 제휴 BM) |

### Spec validation
- **정련**: spec §Open Questions "첫 100명 구체 전략 미정"에 대해 5채널 × 비용·시간 분배 명확. Reviewer Concern #2 해소.
- **도전**: spec은 SNS 5채널(유튜브·인스타·틱톡·트위터·블로그)을 동시 운영한다고 했으나 콜드 스타트엔 모두 비활성이다. **첫 3개월은 유튜브 협업 + 인스타 해시태그 + Reddit 3채널에 집중하고, 틱톡·트위터·블로그는 4개월차부터 본격화** 권고.

---

## 8. Battlecard (vs 5 Competitors)

### vs VisitKorea
| 영역 | 우리 | 상대 |
|---|---|---|
| **포지셔닝** | 음식 특화·게임화·viral | 종합·정부 신뢰 |
| **이길 무기** | 인포그래픽 공유 / 챌린지 / 모바일 UX |  |
| **질 영역** | 공식 신뢰도, 비음식 정보 |  |
| **세일즈 토크** | "VisitKorea로 정보 보고, 우리로 기록·자랑하라" |  |

### vs Klook
| 영역 | 우리 | 상대 |
|---|---|---|
| **포지셔닝** | 큐레이션·무료·기록 | 예약·결제·할인 |
| **이길 무기** | 무료 가입·인포그래픽 후크·가입 마찰 0 |  |
| **질 영역** | 즉시 결제·할인 쿠폰 |  |
| **세일즈 토크** | "예약은 Klook으로, 음식 경험은 우리로 기록" (Phase 2엔 우리도 제휴 도입) |  |

### vs TripAdvisor
| 영역 | 우리 | 상대 |
|---|---|---|
| **포지셔닝** | 큐레이션 50종+게임화 | 리뷰 무한 노출 |
| **이길 무기** | 결정 피로 제거 (50종 한정) / 친구 추천 시트 |  |
| **질 영역** | 식당 수·리뷰 신뢰성 |  |
| **세일즈 토크** | "리뷰 무한 스크롤 대신 '꼭 먹어야 할 50개' 도전" |  |

### vs TasteAtlas
| 영역 | 우리 | 상대 |
|---|---|---|
| **포지셔닝** | 여행 동선 연결 + 인증 | 음식 위키 + 평점 |
| **이길 무기** | 식당 추천·동선 + 인증 후크 |  |
| **질 영역** | 음식 정보 깊이 |  |
| **세일즈 토크** | "TasteAtlas는 '뭐가 있는지', 우리는 '어디서 먹고 어떻게 자랑하는지'" |  |

### vs Reddit r/koreanfood
| 영역 | 우리 | 상대 |
|---|---|---|
| **포지셔닝** | 도구 + 큐레이션 | 커뮤니티 + 진정성 |
| **이길 무기** | 여행 중 즉시 사용 가능 (모바일·검색) |  |
| **질 영역** | 커뮤니티 깊이·해외 거주자 인사이트 |  |
| **세일즈 토크** | (Phase 1 직접 경쟁 회피) "r/koreanfood로 학습, 우리 앱으로 실행" |  |

---

## 9. Growth Loops

### 9.1 Viral Loop — "Trip-End Infographic"
```
회원 인포그래픽 자동 생성 → 인스타·X·카톡 공유
   ↓
친구 본 → "한국 가면 추천해줘" 요청
   ↓
회원 친구 추천 시트 URL 생성·전송
   ↓
친구 가입 → 시트 받음 → 본인 도감 시작
   ↓
다시 친구 인포그래픽 생성
```
- **목표 viral 계수 K**: 0.3 (보수) / 0.5 (base) / 0.8 (stretch)
- **측정**: 인포그래픽 다운로드 수, URL 클릭, 가입 referral

### 9.2 Content Loop — "Trend → Content → Page → SEO"
```
내부 대시보드 Module 01 (SNS 트렌드)
   ↓
Module 02 (1주제 5채널 콘텐츠)
   ↓
유튜브·인스타·틱톡 외국인 도달
   ↓
설명란 → /food/{name} SEO 페이지
   ↓
구글 검색 long-tail 노출 (6주 후)
   ↓
재방문 트래픽 (콘텐츠 자산 누적)
```

### 9.3 Engagement Loop — "Challenge → Check → Achievement"
```
챌린지 페이지 노출 ("서울 5대 김밥")
   ↓
가입 후 챌린지 시작
   ↓
매 방문 체크 (앱 재방문 유도)
   ↓
완료 시 인포그래픽·뱃지
   ↓
새 챌린지 추천 (개인화 — Phase 1 후반)
```

### Spec validation
- **지지**: spec §Functional A "여행 종료 자동 인포그래픽 + 친구 추천 도구"를 viral loop로 공식화. spec의 직관을 구조화한 것.
- **정련**: Engagement Loop는 spec에 명시되지 않은 새 루프. "재방문" KPI에 직접 기여.

---

## 10. Pre-Mortem (6개월 후 실패 시 상위 5가지 이유)

| # | 실패 사유 | 매핑된 Spec 흔들림 / Reviewer Concern | 조기 신호 | 사전 대응 |
|---|---|---|---|---|
| 1 | **가입 동기 부족 — 인포그래픽이 평범** | 전제 (C) | E1 실험 가입 CTR <40% | E1 실험을 0개월차 즉시 실행. 디자이너 외주 우선 투입 |
| 2 | **한빛 어플 진척 지연으로 본진 미출시** | Reviewer #1 (SPOF) | 3개월 시점 alpha 미출시 | Plan B: A 트래커 일부(도감·체크)는 정적 사이트로 우선 출시, 인포그래픽·친구추천만 어플 종속 |
| 3 | **콜드 스타트 첫 100명 미달** | Reviewer #2 | 6주차 회원 30명 미만 | 7.1 채널 중 유튜버 협업 즉시 가속. Reddit r/koreatravel 게시 빈도↑ |
| 4 | **외국인 알고리즘 도달 실패** | spec Failure Mode 4 | 1주차 외국인 impression 비율 30% 미만 | 영문 캡션·해시태그 검수 외주. 외국인 인플루언서 협업 채널 비중↑ |
| 5 | **여행 후 retention 0 → viral 루프 미작동** | 전제 (F) + Failure Mode 5 | 인포그래픽 다운로드 후 SNS 공유율 <10% | 인포그래픽에 "친구 추천 시트" 1-click 통합. Phase 1 후반 푸시 알림 도입 |

### Spec validation
- **지지**: 5대 실패 사유가 spec의 흔들리는 전제 (C)(F) + 5개 Reviewer Concerns와 1:1 매핑됨. spec이 정직하게 위험을 인식했다는 증거.
- **도전**: spec §Failure Modes는 5개 모드를 나열했으나 **조기 신호(early warning)**를 정의하지 않았다. 본 Pre-mortem이 각 모드에 조기 신호+대응을 추가해야 함을 명시.

---

## 11. User Stories + Job Stories (최소 10개, 우선순위)

### Phase 1 본진 (P0 — 출시 필수)

| # | 형식 | 스토리 | INVEST 통과 |
|---|---|---|---|
| US-01 | Job Story | When I land in Seoul and check into hotel, I want to see a 50-food checklist so I can plan tomorrow's eating | ✓ |
| US-02 | User Story | 외국인 여행자로서, K푸드를 체크할 때마다 사진을 첨부할 수 있어야 한다 (여행 후 자랑하기 위함) | ✓ |
| US-03 | Job Story | When my trip ends, I want an auto-generated infographic so I can share my journey on Instagram | ✓ |
| US-04 | User Story | 외국인 여행자로서, 친구가 한국에 갈 때 내 추천 리스트 URL을 한 번에 보낼 수 있어야 한다 | ✓ |
| US-05 | Job Story | When I search "Korean food list" on Google, I want to land on a clear 음식별/지역별 page so I can prepare before my trip | ✓ |
| US-06 | User Story | 외국인 여행자로서, SNS 계정으로 1초 가입할 수 있어야 한다 (이메일·비번 입력 거부) | ✓ |
| US-07 | Job Story | When I'm in front of a restaurant and don't read Korean, I want quick access to menu translations so I can order confidently | ✓ |

### Phase 1 부가 (P1 — 출시 후 4주 내)

| # | 형식 | 스토리 |
|---|---|---|
| US-08 | User Story | 외국인 여행자로서, "서울 5대 김밥"같은 챌린지를 한 번에 추가할 수 있어야 한다 |
| US-09 | Job Story | When I've finished a challenge, I want a badge to appear in my collection so I feel a sense of achievement |
| US-10 | User Story | 외국인 여행자로서, 지도에서 내가 체크한 식당을 한눈에 보고 싶다 |

### Phase 2 보류 (P2)

| # | 형식 | 스토리 |
|---|---|---|
| US-11 | Job Story | When I have a question about a dish, I want to ask other foreigners who've tried it so I can learn from real experience (커뮤니티 — Phase 2) |
| US-12 | User Story | 해외 거주 외국인으로서, 한국 가지 않아도 K푸드 레시피·재료 정보를 보고 싶다 (Phase 2) |

---

## 12. Test Scenarios (Travel Tracker 핵심 가치)

### TS-01: 첫 사용자 가입 + 첫 체크
1. Given 비회원이 `/food/bibimbap` SEO 페이지에 도달
2. When "Try this challenge" 버튼 클릭
3. Then SNS OAuth 가입 모달 노출 → 가입 → 도감 페이지 진입
4. Expected: 가입 → 도감 진입까지 90초 이내, 가입 마찰 없음

### TS-02: 인증·메모 등록
1. Given 회원이 식당에서 비빔밥 먹음
2. When 음식 상세 페이지에서 "I had this" 버튼 → 사진·평점·코멘트 입력
3. Then 마이 페이지 컬렉션에 추가, 인포그래픽 진행률 1+ 증가
4. Expected: 모바일에서 30초 내 완료, 사진 업로드 5MB 이하 자동 압축

### TS-03: 여행 종료 인포그래픽 생성
1. Given 회원이 5박 6일 여행 동안 8종 인증
2. When "Generate trip recap" 버튼 클릭
3. Then 자동 인포그래픽(3종 시안 중 1 선택) 생성 → PNG 다운로드 + 공유 URL
4. Expected: Canvas 렌더링 5초 이내, 1080×1920 인스타 스토리 규격

### TS-04: 친구 추천 시트 공유
1. Given 인포그래픽 생성 완료
2. When "Recommend to a friend" 클릭
3. Then 친구용 추천 시트 URL 생성, 카톡·인스타 DM 공유 옵션 노출
4. Expected: URL 클릭한 친구 — 가입 없이도 시트 열람, 가입 시 본인 도감으로 import

### TS-05: 챌린지 완료
1. Given 회원이 "서울 5대 김밥" 챌린지 시작
2. When 5개 모두 인증 완료
3. Then 뱃지 + 챌린지 완료 인포그래픽 + SNS 공유 옵션
4. Expected: 완료 즉시 알림, 다음 챌린지 추천

### TS-06: 비회원 SEO 진입 → 가입 후크
1. Given 비회원이 구글 검색 "best tteokbokki Seoul" → `/food/tteokbokki` 진입
2. When 페이지 하단 "Start your K-food journey" CTA 클릭
3. Then 가입 모달 + "이 음식이 첫 도감에 자동 추가" 약속
4. Expected: 비회원 → 가입 전환 ≥ 8% (KPI 기준)

---

## 13. Stakeholder Map

| 분류 | 이해관계자 | 관여 단계 | 영향력 | 관리 방식 |
|---|---|---|---|---|
| **내부 — 핵심** | 본인 (PM/기획) | 전 단계 | 高 | 의사결정자 |
| **내부 — 핵심** | 한빛 어플 빌더 | Phase 1 전체 (SPOF) | 高 | 주 1회 마일스톤 동기화, Plan B 합의 |
| **내부** | 콘텐츠 제작팀 (SNS 5채널) | Step 04~05 | 中 | Module 02 공유, 주간 콘텐츠 캘린더 |
| **내부** | 영문 검수자 (외주) | 콘텐츠·UI 카피 전체 | 中 | 톤·매너 가이드 + 일감 단가 사전 합의 |
| **외부 — Phase 1** | 외국인 마이크로 인플루언서 3명 | 0~3개월 콜드 스타트 | 高 | 협찬 단가 명시, 데이터 결과 공유 |
| **외부 — Phase 1** | Reddit r/koreatravel·r/kdrama 커뮤니티 | 0~6개월 침투 | 中 | 자기 홍보 10% 룰 준수, 가치 콘텐츠 우선 |
| **외부 — Phase 2** | 제휴 식당·체험 운영자 | 6~12개월 | 高 | Phase 2 시작 시점 제휴 모델 설계 |
| **외부 — Phase 3** | 한국관광공사, 면세점 등 광고주 | 12개월+ | 高 | 트래픽 데이터 누적 후 영업 |
| **사용자** | First-Timer Mia (Persona A) | 전 단계 | 高 | E1·E3 실험 베타 표본 |
| **사용자** | Repeat Foodie Liam (Persona B) | Phase 1 후반 | 中 | retention·viral 사용자 |
| **사용자** | Solo Backpacker Yuki (Persona C) | Phase 1 후반 | 中 | 가성비 챌린지 사용자 |

---

## 14. Funnel KPI Baseline Proposal (spec [TBD] 채우기)

### 가정 근거
- 2026 외국인 입국 1,700만명, K푸드 1순위 41% → SAM 697만명 (한국관광공사 회복 전망)
- 외국인 인스타 도달율: 마이크로 인플루언서 협찬 평균 5만~10만 view/영상 (업계 통상)
- SEO long-tail 음식·지역 페이지 — 50종 × 평균 100 impression/월 (6개월차 기준) = 5,000 impression/월
- 가입 전환율: 무료 SNS OAuth + 명확 후크 = SaaS·콘텐츠 평균 5~10%
- 모바일 신규 콘텐츠 앱 D7 retention 평균: 15~25% (Mobile Action 벤치마크)
- viral 계수 K: SNS 공유형 도구 평균 0.2~0.6

### 제안 KPI (보수 / 베이스 / 스트레치)

| # | 퍼널 단계 | 지표 | **보수 (3개월)** | **베이스 (6개월)** | **스트레치 (6개월)** | 근거 |
|---|---|---|---|---|---|---|
| 1 | 도달 | SNS 5채널 외국인 impressions (누적) | 50만 | **300만** | 500만 | 영상 협업 3건×30만 + Reddit 게시 24회×3만 + 인스타 누적 ≈ 300만 |
| 2 | 인게이지먼트 | 콘텐츠당 평균 좋아요·댓글·저장 | 30 | **100** | 200 | 마이크로 인플루언서 영상 평균, 인스타 K푸드 해시태그 벤치마크 |
| 3 | 자사 유입 | 월 외국인 UV (site+앱) | 2,000 | **6,000** | 1.5만 | impression→UV CTR 0.4~1.0%, 6개월차 누적 ≈ UV 1.5만 |
| 4 | 회원가입 | 누적 회원 / UV→가입 전환율 | 200명 / 5% | **800명 / 8%** | 1,500명 / 10% | E1 실험 가입 CTR 가정 + SaaS 평균 |
| 5 | 재방문 | D7 / D30 retention | 25% / 10% | **30% / 15%** | 35% / 20% | 모바일 트래커 앱 통상 + 여행 중 매일 사용 가설 |

### Phase 1 종료 결정 (6개월 시점)
- **베이스 미달 (회원 <500명, D30 <10%)** → 본진 메커니즘 재설계 (E1·E3 가설 폐기 검토)
- **베이스 달성** → Phase 2 진입 (B 커뮤니티 시드 + 제휴 BM 1차)
- **스트레치 달성** → Phase 2 가속 + 일본·대만 Pin 2 확장

### Spec validation
- **지지**: spec §Phase 1 측정 지표의 5단계 구조 그대로 사용. 카테고리는 spec이 고정, 수치는 본 PRD가 제안.
- **정련**: spec "수치 목표는 팀과 함께 다음 회고에서 확정" → 본 PRD가 **baseline 제안값**을 제공해 회고를 가속.
- **도전**: spec은 6개월 단일 게이트만 명시했으나, 본 PRD는 **3개월 + 6개월 2단계 게이트**로 분리. 3개월 미달 시 콘텐츠 톤·채널 재조정 결정 시점을 앞당김.

---

## 15. Unresolved Items (다음 단계로 이월)

| # | 항목 | 책임 | 시점 |
|---|---|---|---|
| U1 | E1 인포그래픽 시안 3종 디자인 → 베타 30명 A/B 테스트 | 디자이너+PM | Plan 단계 첫 2주 |
| U2 | 한빛 어플 진척 vs 본진 메커니즘 정합 매핑 (Plan B 합의) | PM + 한빛 어플 빌더 | Plan 단계 첫 1주 |
| U3 | 외국인 인플루언서 3명 섭외·단가 합의 | PM | Plan 단계 첫 4주 |
| U4 | 영문 검수자 외주 단가·일정 합의 | PM | Plan 단계 첫 2주 |
| U5 | 6개 Travel Tracker 기술 결정 항목 (인포그래픽·DB·맵 등) — 추천 1개씩 명시 | 개발팀+PM | Design 단계 |
| U6 | Phase 1 예산 총량 + 월별 마일스톤 캘린더 | PM | Plan 단계 첫 1주 |
| U7 | Phase 2 확장 트리거 — 모드 전환 vs 별도 페르소나 | PM | 6개월 게이트 회고 |

---

## 16. Attribution

본 PRD는 [pm-skills](https://github.com/phuryn/pm-skills) (Pawel Huryn, MIT) 프레임워크 기반.
- Discovery (Teresa Torres OST)
- JTBD 6-Part (Tony Ulwick / Bob Moesta 변형)
- Lean Canvas (Ash Maurya), SWOT
- Beachhead/Bowling-Pin (Geoffrey Moore — Crossing the Chasm)
- Pre-mortem (Gary Klein), Stakeholder Map (Mendelow)

Spec 원본 — `서비스기획/spec-service-bm.md` (Deep-Dive 7-phase) / Workflow — `kfood_workflow.html` / 디자인 기준 — 프로젝트 `CLAUDE.md`.

---

**다음 단계**: `/pdca plan kfood-service` (본 PRD가 Plan 문서에 자동 참조됩니다)
