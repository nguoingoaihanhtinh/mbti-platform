// src/libs/translations.ts
import { useTranslation } from "react-i18next";

const dynamicTranslations: Record<string, Record<"en" | "vi", string>> = {
  // AssessmentsPage & AboutMBTIPage & ForgotPasswordPage
  "Forgot Password": { en: "Forgot Password", vi: "Quên mật khẩu" },
  "Enter your email to receive a reset OTP": {
    en: "Enter your email to receive a reset OTP",
    vi: "Nhập email để nhận mã OTP đặt lại mật khẩu",
  },
  "Email Address": { en: "Email Address", vi: "Địa chỉ email" },
  "Enter your email": { en: "Enter your email", vi: "Nhập email của bạn" },
  "Sending...": { en: "Sending...", vi: "Đang gửi..." },
  "Send OTP": { en: "Send OTP", vi: "Gửi OTP" },
  "Back to Login": { en: "Back to Login", vi: "Quay lại đăng nhập" },
  "Available Tests": { en: "Available Tests", vi: "Bài kiểm tra có sẵn" },
  "My Assessments": { en: "My Assessments", vi: "Bài làm của tôi" },
  "Browse and start new personality tests": {
    en: "Browse and start new personality tests",
    vi: "Duyệt và bắt đầu các bài kiểm tra tính cách mới",
  },
  "Manage your personality tests and study results": {
    en: "Manage your personality tests and study results",
    vi: "Quản lý các bài kiểm tra và kết quả học tập của bạn",
  },
  "Loading...": { en: "Loading...", vi: "Đang tải..." },
  "Take Test": { en: "Take Test", vi: "Làm bài kiểm tra" },
  "You haven’t started any assessments yet.": {
    en: "You haven’t started any assessments yet.",
    vi: "Bạn chưa bắt đầu bài làm nào.",
  },
  "Are you sure you want to delete this assessment?": {
    en: "Are you sure you want to delete this assessment?",
    vi: "Bạn có chắc chắn muốn xóa bài làm này không?",
  },
  "Status:": { en: "Status:", vi: "Trạng thái:" },
  "Completed:": { en: "Completed:", vi: "Hoàn thành:" },
  "View Result": { en: "View Result", vi: "Xem kết quả" },
  Continue: { en: "Continue", vi: "Tiếp tục" },
  "Started:": { en: "Started:", vi: "Bắt đầu:" },
  "Delete assessment": { en: "Delete assessment", vi: "Xóa bài làm" },
  "Unknown Test": { en: "Unknown Test", vi: "Bài kiểm tra không xác định" },
  // AboutMBTIPage
  "Hiểu bản thân - Phát triển sự nghiệp": {
    en: "Understand yourself - Develop your career",
    vi: "Hiểu bản thân - Phát triển sự nghiệp",
  },
  "Myers-Briggs Type Indicator (MBTI)": {
    en: "Myers-Briggs Type Indicator (MBTI)",
    vi: "Myers-Briggs Type Indicator (MBTI)",
  },
  "Khám phá tính cách của bạn qua bài test MBTI chính xác và khoa học — bước đầu tiên để phát triển bản thân và sự nghiệp.":
    {
      en: "Discover your personality through an accurate and scientific MBTI test — the first step to personal and career development.",
      vi: "Khám phá tính cách của bạn qua bài test MBTI chính xác và khoa học — bước đầu tiên để phát triển bản thân và sự nghiệp.",
    },
  "MBTI là gì?": { en: "What is MBTI?", vi: "MBTI là gì?" },
  "MBTI (Myers-Briggs Type Indicator) là một công cụ đánh giá tính cách dựa trên lý thuyết của nhà tâm lý học Carl Jung. Được phát triển bởi Katharine Cook Briggs và Isabel Briggs Myers, MBTI phân loại con người thành 16 loại tính cách dựa trên 4 chiều đối lập:":
    {
      en: "MBTI (Myers-Briggs Type Indicator) is a personality assessment tool based on Carl Jung's theory. Developed by Katharine Cook Briggs and Isabel Briggs Myers, MBTI classifies people into 16 personality types based on 4 dichotomies:",
      vi: "MBTI (Myers-Briggs Type Indicator) là một công cụ đánh giá tính cách dựa trên lý thuyết của nhà tâm lý học Carl Jung. Được phát triển bởi Katharine Cook Briggs và Isabel Briggs Myers, MBTI phân loại con người thành 16 loại tính cách dựa trên 4 chiều đối lập:",
    },
  "Hướng ngoại (Extraversion) ↔ Hướng nội (Introversion)": {
    en: "Extraversion (E) ↔ Introversion (I)",
    vi: "Hướng ngoại (Extraversion) ↔ Hướng nội (Introversion)",
  },
  "Bạn tập trung năng lượng vào đâu?": {
    en: "Where do you focus your energy?",
    vi: "Bạn tập trung năng lượng vào đâu?",
  },
  "Cảm giác (Sensing) ↔ Trực giác (Intuition)": {
    en: "Sensing (S) ↔ Intuition (N)",
    vi: "Cảm giác (Sensing) ↔ Trực giác (Intuition)",
  },
  "Bạn tiếp nhận thông tin như thế nào?": {
    en: "How do you receive information?",
    vi: "Bạn tiếp nhận thông tin như thế nào?",
  },
  "Lý trí (Thinking) ↔ Cảm xúc (Feeling)": {
    en: "Thinking (T) ↔ Feeling (F)",
    vi: "Lý trí (Thinking) ↔ Cảm xúc (Feeling)",
  },
  "Bạn ra quyết định dựa trên điều gì?": {
    en: "What do you base your decisions on?",
    vi: "Bạn ra quyết định dựa trên điều gì?",
  },
  "Nguyên tắc (Judging) ↔ Linh hoạt (Perceiving)": {
    en: "Judging (J) ↔ Perceiving (P)",
    vi: "Nguyên tắc (Judging) ↔ Linh hoạt (Perceiving)",
  },
  "Bạn tiếp cận thế giới ra sao?": { en: "How do you approach the world?", vi: "Bạn tiếp cận thế giới ra sao?" },
  "Tại sao MBTI quan trọng?": { en: "Why is MBTI important?", vi: "Tại sao MBTI quan trọng?" },
  "Hiểu rõ bản thân": { en: "Understand yourself better", vi: "Hiểu rõ bản thân" },
  "Nhận biết điểm mạnh, điểm yếu, xu hướng hành vi và cách bạn tương tác với thế giới.": {
    en: "Recognize strengths, weaknesses, behavioral tendencies, and how you interact with the world.",
    vi: "Nhận biết điểm mạnh, điểm yếu, xu hướng hành vi và cách bạn tương tác với thế giới.",
  },
  "Cải thiện giao tiếp": { en: "Improve communication", vi: "Cải thiện giao tiếp" },
  "Hiểu cách người khác suy nghĩ giúp bạn giao tiếp hiệu quả hơn trong công việc và đời sống.": {
    en: "Understanding how others think helps you communicate more effectively at work and in life.",
    vi: "Hiểu cách người khác suy nghĩ giúp bạn giao tiếp hiệu quả hơn trong công việc và đời sống.",
  },
  "Định hướng sự nghiệp": { en: "Career orientation", vi: "Định hướng sự nghiệp" },
  "Mỗi loại tính cách phù hợp với những ngành nghề khác nhau — MBTI giúp bạn chọn đúng con đường.": {
    en: "Each personality type suits different careers — MBTI helps you choose the right path.",
    vi: "Mỗi loại tính cách phù hợp với những ngành nghề khác nhau — MBTI giúp bạn chọn đúng con đường.",
  },
  "Phát triển cá nhân": { en: "Personal development", vi: "Phát triển cá nhân" },
  "Nhận thức được khuynh hướng tự nhiên giúp bạn phát triển toàn diện và vượt qua giới hạn.": {
    en: "Awareness of natural tendencies helps you develop fully and overcome limits.",
    vi: "Nhận thức được khuynh hướng tự nhiên giúp bạn phát triển toàn diện và vượt qua giới hạn.",
  },
  "Nguyên lý hoạt động của nền tảng": { en: "How the platform works", vi: "Nguyên lý hoạt động của nền tảng" },
  "Nền tảng của chúng tôi sử dụng phương pháp MBTI chuẩn quốc tế, được hiệu chuẩn bởi các chuyên gia tâm lý. Bài test gồm 28 câu hỏi, mỗi câu hỏi đo lường xu hướng tự nhiên của bạn trong các tình huống cụ thể.":
    {
      en: "Our platform uses the standard international MBTI method, calibrated by psychologists. The test consists of 28 questions, each measuring your natural tendencies in specific situations.",
      vi: "Nền tảng của chúng tôi sử dụng phương pháp MBTI chuẩn quốc tế, được hiệu chuẩn bởi các chuyên gia tâm lý. Bài test gồm 28 câu hỏi, mỗi câu hỏi đo lường xu hướng tự nhiên của bạn trong các tình huống cụ thể.",
    },
  "Làm bài test": { en: "Take the test", vi: "Làm bài test" },
  "Trả lời 28 câu hỏi trung thực — không có đáp án đúng/sai.": {
    en: "Answer 28 questions honestly — there are no right or wrong answers.",
    vi: "Trả lời 28 câu hỏi trung thực — không có đáp án đúng/sai.",
  },
  "Phân tích dữ liệu": { en: "Data analysis", vi: "Phân tích dữ liệu" },
  "Hệ thống tính toán điểm số dựa trên 4 chiều tính cách và xác định loại MBTI của bạn.": {
    en: "The system calculates scores based on 4 personality dimensions and determines your MBTI type.",
    vi: "Hệ thống tính toán điểm số dựa trên 4 chiều tính cách và xác định loại MBTI của bạn.",
  },
  "Nhận báo cáo chi tiết": { en: "Receive detailed report", vi: "Nhận báo cáo chi tiết" },
  "Xem kết quả đầy đủ: loại tính cách, điểm mạnh/yếu, nghề nghiệp phù hợp, phong cách giao tiếp và lãnh đạo.": {
    en: "See full results: personality type, strengths/weaknesses, suitable careers, communication and leadership styles.",
    vi: "Xem kết quả đầy đủ: loại tính cách, điểm mạnh/yếu, nghề nghiệp phù hợp, phong cách giao tiếp và lãnh đạo.",
  },
  "Tính khoa học và độ tin cậy": { en: "Scientific validity and reliability", vi: "Tính khoa học và độ tin cậy" },
  "MBTI là một trong những công cụ đánh giá tính cách được sử dụng rộng rãi nhất thế giới, với hơn 2 triệu người thực hiện mỗi năm. Bài test đã được kiểm chứng qua nhiều nghiên cứu và được áp dụng trong:":
    {
      en: "MBTI is one of the most widely used personality assessment tools in the world, with over 2 million people taking it each year. The test has been validated by many studies and is applied in:",
      vi: "MBTI là một trong những công cụ đánh giá tính cách được sử dụng rộng rãi nhất thế giới, với hơn 2 triệu người thực hiện mỗi năm. Bài test đã được kiểm chứng qua nhiều nghiên cứu và được áp dụng trong:",
    },
  "Tuyển dụng và phát triển nhân sự (Google, Amazon, NASA)": {
    en: "Recruitment and HR development (Google, Amazon, NASA)",
    vi: "Tuyển dụng và phát triển nhân sự (Google, Amazon, NASA)",
  },
  "Định hướng nghề nghiệp tại các trường đại học": {
    en: "Career orientation at universities",
    vi: "Định hướng nghề nghiệp tại các trường đại học",
  },
  "Counseling tâm lý và phát triển cá nhân": {
    en: "Psychological counseling and personal development",
    vi: "Counseling tâm lý và phát triển cá nhân",
  },
  "* Lưu ý: MBTI không phải là công cụ chẩn đoán tâm lý, mà là công cụ tự khám phá.": {
    en: "* Note: MBTI is not a psychological diagnostic tool, but a self-discovery tool.",
    vi: "* Lưu ý: MBTI không phải là công cụ chẩn đoán tâm lý, mà là công cụ tự khám phá.",
  },
  "Sẵn sàng khám phá bản thân?": { en: "Ready to discover yourself?", vi: "Sẵn sàng khám phá bản thân?" },
  "Thực hiện bài test MBTI miễn phí ngay hôm nay và nhận báo cáo chi tiết về tính cách của bạn.": {
    en: "Take the MBTI test for free today and receive a detailed report about your personality.",
    vi: "Thực hiện bài test MBTI miễn phí ngay hôm nay và nhận báo cáo chi tiết về tính cách của bạn.",
  },
  "Bắt đầu bài test": { en: "Start the test", vi: "Bắt đầu bài test" },
  // Existing demo
  "Khoa Test": { en: "Khoa Test", vi: "Bài kiểm tra Khoa" },
  "MBTI Personality Assessment": { en: "MBTI Personality Assessment", vi: "Đánh giá tính cách MBTI" },
  "Discover your personality type through 25 validated questions": {
    en: "Discover your personality type through 25 validated questions",
    vi: "Khám phá loại tính cách của bạn qua 25 câu hỏi đã được xác thực",
  },

  "Welcome Back": { en: "Welcome Back", vi: "Chào mừng trở lại" },
  "Sign in to continue your learning journey": {
    en: "Sign in to continue your learning journey",
    vi: "Đăng nhập để tiếp tục hành trình học tập của bạn",
  },
  Password: { en: "Password", vi: "Mật khẩu" },
  "Enter your password": { en: "Enter your password", vi: "Nhập mật khẩu của bạn" },
  "Signing in...": { en: "Signing in...", vi: "Đang đăng nhập..." },
  "Sign In": { en: "Sign In", vi: "Đăng nhập" },
  "Sign in with email code instead": {
    en: "Sign in with email code instead",
    vi: "Đăng nhập bằng mã email thay thế",
  },
  Or: { en: "Or", vi: "Hoặc" },
  "Don't have an account?": { en: "Don't have an account?", vi: "Chưa có tài khoản?" },
  "Sign up": { en: "Sign up", vi: "Đăng ký" },

  // OTP Step
  "Enter OTP": { en: "Enter OTP", vi: "Nhập mã OTP" },
  "We sent a code to": { en: "We sent a code to", vi: "Chúng tôi đã gửi mã đến" },
  "One-Time Code": { en: "One-Time Code", vi: "Mã OTP" },
  "Enter 6-digit code": { en: "Enter 6-digit code", vi: "Nhập mã 6 chữ số" },
  "Verifying...": { en: "Verifying...", vi: "Đang xác minh..." },
  "Verify OTP": { en: "Verify OTP", vi: "Xác minh OTP" },
  "Back to login": { en: "Back to login", vi: "Quay lại đăng nhập" },

  // Signup
  "Create Account": { en: "Create Account", vi: "Tạo tài khoản" },
  "Start your learning journey today": {
    en: "Start your learning journey today",
    vi: "Bắt đầu hành trình học tập ngay hôm nay",
  },
  "Full Name": { en: "Full Name", vi: "Họ và tên" },
  "Enter your full name": { en: "Enter your full name", vi: "Nhập họ và tên của bạn" },
  "Create a password": { en: "Create a password", vi: "Tạo mật khẩu" },
  "Confirm Password": { en: "Confirm Password", vi: "Xác nhận mật khẩu" },
  "Confirm your password": { en: "Confirm your password", vi: "Xác nhận lại mật khẩu" },
  "Must be at least 8 characters": {
    en: "Must be at least 8 characters",
    vi: "Ít nhất 8 ký tự",
  },
  "I agree to the": { en: "I agree to the", vi: "Tôi đồng ý với" },
  "Terms of Service": { en: "Terms of Service", vi: "Điều khoản Dịch vụ" },
  "Privacy Policy": { en: "Privacy Policy", vi: "Chính sách Bảo mật" },
  "Or sign up with": { en: "Or sign up with", vi: "Hoặc đăng ký bằng" },
  Google: { en: "Google", vi: "Google" },
  GitHub: { en: "GitHub", vi: "GitHub" },
  "Already have an account?": { en: "Already have an account?", vi: "Đã có tài khoản?" },

  // Profile
  "Edit Profile": { en: "Edit Profile", vi: "Chỉnh sửa hồ sơ" },
  Education: { en: "Education", vi: "Học vấn" },
  Experience: { en: "Experience", vi: "Kinh nghiệm" },
  "About Me": { en: "About Me", vi: "Giới thiệu bản thân" },
  "Tell us about yourself...": { en: "Tell us about yourself...", vi: "Hãy cho chúng tôi biết về bạn..." },
  LinkedIn: { en: "LinkedIn", vi: "LinkedIn" },

  Cancel: { en: "Cancel", vi: "Hủy" },
  "Save Changes": { en: "Save Changes", vi: "Lưu thay đổi" },
  "Saving...": { en: "Saving...", vi: "Đang lưu..." },
  // Test Page
  "Loading test...": { en: "Loading test...", vi: "Đang tải bài kiểm tra..." },
  "Access Denied": { en: "Access Denied", vi: "Truy cập bị từ chối" },
  "Please login or use the link from your email to access this test.": {
    en: "Please login or use the link from your email to access this test.",
    vi: "Vui lòng đăng nhập hoặc sử dụng liên kết từ email để truy cập bài kiểm tra này.",
  },
  "Failed to load test. Please check your link or contact support.": {
    en: "Failed to load test. Please check your link or contact support.",
    vi: "Không thể tải bài kiểm tra. Vui lòng kiểm tra lại liên kết hoặc liên hệ hỗ trợ.",
  },
  "Quick Actions": { en: "Quick Actions", vi: "Tác vụ nhanh" },
  "View Progress Report": { en: "View Progress Report", vi: "Xem báo cáo tiến độ" },
  "Schedule Study Time": { en: "Schedule Study Time", vi: "Lên lịch học tập" },
  "Study Hints": { en: "Study Hints", vi: "Gợi ý học tập" },
  "Time Remaining:": { en: "Time Remaining:", vi: "Thời gian còn lại:" },
  Question: { en: "Question", vi: "Câu hỏi" },
  "Submit Test": { en: "Submit Test", vi: "Nộp bài" },
  "Next ›": { en: "Next ›", vi: "Tiếp ›" },
  "‹ Previous": { en: "‹ Previous", vi: "‹ Trước" },
  "Question Navigator": { en: "Question Navigator", vi: "Điều hướng câu hỏi" },
  "No question found.": { en: "No question found.", vi: "Không tìm thấy câu hỏi." },
  complete: { en: "complete", vi: "hoàn thành" }, // cho "{progressPct}% complete"
  "Đang gửi...": { en: "Submitting...", vi: "Đang gửi..." }, // thay thế cứng
  // Results Page
  "My MBTI Result": { en: "My MBTI Result", vi: "Kết quả MBTI của bạn" },
  "Detailed and professional personality report": {
    en: "Detailed and professional personality report",
    vi: "Báo cáo tính cách chi tiết và chuyên nghiệp",
  },
  "Loading your result...": { en: "Loading your result...", vi: "Đang tải kết quả của bạn..." },
  "Result not found": { en: "Result not found", vi: "Không tìm thấy kết quả" },

  // Chart Titles
  "Dimension Analysis": { en: "Dimension Analysis", vi: "Phân tích theo chiều" },
  "Answer Distribution": { en: "Answer Distribution", vi: "Phân bố câu trả lời" },
  Dimension: { en: "Dimension", vi: "Chiều" },
  Score: { en: "Score", vi: "Điểm số" },

  // Strengths & Weaknesses
  Strengths: { en: "Strengths", vi: "Điểm mạnh" },
  Weaknesses: { en: "Weaknesses", vi: "Điểm yếu" },

  // Communication & Leadership
  "Communication Style": { en: "Communication Style", vi: "Phong cách giao tiếp" },
  "Leadership Style": { en: "Leadership Style", vi: "Phong cách lãnh đạo" },

  // Career
  "Career Suggestions": { en: "Career Suggestions", vi: "Gợi ý nghề nghiệp" },
  "Suitable Roles": { en: "Suitable Roles", vi: "Vai trò phù hợp" },

  // Workplace
  "Workplace Needs": { en: "Workplace Needs", vi: "Nhu cầu môi trường làm việc" },

  // Response Details
  "Your Answer Details": { en: "Your Answer Details", vi: "Chi tiết câu trả lời của bạn" },
  "—": { en: "—", vi: "—" }, // giữ nguyên

  // Pagination
  "Previous Page": { en: "← Previous Page", vi: "← Trang trước" },
  "Next Page": { en: "Next Page →", vi: "Trang sau →" },
  Page: { en: "Page", vi: "Trang" },
  of: { en: "of", vi: "trên" },

  // Back Button
  "Back to List": { en: "Back to List", vi: "Quay lại Danh sách" },

  // === Company Dashboard ===
  Dashboard: { en: "Dashboard", vi: "Bảng điều khiển" },
  "Company activity overview": {
    en: "Company activity overview",
    vi: "Tổng quan hoạt động công ty của bạn",
  },
  "Send new test": { en: "Send new test", vi: "Gửi test mới" },
  Quota: { en: "Quota", vi: "Hạn mức" },
  "Total assignments": { en: "Total assignments", vi: "Tổng assignments" },
  "Company employees": { en: "Company employees", vi: "Nhân viên công ty" },
  Completed: { en: "Completed", vi: "Đã hoàn thành" },
  Package: { en: "Package", vi: "Gói" },
  "MBTI Distribution": { en: "MBTI Distribution", vi: "Phân bố MBTI" },
  "No MBTI data available": { en: "No MBTI data available", vi: "Chưa có dữ liệu MBTI" },
  "Assignment Status": { en: "Assignment Status", vi: "Trạng thái Assignment" },
  Assigned: { en: "Assigned", vi: "Đã gửi" },
  "In Progress": { en: "In Progress", vi: "Đang làm" },
  "Usage frequency of assignments in the last 30 days": {
    en: "Usage frequency of assignments in the last 30 days",
    vi: "Tần suất sử dụng assignments trong 30 ngày gần đây",
  },
  "No usage data in the last 30 days": {
    en: "No usage data in the last 30 days",
    vi: "Chưa có dữ liệu sử dụng trong 30 ngày gần đây",
  },
  "Number of assignments": { en: "Number of assignments", vi: "Số assignment" },

  // Quick Actions
  "Manage Assignments": { en: "Manage Assignments", vi: "Quản lý Assignments" },
  "View and track all sent tests": {
    en: "View and track all sent tests",
    vi: "Xem và theo dõi tất cả bài test đã gửi",
  },
  Employees: { en: "Employees", vi: "Nhân viên" },
  "Manage employee list": {
    en: "Manage employee list",
    vi: "Quản lý danh sách nhân viên trong công ty",
  },
  "Service Package": { en: "Service Package", vi: "Gói dịch vụ" },
  "View and update current package": {
    en: "View and update current package",
    vi: "Xem và cập nhật gói dịch vụ hiện tại",
  },

  // Loading
  "Loading dashboard...": { en: "Loading dashboard...", vi: "Đang tải dashboard..." },

  // === Company Profile ===
  "Company Information": { en: "Company Information", vi: "Thông tin công ty" },
  "Manage and update your company information": {
    en: "Manage and update your company information",
    vi: "Quản lý và cập nhật thông tin công ty của bạn",
  },
  Edit: { en: "Edit", vi: "Chỉnh sửa" },

  Save: { en: "Save", vi: "Lưu" },
  "Company Name *": { en: "Company Name *", vi: "Tên công ty *" },
  "Enter company name": { en: "Enter company name", vi: "Nhập tên công ty" },
  Website: { en: "Website", vi: "Website" },
  Address: { en: "Address", vi: "Địa chỉ" },
  "Phone Number": { en: "Phone Number", vi: "Số điện thoại" },
  Description: { en: "Description", vi: "Mô tả" },
  "About the company...": { en: "About the company...", vi: "Giới thiệu về công ty..." },
  "Loading company information...": {
    en: "Loading company information...",
    vi: "Đang tải thông tin công ty...",
  },

  // Formatted labels (for display mode)
  "Company name": { en: "Company name", vi: "Tên công ty" },

  // === Company Assignments List ===

  "Track sent tests and candidate results": {
    en: "Track sent tests and candidate results",
    vi: "Theo dõi bài test đã gửi và kết quả ứng viên",
  },

  "Loading assignments list...": { en: "Loading assignments list...", vi: "Đang tải danh sách assignments..." },

  Sent: { en: "Sent", vi: "Đã gửi" },

  "Search by name or email...": {
    en: "Search by name or email...",
    vi: "Tìm kiếm theo tên hoặc email...",
  },
  "All statuses": { en: "All statuses", vi: "Tất cả trạng thái" },
  Candidate: { en: "Candidate", vi: "Ứng viên" },
  Test: { en: "Test", vi: "Bài test" },
  Status: { en: "Status", vi: "Trạng thái" },
  "Sent Date": { en: "Sent Date", vi: "Ngày gửi" },
  Result: { en: "Result", vi: "Kết quả" },
  Actions: { en: "Actions", vi: "Hành động" },
  Guest: { en: "Guest", vi: "Khách" },
  "N/A": { en: "N/A", vi: "N/A" },
  "Not completed yet": { en: "Not completed yet", vi: "Chưa hoàn thành" },
  Showing: { en: "Showing", vi: "Hiển thị" },

  results: { en: "results", vi: "kết quả" },

  // Status labels

  "In progress": { en: "In progress", vi: "Đang làm" },

  Unknown: { en: "Unknown", vi: "Chưa xác định" },

  // === Company Create Assignment ===
  Back: { en: "Back", vi: "Quay lại" },
  "Send test to candidate": { en: "Send test to candidate", vi: "Gửi bài test cho ứng viên" },
  "Choose a test and enter candidate info to send test link": {
    en: "Choose a test and enter candidate info to send test link",
    vi: "Chọn bài test và nhập thông tin ứng viên để gửi link làm bài",
  },
  "Test sent successfully!": { en: "Test sent successfully!", vi: "Gửi bài test thành công!" },
  "Redirecting to assignments list...": {
    en: "Redirecting to assignments list...",
    vi: "Đang chuyển hướng đến danh sách assignments...",
  },
  "An error occurred": { en: "An error occurred", vi: "Có lỗi xảy ra" },
  "Select test": { en: "Select test", vi: "Chọn bài test" },
  "-- Select test --": { en: "-- Select test --", vi: "-- Chọn bài test --" },
  "Candidate info": { en: "Candidate info", vi: "Thông tin ứng viên" },
  "Candidate email *": { en: "Candidate email *", vi: "Email ứng viên *" },
  "Enter candidate email": { en: "Enter candidate email", vi: "Nhập email ứng viên" },
  "Candidate name (optional)": { en: "Candidate name (optional)", vi: "Tên ứng viên (tùy chọn)" },
  "Enter candidate name": { en: "Enter candidate name", vi: "Nhập tên ứng viên" },

  "Send test": { en: "Send test", vi: "Gửi bài test" },

  "Please select a test": { en: "Please select a test", vi: "Vui lòng chọn bài test" },
  "Please enter candidate email": { en: "Please enter candidate email", vi: "Vui lòng nhập email ứng viên" },
  "Invalid email": { en: "Invalid email", vi: "Email không hợp lệ" },
  "Loading tests list...": { en: "Loading tests list...", vi: "Đang tải danh sách test..." },

  // === Company Result Detail ===
  "Loading result...": { en: "Loading result...", vi: "Đang tải kết quả..." },
  "Back to list": { en: "Back to list", vi: "Quay lại danh sách" },

  // Section Titles
  Overview: { en: "Overview", vi: "Tổng quan" },

  "Answer Details": { en: "Answer Details", vi: "Chi tiết câu trả lời" },

  // Pagination
  Previous: { en: "Previous", vi: "Trước" },
  Next: { en: "Next", vi: "Tiếp" },

  // === Company Packages & Subscription ===
  "Service Packages": { en: "Service Packages", vi: "Gói dịch vụ" },
  "Choose the right plan for your needs": {
    en: "Choose the right plan for your needs",
    vi: "Chọn gói phù hợp với nhu cầu của bạn",
  },
  "Subscribe successfully!": { en: "Subscribe successfully!", vi: "Đăng ký gói thành công!" },

  "Are you sure you want to subscribe to this package?": {
    en: "Are you sure you want to subscribe to this package?",
    vi: "Bạn có chắc chắn muốn đăng ký gói này?",
  },
  POPULAR: { en: "POPULAR", vi: "PHỔ BIẾN" },
  "CURRENT PACKAGE": { en: "CURRENT PACKAGE", vi: "GÓI HIỆN TẠI" },
  Max: { en: "Max", vi: "Tối đa" },
  assignments: { en: "assignments", vi: "lượt" },
  "Benefits:": { en: "Benefits:", vi: "Lợi ích:" },
  "Currently using": { en: "Currently using", vi: "Đang sử dụng" },
  "Processing...": { en: "Processing...", vi: "Đang xử lý..." },
  "Subscribe now": { en: "Subscribe now", vi: "Đăng ký ngay" },
  VND: { en: "VND", vi: "VNĐ" },
  "/month": { en: "/month", vi: "/tháng" },

  // Subscription Page
  "Current Subscription": { en: "Current Subscription", vi: "Gói hiện tại" },
  "Manage your subscription": { en: "Manage your subscription", vi: "Quản lý gói đăng ký của bạn" },
  "Upgrade package": { en: "Upgrade package", vi: "Nâng cấp gói" },
  Used: { en: "Used", vi: "Đã sử dụng" },
  Remaining: { en: "Remaining", vi: "Còn lại" },
  Active: { en: "Active", vi: "Đang hoạt động" },
  Inactive: { en: "Inactive", vi: "Không khả dụng" },
  "Package code": { en: "Package code", vi: "Mã gói" },
  Price: { en: "Price", vi: "Giá" },
  "from previous package": { en: "from previous package", vi: "từ gói trước" },

  // No subscription
  "No subscription yet": { en: "No subscription yet", vi: "Chưa có gói đăng ký" },
  "You haven't subscribed to any package. Choose a suitable plan to get started.": {
    en: "You haven't subscribed to any package. Choose a suitable plan to get started.",
    vi: "Bạn chưa đăng ký gói dịch vụ nào. Hãy chọn gói phù hợp để bắt đầu.",
  },
  "View packages": { en: "View packages", vi: "Xem các gói dịch vụ" },

  // Quick Actions

  Upgrade: { en: "Upgrade", vi: "Nâng cấp gói" },
  "Increase usage limit": { en: "Increase usage limit", vi: "Tăng giới hạn sử dụng" },
  "View stats": { en: "View stats", vi: "Xem thống kê" },
  "Hide stats": { en: "Hide stats", vi: "Ẩn thống kê" },
  "Track your usage": { en: "Track your usage", vi: "Theo dõi mức sử dụng" },

  // Chart
  "Assignment usage": { en: "Assignment usage", vi: "Mức tiêu dùng assignment" },

  "Number of assignments sent": { en: "Number of assignments sent", vi: "Số assignment đã gửi" },

  // === Admin Users ===
  "Manage Users": { en: "Manage Users", vi: "Quản lý Users" },
  "Total users in system": { en: "Total {count} users in system", vi: "Tổng số {count} users trong hệ thống" },
  "Loading users list...": { en: "Loading users list...", vi: "Đang tải danh sách users..." },
  "Add user": { en: "Add user", vi: "Thêm user" },
  "Total users": { en: "Total users", vi: "Tổng users" },
  Admins: { en: "Admins", vi: "Admins" },
  Companies: { en: "Companies", vi: "Companies" },
  Candidates: { en: "Candidates", vi: "Candidates" },
  "All roles": { en: "All roles", vi: "Tất cả roles" },
  User: { en: "User", vi: "User" },
  Role: { en: "Role", vi: "Role" },
  "Created Date": { en: "Created Date", vi: "Ngày tạo" },
  Information: { en: "Information", vi: "Thông tin" },
  "Are you sure you want to delete this user? This action cannot be undone.": {
    en: "Are you sure you want to delete this user? This action cannot be undone.",
    vi: "Bạn có chắc chắn muốn xoá user này? Hành động này không thể hoàn tác.",
  },
  "Delete user": { en: "Delete user", vi: "Xoá user" },

  // Create User Modal
  "Create new user": { en: "Create new user", vi: "Tạo người dùng mới" },
  "Full name *": { en: "Full name *", vi: "Họ và tên *" },
  "Enter full name": { en: "Enter full name", vi: "Nhập họ và tên" },
  "Email *": { en: "Email *", vi: "Email *" },
  "Enter email": { en: "Enter email", vi: "Nhập email" },
  "Password *": { en: "Password *", vi: "Mật khẩu *" },
  "Enter password": { en: "Enter password", vi: "Nhập mật khẩu" },
  "Role *": { en: "Role *", vi: "Vai trò *" },

  Company: { en: "Company", vi: "Công ty" },
  Admin: { en: "Admin", vi: "Admin" },
  "Company name *": { en: "Company name *", vi: "Tên công ty *" },

  "Create user": { en: "Create user", vi: "Tạo user" },
  "Creating...": { en: "Creating...", vi: "Đang tạo..." },
  "Please fill in all required fields": {
    en: "Please fill in all required fields",
    vi: "Vui lòng điền đầy đủ thông tin",
  },
  "Please enter company name": { en: "Please enter company name", vi: "Vui lòng nhập tên công ty" },
  "Error creating user": { en: "Error creating user", vi: "Có lỗi xảy ra khi tạo user" },

  // === Admin Companies ===
  "Manage Companies": { en: "Manage Companies", vi: "Quản lý Companies" },
  "Total companies": { en: "Total companies", vi: "Tổng companies" },

  "Total candidates": { en: "Total candidates", vi: "Tổng candidates" },
  "Current Package": { en: "Current Package", vi: "Gói hiện tại" },
  Assignments: { en: "Assignments", vi: "Assignments" },

  Analytics: { en: "Analytics", vi: "Phân tích" },
  "Hide analytics": { en: "Hide analytics", vi: "Ẩn phân tích" },
  "View analytics": { en: "View analytics", vi: "Xem phân tích" },
  "No subscription": { en: "No subscription", vi: "Chưa có" },
  Until: { en: "Until", vi: "Đến" },

  // === Company Analytics ===
  "Detailed company analytics": { en: "Detailed company analytics", vi: "Phân tích chi tiết công ty" },
  "Export PDF": { en: "Export PDF", vi: "Xuất PDF" },
  "Exporting...": { en: "Exporting...", vi: "Đang xuất..." },
  "Loading analytics...": { en: "Loading analytics...", vi: "Đang tải phân tích..." },
  "Failed to load analytics data": {
    en: "Failed to load analytics data",
    vi: "Không thể tải dữ liệu phân tích",
  },
  "No analytics data available for this company": {
    en: "No analytics data available for this company",
    vi: "Chưa có dữ liệu phân tích cho công ty này",
  },

  // Stats Cards

  "Avg per month": { en: "Avg per month", vi: "Trung bình/tháng" },
  "Number of test types": { en: "Number of test types", vi: "Số loại test" },
  "Most popular test": { en: "Most popular test", vi: "Test phổ biến" },

  // Charts
  "Assignments by month": { en: "Assignments by month", vi: "Số assignment theo tháng" },
  "Test selection trends": { en: "Test selection trends", vi: "Xu hướng chọn bài test" },

  "Test details": { en: "Test details", vi: "Chi tiết bài test" },
  times: { en: "times", vi: "lượt" },

  // === Admin Candidates ===
  "All Candidates": { en: "All Candidates", vi: "Tất cả ứng viên" },
  "Manage all candidates in the system": {
    en: "Manage all candidates in the system",
    vi: "Quản lý toàn bộ ứng viên trên hệ thống",
  },
  "Loading candidates list...": { en: "Loading candidates list...", vi: "Đang tải danh sách ứng viên..." },
  "Search by name or email": { en: "Search by name or email", vi: "Tìm theo tên hoặc email" },

  Email: { en: "Email", vi: "Email" },

  MBTI: { en: "MBTI", vi: "MBTI" },

  "No candidates found": { en: "No candidates found", vi: "Không có ứng viên nào" },

  // Detail Page
  "Candidate Detail": { en: "Candidate Detail", vi: "Chi tiết ứng viên" },

  "Loading candidate detail...": {
    en: "Loading candidate detail...",
    vi: "Đang tải chi tiết ứng viên...",
  },

  // Candidate Info
  "Completed at": { en: "Completed at", vi: "Hoàn thành lúc" },
  // === Admin Tests ===
  "Manage Tests": { en: "Manage Tests", vi: "Quản lý Tests" },
  "Total tests": { en: "Total tests", vi: "Tổng tests" },

  "Create new test": { en: "Create new test", vi: "Tạo test mới" },
  "Search test...": { en: "Search test...", vi: "Tìm kiếm test..." },

  Questions: { en: "Questions", vi: "Câu hỏi" },
  "Total attempts": { en: "Total attempts", vi: "Tổng lượt làm" },

  System: { en: "System", vi: "System" },
  "View details": { en: "View details", vi: "Xem chi tiết" },

  Delete: { en: "Delete", vi: "Xóa" },
  "Are you sure you want to delete this test?": {
    en: "Are you sure you want to delete this test?",
    vi: "Bạn có chắc chắn muốn xóa test này?",
  },
  "Test deleted successfully!": { en: "Test deleted successfully!", vi: "Xóa test thành công!" },

  "Edit Test": { en: "Edit Test", vi: "Chỉnh sửa Test" },
  "Create New Test": { en: "Create New Test", vi: "Tạo Test Mới" },
  "Update test successfully!": { en: "Update test successfully!", vi: "Cập nhật test thành công!" },
  "Create test successfully!": { en: "Create test successfully!", vi: "Tạo test thành công!" },
  "Redirecting...": { en: "Redirecting...", vi: "Đang chuyển hướng..." },
  "Basic Information": { en: "Basic Information", vi: "Thông tin cơ bản" },
  "Test title *": { en: "Test title *", vi: "Tiêu đề test *" },
  "Enter test title": { en: "Enter test title", vi: "Nhập tiêu đề test" },

  "Enter description": { en: "Enter description", vi: "Mô tả về test..." },
  "Activate test": { en: "Activate test", vi: "Kích hoạt test" },
  "Questions ({count})": { en: "Questions ({count})", vi: "Câu hỏi ({count})" },
  "Add question": { en: "Add question", vi: "Thêm câu hỏi" },
  "Question {number}": { en: "Question {number}", vi: "Câu {number}" },
  "Question content *": { en: "Question content *", vi: "Nội dung câu hỏi *" },
  "Enter question content": { en: "Enter question content", vi: "Nhập nội dung câu hỏi..." },
  "Question type": { en: "Question type", vi: "Loại câu hỏi" },
  "Single choice": { en: "Single choice", vi: "Chọn 1 đáp án" },
  "Multiple choice": { en: "Multiple choice", vi: "Chọn nhiều đáp án" },
  Scale: { en: "Scale", vi: "Thang đo" },
  "Dimension (E/I, S/N, T/F, J/P)": {
    en: "Dimension (E/I, S/N, T/F, J/P)",
    vi: "Dimension (E/I, S/N, T/F, J/P)",
  },
  "Enter dimension": { en: "Enter dimension", vi: "Ví dụ: E/I" },
  "Answers *": { en: "Answers *", vi: "Câu trả lời *" },
  "Add answer": { en: "Add answer", vi: "+ Thêm câu trả lời" },
  "Answer {number}": { en: "Answer {number}", vi: "Câu trả lời {number}" },

  "Remove question": { en: "Remove question", vi: "Xóa câu hỏi" },
  "Remove answer": { en: "Remove answer", vi: "Xóa câu trả lời" },
  "Add first question": { en: "Add first question", vi: "Thêm câu hỏi đầu tiên" },
  "No questions yet": { en: "No questions yet", vi: "Chưa có câu hỏi nào" },

  "Update Test": { en: "Update Test", vi: "Cập nhật Test" },
  "Create Test": { en: "Create Test", vi: "Tạo Test" },
  "Please enter test title": { en: "Please enter test title", vi: "Vui lòng nhập tiêu đề test" },
  "Please add at least 1 question": {
    en: "Please add at least 1 question",
    vi: "Vui lòng thêm ít nhất 1 câu hỏi",
  },
  "Question cannot be empty": { en: "Question cannot be empty", vi: "Câu hỏi không được để trống" },
  "Need at least 2 answers": { en: "Need at least 2 answers", vi: "Cần ít nhất 2 câu trả lời" },
  "Answer cannot be empty": { en: "Answer cannot be empty", vi: "Câu trả lời không được để trống" },
  "Error saving test": { en: "Error saving test", vi: "Có lỗi xảy ra khi {action} test" },

  // Thêm vào object `dynamicTranslations` trong file src/libs/translations.ts

  // === Admin Dashboard ===
  "Hello, Admin": { en: "Hello, Admin", vi: "Xin chào, Admin" },
  "Welcome back to admin dashboard": {
    en: "Welcome back to admin dashboard",
    vi: "Chào mừng trở lại với dashboard quản trị",
  },
  "Export report": { en: "Export report", vi: "Xuất báo cáo" },
  "Total completions": { en: "Total completions", vi: "Tổng lượt hoàn thành" },
  "Unique candidates": { en: "Unique candidates", vi: "Ứng viên duy nhất" },

  "Active companies": { en: "Active companies", vi: "Công ty đang hoạt động" },
  "Completions by time": { en: "Completions by time", vi: "Lượt hoàn thành theo thời gian" },
  "System-wide MBTI distribution": {
    en: "System-wide MBTI distribution",
    vi: "Phân bố MBTI toàn hệ thống",
  },
  "Activity by company": { en: "Activity by company", vi: "Hoạt động theo công ty" },
  "Most taken tests": { en: "Most taken tests", vi: "Bài test được làm nhiều nhất" },
  "Recent activity": { en: "Recent activity", vi: "Hoạt động gần đây" },
  "View all →": { en: "View all →", vi: "Xem tất cả →" },
  completions: { en: "completions", vi: "lượt" },
  people: { en: "people", vi: "người" },
  companies: { en: "companies", vi: "công ty" },

  // === Admin Packages ===
  "Manage Packages": { en: "Manage Packages", vi: "Quản lý Packages" },

  "Create new package": { en: "Create new package", vi: "Tạo package mới" },
  "Are you sure you want to delete this package?": {
    en: "Are you sure you want to delete this package?",
    vi: "Bạn có chắc chắn muốn xóa package này?",
  },
  "Package deleted successfully!": { en: "Package deleted successfully!", vi: "Xóa package thành công!" },
  "Create Package": { en: "Create Package", vi: "Tạo Package" },
  "Edit Package": { en: "Edit Package", vi: "Chỉnh sửa Package" },
  "Package created successfully!": { en: "Package created successfully!", vi: "Tạo package thành công!" },
  "Package updated successfully!": { en: "Package updated successfully!", vi: "Cập nhật package thành công!" },

  "Package name *": { en: "Package name *", vi: "Tên package *" },
  "Enter package name": { en: "Enter package name", vi: "Basic Plan" },
  "Package code *": { en: "Package code *", vi: "Mã package *" },
  "Enter package code": { en: "Enter package code", vi: "basic" },
  "Activate this package": { en: "Activate this package", vi: "Kích hoạt package này" },
  Pricing: { en: "Pricing", vi: "Giá" },
  "Price (VND/month) *": { en: "Price (VND/month) *", vi: "Giá (VNĐ/tháng) *" },
  "Enter price": { en: "Enter price", vi: "100000" },
  Limits: { en: "Limits", vi: "Giới hạn" },
  "Max assignments *": { en: "Max assignments *", vi: "Số assignment tối đa *" },
  "Enter max assignments": { en: "Enter max assignments", vi: "10" },
  "Description (optional)": { en: "Description (optional)", vi: "Mô tả (tùy chọn)" },

  "Features (benefits)": { en: "Features (benefits)", vi: "Tính năng (benefits)" },
  "Example: Priority support": { en: "Example: Priority support", vi: "Ví dụ: Hỗ trợ ưu tiên" },
  "Add feature": { en: "Add feature", vi: "+ Thêm tính năng" },
  Remove: { en: "Remove", vi: "Xóa" },

  "Please enter package name": { en: "Please enter package name", vi: "Vui lòng nhập tên package" },
  "Please enter package code": { en: "Please enter package code", vi: "Vui lòng nhập mã package" },
  "Price must be greater than 0": { en: "Price must be greater than 0", vi: "Giá phải lớn hơn 0" },
  "Max assignments must be greater than 0": {
    en: "Max assignments must be greater than 0",
    vi: "Số assignment phải lớn hơn 0",
  },
  "Error saving package": { en: "Error saving package", vi: "Có lỗi xảy ra khi {action} package" },

  // Package list item

  "Created on": { en: "Created on", vi: "Tạo ngày" },

  "No packages yet": { en: "No packages yet", vi: "Chưa có package nào" },

  benefits: { en: "benefits", vi: "quyền lợi khác" },

  // Tiếp tục thêm ở đây
};
// src/libs/translations.ts

