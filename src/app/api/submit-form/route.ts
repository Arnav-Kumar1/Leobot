import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { responses, userEmail } = data;

    if (!responses) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 });
    }

    const submissionData = {
      timestamp: new Date().toISOString(),
      userEmail: userEmail || 'anonymous',
      totalResponses: Object.keys(responses).length,
      responses: responses,
      submissionComplete: true
    };

    // Log complete submission (you can access this in Vercel Function logs)
    console.log('=== MINDCLONE FORM SUBMISSION ===');
    console.log('Timestamp:', submissionData.timestamp);
    console.log('User Email:', submissionData.userEmail);
    console.log('Total Responses:', submissionData.totalResponses);
    console.log('Complete Data:', JSON.stringify(submissionData, null, 2));
    console.log('=== END SUBMISSION ===');

    // Here you could add email functionality using services like:
    // - Resend.com
    // - SendGrid
    // - Nodemailer with Gmail
    // - EmailJS (client-side)

    // For now, return success with the data logged
    return NextResponse.json({ 
      message: 'Form submitted successfully! Data has been logged.',
      timestamp: submissionData.timestamp,
      responseCount: submissionData.totalResponses
    }, { status: 200 });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ 
      error: 'Failed to submit form' 
    }, { status: 500 });
  }
}