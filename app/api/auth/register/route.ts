import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role,
        company: validatedData.company,
      },
    });

    // If EMPLOYER role, claim any guest jobs with matching email
    if (validatedData.role === 'EMPLOYER') {
      await db.job.updateMany({
        where: {
          email: validatedData.email,
          userId: null, // Only claim unclaimed jobs
        },
        data: {
          userId: user.id,
        },
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Send welcome email (non-blocking, failures won't prevent registration)
    sendWelcomeEmail({
      to: user.email,
      name: user.name,
      role: user.role as 'EMPLOYER' | 'JOB_SEEKER',
      company: user.company || undefined,
    }).catch((err) => {
      console.error('Failed to send welcome email (non-blocking):', err);
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
