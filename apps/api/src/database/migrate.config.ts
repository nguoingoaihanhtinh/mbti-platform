// migrate.config.js
module.exports = {
  migrationDirectory: './src/database/migrations',
  // DÙNG SERVICE ROLE KEY → bypass RLS, có quyền full DB
  connectionString: `${process.env.SUPABASE_URL}/postgres?sslmode=require&password=${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  migrationsSchema: 'public',
};