const fieldTranslations: Record<string, Record<"en" | "vi", string>> = {
  // IDs
  id: { en: "ID", vi: "Mã" },
  test_id: { en: "Test ID", vi: "Mã bài kiểm tra" },
  test_version_id: { en: "Test Version ID", vi: "Mã phiên bản bài kiểm tra" },
  question_id: { en: "Question ID", vi: "Mã câu hỏi" },
  answer_id: { en: "Answer ID", vi: "Mã đáp án" },
  user_id: { en: "User ID", vi: "Mã người dùng" },
  assessment_id: { en: "Assessment ID", vi: "Mã bài làm" },
  company_id: { en: "Company ID", vi: "Mã công ty" },
  package_id: { en: "Package ID", vi: "Mã gói" },
  mbti_type_id: { en: "MBTI Type ID", vi: "Mã loại MBTI" },

  // General
  title: { en: "Title", vi: "Tiêu đề" },
  description: { en: "Description", vi: "Mô tả" },
  name: { en: "Name", vi: "Tên" },
  code: { en: "Code", vi: "Mã" },
  type: { en: "Type", vi: "Loại" },
  text: { en: "Text", vi: "Nội dung" },
  status: { en: "Status", vi: "Trạng thái" },
  is_active: { en: "Active", vi: "Kích hoạt" },

  // Time-related
  created_at: { en: "Created At", vi: "Ngày tạo" },
  updated_at: { en: "Updated At", vi: "Cập nhật lần cuối" },
  deleted_at: { en: "Deleted At", vi: "Ngày xóa" },
  started_at: { en: "Started At", vi: "Bắt đầu lúc" },
  completed_at: { en: "Completed At", vi: "Hoàn thành lúc" },
  last_seen_at: { en: "Last Seen", vi: "Lần cuối hoạt động" },
  expires_at: { en: "Expires At", vi: "Hết hạn lúc" },
  start_date: { en: "Start Date", vi: "Ngày bắt đầu" },
  end_date: { en: "End Date", vi: "Ngày kết thúc" },

  // Ordering & Index
  order_index: { en: "Order", vi: "Thứ tự" },
  version_number: { en: "Version", vi: "Phiên bản" },
  selected_option_index: { en: "Selected Option", vi: "Lựa chọn" },

  // Users & Profiles
  full_name: { en: "Full Name", vi: "Họ và tên" },
  email: { en: "Email", vi: "Email" },
  password: { en: "Password", vi: "Mật khẩu" },
  avatar: { en: "Avatar", vi: "Ảnh đại diện" },
  role: { en: "Role", vi: "Vai trò" },
  education: { en: "Education", vi: "Học vấn" },
  experience: { en: "Experience", vi: "Kinh nghiệm" },
  about: { en: "About", vi: "Giới thiệu" },
  social_links: { en: "Social Links", vi: "Liên kết mạng xã hội" },
  guest_email: { en: "Guest Email", vi: "Email khách" },
  guest_fullname: { en: "Guest Full Name", vi: "Họ tên khách" },

  // Companies
  domain: { en: "Domain", vi: "Tên miền" },
  website: { en: "Website", vi: "Website" },
  logo_url: { en: "Logo URL", vi: "URL logo" },
  address: { en: "Address", vi: "Địa chỉ" },
  phone: { en: "Phone", vi: "Số điện thoại" },

  // Tests & Questions
  dimension: { en: "Dimension", vi: "Chiều" },
  score: { en: "Score", vi: "Điểm" },
  free_text: { en: "Free Text", vi: "Văn bản tự do" },

  // Packages & Subscriptions
  max_assignments: { en: "Max Assignments", vi: "Số lượt giao tối đa" },
  used_assignments: { en: "Used Assignments", vi: "Lượt đã dùng" },
  carry_over_assignments: { en: "Carry-over Assignments", vi: "Lượt chuyển tiếp" },
  price_per_month: { en: "Price per Month", vi: "Giá mỗi tháng" },
  benefits: { en: "Benefits", vi: "Quyền lợi" },

  // MBTI Types
  type_code: { en: "Type Code", vi: "Mã loại" },
  type_name: { en: "Type Name", vi: "Tên loại" },
  overview: { en: "Overview", vi: "Tổng quan" },
  strengths: { en: "Strengths", vi: "Điểm mạnh" },
  weaknesses: { en: "Weaknesses", vi: "Điểm yếu" },
  career_recommendations: { en: "Career Recommendations", vi: "Đề xuất nghề nghiệp" },
  improvement_areas: { en: "Improvement Areas", vi: "Khu vực cải thiện" },
  workplace_needs: { en: "Workplace Needs", vi: "Nhu cầu nơi làm việc" },
  suitable_roles: { en: "Suitable Roles", vi: "Vai trò phù hợp" },
  communication_style: { en: "Communication Style", vi: "Phong cách giao tiếp" },
  leadership_style: { en: "Leadership Style", vi: "Phong cách lãnh đạo" },
  stress_responses: { en: "Stress Responses", vi: "Phản ứng khi căng thẳng" },
  development_tips: { en: "Development Tips", vi: "Gợi ý phát triển" },

  // MBTI Dimensions
  dimension_code: { en: "Dimension Code", vi: "Mã chiều" },
  dimension_name: { en: "Dimension Name", vi: "Tên chiều" },
  high_trait: { en: "High Trait", vi: "Đặc điểm cao" },
  high_trait_description: { en: "High Trait Description", vi: "Mô tả đặc điểm cao" },
  low_trait: { en: "Low Trait", vi: "Đặc điểm thấp" },
  low_trait_description: { en: "Low Trait Description", vi: "Mô tả đặc điểm thấp" },

  // Career Paths
  role_title: { en: "Role Title", vi: "Chức danh" },
  industry: { en: "Industry", vi: "Ngành" },
  skills_needed: { en: "Skills Needed", vi: "Kỹ năng cần có" },
  development_path: { en: "Development Path", vi: "Lộ trình phát triển" },
  salary_range: { en: "Salary Range", vi: "Mức lương" },
  job_satisfaction_factors: { en: "Job Satisfaction Factors", vi: "Yếu tố hài lòng công việc" },
  potential_challenges: { en: "Potential Challenges", vi: "Thách thức tiềm ẩn" },

  // AI & Logging
  model: { en: "Model", vi: "Mô hình" },
  prompt: { en: "Prompt", vi: "Prompt" },
  response: { en: "Response", vi: "Phản hồi" },
  scores: { en: "Scores", vi: "Điểm số" },

  // OTP
  otp: { en: "OTP", vi: "Mã OTP" },
  purpose: { en: "Purpose", vi: "Mục đích" },

  // Results
  mbti_type: { en: "MBTI Type", vi: "Loại MBTI" },
  raw_scores: { en: "Raw Scores", vi: "Điểm thô" },
};
export function useDynamicTranslation() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  const tContent = (text: string) => dynamicTranslations[text]?.[lang] || text;
  const tField = (field: string) => fieldTranslations[field]?.[lang] || field;

  return { tContent, tField };
}
