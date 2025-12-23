// src/pages/AboutMBTIPage.tsx
import { AppShell } from "../components/layout/AppShell";
import { Brain, Target, Users, TrendingUp, BookOpen, Lightbulb, Shield, Zap } from "lucide-react";

export default function AboutMBTIPage() {
  return (
    <AppShell activeNav="about">
      <div className="max-w-4xl mx-auto space-y-12 px-4 py-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            <Brain className="w-4 h-4" />
            Hiểu bản thân - Phát triển sự nghiệp
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Myers-Briggs Type Indicator (MBTI)</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá tính cách của bạn qua bài test MBTI chính xác và khoa học — bước đầu tiên để phát triển bản thân và
            sự nghiệp.
          </p>
        </section>

        {/* What is MBTI */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            MBTI là gì?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            MBTI (Myers-Briggs Type Indicator) là một công cụ đánh giá tính cách dựa trên lý thuyết của nhà tâm lý học
            Carl Jung. Được phát triển bởi Katharine Cook Briggs và Isabel Briggs Myers, MBTI phân loại con người thành{" "}
            <strong>16 loại tính cách</strong> dựa trên 4 chiều đối lập:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[
              {
                dim: "E - I",
                name: "Hướng ngoại (Extraversion) ↔ Hướng nội (Introversion)",
                desc: "Bạn tập trung năng lượng vào đâu?",
              },
              {
                dim: "S - N",
                name: "Cảm giác (Sensing) ↔ Trực giác (Intuition)",
                desc: "Bạn tiếp nhận thông tin như thế nào?",
              },
              {
                dim: "T - F",
                name: "Lý trí (Thinking) ↔ Cảm xúc (Feeling)",
                desc: "Bạn ra quyết định dựa trên điều gì?",
              },
              {
                dim: "J - P",
                name: "Nguyên tắc (Judging) ↔ Linh hoạt (Perceiving)",
                desc: "Bạn tiếp cận thế giới ra sao?",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-lg font-bold text-purple-600 mb-2">{item.dim}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why MBTI Matters */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-purple-600" />
            Tại sao MBTI quan trọng?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: "Hiểu rõ bản thân",
                desc: "Nhận biết điểm mạnh, điểm yếu, xu hướng hành vi và cách bạn tương tác với thế giới.",
              },
              {
                icon: Users,
                title: "Cải thiện giao tiếp",
                desc: "Hiểu cách người khác suy nghĩ giúp bạn giao tiếp hiệu quả hơn trong công việc và đời sống.",
              },
              {
                icon: TrendingUp,
                title: "Định hướng sự nghiệp",
                desc: "Mỗi loại tính cách phù hợp với những ngành nghề khác nhau — MBTI giúp bạn chọn đúng con đường.",
              },
              {
                icon: Shield,
                title: "Phát triển cá nhân",
                desc: "Nhận thức được khuynh hướng tự nhiên giúp bạn phát triển toàn diện và vượt qua giới hạn.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                <item.icon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How Our Platform Works */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            Nguyên lý hoạt động của nền tảng
          </h2>
          <p className="text-gray-700">
            Nền tảng của chúng tôi sử dụng phương pháp MBTI chuẩn quốc tế, được hiệu chuẩn bởi các chuyên gia tâm lý.
            Bài test gồm <strong>28 câu hỏi</strong>, mỗi câu hỏi đo lường xu hướng tự nhiên của bạn trong các tình
            huống cụ thể.
          </p>
          <div className="space-y-4 mt-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Làm bài test</h3>
                <p className="text-gray-600">Trả lời 28 câu hỏi trung thực — không có đáp án đúng/sai.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phân tích dữ liệu</h3>
                <p className="text-gray-600">
                  Hệ thống tính toán điểm số dựa trên 4 chiều tính cách và xác định loại MBTI của bạn.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nhận báo cáo chi tiết</h3>
                <p className="text-gray-600">
                  Xem kết quả đầy đủ: loại tính cách, điểm mạnh/yếu, nghề nghiệp phù hợp, phong cách giao tiếp và lãnh
                  đạo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Validity */}
        <section className="bg-purple-50 p-8 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Tính khoa học và độ tin cậy</h2>
          <p className="text-purple-800">
            MBTI là một trong những công cụ đánh giá tính cách được sử dụng rộng rãi nhất thế giới, với hơn{" "}
            <strong>2 triệu người</strong> thực hiện mỗi năm. Bài test đã được kiểm chứng qua nhiều nghiên cứu và được
            áp dụng trong:
          </p>
          <ul className="mt-3 space-y-2 text-purple-800 list-disc pl-5">
            <li>Tuyển dụng và phát triển nhân sự (Google, Amazon, NASA)</li>
            <li>Định hướng nghề nghiệp tại các trường đại học</li>
            <li>Counseling tâm lý và phát triển cá nhân</li>
          </ul>
          <p className="mt-4 text-sm text-purple-700 italic">
            * Lưu ý: MBTI không phải là công cụ chẩn đoán tâm lý, mà là công cụ tự khám phá.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sẵn sàng khám phá bản thân?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Thực hiện bài test MBTI miễn phí ngay hôm nay và nhận báo cáo chi tiết về tính cách của bạn.
          </p>
          <a
            href="/assessments"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Bắt đầu bài test
          </a>
        </section>
      </div>
    </AppShell>
  );
}
