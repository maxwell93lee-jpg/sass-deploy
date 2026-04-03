---
trigger: always_on
---

Clean Architecture in Next.js
Clean Architecture는 애플리케이션의 **관심사(Concern)**를 분리하여, UI나 데이터베이스 같은 외부 요소의 변경이 핵심 비즈니스 로직에 영향을 주지 않도록 만드는 설계 패턴입니다.

Next.js (App Router 기반) 프로젝트에 어울리는 추천 폴더 구조는 다음과 같습니다:

text
src/
├── app/                  # UI 및 라우팅 계층 (Framework)
│   ├── layout.tsx        # 글로벌 레이아웃
│   ├── page.tsx          # 메인 페이지
│   └── (features)/       # 기능별 페이지 (예: products, cart)
│       └── products/
│           └── page.tsx
│
├── core/                 # 핵심 비즈니스 로직 (Entities & Use Cases)
│   ├── entities/         # 도메인 모델 및 타입 정의 (예: Product.ts)
│   │   └── product.entity.ts
│   └── use-cases/        # 비즈니스 규칙 및 유스케이스 (예: GetProducts.ts)
│       └── product.use-case.ts
│
├── application/          # 상태 관리 및 인터페이스 어댑터
│   ├── ports/            # 외부와 통신하기 위한 Interface 정의 (의존성 역전)
│   │   └── product.repository.port.ts
│   └── store/            # 전역 상태 관리 (Zustand, Redux 등)
│
├── infrastructure/       # 외부 시스템, DB, API 통신 구현체
│   ├── api/              # 외부 API Fetch 함수 모음 (예: httpClient.ts)
│   ├── repositories/     # Ports(인터페이스)의 실제 구현체
│   │   └── product.repository.impl.ts
│   └── database/         # DB 연결 및 스키마 (Prisma, Supabase 등)
│
└── presentation/         # 순수 UI 컴포넌트 (Next.js에 종속되지 않는 재사용 가능한 요소)
    ├── components/       # 버튼, 모달, 카드 등
    │   ├── ui/           # 공통 UI 요소 
    │   └── feature/      # 특정 기능에 종속된 UI 컴포넌트
    └── hooks/            # 커스텀 훅 (UI 조작 관련)
계층(Layer) 설명
core/ (핵심, 도메인)

앱의 심장부입니다. 다른 어떤 폴더(Next.js, React, DB)에도 의존해서는 안 됩니다.
데이터의 형태(entities)와 그 데이터를 가지고 하는 행동(use-cases)만 순수 TypeScript/JavaScript로 작성합니다.
application/ (애플리케이션)

core와 외부 요소 사이의 중간다리 역할을 합니다.
ports: "이런 기능을 하는 함수나 객체가 필요해!"라고 규칙(인터페이스)만 정해둡니다. 이렇게 하면 DB가 바뀌어도 core 로직은 수정할 필요가 없습니다. (의존성 역전 원칙 적용)
infrastructure/ (인프라)

데이터베이스 접속 방법, 외부 API(REST, GraphQL 등) 통신, 브라우저 스토리지 접근 등 세부적이고 구체적인 기술들을 구현합니다.
application/ports에서 정의한 인터페이스 규칙에 맞게 실제 코드를 작성합니다.
presentation/ 및 app/ (프레젠테이션 / 프레임워크)

화면에 보여지는 영역입니다.
presentation/: 재사용 가능한 UI 컴포넌트와 화면 상태(로딩, 에러 등)를 관리하는 커스텀 훅을 둡니다.
app/: Next.js의 App Router의 라우팅과 페이지 렌더링(Server Component / Client Component 통신)을 담당합니다.
개발 진행 흐름 예시 (상품 목록 가져오기)
Core: product.entity.ts에 상품 정보 타입 정의.
Application (Port): product.repository.port.ts에 getProducts(): Promise<Product[]> 인터페이스 규칙 작성.
Core (Use Case): 인터페이스 규칙(Port)을 기반으로 상품 목록을 가져와서 필터링하는 파츠 구현.
Infrastructure (Impl): product.repository.impl.ts에서 실제로 API나 DB를 통해 JSON 데이터를 받아오는 코드 작성. 완성된 객체를 Port 규칙에 맞게 반환.
App / Presentation: app/products/page.tsx 또는 컴포넌트 내부에서 Use Case를 호출하여 화면에 렌더링.
이렇게 구조를 잡으면 초기 세팅에 시간은 걸리지만, 나중에 "API 주소가 바뀌었다", "상태 관리 라이브러리를 변경해야 한다" 등의 상황에서 해당 계층만 수정하면 되므로 유지보수가 매우 편리해집니다.