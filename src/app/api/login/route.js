import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
export async function POST(req) {
  const { email, password } = await req.json();

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid email or password' }), {
      status: 401,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid email or password' }), {
      status: 401,
    });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET, 
    { expiresIn: '1h' } 
  );
  return new Response(JSON.stringify({ success: true, message: 'Login successful',token }), {
    status: 200,
  });
}
