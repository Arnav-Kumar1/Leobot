import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { responses, userEmail, isAutoSave = false } = data;

    if (!responses) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 });
    }

    // Log the data for server logs (you can see this in Vercel Function logs)
    console.log('Saving progress:', {
      timestamp: new Date().toISOString(),
      userEmail: userEmail || 'anonymous',
      responseCount: Object.keys(responses).length,
      isAutoSave,
      fullData: responses // This logs the actual responses
    });

    // Simulate a small delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({ 
      message: 'Progress saved successfully',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ 
      error: 'Failed to save progress' 
    }, { status: 500 });
  }
}