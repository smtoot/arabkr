
import { supabase } from "@/integrations/supabase/client";
import { Teacher } from "@/types/teacher";

// Fetch teacher profile with all details
export async function fetchTeacherProfile(teacherId: string) {
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
      .eq('id', teacherId)
      .single();

    if (error) {
      console.error('Error fetching teacher profile:', error);
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
      specialties: [], // Will be populated once schema is updated
      languages_spoken: [], // Will be populated once schema is updated
      avg_rating: 0, // Will be populated once schema is updated
      total_reviews: 0 // Will be populated once schema is updated
    };

    return teacher;
  } catch (error) {
    console.error('Error in fetchTeacherProfile:', error);
    throw error;
  }
}

// Update teacher profile
export async function updateTeacherProfile(teacherId: string, profileData: Partial<Teacher>) {
  try {
    // Update teacher table
    const teacherUpdate = {
      hourly_rate: profileData.hourly_rate,
      education: profileData.education,
      teaching_style: profileData.teaching_style,
      years_experience: profileData.years_experience,
      introduction_video_url: profileData.introduction_video_url
    };
    
    const { error: teacherError } = await supabase
      .from('teachers')
      .update(teacherUpdate)
      .eq('id', teacherId);
    
    if (teacherError) {
      console.error('Error updating teacher profile:', teacherError);
      throw teacherError;
    }
    
    // Update profiles table if profile data was included
    if (profileData.profile) {
      const profileUpdate = {
        first_name: profileData.profile.first_name,
        last_name: profileData.profile.last_name,
        bio: profileData.profile.bio,
        native_language: profileData.profile.native_language
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', teacherId);
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTeacherProfile:', error);
    throw error;
  }
}

// Upload teacher profile picture
export async function uploadProfilePicture(teacherId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `teacher-avatars/${teacherId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', teacherId);
    
    if (updateError) {
      console.error('Error updating profile with new avatar:', updateError);
      throw updateError;
    }
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
}

// Fetch upcoming lessons for teacher
export async function fetchUpcomingLessons(teacherId: string) {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        start_time,
        end_time,
        lesson_type,
        status,
        student_id,
        profiles:student_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('teacher_id', teacherId)
      .eq('status', 'confirmed')
      .gte('start_time', now)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming lessons:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUpcomingLessons:', error);
    throw error;
  }
}

// Fetch teacher availability
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
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchTeacherAvailability:', error);
    throw error;
  }
}

// Add new availability slot
export async function addAvailabilitySlot(teacherId: string, slotData: any) {
  try {
    const { error } = await supabase
      .from('availability')
      .insert({
        teacher_id: teacherId,
        day_of_week: slotData.day_of_week,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
        is_recurring: slotData.is_recurring
      });
    
    if (error) {
      console.error('Error adding availability slot:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addAvailabilitySlot:', error);
    throw error;
  }
}

// Delete availability slot
export async function deleteAvailabilitySlot(slotId: string) {
  try {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', slotId);
    
    if (error) {
      console.error('Error deleting availability slot:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAvailabilitySlot:', error);
    throw error;
  }
}

// Fetch teacher students
export async function fetchTeacherStudents(teacherId: string) {
  try {
    // Get all students who have had at least one booking with this teacher
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        student_id,
        profiles:student_id (
          first_name,
          last_name,
          avatar_url,
          email
        )
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teacher students:', error);
      throw error;
    }
    
    // Remove duplicates (students who have had multiple lessons)
    const uniqueStudents = data.filter((obj, index, self) => 
      index === self.findIndex((o) => o.student_id === obj.student_id)
    );
    
    return uniqueStudents || [];
  } catch (error) {
    console.error('Error in fetchTeacherStudents:', error);
    throw error;
  }
}

// Fetch teacher earnings
export async function fetchTeacherEarnings(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        created_at,
        type,
        status,
        description,
        wallets (
          id,
          user_id,
          balance
        )
      `)
      .eq('wallets.user_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teacher earnings:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchTeacherEarnings:', error);
    throw error;
  }
}
