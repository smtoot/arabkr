
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/teacher";

// Fetch reviews given by a student
export async function fetchStudentReviews(studentId: string) {
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
        teachers:teacher_id (
          profiles:id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student reviews:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchStudentReviews:', error);
    throw error;
  }
}

// Create a new review
export async function createReview(review: {
  teacher_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
}, studentId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        ...review,
        student_id: studentId,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createReview:', error);
    throw error;
  }
}

// Update a review
export async function updateReview(
  reviewId: string,
  updates: {
    rating?: number;
    comment?: string;
  }
) {
  try {
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
  } catch (error) {
    console.error('Error in updateReview:', error);
    throw error;
  }
}
