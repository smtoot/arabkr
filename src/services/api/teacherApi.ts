
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherFilters, SortOption } from "@/types/teacher";

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
    // Note: We've removed specialties and languages filters as they seem to be missing from the DB schema
    // Uncomment these when the schema is updated
    /*
    if (filters.specialties && filters.specialties.length > 0) {
      query = query.contains('specialties', filters.specialties);
    }
    if (filters.languages && filters.languages.length > 0) {
      query = query.contains('languages_spoken', filters.languages);
    }
    */
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
    specialties: [], // Will need to be populated once schema is updated
    languages_spoken: [], // Will need to be populated once schema is updated
    avg_rating: item.avg_rating || 0,
    total_reviews: item.total_reviews || 0
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
    id: data.id,
    profile: data.profiles,
    hourly_rate: data.hourly_rate,
    education: data.education,
    teaching_style: data.teaching_style,
    years_experience: data.years_experience,
    introduction_video_url: data.introduction_video_url,
    is_approved: data.is_approved,
    specialties: [], // Will need to be populated once schema is updated
    languages_spoken: [], // Will need to be populated once schema is updated
    avg_rating: data.avg_rating || 0,
    total_reviews: data.total_reviews || 0
  };

  return teacher;
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
