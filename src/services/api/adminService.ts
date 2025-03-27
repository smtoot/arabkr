
import { supabase } from '@/integrations/supabase/client';

// User Management
export const fetchUsers = async () => {
  // In a real implementation, this would fetch from Supabase with admin rights
  // using either an edge function or RLS policies for admin users
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*, teachers(*)')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  // Enhance profile data with email from auth.users (would normally be done via joins in SQL)
  // This is a simplified implementation
  return data.map(profile => ({
    ...profile,
    email: `user${profile.id.slice(0, 4)}@example.com`, // Mock email for demo
    status: profile.is_verified ? 'active' : 'pending'
  }));
};

export const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
  // In a real implementation, this would update the user status in Supabase
  // through an edge function with admin rights
  
  console.log(`Updating user ${userId} status to ${status}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
};

// Teacher Applications
export const fetchTeacherApplications = async (status: string = 'pending') => {
  // In a real implementation, this would fetch from Supabase with admin rights
  
  const { data, error } = await supabase
    .from('teachers')
    .select('*, profiles!inner(*)')
    .eq('is_approved', status === 'approved')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching teacher applications:', error);
    throw error;
  }
  
  return data.map(teacher => ({
    ...teacher,
    ...teacher.profiles,
    // Mock data for demonstration
    email: `teacher${teacher.id.slice(0, 4)}@example.com`,
    status: teacher.is_approved ? 'approved' : 'pending',
  }));
};

export const updateTeacherStatus = async (
  teacherId: string, 
  status: 'approved' | 'rejected', 
  rejectionReason?: string
) => {
  // In a real implementation, this would update the teacher status in Supabase
  
  console.log(`Updating teacher ${teacherId} status to ${status}${rejectionReason ? ` with reason: ${rejectionReason}` : ''}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
};

// Analytics & Statistics
export const fetchPlatformStatistics = async () => {
  // In a real implementation, this would fetch real statistics from Supabase
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data for demonstration
  const userStats = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 200 },
    { month: 'Apr', users: 250 },
    { month: 'May', users: 300 },
    { month: 'Jun', users: 350 },
  ];
  
  const lessonStats = [
    { month: 'Jan', booked: 80, completed: 75 },
    { month: 'Feb', booked: 95, completed: 90 },
    { month: 'Mar', booked: 120, completed: 110 },
    { month: 'Apr', booked: 150, completed: 140 },
    { month: 'May', booked: 200, completed: 180 },
    { month: 'Jun', booked: 220, completed: 205 },
  ];
  
  const revenueStats = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 20000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 30000 },
    { month: 'Jun', revenue: 35000 },
  ];
  
  return {
    totalUsers: 850,
    activeUsers: 720,
    totalTeachers: 120,
    completedLessons: 800,
    totalRevenue: 137000,
    userStats,
    lessonStats,
    revenueStats
  };
};

// Content Management
export const fetchHomePageContent = async () => {
  // In a real implementation, this would fetch from a 'content' table in Supabase
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock data for demonstration
  return {
    hero: {
      title: 'تعلم اللغة الكورية بسهولة',
      description: 'منصة متخصصة لتعلم اللغة الكورية مع أفضل المعلمين المحترفين من خلال دروس مباشرة عبر الإنترنت.',
      buttonText: 'ابدأ التعلم الآن',
      imageUrl: 'https://via.placeholder.com/600x400?text=Hero+Image'
    },
    about: {
      title: 'عن المنصة',
      description: 'منصتنا توفر تجربة تعليمية فريدة للراغبين في تعلم اللغة الكورية بطريقة فعالة وممتعة. نوفر دروسًا مباشرة مع معلمين محترفين وأدوات تفاعلية تساعد على تحسين مهاراتك بسرعة.',
      imageUrl: 'https://via.placeholder.com/400x300?text=About+Image'
    },
    features: {
      title: 'مميزات المنصة',
      items: [
        {
          title: 'دروس مباشرة',
          description: 'دروس فردية مع معلمين محترفين'
        },
        {
          title: 'مرونة في المواعيد',
          description: 'حدد الوقت المناسب لك'
        },
        {
          title: 'منهج متكامل',
          description: 'منهج شامل لجميع المستويات'
        }
      ]
    }
  };
};

export const updateHomePageContent = async (section: string, content: any) => {
  // In a real implementation, this would update the content in Supabase
  
  console.log(`Updating ${section} content:`, content);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true };
};

// FAQs Management
export const fetchFAQs = async () => {
  // In a real implementation, this would fetch from a 'faqs' table in Supabase
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data for demonstration
  return [
    {
      id: '1',
      question: 'كيف أبدأ في تعلم اللغة الكورية؟',
      answer: 'يمكنك البدء بالتسجيل في المنصة، ثم اختيار معلم مناسب وحجز درس تجريبي للتعرف على آلية التعلم.'
    },
    {
      id: '2',
      question: 'كم تكلفة الدروس؟',
      answer: 'تختلف تكلفة الدروس حسب المعلم والمستوى، لكن المتوسط يتراوح بين 50-150 ريال سعودي للدرس الواحد.'
    },
    {
      id: '3',
      question: 'هل يمكنني إلغاء الدرس؟',
      answer: 'نعم، يمكنك إلغاء الدرس قبل 24 ساعة من موعده للحصول على استرداد كامل للمبلغ.'
    }
  ];
};

export const addFAQ = async (faqData: { question: string; answer: string }) => {
  // In a real implementation, this would add to a 'faqs' table in Supabase
  
  console.log('Adding new FAQ:', faqData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return { 
    id: Date.now().toString(),
    ...faqData 
  };
};

export const updateFAQ = async (id: string, faqData: { question: string; answer: string }) => {
  // In a real implementation, this would update in a 'faqs' table in Supabase
  
  console.log(`Updating FAQ ${id}:`, faqData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return { 
    id,
    ...faqData 
  };
};

export const deleteFAQ = async (id: string) => {
  // In a real implementation, this would delete from a 'faqs' table in Supabase
  
  console.log(`Deleting FAQ ${id}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return { success: true };
};
