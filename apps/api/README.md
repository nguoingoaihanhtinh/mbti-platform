````markdown
# MBTI Platform – Backend (NestJS)

API quản lý toàn bộ logic nghiệp vụ: user, test, assessment, MBTI scoring.

---

## 🛠️ Công nghệ

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT + Bcrypt + Supabase Auth integration
- **Validation**: class-validator
- **Pagination**: Custom service
- **Migration**: `pg-migrate`
- **Lint**: ESLint + `@repo/eslint-config`

---

## ▶️ Chạy ứng dụng

### Phát triển (local)

```bash
# Từ thư mục gốc: chạy toàn bộ
bun dev

# Từ thư mục apps/api: chỉ backend
bun run start:dev
```
````

## Cơ sở dữ liệu

### Môi trường

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:...@your-project.supabase.co:5432/postgres

### Migration

```bash
# Chạy toàn bộ migration
bun run migrate:up

# Hoặc chạy trực tiếp
export $(grep -v '^#' .env | xargs) && bun run migrate:up
```

### Cấu trúc DB

    users / companies: Quản lý tài khoản
    tests / questions / answers: Bài test MBTI
    assessments / responses: Làm bài test
    results / mbti_types: Kết quả & mô tả tính cách
    packages / company_subscriptions: Gói dịch vụ cho công ty

## API Documentation

Swagger: http://localhost:3000/api (khi chạy dev)

## Testing

```bash
# Unit test
bun run test

# E2E test
bun run test:e2e
```

## Cấu trúc

src/
├── modules/ # Các module NestJS (auth, assessment, test, v.v.)
├── database/ # Supabase provider + migration
├── common/ # Dịch vụ dùng chung (pagination, validation)
├── types/ # TypeScript interfaces
└── scripts/ # Script tiện ích (generate hash, migrate)
