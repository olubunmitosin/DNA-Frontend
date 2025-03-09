import * as z from "zod";

import {
  SetupPasswordCSchema,
  validateEmail,
  validatePassword,
} from "./common-rules";

export const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: validateEmail,
  password: SetupPasswordCSchema,
});

export const ResetPasswordSchema = z.object({
  email: validateEmail,
});
export const LoginSchema = z.object({
  email: validateEmail,
  password: validatePassword,
  rememberMe: z.boolean().default(false),
});
export const onboardingStepOneSchema = z.object({
  role: z.string(),
});

export const onboardingPersonalInfoSchema = z.object({
  dob: z.date(),
  gender: z.string(),
  phoneNumber: z.string(),
  email: validateEmail,
  address: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  bloodGroup: z.string(),
  genotype: z.string(),
  medications: z.string(),
  familyMedicalHistory: z.optional(z.string()),
});

export const updatePersonalInformationSchema = z.object({
  photo: z.optional(
    z
      .instanceof(File)
      .refine(
        (file) => file.type.includes("image") || file.type.includes("pdf"),
        {
          message: "Only image f or PDF files are allowed",
        }
      )
  ),
  name: z.optional(z.string()),
  dob: z.date(),
  gender: z.string(),
  phoneNumber: z.string(),
  email: validateEmail,
});
export const OTPSchema = z.object({
  otp: z.string(),
});
export const updatePersonalAddressSchema = z.object({
  address: z.optional(z.string()),
  state: z.optional(z.string()),
  country: z.optional(z.string()),
  zipCode: z.optional(z.string()),
});

export const updategeneralHealthInformationSchema = z.object({
  bloodGroup: z.optional(z.string()),
  genotype: z.optional(z.string()),
  medications: z.optional(z.string()),
  familyMedicalHistory: z.optional(z.string()),
});
export const bookingDropOffDetails = z.object({
  sampleType: z.string(),
  sampleCollectionDate: z.date(),
  sampleCollectionTime: z.date(),
  chaninOfCustody: z.string(),
  relationShipToDonor: z.string(),
  address: z.string(),
  pickUpDate: z.date(),
  pickUpTime: z.string(),
  processingTime: z.string(),
  consent: z.boolean().default(true),
  dropOffAddress: z.optional(z.string()),
});

export const bookingPickupDetails = z.object({
  pickupAddress: z.string(),
  pickupDate: z.date(),
  pickupTIme: z.string(),
  additionalInstructions: z.optional(z.string()),
  consent: z.boolean().default(true),
});

export const testFormSchema = z.object({
  purposeOfTesting: z.array(z.string()),
  predisposingCondition: z.string(),
  predisposingConditionDetails: z.optional(z.string()),
  typeOfGeneticTest: z.string(),
  testFocusArea: z.string(),
});
// Shared Type for Zustand
export const formDataSchema = z.object({
  testType: z.string(), // e.g., "sample submission"
  submissionProcess: z.union([z.literal("pickup"), z.literal("dropoff")]),
  instructionsAccepted: z.boolean(),
  testForm: z.optional(testFormSchema),
  dropOffDetails: bookingDropOffDetails.optional(),
  pickupDetails: bookingPickupDetails.optional(),
});

export type FormData = z.infer<typeof formDataSchema>;
// Define formData types
export type DropOffDetails = z.infer<typeof bookingDropOffDetails>;
export type PickupDetails = z.infer<typeof bookingPickupDetails>;
export type TestFormDetails = z.infer<typeof testFormSchema>;

export const buyUnitsSchema = z.object({
  amount: z.string(),
  paymentMethod: z.string().optional(),
});

export const updatePersonalInfoSchema = z.object({
  dob: z.date(),
  gender: z.string(),
  phoneNumber: z.string(),
  email: validateEmail,
  address: z.string(),
  name: z.string(),
  meansOfIdentification: z.string(),
  identificationDoc: z
    .instanceof(File)
    .refine(
      (file) => file.type.includes("image") || file.type.includes("pdf"),
      {
        message: "Only image or PDF files are allowed",
      }
    ),
});
