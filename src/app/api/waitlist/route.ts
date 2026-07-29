import { NextResponse } from 'next/server';

// In-memory array to simulate local storage for waitlist entries during runtime
// In production on Vercel serverless functions, this memory state resets between cold starts.
// TODO: connect to email service (e.g. Mailchimp, Resend, ConvertKit, or a database like Supabase) for permanent persistence.
const waitlistStorage: { email: string; size?: string; color?: string; createdAt: string }[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, size, color } = body;

    // Validate email presence and simple regex structure
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanedEmail = email.trim().toLowerCase();

    // Check if email already registered in session
    const existing = waitlistStorage.find((entry) => entry.email === cleanedEmail);
    if (!existing) {
      waitlistStorage.push({
        email: cleanedEmail,
        size: size || 'Unspecified',
        color: color || 'Unspecified',
        createdAt: new Date().toISOString(),
      });
    }

    // Console log to verify in terminal logs
    console.log(`[ROVE Waitlist New Entry]: ${cleanedEmail} | Color: ${color || 'N/A'} | Size: ${size || 'N/A'}`);

    return NextResponse.json(
      {
        success: true,
        message: 'You have been added to the Drop 001 priority list.',
        entryCount: waitlistStorage.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
