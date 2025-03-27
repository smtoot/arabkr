import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/teacher";
import { generateMockReviews } from "./mockTeacherData";

export async function fetchTeacherReviews(teacherId: string) {
  try {
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
  } catch (error) {
    console.error('Error fetching reviews, using mock data:', error);
    // Fallback to mock data
    return generateMockReviews(teacherId, 5);
  }
}

export async function createReview(review: {
  teacher_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      ...review,
      student_id: userData.user?.id,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
}

export async function updateReview(
  reviewId: string,
  updates: {
    rating?: number;
    comment?: string;
  }
) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }

  return data;
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }

  return true;
}
