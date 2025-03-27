
import { supabase } from "@/integrations/supabase/client";
import { Teacher } from "@/types/teacher";
import { generateMockTeachers } from "../mockTeacherData";
import { fetchTeacherLanguages } from "./languagesService";
import { fetchTeacherSpecialties } from "./specialtiesService";

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

    // Fetch specialties using the new table
    const specialties = await fetchTeacherSpecialties(id);
    
    // Fetch languages using the new table
    const languages = await fetchTeacherLanguages(id);
    
    // Using the get_teacher_rating function
    const { data: ratingData, error: ratingError } = await supabase
      .rpc('get_teacher_rating', { teacher_id: id }) as any;
    
    const avgRating = ratingError || !ratingData || ratingData.length === 0 
      ? 0 
      : ratingData[0].avg_rating || 0;
      
    const totalReviews = ratingError || !ratingData || ratingData.length === 0 
      ? 0 
      : ratingData[0].total_reviews || 0;

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
