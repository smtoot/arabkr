
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/teacher";

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
