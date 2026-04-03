---
trigger: always_on
---

# Next.js Framework Rules

이 문서는 본 프로젝트에서 Next.js (App Router 기반) 개발 시 준수해야 할 안티그래비티 설계 규약(Rules)을 정의합니다. 모든 컴포넌트와 비즈니스 로직 작성 시 아래의 원칙을 우선하여 적용합니다.

## 1. Server Component 우선 사용 (Prefer Server Components)
- **원칙**: 모든 컴포넌트는 기본적으로 Server Component로 작성합니다.
- **이유**: 클라이언트 번들 크기를 줄이고, 검색 엔진 최적화(SEO)를 향상시키며, 데이터베이스나 백엔드 리소스에 직접 안전하게 접근할 수 있습니다.
- **적용**: 상태(State)나 생명주기(Lifecycle), 브라우저 전용 API(window, document 등), 이벤트 리스너(onClick, onChange 등)가 반드시 필요한 경우에만 예외적으로 파일 최상단에 `'use client'` 지시어를 추가하여 Client Component로 전환합니다.

## 2. Client Component의 분리와 최소화 (Push Client Components to the Leaves)
- **원칙**: Client Component는 전체 컴포넌트 트리의 최대한 "잎(Leaf)" 레벨로 밀어냅니다.
- **이유**: 상위 레이아웃이나 페이지 전체를 Client Component로 만들면 하위의 모든 컴포넌트가 Client Component가 되어 Server Component의 장점을 잃게 됩니다.
- **적용**: 상호작용이 필요한 특정 UI(예: 버튼, 모달, 입력창 등)만 분리하여 Client Component로 만들고, 데이터를 보여주는 부모나 래퍼는 Server Component로 유지합니다.

## 3. 간결하고 명확한 코드 작성 (Clear and Concise Code)
- **원칙**: 알아보기 쉽고 의도가 명확한 코드를 작성합니다.
- **이유**: 협업 및 유지보수 시 가독성을 극대화하기 위함입니다.
- **적용**: 변수명, 함수명, 컴포넌트명은 그 역할을 명확히 설명하는 직관적인 이름을 사용합니다. 불필요하게 복잡한 로직은 피하며, 단일 책임 원칙(SRP)을 준수합니다.

## 4. 큰 파일의 분리 (Split Large Files)
- **원칙**: 하나의 파일(코드 베이스) 규모가 커지면 여러 개의 작은 논리적 파일로 분리합니다.
- **이유**: 하나의 파일에 수백 줄의 코드가 모여있으면 가독성이 떨어지고 버그 발생 확률이 높아집니다.
- **적용**:
  - 컴포넌트 단위: 특정 마크업이나 UI 로직이 길어지면 별도의 하위 컴포넌트 파일로 분리.
  - 비즈니스 로직: 데이터 패칭, 데이터 가공 등의 로직이 컴포넌트를 비대하게 만든다면, `core/use-cases`나 `presentation/hooks` 코드로 분리 (클린 아키텍처 규칙 참조).
  - 파일 라인 수 기준 (권장): 일반적으로 파일의 코드가 200~300줄을 넘어가는 시점부터 분리를 고려합니다.

## 5. 데이터 패칭은 Server Component에서 (Data Fetching in Server Components)
- **원칙**: 데이터베이스 접근이나 외부 API 호출 등의 데이터 패칭은 Server Component나 Server Actions에서 수행합니다.
- **이유**: 클라이언트-서버 간 불필요한 네트워크 폭포수(Waterfall)를 방지하고, 보안 및 속도 측면에서 유리합니다.
- **적용**: Client Component 내에서 `useEffect`를 사용한 데이터 패칭(`fetch`)은 꼭 필요한 경우(예: 무한 스크롤, 실시간 데이터 등)를 제외하고 피합니다.

## 6. App Router 컨벤션 준수 (Use App Router Conventions)
- **원칙**: Next.js App Router의 특수 파일 역할(`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)을 준수합니다.
- **이유**: 프레임워크가 제공하는 핵심 기능(중첩 라우팅, 에러 바운더리, 서스펜스)을 자연스럽게 활용하기 위함입니다.
- **적용**: 로딩 상태나 에러 처리를 수동으로 상태값(isLoading, error)으로 처리하기보다는 프레임워크의 `loading.tsx`와 `error.tsx`를 적극 활용합니다.

## 7. 명시적 데이터 캐싱 (Explicit Data Caching)
- **원칙**: `fetch` API 사용 시 캐싱 동작을 명시적으로 제어합니다.
- **적용**: 
  - 정적 데이터: `cache: 'force-cache'` (기본값)
  - 동적 비정적 데이터: `cache: 'no-store'` 또는 `revalidate: 0`
  - 일정 주기로 갱신: `next: { revalidate: 3600 }` 
- 데이터의 최신화 주기를 고려하여 이 옵션을 명확히 기록합니다.
