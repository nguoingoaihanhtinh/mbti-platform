// type MBTIData = {
//   type: string;
//   description: string;
//   strengths: string[];
//   weaknesses: string[];
//   workStyle: string[];
//   communicationStyle: string[];
//   idealRoles: string[];
//   roleCompatibility: {
//     Leader: number;
//     Sales: number;
//     Marketing: number;
//     Creative: number;
//     Technical: number;
//     Administrative: number;
//   };
// };

// const MBTI_DATABASE: Record<string, MBTIData> = {
//   INTJ: {
//     type: "INTJ",
//     description:
//       "Chiến lược gia - Người có tư duy hệ thống, sáng tạo và quyết đoán. Luôn có tầm nhìn dài hạn và khả năng lập kế hoạch tuyệt vời.",
//     strengths: [
//       "Tư duy chiến lược và phân tích sâu",
//       "Độc lập và tự chủ cao",
//       "Khả năng giải quyết vấn đề phức tạp",
//       "Tập trung vào mục tiêu dài hạn",
//       "Quyết đoán và kiên định",
//     ],
//     weaknesses: [
//       "Có thể quá lý thuyết, thiếu thực tế",
//       "Khó khăn trong giao tiếp cảm xúc",
//       "Thiếu kiên nhẫn với chi tiết nhỏ",
//       "Có thể cứng nhắc với kế hoạch",
//       "Ít chú ý đến yếu tố con người",
//     ],
//     workStyle: [
//       "Làm việc độc lập hiệu quả",
//       "Tập trung vào chiến lược và tầm nhìn",
//       "Ưa thích môi trường có cấu trúc rõ ràng",
//       "Luôn tìm kiếm cải tiến và tối ưu hóa",
//     ],
//     communicationStyle: [
//       "Giao tiếp trực tiếp và logic",
//       "Tập trung vào ý tưởng và khái niệm",
//       "Ưa thích cuộc họp có nội dung cụ thể",
//       "Đánh giá cao sự chính xác",
//     ],
//     idealRoles: [
//       "Giám đốc chiến lược",
//       "Kiến trúc sư hệ thống",
//       "Nhà phân tích dữ liệu",
//       "Giám đốc sản phẩm",
//       "Chuyên gia tư vấn",
//     ],
//     roleCompatibility: {
//       Leader: 90,
//       Technical: 95,
//       Creative: 70,
//       Sales: 50,
//       Marketing: 65,
//       Administrative: 60,
//     },
//   },
//   ENTJ: {
//     type: "ENTJ",
//     description: "Nhà lãnh đạo - Người có khả năng lãnh đạo mạnh mẽ, quyết đoán và có tầm nhìn chiến lược.",
//     strengths: [
//       "Khả năng lãnh đạo tự nhiên",
//       "Tư duy chiến lược xuất sắc",
//       "Quyết đoán và hành động nhanh",
//       "Giao tiếp thuyết phục",
//       "Tổ chức và quản lý hiệu quả",
//     ],
//     weaknesses: [
//       "Có thể quá cứng rắn",
//       "Thiếu kiên nhẫn với người chậm",
//       "Đôi khi bỏ qua cảm xúc",
//       "Có xu hướng áp đặt",
//       "Khó chấp nhận thất bại",
//     ],
//     workStyle: [
//       "Dẫn dắt và động viên team",
//       "Tập trung vào kết quả",
//       "Làm việc với mục tiêu rõ ràng",
//       "Thích môi trường thử thách",
//     ],
//     communicationStyle: [
//       "Giao tiếp trực tiếp và mạnh mẽ",
//       "Thuyết phục và tự tin",
//       "Tập trung vào hành động",
//       "Ưa thích tranh luận logic",
//     ],
//     idealRoles: [
//       "CEO/Giám đốc điều hành",
//       "Giám đốc kinh doanh",
//       "Quản lý dự án",
//       "Chuyên viên chiến lược",
//       "Nhà tư vấn quản lý",
//     ],
//     roleCompatibility: {
//       Leader: 98,
//       Sales: 85,
//       Marketing: 80,
//       Technical: 70,
//       Creative: 65,
//       Administrative: 60,
//     },
//   },
//   INFP: {
//     type: "INFP",
//     description: "Nhà lý tưởng - Người sáng tạo, có lòng trắc ẩn sâu sắc và luôn tìm kiếm ý nghĩa trong công việc.",
//     strengths: [
//       "Sáng tạo và giàu trí tưởng tượng",
//       "Đồng cảm và hiểu người khác",
//       "Linh hoạt và cởi mở",
//       "Tận tâm với giá trị cá nhân",
//       "Khả năng viết và diễn đạt tốt",
//     ],
//     weaknesses: [
//       "Quá lý tưởng hóa",
//       "Khó ra quyết định nhanh",
//       "Dễ bị căng thẳng khi xung đột",
//       "Thiếu tính thực tế",
//       "Khó chấp nhận phê bình",
//     ],
//     workStyle: [
//       "Làm việc theo cảm hứng",
//       "Cần môi trường hòa hợp",
//       "Tập trung vào ý nghĩa công việc",
//       "Ưa thích sự linh hoạt",
//     ],
//     communicationStyle: [
//       "Giao tiếp nhẹ nhàng và thấu hiểu",
//       "Tránh xung đột trực tiếp",
//       "Diễn đạt bằng ẩn dụ và câu chuyện",
//       "Lắng nghe tốt",
//     ],
//     idealRoles: [
//       "Nhà văn/Content Creator",
//       "Nhà tâm lý học",
//       "Nhà thiết kế UX",
//       "Chuyên viên nhân sự",
//       "Giáo viên/Đào tạo",
//     ],
//     roleCompatibility: {
//       Creative: 95,
//       Marketing: 75,
//       Administrative: 65,
//       Sales: 55,
//       Leader: 50,
//       Technical: 60,
//     },
//   },
//   ENFP: {
//     type: "ENFP",
//     description: "Nhà vận động - Người nhiệt tình, sáng tạo và có khả năng truyền cảm hứng cho người khác.",
//     strengths: [
//       "Nhiệt tình và tràn đầy năng lượng",
//       "Sáng tạo và đa tài",
//       "Giao tiếp xuất sắc",
//       "Linh hoạt và thích nghi tốt",
//       "Khả năng kết nối con người",
//     ],
//     weaknesses: [
//       "Dễ bị phân tâm",
//       "Khó hoàn thành chi tiết",
//       "Thiếu tính kiên trì",
//       "Quá lạc quan",
//       "Khó quản lý thời gian",
//     ],
//     workStyle: [
//       "Làm việc theo nhóm hiệu quả",
//       "Cần sự đa dạng trong công việc",
//       "Thích môi trường năng động",
//       "Khám phá ý tưởng mới",
//     ],
//     communicationStyle: [
//       "Giao tiếp nhiệt tình và cởi mở",
//       "Truyền cảm hứng cho người khác",
//       "Chia sẻ ý tưởng liên tục",
//       "Tạo không khí tích cực",
//     ],
//     idealRoles: ["Chuyên viên Marketing", "HR Manager", "Event Planner", "Consultant", "Sales Representative"],
//     roleCompatibility: {
//       Marketing: 95,
//       Sales: 90,
//       Creative: 85,
//       Leader: 75,
//       Administrative: 50,
//       Technical: 55,
//     },
//   },
//   ISTJ: {
//     type: "ISTJ",
//     description: "Nhà quản lý - Người có trách nhiệm, đáng tin cậy và tập trung vào chi tiết.",
//     strengths: [
//       "Có trách nhiệm cao",
//       "Tỉ mỉ và chính xác",
//       "Đáng tin cậy và kiên định",
//       "Tổ chức công việc tốt",
//       "Tuân thủ quy trình",
//     ],
//     weaknesses: [
//       "Cứng nhắc với quy tắc",
//       "Khó thích nghi với thay đổi",
//       "Thiếu linh hoạt",
//       "Ít sáng tạo",
//       "Khó bày tỏ cảm xúc",
//     ],
//     workStyle: [
//       "Làm việc có hệ thống",
//       "Tuân thủ deadline nghiêm túc",
//       "Tập trung vào chất lượng",
//       "Ưa thích quy trình rõ ràng",
//     ],
//     communicationStyle: [
//       "Giao tiếp chính xác và ngắn gọn",
//       "Tập trung vào sự thật",
//       "Ưa thích văn bản hơn nói",
//       "Truyền đạt thông tin cụ thể",
//     ],
//     idealRoles: ["Accountant", "Project Manager", "Quality Control", "Administrative Manager", "Operations Manager"],
//     roleCompatibility: {
//       Administrative: 95,
//       Technical: 85,
//       Leader: 75,
//       Sales: 55,
//       Marketing: 50,
//       Creative: 45,
//     },
//   },
//   ESTJ: {
//     type: "ESTJ",
//     description: "Nhà điều hành - Người có khả năng quản lý, tổ chức và thực thi hiệu quả.",
//     strengths: [
//       "Khả năng tổ chức xuất sắc",
//       "Quyết đoán và hành động",
//       "Quản lý người tốt",
//       "Đáng tin cậy",
//       "Thực tế và logic",
//     ],
//     weaknesses: [
//       "Có thể quá cứng nhắc",
//       "Thiếu sự linh hoạt",
//       "Ít quan tâm cảm xúc",
//       "Khó chấp nhận ý kiến khác",
//       "Áp lực cao với team",
//     ],
//     workStyle: ["Dẫn dắt team mạnh mẽ", "Tạo cấu trúc rõ ràng", "Tập trung vào hiệu quả", "Đưa ra quyết định nhanh"],
//     communicationStyle: [
//       "Giao tiếp trực tiếp và rõ ràng",
//       "Đưa ra chỉ đạo cụ thể",
//       "Không ngại đối đầu",
//       "Tập trung vào kết quả",
//     ],
//     idealRoles: ["Operations Director", "Sales Manager", "Business Manager", "General Manager", "COO"],
//     roleCompatibility: {
//       Leader: 95,
//       Administrative: 90,
//       Sales: 85,
//       Technical: 70,
//       Marketing: 65,
//       Creative: 50,
//     },
//   },
// };
