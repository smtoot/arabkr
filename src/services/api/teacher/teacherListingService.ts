
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherFilters, SortOption } from "@/types/teacher";
import { fetchTeacherLanguages } from "./languagesService";
import { fetchTeacherSpecialties } from "./specialtiesService";

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
        // Fetch specialties using the new table
        const specialties = await fetchTeacherSpecialties(item.id);
        
        // Fetch languages using the new table  
        const languages = await fetchTeacherLanguages(item.id);
        
        // Using the get_teacher_rating function
        const { data: ratingData, error: ratingError } = await supabase
          .rpc('get_teacher_rating', { teacher_id: item.id }) as any;
        
        const avgRating = ratingError || !ratingData || ratingData.length === 0 
          ? 0 
          : ratingData[0].avg_rating || 0;
          
        const totalReviews = ratingError || !ratingData || ratingData.length === 0 
          ? 0 
          : ratingData[0].total_reviews || 0;
        
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

    // Filter by specialties if provided
    if (filters?.specialties && filters.specialties.length > 0) {
      filteredTeachers = filteredTeachers.filter(teacher => 
        filters.specialties!.some(specialty => teacher.specialties.includes(specialty))
      );
    }

    // Filter by languages if provided
    if (filters?.languages && filters.languages.length > 0) {
      filteredTeachers = filteredTeachers.filter(teacher => 
        filters.languages!.some(language => teacher.languages_spoken.includes(language))
      );
    }

    if (sort === 'rating') {
      filteredTeachers.sort((a, b) => b.avg_rating - a.avg_rating);
    }

    return { 
      teachers: filteredTeachers, 
      count: count || filteredTeachers.length 
    };
  } catch (error) {
    console.error('Error in fetchTeachers:', error);
    const mockTeachers = generateMockTeachers(9);
    return { teachers: mockTeachers, count: mockTeachers.length };
  }
}

// Import mock data generation function from mockTeacherData
import { generateMockTeachers } from "../mockTeacherData";
