// import { useEffect, useState } from "react";
// import {
//   Download,
//   Share2,
//   Briefcase,
//   Users,
//   MessageSquare,
//   Target,
//   TrendingUp,
//   AlertCircle,
//   Menu,
//   X,
// } from "lucide-react";

// type ResponseItem = {
//   id: string;
//   question_id: string;
//   answer_id: string | null;
//   free_text: string | null;
// };

// type QuestionWithAnswers = {
//   id: string;
//   text: string;
//   dimension: string;
//   answers: { id: string; text: string }[];
// };

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

// export default function ResultsPage() {
//   const [assessmentId] = useState("demo-123");
//   const [result, setResult] = useState<{ mbti_type: string } | null>(null);
//   const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     // Simulate API call with demo data
//     setTimeout(() => {
//       setResult({ mbti_type: "INTJ" });
//       setDimensionCounts({
//         "E (Extroversion)": 15,
//         "I (Introversion)": 35,
//         "S (Sensing)": 20,
//         "N (Intuition)": 30,
//         "T (Thinking)": 40,
//         "F (Feeling)": 10,
//         "J (Judging)": 32,
//         "P (Perceiving)": 18,
//       });
//       setLoading(false);
//     }, 800);
//   }, []);

//   const handleDownloadPDF = () => {
//     window.print();
//   };

//   const handleShare = async () => {
//     const shareUrl = window.location.href;
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `MBTI Result: ${result?.mbti_type}`,
//           text: "Check out my MBTI assessment result",
//           url: shareUrl,
//         });
//       } catch (err) {
//         console.error("Share failed:", err);
//       }
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       alert("Link copied to clipboard!");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-lg text-gray-600">Loading your result...</div>
//       </div>
//     );
//   }

//   if (!result) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center text-red-500 py-12">Result not found</div>
//       </div>
//     );
//   }

//   const mbtiData = MBTI_DATABASE[result.mbti_type] || MBTI_DATABASE.INTJ;
//   const maxDimension = Math.max(...Object.values(dimensionCounts), 1);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm print:hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-bold text-gray-900">MBTI Assessment</h1>
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               <button
//                 onClick={handleShare}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//               >
//                 <Share2 className="w-4 h-4 mr-2" />
//                 Share
//               </button>
//               <button
//                 onClick={handleDownloadPDF}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Download PDF
//               </button>
//             </div>
//             <div className="md:hidden">
//               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-700">
//                 {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>
//         </div>
//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 py-4 px-4 space-y-2">
//             <button
//               onClick={handleShare}
//               className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             >
//               <Share2 className="w-4 h-4 mr-2" />
//               Share
//             </button>
//             <button
//               onClick={handleDownloadPDF}
//               className="w-full flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Download PDF
//             </button>
//           </div>
//         )}
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6 print:mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">Professional MBTI Report</h2>
//           <p className="text-gray-600 mt-1">Comprehensive personality assessment for workplace success</p>
//         </div>

//         {/* Main Result Card */}
//         <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-8 sm:p-12 mb-8 text-white">
//           <div className="text-center">
//             <div className="text-6xl sm:text-7xl font-bold mb-3">{mbtiData.type}</div>
//             <div className="text-xl sm:text-2xl opacity-90 mb-4">
//               {mbtiData.type === "INTJ"
//                 ? "The Architect"
//                 : mbtiData.type === "ENTJ"
//                   ? "The Commander"
//                   : mbtiData.type === "INFP"
//                     ? "The Mediator"
//                     : mbtiData.type === "ENFP"
//                       ? "The Campaigner"
//                       : mbtiData.type === "ISTJ"
//                         ? "The Logistician"
//                         : "The Executive"}
//             </div>
//             <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">{mbtiData.description}</p>
//           </div>
//         </div>

//         {/* Dimension Analysis Graph */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//             <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
//             Dimension Analysis
//           </h3>
//           <div className="space-y-4">
//             {Object.entries(dimensionCounts).map(([dimension, count]) => (
//               <div key={dimension}>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold text-gray-700 text-sm sm:text-base">{dimension}</span>
//                   <span className="text-sm text-gray-600">{count} responses</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
//                     style={{ width: `${(count / maxDimension) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
//           {/* Strengths */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
//               <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
//               Strengths
//             </h3>
//             <ul className="space-y-3">
//               {mbtiData.strengths.map((strength, idx) => (
//                 <li key={idx} className="flex items-start">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
//                   <span className="text-gray-700 text-sm sm:text-base">{strength}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Weaknesses */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
//               <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-600" />
//               Areas for Development
//             </h3>
//             <ul className="space-y-3">
//               {mbtiData.weaknesses.map((weakness, idx) => (
//                 <li key={idx} className="flex items-start">
//                   <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
//                   <span className="text-gray-700 text-sm sm:text-base">{weakness}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Work Style */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
//             Work Style & Communication
//           </h3>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Preferred Working Methods</h4>
//               <ul className="space-y-2">
//                 {mbtiData.workStyle.map((style, idx) => (
//                   <li key={idx} className="flex items-start">
//                     <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
//                     <span className="text-gray-700 text-sm">{style}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Communication Style</h4>
//               <ul className="space-y-2">
//                 {mbtiData.communicationStyle.map((style, idx) => (
//                   <li key={idx} className="flex items-start">
//                     <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
//                     <span className="text-gray-700 text-sm">{style}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Ideal Roles */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
//             Ideal Roles
//           </h3>
//           <div className="flex flex-wrap gap-2 sm:gap-3">
//             {mbtiData.idealRoles.map((role, idx) => (
//               <span
//                 key={idx}
//                 className="px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium"
//               >
//                 {role}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Role Compatibility */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
//             <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" />
//             Role Compatibility
//           </h3>
//           <div className="space-y-4">
//             {Object.entries(mbtiData.roleCompatibility)
//               .sort(([, a], [, b]) => b - a)
//               .map(([role, score]) => (
//                 <div key={role}>
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-semibold text-gray-700 text-sm sm:text-base">{role}</span>
//                     <span className="text-sm font-bold text-gray-900">{score}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className={`h-3 rounded-full transition-all duration-500 ${
//                         score >= 80
//                           ? "bg-gradient-to-r from-green-500 to-green-600"
//                           : score >= 60
//                             ? "bg-gradient-to-r from-blue-500 to-blue-600"
//                             : "bg-gradient-to-r from-yellow-500 to-yellow-600"
//                       }`}
//                       style={{ width: `${score}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row gap-4 pb-8 print:hidden">
//           <button
//             onClick={() => window.history.back()}
//             className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//           >
//             Back to Assessments
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Save as PDF
//           </button>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style>{`
//         @media print {
//           body {
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//           .print\\:mb-8 {
//             margin-bottom: 2rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
