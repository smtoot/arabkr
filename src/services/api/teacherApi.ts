
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
        avg_rating,
        total_reviews,
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
      if (filters.minRating !== undefined) {
        query = query.gte('avg_rating', filters.minRating);
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
        default:
          query = query.order('avg_rating', { ascending: false });
      }
    } else {
      // Default ordering by rating
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

    // Fetch specialties and languages for each teacher
    const teachersWithDetails = await Promise.all(
      data.map(async (item: any) => {
        const { data: specialtiesData, error: specialtiesError } = await supabase
          .from('teacher_specialties')
          .select('specialty')
          .eq('teacher_id', item.id);
        
        if (specialtiesError) {
          console.error('Error fetching specialties:', specialtiesError);
        }
        
        const { data: languagesData, error: languagesError } = await supabase
          .from('teacher_languages')
          .select('language')
          .eq('teacher_id', item.id);
        
        if (languagesError) {
          console.error('Error fetching languages:', languagesError);
        }
        
        return {
          id: item.id,
          profile: item.profiles,
          hourly_rate: item.hourly_rate,
          education: item.education,
          teaching_style: item.teaching_style,
          years_experience: item.years_experience,
          introduction_video_url: item.introduction_video_url,
          is_approved: item.is_approved,
          specialties: specialtiesData ? specialtiesData.map((s: any) => s.specialty) : [],
          languages_spoken: languagesData ? languagesData.map((l: any) => l.language) : [],
          avg_rating: item.avg_rating || 0,
          total_reviews: item.total_reviews || 0
        };
      })
    );

    return { teachers: teachersWithDetails, count: count || 0 };
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

    // Fetch specialties and languages
    const { data: specialtiesData, error: specialtiesError } = await supabase
      .from('teacher_specialties')
      .select('specialty')
      .eq('teacher_id', id);
    
    if (specialtiesError) {
      console.error('Error fetching specialties:', specialtiesError);
    }
    
    const { data: languagesData, error: languagesError } = await supabase
      .from('teacher_languages')
      .select('language')
      .eq('teacher_id', id);
    
    if (languagesError) {
      console.error('Error fetching languages:', languagesError);
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
      specialties: specialtiesData ? specialtiesData.map((s: any) => s.specialty) : [],
      languages_spoken: languagesData ? languagesData.map((l: any) => l.language) : [],
      avg_rating: data.avg_rating || 0,
      total_reviews: data.total_reviews || 0
    };

    return teacher;
  } catch (error) {
    console.error('Error in fetchTeacherById:', error);
    throw error;
  }
}

export async function fetchTeacherAvailability(teacherId: string, startDate?: Date, endDate?: Date) {
  try {
    let query = supabase
      .from('availability')
      .select('*')
      .eq('teacher_id', teacherId);
      
    // If start and end dates are provided, fetch bookings for that period
    if (startDate && endDate) {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('teacher_id', teacherId)
        .gte('start_time', startDateStr)
        .lte('start_time', endDateStr)
        .in('status', ['confirmed', 'pending']);
      
      if (bookingsError) {
        console.error('Error fetching teacher bookings:', bookingsError);
        throw bookingsError;
      }
      
      const { data: availabilityData, error: availabilityError } = await query;
      
      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
        throw availabilityError;
      }
      
      return { 
        availability: availabilityData || [], 
        existingBookings: bookingsData || [] 
      };
    }
    
    const { data, error } = await query;

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
