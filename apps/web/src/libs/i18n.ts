// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translations (bạn sẽ bổ sung dần)
// src/i18n.ts

const resources = {
  en: {
    translation: {
      // --- Existing
      welcome: "Welcome",
      login: "Login",
      dashboard: "Dashboard",
      users: "Users",
      tests: "Tests",

      // --- NEW: AppShell (Layout)
      assignments: "Assignments",
      packages: "Packages",
      current_subscription: "Current Subscription",
      company_info: "Company Information",
      all_tests: "All Tests",
      about_mbti: "About MBTI",
      profile_settings: "Profile Settings",
      logout: "Logout",

      // --- Roles (for display)
      candidate: "Candidate",
      company: "Company",

      // --- Profile Sidebar Labels
      role: "ROLE",
      education: "EDUCATION",
      social: "SOCIAL",
      linkedin: "LinkedIn",
      github: "GitHub",

      // --- User Info
      user_id: "User ID",

      overview: "Overview",
      companies: "Companies",
      service_packages: "Service Packages",

      candidates: "Candidates",

      platform_name: "H&HIS",
      platform_slogan: "HIRE MASTER, GROW FASTER",
      hr_company: "HR Company",
    },
  },
  vi: {
    translation: {
      // --- Existing
      welcome: "Chào mừng",
      login: "Đăng nhập",
      dashboard: "Bảng điều khiển",
      users: "Người dùng",
      tests: "Bài kiểm tra",

      // --- NEW: AppShell (Layout)
      assignments: "Bài được giao",
      packages: "Gói dịch vụ",
      current_subscription: "Gói hiện tại",
      company_info: "Thông tin công ty",
      all_tests: "Tất cả bài kiểm tra",
      about_mbti: "Giới thiệu MBTI",
      profile_settings: "Cài đặt hồ sơ",
      logout: "Đăng xuất",

      // --- Roles
      candidate: "Ứng viên",
      company: "Doanh nghiệp",

      // --- Profile Sidebar Labels
      role: "VAI TRÒ",
      education: "HỌC VẤN",
      social: "MẠNG XÃ HỘI",
      linkedin: "LinkedIn",
      github: "GitHub",

      // --- User Info
      user_id: "Mã người dùng",
      // === HR Shell ===
      overview: "Tổng quan",
      companies: "Công ty",
      service_packages: "Gói dịch vụ",
      candidates: "Danh sách khách hàng",
      platform_name: "H&HIS",
      platform_slogan: "HIRE MASTER, GROW FASTER",
      hr_company: "HR Company",
    },
  },
};

i18n
  .use(LanguageDetector) // Tự detect ngôn ngữ browser + localStorage
  .use(initReactI18next) // Kết nối với React
  .init({
    resources,
    fallbackLng: "en", // Nếu không detect được thì dùng en
    supportedLngs: ["en", "vi"],
    detection: {
      order: ["localStorage", "navigator"], // Ưu tiên localStorage trước
      caches: ["localStorage"], // Lưu vào localStorage khi change
    },
    interpolation: {
      escapeValue: false, // React đã tự escape
    },
  });

export default i18n;
