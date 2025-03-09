import { NewspaperIcon } from "lucide-react";

// import ChartBarIcon from "@/icons/chart-bar-icon";
import DashboardIcon from "@/icons/dashboard-icon";
import DNAIcon from "@/icons/dna-icon";
import SettingsIcon from "@/icons/settings";
// import SharedWithMeIcon from "@/icons/shared-with-me";

import { allRoutes } from "./routes";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  dropdownItems?: {
    name: string;
    href: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }[];
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: allRoutes.dashboard.url,
    icon: DashboardIcon,
  },
  {
    name: "Sample Management",
    href: allRoutes.SampleManagement.url,
    icon: DNAIcon,
  },
  {
    name: "News",
    href: allRoutes.news.url,
    icon: NewspaperIcon,
  },
  {
    name: "Sample Submission",
    href: allRoutes.Sample.url,
    icon: DNAIcon,
  },

  // {
  //   name: "Reports",
  //   href: allRoutes.reports.url,
  //   icon: ChartBarIcon,
  // },
  // {
  //   name: "Shared With Me",
  //   href: allRoutes.shared.url,
  //   icon: SharedWithMeIcon,
  // },
  {
    name: "Settings",
    href: allRoutes.settings.url,
    icon: SettingsIcon,
  },
];
export const roles = [
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "Customer",
    value: "customer",
  },
];
export const testTypes = [
  {
    name: "Genetic Test",
    value: "genetic-test",
  },
  {
    name: "Paternity Test",
    value: "paternity-test",
  },
  {
    name: "Maternity Test",
    value: "maternity-test",
  },
  {
    name: "Relationship Test",
    value: "relationship-test",
  },
  {
    name: "Ancestry Tracing",
    value: "ancestry-tracing",
  },
];

export const sampleTypes = [
  {
    name: "Buccal Swab",
    value: "buccal-swab",
  },
  {
    name: "Blood Sample",
    value: "blood-sample",
  },
  {
    name: "Hair Follicle",
    value: "hair-follicle",
  },
  {
    name: "Others",
    value: "others",
  },
];

export const sampleStatuses = [
  {
    value: "Active",
    name: "Active",
  },
  {
    name: "Draft",
    value: "draft",
  },
  {
    value: "pending",
    name: "Pending",
  },
  {
    value: "Processing",
    name: "Processing",
  },
];
export const dropOffAddress = [
  {
    name: "St. Mary's Hospital & Maternity",
    desc: "10 John Nwodo Cl · 0903 282 3830",
    value: "option-one",
  },
  {
    name: "Niger Foundation Hospital",
    desc: "5 Presidential Close, off Alvan Ikoku St · 0706 569 3009",
    value: "option-two",
  },
  {
    name: "Park Lane Specialist Hospital",
    desc: "FF6V+HC4, Park Ln",
    value: "option-three",
  },
];

export const meansOfIdentification = [
  {
    name: "NIN",
    value: "nin",
  },
  {
    name: "International Passport",
    value: "international-passport",
  },
  {
    name: "Driver's License",
    value: "drivers-license",
  },
];

export const purposeOfTesting = [
  {
    name: "Clinical Diagnosis",
    value: "clinical-diagnosis",
  },
  {
    name: "Carrier Screening",
    value: "carrier-screening",
  },
  {
    name: "Ancestry",
    value: "ancestry",
  },
  {
    name: "Pharmacogenomics",
    value: "pharmacogenomics",
  },
];

export const geneticTestRequired = [
  {
    name: "Whole Genome Sequencing (WGS)",
    value: "whole-genome-sequencing",
  },
  {
    name: "Whole Exome Sequencing (WES)",
    value: "whole-exome-sequencing",
  },
  {
    name: "Targeted Sequencing",
    value: "targeted-sequencing",
  },
  {
    name: "Single Gene Sequencing",
    value: "single-gene-sequencing",
  },
  {
    name: "Polygenic Risk Score (PRS)",
    value: "polygenic-risk-score",
  },
  {
    name: "Other (Specify)",
    value: "other",
  },
];

export const testFocusArea = [
  {
    name: "Hereditary Diseases",
    value: "hereditary-diseases",
  },
  {
    name: "Cancer Predisposition",
    value: "cancer-predisposition",
  },
  {
    name: "Reproductive Health",
    value: "reproductive-health",
  },
  {
    name: "Pharmacogenomics",
    value: "pharmacogenomics",
  },
  {
    name: "Nutrigenomics",
    value: "nutrigenomics",
  },
  {
    name: "Other (Specify)",
    value: "other",
  },
];

export const processingTime = [
  {
    name: "Standard Processing",
    time: "2 - 4 weeks",
    value: "standard-processing",
    units: 5,
  },
  {
    name: "Express Processing",
    time: "1 week",
    value: "express-processing",
    units: 10,
  },
];
