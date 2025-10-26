import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      로그인 레이아웃
      <Outlet />
    </div>
  );
}
