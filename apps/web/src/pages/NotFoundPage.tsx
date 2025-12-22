import { useNavigate } from "@tanstack/react-router";

import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-6xl font-bold text-purple-600">404</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy trang</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng quay lại trang chủ.
      </p>
      <Button onClick={() => navigate({ to: "/" })} variant="primary">
        Quay về trang chủ
      </Button>
    </div>
  );
}
