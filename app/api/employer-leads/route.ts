import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employerLeadSchema } from '@/lib/validations';
import { sanitizeAttribution } from '@/lib/attribution';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const input = employerLeadSchema.parse(await request.json());
    const { attribution, ...data } = input;
    const touch = sanitizeAttribution(attribution);
    const lead = await db.employerLead.create({
      data: {
        ...data,
        locations: data.locations || null,
        notes: data.notes || null,
        firstTouch: touch.firstTouch || undefined,
        lastTouch: touch.lastTouch || undefined,
      },
    });

    sendContactFormEmail({
      name: data.name,
      email: data.workEmail,
      inquiryType: 'employer',
      subject: `${data.inquiryType.replaceAll('_', ' ')} — ${data.company}`,
      message: `Roles: ${data.roles}\nLocations: ${data.locations || 'Not specified'}\nVolume: ${data.hiringVolume}\nTimeline: ${data.timeline}\nNotes: ${data.notes || 'None'}`,
    }).catch((error) => console.error('Employer lead notification failed:', error));

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Please review the highlighted information.', details: error.errors }, { status: 400 });
    }
    console.error('Employer lead persistence failed:', error);
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 });
  }
}
