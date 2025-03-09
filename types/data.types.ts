export const sampleStatus = {
  active: "Active",
  processing: "Processing",
};

export const testTypesEnum = {
  "genetic-test": "Genetic Test",
  "paternity-test": "Paternity Test",
  "maternity-test": "Maternity Test",
  "relationship-test": "Relationship Test",
  "ancestry-tracing": "Ancestry Tracing",
};
export type StatusType = keyof typeof sampleStatus;
export type TestType = keyof typeof testTypesEnum;
