# MBTI Platform – Monorepo

Một nền tảng đánh giá tính cách MBTI chuyên nghiệp, hỗ trợ **4 cổng người dùng** với phân quyền rõ ràng.

## 🎯 Các cổng người dùng

- **Admin**: Quản trị hệ thống, tạo & quản lý bài test
- **Company**: Gửi assignment, xem kết quả ứng viên
- **User**: Làm bài test, xem kết quả cá nhân
- **Guest**: Làm bài test thông qua link email từ công ty

---

## 🏗️ Kiến trúc dự án

Dự án được xây dựng theo kiến trúc **Monorepo**, sử dụng:

- **Turborepo** – quản lý build & cache
- **Bun** – package manager & runtime

### Các ứng dụng & package chính

- **`apps/api`** – Backend NestJS (PostgreSQL + Supabase)
- **`apps/web`** – Frontend React (Vite + TanStack Router)
- **`apps/docs`** – Tài liệu kỹ thuật (Next.js)
- **`packages/ui`** – Thư viện UI chia sẻ
- **`packages/eslint-config`** – Cấu hình ESLint dùng chung
- **`packages/typescript-config`** – Cấu hình TypeScript dùng chung

---

## 🛠️ Yêu cầu hệ thống

- **Node.js** ≥ 18.x
- **Bun** ≥ 1.0 (khuyến nghị)  
  👉 Cài đặt: https://bun.sh/docs/installation

---

## 🚀 Hướng dẫn nhanh

### 1. Cài đặt dependencies

```bash
bun install
```
