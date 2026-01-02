export interface StateData {
  slug: string;
  name: string;
  ageRequirement: number;
  cardFee: number;
  description: string;
}

export interface FormSubmission {
  id: string;
  fullName: string;
  email: string;
  age: number;
  medicalCondition: string;
  state: string;
  agreedToPrivacy: boolean;
  submittedAt: string;
}
