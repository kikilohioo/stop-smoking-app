export type DBCigarType = {
  id?: number;
  intensity: number;
  motive_id: number;
  social: number;
  emotional: number;
  conductual: number;
  physiological: number;
  trigger_id: number | undefined;
  place_id: number;
  person_id: number | undefined;
  date_time: string;
};

export type DBCigarPersonType = {
  id?: number;
  cigar_id: number;
  person_id: number;
  name?: string;
};

export type DBMotiveType = {
  id?: number;
  name: string;
  social: number;
  emotional: number;
  conductual: number;
  physiological: number;
};

export type DBLeaveMotiveType = {
  id?: number;
  name: string;
  description: string;
};

export type DBPlaceType = {
  id?: number;
  name: string;
};

export type DBPersonType = {
  id?: number;
  name: string;
};

export type DBTriggerType = {
  id?: number;
  name: string;
};

export type Spheres = {
  social: number;
  emotional: number;
  conductual: number;
  physiological: number;
};

export type MotiveFormData = {
  id?: number;
  name: string;
  spheres: Spheres;
};

export type CigarFormData = {
  id?: number;
  spheres: Spheres;
  persons: number[];
  intensity: number;
  motive_id: number;
  trigger_id: number;
  place_id: number;
  date_time: string;
};

export type Seeder<T> = {
  table: string;
  data: T[];
};
