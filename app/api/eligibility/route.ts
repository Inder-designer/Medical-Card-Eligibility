import { NextRequest, NextResponse } from 'next/server';
import { FormSubmission } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import { submissionSchema } from '@/components/formik/submissions/validations';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.json();
        const body = await submissionSchema.validate(rawBody, {
            abortEarly: false,
        });

        const submission: FormSubmission = {
            ...body,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

    } catch (error: unknown) {
        if (error) {
            return NextResponse.json(
                { error: 'Validation failed', details: error },
                { status: 400 }
            );
        }

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
