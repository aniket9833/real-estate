import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../src/models/Admin';

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!uri) throw new Error('MONGODB_URI is not set in .env.local');
  if (!email || !password) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before seeding.',
    );
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name: 'Owner' },
    { upsert: true, new: true },
  );

  console.log(`✔ Admin account ready: ${admin.email}`);
  console.log(
    'You can now log in at /admin/login with this email and the password you set in ADMIN_PASSWORD.',
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
