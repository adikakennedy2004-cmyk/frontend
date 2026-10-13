type ScholarshipOpportunityRow = {
  slug: string;
  title: string;
  provider: string;
  category: string;
  award: string;
  deadline: string;
  location: string;
  summary: string;
  eligibility: string;
  created_at: string;
};

type ScholarshipApplicationRow = {
  id: string;
  scholarship_slug: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  study_level: string;
  course: string;
  personal_statement: string;
  consent_given: boolean;
  status: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      scholarship_opportunities: {
        Row: ScholarshipOpportunityRow;
        Insert: Omit<ScholarshipOpportunityRow, "created_at"> & {
          created_at?: string;
        };
        Update: Partial<ScholarshipOpportunityRow>;
        Relationships: [];
      };
      scholarship_applications: {
        Row: ScholarshipApplicationRow;
        Insert: Omit<
          ScholarshipApplicationRow,
          "id" | "consent_given" | "status" | "created_at"
        > & {
          id?: string;
          consent_given?: boolean;
          status?: string;
          created_at?: string;
        };
        Update: Partial<ScholarshipApplicationRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
