import { NextRequest, NextResponse } from 'next/server';
import { FormSubmission } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.age || !body.medicalCondition || !body.state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (typeof body.age !== 'number' || body.age < 18 || body.age > 120) {
      return NextResponse.json(
        { error: 'Invalid age. Must be between 18 and 120' },
        { status: 400 }
      );
    }

    if (!body.agreedToPrivacy) {
      return NextResponse.json(
        { error: 'You must agree to the privacy policy' },
        { status: 400 }
      );
    }

    const submission: FormSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullName: body.fullName,
      email: body.email,
      age: body.age,
      medicalCondition: body.medicalCondition,
      state: body.state,
      agreedToPrivacy: body.agreedToPrivacy,
      submittedAt: new Date().toISOString(),
    };

    const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
    let submissions: FormSubmission[] = [];

    try {
      const data = await fs.readFile(submissionsPath, 'utf-8');
      submissions = JSON.parse(data);
    } catch (error) {
      submissions = [];
    }

    submissions.push(submission);

    await fs.writeFile(submissionsPath, JSON.stringify(submissions, null, 2));

    return NextResponse.json(
      { 
        success: true,
        message: 'Application submitted successfully',
        submissionId: submission.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
    
    try {
      const data = await fs.readFile(submissionsPath, 'utf-8');
      const submissions = JSON.parse(data);
      return NextResponse.json({ submissions });
    } catch {
      return NextResponse.json({ submissions: [] });
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
