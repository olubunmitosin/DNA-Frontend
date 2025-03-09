/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DropOffDetails,
  PickupDetails,
  TestFormDetails,
} from "@/lib/validations";

// import { FormData } from "@/lib/validations";
export interface FormData {
  testType: string;
  sampleID: string;
  submissionProcess: "pickup" | "dropoff";
  instructionsAccepted: boolean;
  testForm?: TestFormDetails;
  dropOffDetails?: DropOffDetails;
  pickupDetails?: PickupDetails;
}

interface FormStore {
  formData: FormData;
  updateFormData?: (key: keyof FormData, value: any) => void; // Mark as optional
  resetForm?: () => void; // Mark as optional
}

const useFormStore = create(
  persist<FormStore>(
    (set) => ({
      formData: {
        testType: "", // Default values
        sampleID: "",
        submissionProcess: "pickup",
        instructionsAccepted: false,
        testForm: undefined,
        dropOffDetails: undefined,
        pickupDetails: undefined,
      },
      updateFormData: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),
      resetForm: () =>
        set(() => ({
          formData: {
            testType: "",
            sampleID: "",
            submissionProcess: "pickup",
            instructionsAccepted: false,
            testForm: undefined,

            dropOffDetails: undefined,
            pickupDetails: undefined,
          },
        })),
    }),
    {
      name: "form-storage", // Key in localStorage
      partialize: (state) => ({
        formData: state.formData, // Only persist formData
      }),
    }
  )
);

export default useFormStore;
