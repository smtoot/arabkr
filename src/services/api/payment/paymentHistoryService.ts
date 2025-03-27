
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentRecord } from '@/types/payment';

/**
 * Retrieves payment history for a specific user
 */
export async function getPaymentHistory(userId: string) {
  const { data, error } = await supabase
    .from('payment_history')
    .select(`
      *,
      payment_methods(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    toast.error('خطأ في جلب سجل المدفوعات');
    console.error('Error fetching payment history:', error);
    return [];
  }

  return data || [];
}

/**
 * Creates a new payment record and processes it
 */
export async function createPayment(
  userId: string,
  payment: Omit<PaymentRecord, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>
) {
  // First create the payment record
  const { data, error } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      amount: payment.amount,
      currency: payment.currency || 'SAR',
      payment_type: payment.payment_type,
      payment_method_id: payment.payment_method_id,
      status: 'pending',
      metadata: payment.metadata
    })
    .select('*')
    .single();

  if (error) {
    toast.error('خطأ في إنشاء سجل الدفع');
    console.error('Error creating payment record:', error);
    throw error;
  }

  // Import here to avoid circular dependencies
  const { mockProcessPayment } = await import('./mockPaymentService');
  const { updateWalletBalance } = await import('./walletService');
  const { createSubscription } = await import('./subscriptionService');

  // Simulate payment processing
  const isSuccessful = await mockProcessPayment(data.id);

  // Update the payment status based on the result
  const updatedStatus = isSuccessful ? 'completed' : 'failed';
  
  const { error: updateError } = await supabase
    .from('payment_history')
    .update({ status: updatedStatus })
    .eq('id', data.id);

  if (updateError) {
    console.error('Error updating payment status:', updateError);
  }

  // If payment is for wallet recharge and successful, update wallet balance
  if (isSuccessful && payment.payment_type === 'wallet_recharge') {
    await updateWalletBalance(userId, payment.amount);
  }

  // If payment is for subscription and successful, create subscription
  if (isSuccessful && payment.payment_type === 'subscription' && payment.metadata?.plan_id) {
    await createSubscription(userId, {
      plan_name: payment.metadata.plan_name,
      price: payment.amount,
      end_date: payment.metadata.end_date,
      payment_history_id: data.id
    });
  }

  return {
    ...data,
    status: updatedStatus,
    isSuccessful
  };
}
