'use client';

import { useParams, useRouter } from 'next/navigation';
import { use } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FormInput from '@/components/FormInput';
import { submissionSchema } from '@/components/formik/submissions/validations';
import { getSubmissionInitialValue } from '@/components/formik/submissions/initialValues';

interface ApplyPageProps {
    params: Promise<{ slug: string }>;
}
export default function ApplyPage({ params }: ApplyPageProps) {
    console.log({ params });

    const { slug } = useParams();
    const router = useRouter();

    const handleSubmit = async (values: any, { setSubmitting }: any) => {

        try {
            const response = await fetch('/api/eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    state: slug,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/state/${slug}/success?name=${encodeURIComponent(values.fullName)}`);
            } else {
                alert(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Eligibility Application
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Please fill out the form below to check your eligibility.
                    </p>

                    <Formik
                        initialValues={getSubmissionInitialValue}
                        validationSchema={submissionSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <FormInput
                                    label="Full Name"
                                    name="fullName"
                                    placeholder="John Doe"
                                    required
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                />

                                <FormInput
                                    label="Age"
                                    name="age"
                                    type="number"
                                    placeholder="25"
                                    required
                                />

                                <FormInput
                                    label="Medical Condition"
                                    name="medicalCondition"
                                    as="textarea"
                                    rows={4}
                                    placeholder="Please describe your medical condition..."
                                    required
                                />

                                {/* Privacy Agreement */}
                                <div className="mb-6">
                                    <label className="flex items-start">
                                        <Field
                                            type="checkbox"
                                            name="agreedToPrivacy"
                                            className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I agree to the privacy policy and consent to the collection and use of my personal information. <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <ErrorMessage name="agreedToPrivacy" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 font-semibold px-8 py-3 rounded-lg transition-all ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            } text-white`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
