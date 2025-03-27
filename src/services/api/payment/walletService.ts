
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a user's wallet balance
 */
export async function updateWalletBalance(userId: string, amount: number) {
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
      updated_at: new Date().toISOString()
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
