
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types/payment';

/**
 * Gets all payment methods for a user
 */
export async function getPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) {
    toast.error('خطأ في جلب وسائل الدفع');
    console.error('Error fetching payment methods:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new payment method for a user
 */
export async function addPaymentMethod(
  userId: string,
  paymentMethod: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      type: paymentMethod.type,
      details: paymentMethod.details,
      is_default: paymentMethod.is_default
    })
    .select('*')
    .single();

  if (error) {
    toast.error('خطأ في إضافة وسيلة الدفع');
    console.error('Error adding payment method:', error);
    throw error;
  }

  // If this is the default payment method, update other methods
  if (paymentMethod.is_default) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId)
      .neq('id', data.id);
  }

  toast.success('تمت إضافة وسيلة الدفع بنجاح');
  return data;
}

/**
 * Sets a specific payment method as the default
 */
export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
  // First, set all payment methods to non-default
  await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  // Then, set the selected one as default
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodId)
    .eq('user_id', userId);

  if (error) {
    toast.error('خطأ في تعيين وسيلة الدفع الافتراضية');
    console.error('Error setting default payment method:', error);
    throw error;
  }

  toast.success('تم تعيين وسيلة الدفع الافتراضية بنجاح');
  return true;
}

/**
 * Deletes a payment method
 */
export async function deletePaymentMethod(userId: string, paymentMethodId: string) {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId)
    .eq('user_id', userId);

  if (error) {
    toast.error('خطأ في حذف وسيلة الدفع');
    console.error('Error deleting payment method:', error);
    throw error;
  }

  toast.success('تم حذف وسيلة الدفع بنجاح');
  return true;
}
