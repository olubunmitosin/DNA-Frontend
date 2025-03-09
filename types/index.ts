export type TimelineItemType = {
  id: number;
  title: string;
  description: string;
  // time: string;
};

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[];
  translations: Record<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: string;
  longitude: string;
}
export interface CategoriesDatum {
  id: number;
  name: string;
}

export interface MainCategories {
  status: boolean;
  message: string;
  data: CategoriesDatum[];
}

export interface ArticlesDatum {
  id: number;
  title: string;
  image: string;
  body: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  category: CategoriesDatum | null;
}

export interface AriclesMain {
  status: boolean;
  message: string;
  data: ArticlesDatum[];
}

export interface WalletPaymentInitialized {
  status: boolean;
  message: string;
  initiate_payment_data: {
    access_code: string;
    reference: string;
    authorization_url: string;
  };
}

export interface DropOffDatum {
  id: number;
  sampleId: string;
  sample_process: string;
  test_performed: string;

  created_at: null;
  status: string;
  pickup_date: Date;
  pickup_time: string;
  sample_type: string;
  collection_date: Date;
  collection_time: string;
  custody_started: string;
  relationship_donor: string;
  address: string;
  dropoff_address: string;
}

export interface MainSropOff {
  status: boolean;
  message: string;
  data: DropOffDatum[];
}
export interface PickupDatum {
  id: number;
  sampleId: string;
  sample_process: string;
  test_performed: string;

  created_at: null;
  additional_information: null;
  status: string;
  pickup_date: Date;
  pickup_time: string;
  pickup_address: string;
}
export interface MaiPickUP {
  status: boolean;
  message: string;
  data: PickupDatum[];
}

export interface SamplesDatum {
  id: number;
  test_performed: string;
  sample_process: string | null;
  sample_type: null | string;
  sampleId: string;
  userid: number;
  collection_date: Date | null;
  collection_time: null | string;
  custody_started: null | string;
  relationship_donor: null | string;
  address: null | string;
  status: string | null;
  sample_result: null;
  pickup_date: Date | null;
  purpose_of_test: null | string;
  predisposing_condition: null | string;
  has_predisposing: null | string;
  instruction_accepted: null | string;
  processing_time: null;
  test_focus_area: null;
  pickup_time: null | string;
  dropoff_address: null | string;
  additional_information: null | string;
  pickup_address: null | string;
  created_at: null;
  updated_at: Date | null;
}

export interface AllSamplesD {
  status: boolean;
  message: string;
  data: SamplesDatum[];
}
export interface AllSampleD {
  status: boolean;
  message: string;
  data: SamplesDatum;
}
