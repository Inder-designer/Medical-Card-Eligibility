'use client';

import { Field, ErrorMessage } from 'formik';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea';
  rows?: number;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  as = 'input',
  rows
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field name={name}>
        {({ field, meta }: any) => (
          <>
            {as === 'textarea' ? (
              <textarea
                {...field}
                id={name}
                rows={rows || 4}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border ${
                  meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
            ) : (
              <input
                {...field}
                type={type}
                id={name}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border ${
                  meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
            )}
          </>
        )}
      </Field>
      <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-500" />
    </div>
  );
}
