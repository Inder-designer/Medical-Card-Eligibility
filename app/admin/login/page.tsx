'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '@/components/FormInput';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoginError('');
    try {
      await login(values.username, values.password);
      router.push('/admin/submissions');
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          {/* Login Form */}
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormInput
                  label="Username"
                  name="username"
                  placeholder="admin"
                  required
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-semibold px-8 py-3 rounded-lg transition-all text-white ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Demo Credentials:</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Admin:</strong> admin / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
