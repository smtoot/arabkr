
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentMethod, PaymentRecord, SubscriptionPlan } from '@/types/payment';

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

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    toast.error('خطأ في جلب معلومات الاشتراك');
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

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

  // Simulate payment processing (in a real app, you would integrate with a payment gateway)
  // This mock function randomly succeeds or fails the payment
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

// Mock function for simulating payment processing
async function mockProcessPayment(paymentId: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 90% success rate for the mock
  return Math.random() < 0.9;
}

async function updateWalletBalance(userId: string, amount: number) {
  // Get user's wallet
  const { data: wallet, error: fetchError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching wallet:', fetchError);
    return;
  }

  // Update wallet balance
  const { error: updateError } = await supabase
    .from('wallets')
    .update({ 
      balance: wallet.balance + amount,
      updated_at: new Date()
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating wallet balance:', updateError);
  }

  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      wallet_id: wallet.id,
      amount: amount,
      type: 'deposit',
      description: 'إيداع من بطاقة الدفع'
    });
}

async function createSubscription(
  userId: string, 
  subscription: {
    plan_name: string;
    price: number;
    end_date: string;
    payment_history_id: string;
  }
) {
  // Check if user has an active subscription
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  // If exists, cancel it
  if (existingSubscription) {
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date() })
      .eq('id', existingSubscription.id);
  }

  // Create new subscription
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_name: subscription.plan_name,
      status: 'active',
      end_date: subscription.end_date,
      price: subscription.price,
      payment_history_id: subscription.payment_history_id
    });

  if (error) {
    console.error('Error creating subscription:', error);
  }
}

export async function cancelSubscription(userId: string, subscriptionId: string) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date()
    })
    .eq('id', subscriptionId)
    .eq('user_id', userId);

  if (error) {
    toast.error('خطأ في إلغاء الاشتراك');
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  toast.success('تم إلغاء الاشتراك بنجاح');
  return true;
}
