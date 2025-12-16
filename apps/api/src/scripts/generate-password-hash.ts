// scripts/generate-password-hash.ts
import * as bcrypt from 'bcrypt';

async function generateHash() {
  const password = process.argv[2];
  if (!password) {
    console.error(
      'Usage: bun run scripts/generate-password-hash.ts <password>',
    );
    process.exit(1);
  }

  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hashed}`);
}

generateHash();
