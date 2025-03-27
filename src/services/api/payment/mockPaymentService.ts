
/**
 * Mock function for simulating payment processing
 * In a real app, this would be replaced with actual payment gateway integration
 */
export async function mockProcessPayment(paymentId: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 90% success rate for the mock
  return Math.random() < 0.9;
}
