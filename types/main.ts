export interface SessionData {
  isLoggedIn: boolean;
  onboarded: boolean;
  accessToken: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  emailIsVerified: boolean;
  role: string;
  // status: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  onboarded: false,
  accessToken: "",
  userId: 0,
  firstName: "",
  lastName: "",
  email: "",
  emailIsVerified: false,
  role: "",
  // status: "",
};

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  state: string;
  gender: string;
  dob: string;
  phone: string;
  wallet_balance: number;
  user_type: string;
  block_status: number;
  postal_code: string;
  blood_group: string;
  genotype: string;
  medication: string;
  is_done_step_one: string;
  has_confirmed_phone_number: string;
  is_done_step_two: string;
  has_done_full: string;
  bio_data_confirmed: number;
  profile_verified: number;
  upload_result: null;
  email: string;
  family_history: string;
  image: string;
  address: string;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
}
