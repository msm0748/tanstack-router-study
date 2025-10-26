# Next.js vs TanStack Router - 파일 기반 라우팅 비교

## 개요

Next.js와 TanStack Router 모두 파일 기반 라우팅을 지원하지만, 접근 방식이 다릅니다.

---

## 1. 기본 개념 비교

### Next.js (App Router)

- **파일 이름으로 역할 구분**
- `layout.tsx` = 레이아웃
- `page.tsx` = 페이지
- `loading.tsx`, `error.tsx` 등 특수 파일

### TanStack Router

- **폴더 구조와 파일 이름 조합으로 역할 결정**
- `route.tsx` 또는 `[name].tsx` = 레이아웃 (하위 폴더가 있을 때)
- `index.tsx` = 페이지
- `<Outlet />` 컴포넌트로 자식 렌더링

---

## 2. 폴더 구조 패턴

### 패턴 1: 기본 페이지

#### Next.js

```
📂 app/
  📂 about/
    ʦ page.tsx          → /about
```

#### TanStack Router (방법 1)

```
📂 routes/
  ʦ about.tsx           → /about
```

#### TanStack Router (방법 2 - 권장)

```
📂 routes/
  📂 about/
    ʦ index.tsx         → /about
```

---

### 패턴 2: 레이아웃 + 페이지

#### Next.js

```
📂 app/
  📂 about/
    ʦ layout.tsx        → 레이아웃 (명확)
    ʦ page.tsx          → /about
    📂 team/
      ʦ page.tsx        → /about/team
```

**코드 예시:**

```tsx
// app/about/layout.tsx
export default function AboutLayout({ children }) {
  return (
    <div>
      <h2>About 레이아웃</h2>
      {children}
    </div>
  );
}

// app/about/page.tsx
export default function AboutPage() {
  return <div>About 페이지</div>;
}
```

#### TanStack Router (방법 1 - 헷갈림 ❌)

```
📂 routes/
  ʦ about.tsx           → 레이아웃? 페이지? (모호함)
  📂 about/
    ʦ index.tsx         → /about
    📂 team/
      ʦ index.tsx       → /about/team
```

#### TanStack Router (방법 2 - 권장 ✅)

```
📂 routes/
  📂 about/
    ʦ route.tsx         → 레이아웃 (명확)
    ʦ index.tsx         → /about
    📂 team/
      ʦ index.tsx       → /about/team
```

**코드 예시:**

```tsx
// routes/about/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutLayout,
});

function AboutLayout() {
  return (
    <div>
      <h2>About 레이아웃</h2>
      <Outlet /> {/* Next.js의 {children}과 같은 역할 */}
    </div>
  );
}

// routes/about/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about/')({
  component: AboutPage,
});

function AboutPage() {
  return <div>About 페이지</div>;
}
```

---

## 3. 중첩 라우팅

### Next.js

```
📂 app/
  📂 dashboard/
    ʦ layout.tsx        → 대시보드 레이아웃
    ʦ page.tsx          → /dashboard
    📂 settings/
      ʦ layout.tsx      → 설정 레이아웃 (중첩)
      ʦ page.tsx        → /dashboard/settings
      📂 profile/
        ʦ page.tsx      → /dashboard/settings/profile
```

**렌더링 결과:**

```
/dashboard/settings/profile
→ <DashboardLayout>
    <SettingsLayout>
      <ProfilePage>
    </SettingsLayout>
  </DashboardLayout>
```

### TanStack Router

```
📂 routes/
  📂 dashboard/
    ʦ route.tsx         → 대시보드 레이아웃
    ʦ index.tsx         → /dashboard
    📂 settings/
      ʦ route.tsx       → 설정 레이아웃 (중첩)
      ʦ index.tsx       → /dashboard/settings
      📂 profile/
        ʦ index.tsx     → /dashboard/settings/profile
```

**렌더링 결과:**

```
/dashboard/settings/profile
→ <Root>
    <DashboardLayout>
      <SettingsLayout>
        <ProfilePage>
      </SettingsLayout>
    </DashboardLayout>
  </Root>
```

---

## 4. 동적 라우트 (Dynamic Routes)

### Next.js

```
📂 app/
  📂 posts/
    ʦ page.tsx              → /posts
    📂 [postId]/
      ʦ page.tsx            → /posts/123
      📂 comments/
        📂 [commentId]/
          ʦ page.tsx        → /posts/123/comments/456
```

**코드 예시:**

```tsx
// app/posts/[postId]/page.tsx
export default function PostPage({ params }: { params: { postId: string } }) {
  return <div>Post ID: {params.postId}</div>;
}
```

### TanStack Router

```
📂 routes/
  📂 posts/
    ʦ index.tsx             → /posts
    📂 $postId/
      ʦ index.tsx           → /posts/123
      📂 comments/
        📂 $commentId/
          ʦ index.tsx       → /posts/123/comments/456
```

**코드 예시:**

```tsx
// routes/posts/$postId/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$postId/')({
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  return <div>Post ID: {postId}</div>;
}
```

---

## 5. Flat Routes (플랫 라우팅)

TanStack Router만의 고유 기능으로, `.`을 사용하여 중첩을 표현할 수 있습니다.

### 디렉토리 방식 (Directory Routes)

```
📂 routes/
  📂 dashboard/
    ʦ route.tsx
    ʦ index.tsx
    📂 settings/
      ʦ index.tsx
      📂 profile/
        ʦ index.tsx
```

### 플랫 방식 (Flat Routes)

```
📂 routes/
  ʦ dashboard.tsx
  ʦ dashboard.index.tsx
  ʦ dashboard.settings.index.tsx
  ʦ dashboard.settings.profile.index.tsx
```

