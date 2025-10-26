import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>로그인 페이지</div>;
}
