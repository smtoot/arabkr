
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherFilters, SortOption, Review, TeacherSpecialty } from "@/types/teacher";

export async function fetchTeachers(
  page = 1,
  pageSize = 9,
  filters?: TeacherFilters,
  sort?: SortOption
) {
  let query = supabase
    .from('teachers')
    .select(`
      id,
      hourly_rate,
      education,
      teaching_style,
      years_experience,
      introduction_video_url,
      is_approved,
      specialties,
      languages_spoken,
      avg_rating,
      total_reviews,
      profiles (
        first_name,
        last_name,
        avatar_url,
        bio
      )
    `)
    .eq('is_approved', true);

  // Apply filters
  if (filters) {
    if (filters.minPrice !== undefined) {
      query = query.gte('hourly_rate', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('hourly_rate', filters.maxPrice);
    }
    if (filters.minRating !== undefined) {
      query = query.gte('avg_rating', filters.minRating);
    }
    if (filters.specialties && filters.specialties.length > 0) {
      query = query.contains('specialties', filters.specialties);
    }
    if (filters.languages && filters.languages.length > 0) {
      query = query.contains('languages_spoken', filters.languages);
    }
  }

  // Apply sorting
  if (sort) {
    switch (sort) {
      case 'rating':
        query = query.order('avg_rating', { ascending: false });
        break;
      case 'price_low':
        query = query.order('hourly_rate', { ascending: true });
        break;
      case 'price_high':
        query = query.order('hourly_rate', { ascending: false });
        break;
      case 'experience':
        query = query.order('years_experience', { ascending: false });
        break;
    }
  } else {
    // Default sorting by rating
    query = query.order('avg_rating', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }

  // Map the data to our Teacher type
  const teachers: Teacher[] = data.map((item: any) => ({
    id: item.id,
    profile: item.profiles,
    hourly_rate: item.hourly_rate,
    education: item.education,
    teaching_style: item.teaching_style,
    years_experience: item.years_experience,
    introduction_video_url: item.introduction_video_url,
    is_approved: item.is_approved,
    specialties: item.specialties,
    languages_spoken: item.languages_spoken,
    avg_rating: item.avg_rating,
    total_reviews: item.total_reviews
  }));

  return { teachers, count };
}

export async function fetchTeacherById(id: string) {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      id,
      hourly_rate,
      education,
      teaching_style,
      years_experience,
      introduction_video_url,
      is_approved,
      specialties,
      languages_spoken,
      avg_rating,
      total_reviews,
      profiles (
        first_name,
        last_name,
        avatar_url,
        bio,
        native_language
      )
    `)
    .eq('id', id)
    .eq('is_approved', true)
    .single();

  if (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }

  const teacher: Teacher = {
    ...data,
    profile: data.profiles,
  };

  return teacher;
}

export async function fetchTeacherReviews(teacherId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      student_id,
      teacher_id,
      booking_id,
      rating,
      comment,
      created_at,
      profiles:student_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  const reviews: Review[] = data.map((item: any) => ({
    ...item,
    student: item.profiles,
  }));

  return reviews;
}

export async function fetchTeacherAvailability(teacherId: string) {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('teacher_id', teacherId);

  if (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }

  return data;
}

// Mock data for testing before we have data in Supabase
export const generateMockTeachers = (count: number): Teacher[] => {
  const specialties: TeacherSpecialty[] = [
    'conversation',
    'grammar',
    'vocabulary',
    'reading',
    'writing',
    'business_korean',
    'exam_preparation'
  ];
  
  const languages = ['العربية', 'English', '한국어'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `teacher-${i + 1}`,
    profile: {
      first_name: `معلم${i + 1}`,
      last_name: `كوري${i + 1}`,
      avatar_url: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`,
      bio: `أنا معلم لغة كورية مع خبرة ${2 + (i % 10)} سنوات. متخصص في تعليم القواعد والمحادثة للمبتدئين والمتوسطين.`
    },
    hourly_rate: 50 + (i * 10) % 150,
    education: `جامعة سيول، بكالوريوس في تعليم اللغة الكورية`,
    teaching_style: `أركز على المحادثة والتطبيق العملي للغة في الحياة اليومية`,
    years_experience: 2 + (i % 10),
    introduction_video_url: null,
    is_approved: true,
    specialties: [
      specialties[i % specialties.length],
      specialties[(i + 1) % specialties.length]
    ],
    languages_spoken: [
      '한국어',
      languages[i % languages.length]
    ],
    avg_rating: 3 + (Math.random() * 2),
    total_reviews: Math.floor(Math.random() * 50)
  }));
};

export const generateMockReviews = (teacherId: string, count: number): Review[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i}`,
    teacher_id: teacherId,
    student_id: `student-${i}`,
    booking_id: `booking-${i}`,
    rating: Math.floor(3 + Math.random() * 3),
    comment: `تجربة ممتازة مع هذا المعلم! تعلمت الكثير في وقت قصير`,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    student: {
      first_name: `طالب${i + 1}`,
      last_name: `${i + 1}`,
      avatar_url: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`
    }
  }));
};
