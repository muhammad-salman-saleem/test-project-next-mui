import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password } = await req.json(); 

  await connectToDatabase(); 

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ success: true, message: 'User inserted successfully', user: newUser }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'User insertion failed', error: error.message }), {
      status: 500,
    });
  }
}
