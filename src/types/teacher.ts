
export type TeacherSpecialty = 
  | 'conversation'
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'writing' 
  | 'business_korean' 
  | 'exam_preparation';

export interface Teacher {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    bio: string | null;
    native_language?: string | null;
  };
  hourly_rate: number;
  education: string | null;
  teaching_style: string | null;
  years_experience: number | null;
  introduction_video_url: string | null;
  is_approved: boolean | null;
  specialties: TeacherSpecialty[];
  languages_spoken: string[];
  avg_rating: number;
  total_reviews: number;
}

export interface Review {
  id: string;
  student_id: string;
  teacher_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface TeacherFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  specialties?: TeacherSpecialty[];
  languages?: string[];
}

export type SortOption = 'rating' | 'price_low' | 'price_high' | 'experience';
