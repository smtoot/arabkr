
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherFilters, SortOption } from "@/types/teacher";

export async function fetchTeachers(
  page = 1,
  pageSize = 9,
  filters?: TeacherFilters,
  sort?: SortOption
) {
  try {
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
        profiles (
          first_name,
          last_name,
          avatar_url,
          bio,
          native_language
        )
      `, { count: 'exact' })
      .eq('is_approved', true);

    // Apply filters
    if (filters) {
      if (filters.minPrice !== undefined) {
        query = query.gte('hourly_rate', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('hourly_rate', filters.maxPrice);
      }
      // Note: We've removed minRating, specialties and languages filters as they seem to be missing from the DB schema
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price_low':
          query = query.order('hourly_rate', { ascending: true });
          break;
        case 'price_high':
          query = query.order('hourly_rate', { ascending: false });
          break;
        case 'experience':
          query = query.order('years_experience', { ascending: false });
          break;
        default:
          // Default ordering - we can't sort by rating if it doesn't exist
          query = query.order('id', { ascending: true });
      }
    } else {
      // Default ordering if no sort option is provided
      query = query.order('id', { ascending: true });
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
      avg_rating: 0, // We don't have this column yet
      total_reviews: 0 // We don't have this column yet
    }));

    return { teachers, count: count || 0 };
  } catch (error) {
    console.error('Error in fetchTeachers:', error);
    throw error;
  }
}

export async function fetchTeacherById(id: string) {
  try {
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
      avg_rating: 0, // We don't have this column yet
      total_reviews: 0 // We don't have this column yet
    };

    return teacher;
  } catch (error) {
    console.error('Error in fetchTeacherById:', error);
    throw error;
  }
}

export async function fetchTeacherAvailability(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchTeacherAvailability:', error);
    throw error;
  }
}
