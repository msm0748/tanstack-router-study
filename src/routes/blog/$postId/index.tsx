import { createFileRoute, useBlocker } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';

export const Route = createFileRoute('/blog/$postId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { postId } = Route.useParams();
  const [isEditing, setIsEditing] = useState(true); // 편집 중인지 여부

  // 네비게이션 차단 - isEditing이 true일 때만 차단
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isEditing,
    withResolver: true, // proceed, reset 사용하려면 필수!
    enableBeforeUnload: true, // 브라우저 닫기/새로고침도 차단
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        블로그 포스트 페이지: {postId}
      </h1>

      <div className="mb-4">
        <p className="mb-2">
          편집 중 상태: <strong>{isEditing ? '켜짐' : '꺼짐'}</strong>
        </p>
        <Button
          colorPalette={isEditing ? 'red' : 'green'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '편집 완료' : '편집 시작'}
        </Button>
      </div>

      <div className="p-4 border rounded bg-yellow-50">
        <p>
          현재 편집 중입니다. 다른 페이지로 이동하려면 위의 "편집 완료" 버튼을
          눌러주세요.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          또는 내비게이션 링크를 클릭하면 확인 모달이 나타납니다.
        </p>
      </div>

      {/* 네비게이션 차단 모달 */}
      {status === 'blocked' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                페이지를 나가시겠습니까?
              </h2>
            </div>

            {/* 모달 바디 */}
            <div className="px-6 py-4">
              <p className="text-gray-700">
                저장하지 않은 변경사항이 있을 수 있습니다. 정말로 이 페이지를
                떠나시겠습니까?
              </p>
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  proceed();
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