### 혼합 방식 (Mixed - 권장)

```
📂 routes/
  📂 dashboard/
    ʦ route.tsx
    ʦ index.tsx
    ʦ settings.tsx
    ʦ settings.profile.tsx
```

---

## 6. Pathless Layout (경로 없는 레이아웃)

### Next.js

```
📂 app/
  📂 (marketing)/         → 그룹 라우팅 (URL에 포함 안됨)
    ʦ layout.tsx
    📂 about/
      ʦ page.tsx          → /about
    📂 contact/
      ʦ page.tsx          → /contact
```

### TanStack Router

```
📂 routes/
  ʦ _marketing.tsx        → '_'로 시작하면 pathless
  📂 _marketing/
    📂 about/
      ʦ index.tsx         → /about
    📂 contact/
      ʦ index.tsx         → /contact
```

**코드 예시:**

```tsx
// routes/_marketing.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className="marketing-layout">
      <nav>마케팅 네비게이션</nav>
      <Outlet />
    </div>
  );
}
```

---

## 7. Catch-all Routes (모든 경로 캐치)

### Next.js

```
📂 app/
  📂 docs/
    📂 [...slug]/
      ʦ page.tsx          → /docs/a, /docs/a/b, /docs/a/b/c
```

**코드 예시:**

```tsx
// app/docs/[...slug]/page.tsx
export default function DocsPage({ params }: { params: { slug: string[] } }) {
  return <div>Path: {params.slug.join('/')}</div>;
}
```

### TanStack Router

```
📂 routes/
  📂 docs/
    ʦ $.tsx               → /docs/a, /docs/a/b, /docs/a/b/c
```

**코드 예시:**

```tsx
// routes/docs/$.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/docs/$')({
  component: DocsPage,
});

function DocsPage() {
  const { _splat } = Route.useParams();
  return <div>Path: {_splat}</div>;
}
```

---

## 8. 핵심 차이점 요약

| 항목              | Next.js           | TanStack Router               |
| ----------------- | ----------------- | ----------------------------- |
| **레이아웃 파일** | `layout.tsx`      | `route.tsx` 또는 `[name].tsx` |
| **페이지 파일**   | `page.tsx`        | `index.tsx`                   |
| **동적 라우트**   | `[param]`         | `$param`                      |
| **Catch-all**     | `[...slug]`       | `$`                           |
| **Pathless**      | `(folder)`        | `_folder`                     |
| **자식 렌더링**   | `{children}` prop | `<Outlet />` 컴포넌트         |
| **플랫 라우팅**   | ❌ 지원 안함      | ✅ `.`으로 중첩 표현 가능     |
| **타입 안정성**   | 제한적            | ✅ 자동 타입 생성             |

---

## 9. 실전 예제: 블로그 구조

### Next.js

```
📂 app/
  ʦ layout.tsx            → 루트 레이아웃
  ʦ page.tsx              → / (홈)
  📂 blog/
    ʦ layout.tsx          → 블로그 레이아웃
    ʦ page.tsx            → /blog
    📂 [slug]/
      ʦ page.tsx          → /blog/my-post
      📂 edit/
        ʦ page.tsx        → /blog/my-post/edit
  📂 (auth)/              → 그룹 라우팅
    ʦ layout.tsx
    📂 login/
      ʦ page.tsx          → /login
    📂 signup/
      ʦ page.tsx          → /signup
```

### TanStack Router (권장 구조)

```
📂 routes/
  ʦ __root.tsx            → 루트 레이아웃
  ʦ index.tsx             → / (홈)
  📂 blog/
    ʦ route.tsx           → 블로그 레이아웃
    ʦ index.tsx           → /blog
    📂 $slug/
      ʦ index.tsx         → /blog/my-post
      📂 edit/
        ʦ index.tsx       → /blog/my-post/edit
  📂 _auth/
    ʦ route.tsx         → Pathless 레이아웃
    📂 login/
      ʦ index.tsx         → /login
    📂 signup/
      ʦ index.tsx         → /signup
```

---

## 10. 어떤 것을 선택해야 할까?

### Next.js를 선택하는 경우

- ✅ SSR/SSG가 필수적인 프로젝트
- ✅ SEO가 중요한 마케팅 사이트
- ✅ Vercel 배포 및 에코시스템 활용
- ✅ 더 많은 레퍼런스와 커뮤니티

### TanStack Router를 선택하는 경우

- ✅ 클라이언트 중심의 SPA
- ✅ 강력한 타입 안정성이 필요한 경우
- ✅ 더 유연한 라우팅 구조 (Flat Routes)
- ✅ 번들 사이즈가 중요한 경우
- ✅ TanStack Query 등 다른 TanStack 라이브러리와 통합

---

## 11. 학습 팁

### Next.js에서 TanStack Router로 전환 시

1. `layout.tsx` → `route.tsx`로 생각
2. `page.tsx` → `index.tsx`로 생각
3. `{children}` → `<Outlet />`로 변경
4. `[param]` → `$param`으로 변경
5. `route.tsx` 패턴을 사용하면 Next.js와 거의 동일한 구조

### 권장 파일 구조 (TanStack Router)

```
📂 routes/
  ʦ __root.tsx
  ʦ index.tsx
  📂 [feature]/
    ʦ route.tsx      ← 레이아웃 (명시적)
    ʦ index.tsx      ← 메인 페이지
    📂 [sub-page]/
      ʦ index.tsx
```

---

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [TanStack Router 문서](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [TanStack Router File Naming Conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)
