import { Link } from '@/components/ui/link';
import { Box } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blog/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      블로그 페이지
      <Box>
        <Link to="/blog/$postId" params={{ postId: '1' }} color="blue">
          블로그 포스트 1
        </Link>
      </Box>
    </div>
  );
}
