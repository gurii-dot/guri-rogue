# 개조 내역 (CHANGES) - editver 기반

이 저장소(`ZA-Digi-Rouge-Custom/editver`) 소스에 아래 8가지를 수정했습니다.

## 1. 필드 및 알까기 이로치 확률 10배
- `src/data/balance/rates.ts`

## 2. 희귀 아이템 가중치 상향
- `src/modifier/modifier-type.ts`
- MASTER 8배, ROGUE 4배, ULTRA 2배 (COMMON 비중을 줄여서 합계 유지)

## 3. 메가진화템(메가 브레이슬릿 + 메가스톤) 확정 등장
- `src/modifier/modifier-type.ts`
- 메가 브레이슬릿: 1~79웨이브까지 확정 등장
- 메가스톤: 브레이슬릿 보유 후, 1~99웨이브 동안 파티에 대상 포켓몬이 있으면 확정 등장

## 4. 포켓몬 코스트 최대 2로 제한
- `src/data/species-data-registry.ts` (`getStarterCost` 함수)
- 해금 진행에 따라 2 → 1 → 0.5로 감소 (이 코드베이스는 `speciesStarterCosts` 객체 대신
  `speciesDataRegistry.getStarterCost()`로 코스트를 조회하는 구조라, 원본(ZA-DIGI-Rouge)과
  수정 위치가 다릅니다)

## 5. 포획 확률 10배
- `src/phases/attempt-capture-phase.ts`

## 6. 알까기 시 미해금 알기술 우선 해금
- `src/data/egg.ts`

## 7. 획득 골드 5배
- `src/phases/money-reward-phase.ts` (전투 승리 보상금)
- `src/modifier/modifier.ts` (골든 포켓볼 등 즉시지급 아이템)

## 8. 안드로이드 앱 화면 크기 버그 대응
- `src/main.ts`
- 앱 최초 실행 시 웹뷰가 화면 크기를 잘못 인식해서 캔버스가 작게 잡히는 문제에 대한 임시 보정 코드
