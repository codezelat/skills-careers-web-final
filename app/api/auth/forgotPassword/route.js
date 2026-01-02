import { connectToDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await connectToDatabase();
    const db = client.db();
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'If the email exists, a reset link will be sent' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate token
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await db.collection('users').updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } }
    );

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/resetPassword?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);
    return new Response(JSON.stringify({ message: 'Reset email sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}