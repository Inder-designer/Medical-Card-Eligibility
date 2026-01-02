import * as Yup from "yup";

export const submissionSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    age: Yup.number()
        .min(18, 'Age must be at least 18')
        .max(120, 'Age must be less than 120')
        .required('Age is required')
        .typeError('Age must be a number'),
    medicalCondition: Yup.string()
        .min(10, 'Please provide more details (at least 10 characters)')
        .required('Medical condition is required'),
    agreedToPrivacy: Yup.boolean()
        .oneOf([true], 'You must agree to the privacy policy')
        .required('You must agree to the privacy policy'),
});
export const backendSubmissionSchema = Yup.object({
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  age: Yup.number().required(),
  medicalCondition: Yup.string().required(),
  state: Yup.string().required(),
  agreedToPrivacy: Yup.boolean().oneOf([true]).required(),
});