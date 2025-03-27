
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherFilters, SortOption } from "@/types/teacher";
import { generateMockTeachers } from "./mockTeacherData";

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

    if (filters) {
      if (filters.minPrice !== undefined) {
        query = query.gte('hourly_rate', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('hourly_rate', filters.maxPrice);
      }
    }

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
          query = query.order('id', { ascending: true });
      }
    } else {
      query = query.order('id', { ascending: true });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }

    const teachersWithDetails = await Promise.all(
      data.map(async (item: any) => {
        // Fetch specialties using raw SQL to avoid type errors
        const { data: specialtiesData, error: specialtiesError } = await supabase
          .rpc('execute_sql', {
            query_text: `SELECT specialty FROM teacher_specialties WHERE teacher_id = '${item.id}'`
          });
        
        const specialties = specialtiesError || !specialtiesData 
          ? [] 
          : specialtiesData.map((s: any) => s.specialty);
        
        // Fetch languages using raw SQL to avoid type errors
        const { data: languagesData, error: languagesError } = await supabase
          .rpc('execute_sql', {
            query_text: `SELECT language FROM teacher_languages WHERE teacher_id = '${item.id}'`
          });
        
        const languages = languagesError || !languagesData 
          ? [] 
          : languagesData.map((l: any) => l.language);
        
        // Fetch teacher rating
        const { data: ratingData, error: ratingError } = await supabase
          .rpc('get_teacher_rating', { teacher_id: item.id });
        
        const avgRating = ratingError || !ratingData ? 0 : ratingData.avg_rating || 0;
        const totalReviews = ratingError || !ratingData ? 0 : ratingData.total_reviews || 0;
        
        return {
          id: item.id,
          profile: item.profiles,
          hourly_rate: item.hourly_rate,
          education: item.education,
          teaching_style: item.teaching_style,
          years_experience: item.years_experience,
          introduction_video_url: item.introduction_video_url,
          is_approved: item.is_approved,
          specialties: specialties,
          languages_spoken: languages,
          avg_rating: avgRating,
          total_reviews: totalReviews
        };
      })
    );

    let filteredTeachers = teachersWithDetails;
    if (filters?.minRating !== undefined) {
      filteredTeachers = filteredTeachers.filter(
        teacher => teacher.avg_rating >= (filters.minRating || 0)
      );
    }

    if (sort === 'rating') {
      filteredTeachers.sort((a, b) => b.avg_rating - a.avg_rating);
    }

    return { 
      teachers: filteredTeachers, 
      count: filteredTeachers.length 
    };
  } catch (error) {
    console.error('Error in fetchTeachers:', error);
    const mockTeachers = generateMockTeachers(9);
    return { teachers: mockTeachers, count: mockTeachers.length };
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

    // Fetch specialties using raw SQL to avoid type errors
    const { data: specialtiesData, error: specialtiesError } = await supabase
      .rpc('execute_sql', {
        query_text: `SELECT specialty FROM teacher_specialties WHERE teacher_id = '${id}'`
      });
    
    const specialties = specialtiesError || !specialtiesData 
      ? [] 
      : specialtiesData.map((s: any) => s.specialty);
    
    // Fetch languages using raw SQL to avoid type errors
    const { data: languagesData, error: languagesError } = await supabase
      .rpc('execute_sql', {
        query_text: `SELECT language FROM teacher_languages WHERE teacher_id = '${id}'`
      });
    
    const languages = languagesError || !languagesData 
      ? [] 
      : languagesData.map((l: any) => l.language);
    
    // Fetch teacher rating
    const { data: ratingData, error: ratingError } = await supabase
      .rpc('get_teacher_rating', { teacher_id: id });
    
    const avgRating = ratingError || !ratingData ? 0 : ratingData.avg_rating || 0;
    const totalReviews = ratingError || !ratingData ? 0 : ratingData.total_reviews || 0;

    const teacher: Teacher = {
      id: data.id,
      profile: data.profiles,
      hourly_rate: data.hourly_rate,
      education: data.education,
      teaching_style: data.teaching_style,
      years_experience: data.years_experience,
      introduction_video_url: data.introduction_video_url,
      is_approved: data.is_approved,
      specialties: specialties,
      languages_spoken: languages,
      avg_rating: avgRating,
      total_reviews: totalReviews
    };

    return teacher;
  } catch (error) {
    console.error('Error in fetchTeacherById:', error);
    const mockTeachers = generateMockTeachers(1);
    return mockTeachers[0];
  }
}

export async function fetchTeacherAvailability(teacherId: string, startDate?: Date, endDate?: Date) {
  try {
    let query = supabase
      .from('availability')
      .select('*')
      .eq('teacher_id', teacherId);
      
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
