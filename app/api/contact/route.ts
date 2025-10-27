import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Here you can:
    // 1. Store the contact message in the database (if you have a Contact model)
    // 2. Send an email notification to your support team
    // 3. Integrate with a CRM or ticketing system

    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      inquiryType: validatedData.inquiryType,
      subject: validatedData.subject,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
    });

    // In a production environment, you would send an email here
    // Example with nodemailer or similar:
    // await sendEmail({
    //   to: 'support@workindatacenter.com',
    //   from: validatedData.email,
    //   subject: `[Contact Form] ${validatedData.inquiryType} - ${validatedData.subject}`,
    //   text: `From: ${validatedData.name} (${validatedData.email})\n\nInquiry Type: ${validatedData.inquiryType}\n\nMessage:\n${validatedData.message}`,
    // });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24-48 hours.'
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
