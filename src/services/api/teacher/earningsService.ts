
import { supabase } from "@/integrations/supabase/client";

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
