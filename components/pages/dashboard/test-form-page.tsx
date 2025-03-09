"use client";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronRight, CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

import PageTitleHeader from "@/components/shared/page-title-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { geneticTestRequired, testFocusArea } from "@/constants";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/sample-submission";

const TestFormPage = () => {
  const [isPending, startTransition] = useTransition();

  const { updateFormData, formData } = useFormStore();
  const [selectedTests, setSelectedTests] = useState<string[]>(
    formData.testForm?.purposeOfTesting
      ? formData.testForm?.purposeOfTesting
      : []
  );
  const [preCondition, setPreCondition] = useState(
    formData.testForm?.predisposingCondition
      ? formData.testForm.predisposingCondition
      : ""
  );
  const [conditionType, setConditionType] = useState(
    formData.testForm?.predisposingConditionDetails
      ? formData.testForm.predisposingConditionDetails
      : ""
  );
  const [typeOfTest, setTypeOfTest] = useState(
    formData.testForm?.typeOfGeneticTest
      ? formData.testForm.typeOfGeneticTest
      : ""
  );
  const [testFocusAreas, setTestFocusAreas] = useState(
    formData.testForm?.testFocusArea ? formData.testForm.testFocusArea : ""
  );
  const router = useRouter();
  const [formStage, setFormStage] = React.useState(1);

  // Test options
  const tests = [
    { id: "clinical", name: "Clinical Diagnosis" },
    { id: "carrier", name: "Carrier Screening" },
    { id: "pathology", name: "Ancestry" },
    { id: "pharma", name: "Pharmacogenomics" },
  ];

  // Handle checkbox change
  const handleCheckboxChange = (testId: string, isChecked: CheckedState) => {
    if (isChecked) {
      setSelectedTests((prev) => [...prev, testId]); // Add to selection
    } else {
      setSelectedTests((prev) => prev.filter((id) => id !== testId)); // Remove from selection
    }
  };

  function calculateProgress() {
    if (formStage < 2) {
      return 0; // No progress for formStage 1
    }
    return ((formStage - 1) / 4) * 100; // Calculate progress starting from stage 2
  }

  const progressValue = calculateProgress();

  const handlePurposeOfTest = () => {
    if (updateFormData) {
      updateFormData("testForm", {
        ...formData.testForm,
        purposeOfTesting: Array.isArray(selectedTests) ? selectedTests : [],
      });

      setFormStage((prev) => prev + 1);
    }
  };
  const handlePreDisposingCondition = () => {
    if (updateFormData) {
      updateFormData("testForm", {
        ...formData.testForm,
        predisposingCondition: preCondition,
      });

      if (preCondition === "yes") {
        setFormStage((prev) => prev + 1);
      } else {
        router.push(
          "/dashboard/sample-submission/submission-process/instructions/booking-details"
        );
      }
    }
  };
  const handleConditionDetails = () => {
    if (updateFormData) {
      updateFormData("testForm", {
        ...formData.testForm,
        predisposingConditionDetails: conditionType,
      });
      setFormStage((prev) => prev + 1);
    }
  };
  const handleGeneticTest = () => {
    if (updateFormData) {
      updateFormData("testForm", {
        ...formData.testForm,
        typeOfGeneticTest: typeOfTest,
      });
      setFormStage((prev) => prev + 1);
    }
  };
  const handleTestFocus = () => {
    startTransition(() => {
      if (updateFormData) {
        updateFormData("testForm", {
          ...formData.testForm,
          testFocusArea: testFocusAreas,
        });
        router.push(
          "/dashboard/sample-submission/submission-process/instructions/booking-details"
        );
      }
    });
  };

  const renderStage = () => {
    if (formStage === 1) {
      return (
        <div className="space-y-5 bg-white p-4">
          <h2>1. Purpose of Testing [Choose all that apply]</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`group flex h-[131px] flex-col items-start justify-between rounded-sm border p-4 
          ${selectedTests.includes(test.id) ? "bg-primary" : "bg-white"} 
          border-[#E9E9E9]`}
              >
                <Label
                  className={cn(
                    "flex w-full items-center justify-between text-sm font-normal text-[#767676]",
                    selectedTests.includes(test.id) && "text-white"
                  )}
                >
                  {test.name} <CircleAlert className="size-4" />
                </Label>
                <Checkbox
                  className={cn(
                    "checkers peer size-4 border-[#D5D7DA] data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  )}
                  checked={selectedTests.includes(test.id)}
                  onCheckedChange={(isChecked) =>
                    handleCheckboxChange(test.id, isChecked)
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-5">
            <Button onClick={handlePurposeOfTest}>
              Proceed <ChevronRight className="ms-2" />
            </Button>
            <Button variant={"link"} className="p-0 underline">
              Cancel
            </Button>
          </div>
        </div>
      );
    } else if (formStage === 2) {
      return (
        <div className="space-y-5 bg-white p-4">
          <Select
            onValueChange={(e) => setPreCondition(e)}
            defaultValue={preCondition}
          >
            <Label>Do you have any predisposing conditions</Label>

            <SelectTrigger className="!no-focus h-[50px] rounded-[10px] border  border-[#E5E5EA] bg-transparent shadow-none dark:bg-dark-400 dark:text-light-300">
              <SelectValue placeholder="Select one" className="!no-focus" />
            </SelectTrigger>

            <SelectContent className="">
              {["yes", "no"].map((provider) => (
                <SelectItem
                  key={provider}
                  value={String(provider)}
                  className="mb-3 flex cursor-pointer py-3 hover:!bg-accent focus:!bg-accent"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span>{provider}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-5">
            <Button onClick={handlePreDisposingCondition}>
              Proceed <ChevronRight className="ms-2" />
            </Button>
            <Button variant={"link"} className="p-0 underline">
              Cancel
            </Button>
          </div>
        </div>
      );
    } else if (formStage === 3) {
      return (
        <div className="space-y-5 bg-white p-4">
          <Select onValueChange={(e) => setConditionType(e)}>
            <Label>Is this condition from Paternal or Maternal?</Label>

            <SelectTrigger className="!no-focus dark:light-border-2 h-[50px] rounded-[10px] border  border-[#E5E5EA] bg-transparent shadow-none dark:bg-dark-400 dark:text-light-300">
              <SelectValue placeholder="Select one" className="!no-focus" />
            </SelectTrigger>

            <SelectContent className="">
              {["maternal", "paternal"].map((provider) => (
                <SelectItem
                  key={provider}
                  value={String(provider)}
                  className="mb-3 flex cursor-pointer py-3 hover:!bg-accent focus:!bg-accent"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="capitalize">{provider}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-5">
            <Button onClick={handleConditionDetails}>
              Proceed <ChevronRight className="ms-2" />
            </Button>
            <Button variant={"link"} className="p-0 underline">
              Cancel
            </Button>
          </div>
        </div>
      );
    } else if (formStage === 4) {
      return (
        <div className="space-y-5 bg-white p-4">
          <Select onValueChange={(e) => setTypeOfTest(e)}>
            <Label>Type of Genetic Test Requested </Label>

            <SelectTrigger className="!no-focus dark:light-border-2 h-[50px] rounded-[10px] border  border-[#E5E5EA] bg-transparent shadow-none dark:bg-dark-400 dark:text-light-300">
              <SelectValue placeholder="Select one" className="!no-focus" />
            </SelectTrigger>

            <SelectContent className="">
              {geneticTestRequired.map((provider) => (
                <SelectItem
                  key={provider.value}
                  value={String(provider.value)}
                  className="mb-3 flex cursor-pointer py-3 hover:!bg-accent focus:!bg-accent"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="capitalize">{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-5">
            <Button onClick={handleGeneticTest}>
              Proceed <ChevronRight className="ms-2" />
            </Button>
            <Button variant={"link"} className="p-0 underline">
              Cancel
            </Button>
          </div>
        </div>
      );
    } else if (formStage === 5) {
      return (
        <div className="space-y-5 bg-white p-4">
          <Select onValueChange={(e) => setTestFocusAreas(e)}>
            <Label>Test Focus Area </Label>

            <SelectTrigger className="!no-focus dark:light-border-2 h-[50px] rounded-[10px] border  border-[#E5E5EA] bg-transparent shadow-none dark:bg-dark-400 dark:text-light-300">
              <SelectValue placeholder="Select one" className="!no-focus" />
            </SelectTrigger>

            <SelectContent className="">
              {testFocusArea.map((provider) => (
                <SelectItem
                  key={provider.value}
                  value={String(provider.value)}
                  className="mb-3 flex cursor-pointer py-3 hover:!bg-accent focus:!bg-accent"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="capitalize">{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-5">
            <Button
              onClick={handleTestFocus}
              className="flex items-center"
              disabled={isPending}
            >
              {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              Proceed <ChevronRight className="ms-2" />
            </Button>
            <Button variant={"link"} className="p-0 underline">
              Cancel
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageTitleHeader page="Test Form" />

      <div className="flex h-[75px] items-center bg-white px-[22px] py-[32px]">
        <Progress value={progressValue} />
      </div>
      {renderStage()}
    </div>
  );
};

export default TestFormPage;
