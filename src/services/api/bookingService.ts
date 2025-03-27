
import { supabase } from "@/integrations/supabase/client";
import { LessonType } from "@/hooks/useBookingForm";

// Fetch available lesson types
export const fetchLessonTypes = async (): Promise<LessonType[]> => {
  // Use RPC function to get lesson types
  const { data, error } = await supabase
    .rpc('get_lesson_types')
    .returns<LessonType[]>();
  
  if (error) {
    console.error('Error fetching lesson types:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch a teacher's availability
export const fetchTeacherAvailability = async (teacherId: string, startDate: Date, endDate: Date) => {
  // First get the teacher's weekly schedule
  const { data: availabilityData, error: availabilityError } = await supabase
    .from('availability')
    .select('*')
    .eq('teacher_id', teacherId);
  
  if (availabilityError) {
    console.error('Error fetching teacher availability:', availabilityError);
    throw availabilityError;
  }
  
  // Then get existing bookings to check for conflicts
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
  
  return { 
    availability: availabilityData || [], 
    existingBookings: bookingsData || [] 
  };
};

// Create a new booking
export const createBooking = async (bookingData: {
  teacher_id: string;
  start_time: string;
  end_time: string;
  lesson_type: string;
  amount: number;
  notes?: string;
}) => {
  const user = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...bookingData,
      student_id: user.data.user?.id,
      status: 'pending'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  return data;
};

// Get user wallet balance
export const getUserWalletBalance = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
  
  return data;
};

// Process payment for a booking
export const processBookingPayment = async (bookingId: string, amount: number) => {
  // In a real system, this would interact with a payment gateway
  // For now, we'll simulate the payment by deducting from wallet
  
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error('User not authenticated');
  }
  
  // Start a transaction to update wallet and booking status
  // This is simplified as Supabase doesn't support transactions in the JS client
  // In production, you'd use an edge function to handle this atomically
  
  // 1. Update wallet balance
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.data.user.id)
    .single();
  
  if (walletError) {
    console.error('Error getting wallet:', walletError);
    throw walletError;
  }
  
  const newBalance = Number(walletData.balance) - amount;
  
  const { error: updateWalletError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', walletData.id);
  
  if (updateWalletError) {
    console.error('Error updating wallet:', updateWalletError);
    throw updateWalletError;
  }
  
  // 2. Update booking status
  const { data, error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)
    .select()
    .single();
  
  if (bookingError) {
    console.error('Error updating booking status:', bookingError);
    throw bookingError;
  }
  
  // 3. Record the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert([{
      wallet_id: walletData.id,
      amount: -amount, // Negative for outgoing payment
      type: 'booking_payment',
      reference_id: bookingId,
      description: 'Payment for lesson booking'
    }]);
  
  if (transactionError) {
    console.error('Error recording transaction:', transactionError);
    throw transactionError;
  }
  
  return data;
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()
    .single();
  
  if (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
  
  return data;
};
