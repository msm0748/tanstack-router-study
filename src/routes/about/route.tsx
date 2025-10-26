import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutLayout,
});

function AboutLayout() {
  return (
    <div>
      <h2>About 레이아웃222</h2>
      <Outlet />
    </div>
  );
}
