import { createFileRoute } from "@tanstack/react-router";
import AboutMBTIPage from "../pages/AboutMBTIPage";

export const Route = createFileRoute("/about/mbti")({
  component: AboutMBTIPage,

  head: () => ({
    meta: [
      {
        title: "MBTI là gì? | Khám phá 16 loại tính cách & Định hướng sự nghiệp",
        description:
          "Tìm hiểu MBTI - công cụ đánh giá tính cách Myers-Briggs chuẩn quốc tế. Khám phá 16 loại tính cách, điểm mạnh/yếu, nghề nghiệp phù hợp và cách phát triển bản thân.",
      },
      {
        property: "og:title",
        content: "MBTI là gì? | Hiểu bản thân - Phát triển sự nghiệp",
      },
      {
        property: "og:description",
        content: "Thực hiện bài test MBTI miễn phí và nhận báo cáo chi tiết về tính cách của bạn.",
      },
      {
        name: "keywords",
        content:
          "MBTI, test MBTI, Myers-Briggs, 16 loại tính cách, định hướng nghề nghiệp, khám phá bản thân, tính cách MBTI",
      },
    ],
  }),
});
