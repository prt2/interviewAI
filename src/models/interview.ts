export interface BaseInterview {
  job_description: string;
  company: string;
  job_title: string;
  created_at: {
    date: Date;
    time: string;
  };
}

export interface Interview extends BaseInterview {
  id: string;
}
