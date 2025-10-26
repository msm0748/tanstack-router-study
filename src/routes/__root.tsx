import { Link } from '@chakra-ui/react';
import {
  createRootRoute,
  Link as TanStackLink,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link asChild bg="blue.500">
        <TanStackLink to="/">Home</TanStackLink>
      </Link>{' '}
      <Link asChild bg="green.500">
        <TanStackLink to="/about">About</TanStackLink>
      </Link>{' '}
      <Link asChild bg="red.500">
        <TanStackLink to="/docs/$" params={{ _splat: 'test/abc' }}>
          Docs
        </TanStackLink>
      </Link>
      <Link asChild bg="purple.500">
        <TanStackLink to="/login">Login</TanStackLink>
      </Link>
      <Link asChild bg="orange.500">
        <TanStackLink to="/blog">Blog</TanStackLink>
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
