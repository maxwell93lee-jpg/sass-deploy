---
trigger: always_on
---

# Tech Stack Rules & Best Practices

이 프로젝트는 **Next.js (App Router)**와 **Supabase**를 핵심 기술 스택으로 사용합니다. 아래는 해당 스택을 사용할 때 지켜야 할 안티그래비티 설계 및 보안 규약입니다.

## 1. Next.js 프레임워크 규약 (참조)
기본적인 Next.js App Router 작성 규칙(Server Component 선호, 렌더링 최적화, 파일 분리 등)은 `Next.js-framework.md` 파일을 따릅니다.

## 2. Supabase 통합 및 클라이언트 생성 (Use `@supabase/ssr`)
- **원칙**: Next.js App Router 환경에서는 반드시 `@supabase/ssr` 패키지를 사용하여 클라이언트를 생성합니다. (`@supabase/auth-helpers-nextjs`는 더 이상 권장되지 않음)
- **적용**:
  - **Server Components / Actions / Route Handlers**: `createServerClient`를 사용하여 요청(Request) 단에서 쿠키를 읽고 쓸 수 있는 서버 전용 클라이언트를 사용합니다.
  - **Client Components**: `createBrowserClient`를 사용하여 브라우저에서 안전하게 동작하는 클라이언트를 생성합니다.

## 3. 강력한 데이터베이스 보안 (Enforce Row Level Security)
- **원칙**: 프론트엔드나 엣지 함수에서 데이터 검증을 전적으로 신뢰하지 않으며, Supabase의 **Row Level Security (RLS)**를 활성화하여 데이터베이스 레벨에서 직접 접근 권한을 제어합니다.
- **적용**:
  - 모든 테이블에 대해 RLS를 켭니다 (`ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`).
  - 사용자는 자신의 데이터만 읽고 쓸 수 있도록 명시적인 정책(Policy)을 작성합니다.

## 4. 데이터 타입 안전성 (Type-Safe Database)
- **원칙**: Supabase에서 제공하는 데이터베이스 추론 타입을 추출하여 TypeScript 환경에서 Type-Safe하게 활용합니다.
- **적용**:
  - Supabase CLI를 통해 데이터베이스 스키마를 기반으로 `types_db.ts` (또는 유사한 이름) 파일을 자동 생성합니다.
  - 이 생성된 타입을 `core/entities`의 도메인 모델과 매핑하거나, `infrastructure/api` 단에서 직접 사용하여 컴파일 시점에 오류를 방지합니다.

## 4-1. 마이그레이션 (Migrations)
- **원칙**: supabase/migrations 폴더에 위치
- **적용**: 마이그레이션을 수정하거나 삭제하거나 새로 생성할 때는 항상 사용자의 허가 받기.

## 5. 환경 변수 엄격 분리 (Environment Variables)
- **원칙**: 브라우저에 노출되어도 되는 변수와 서버에서만 사용해야 하는 변수를 명확히 분리합니다.
- **적용**:
  - Supabase URL과 익명 키(Anon Key)는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 접두어(`NEXT_PUBLIC_`)를 붙여 프론트엔드에서도 사용할 수 있도록 합니다.
  - Supabase Service Role Key 등 관리자 권한이 있는 키는 절대로 `NEXT_PUBLIC_`를 붙이지 않으며, Server Component나 Edge/Node 서버 환경에서만 접근하도록 합니다.

## 6. 클린 아키텍처와의 조화 (Infrastructure Layer)
- **원칙**: Supabase에 직접 의존하는 쿼리 코드나 API 호출은 클린 아키텍처의 `infrastructure/` 계층에 캡슐화합니다.
- **이유**: `core/` 비즈니스 로직이나 UI 컴포넌트가 특정 BaaS(Backend as a Service) 벤더에 강하게 결합되는 것을 막기 위함입니다.
- **적용**: 예를 들어, `ProductRepository` 인터페이스를 만들고, `SupabaseProductRepository` 구현체에서만 Supabase 클라이언트를 임포트하여 데이터를 가져옵니다.
