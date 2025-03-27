
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserWalletBalance } from '@/services/api/bookingService';
import { fetchUpcomingLessons } from '@/services/api/student/lessonService';
import { fetchStudentReviews } from '@/services/api/student/reviewsService';
import Layout from '@/components/Layout';
import { ProgressSection } from '@/components/student-dashboard/ProgressSection';
import { WalletCard } from '@/components/student-dashboard/WalletCard';
import { QuickActionsCard } from '@/components/student-dashboard/QuickActionsCard';
import { UpcomingLessonsSection } from '@/components/student-dashboard/UpcomingLessonsSection';
import { ReviewsSection } from '@/components/student-dashboard/ReviewsSection';
import { LearningGoalsSection } from '@/components/student-dashboard/LearningGoalsSection';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  
  // Fetch wallet balance
  const { 
    data: walletData, 
    isLoading: walletLoading 
  } = useQuery({
    queryKey: ['walletBalance', user?.id],
    queryFn: () => user?.id ? getUserWalletBalance(user.id) : null,
    enabled: !!user?.id,
  });
  
  // Fetch upcoming lessons
  const { 
    data: upcomingLessons, 
    isLoading: lessonsLoading 
  } = useQuery({
    queryKey: ['upcomingLessons', user?.id],
    queryFn: () => user?.id ? fetchUpcomingLessons(user.id) : [],
    enabled: !!user?.id,
  });
  
  // Fetch reviews
  const { 
    data: reviews, 
    isLoading: reviewsLoading 
  } = useQuery({
    queryKey: ['studentReviews', user?.id],
    queryFn: () => user?.id ? fetchStudentReviews(user.id) : [],
    enabled: !!user?.id,
  });

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">لوحة تحكم الطالب</h1>
        
        {/* Welcome and Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Welcome Card */}
          <ProgressSection firstName={profile?.first_name} />

          {/* Wallet Card */}
          <WalletCard walletData={walletData} isLoading={walletLoading} />

          {/* Quick Actions Card */}
          <QuickActionsCard />
        </div>
        
        {/* Learning Goals Section */}
        <div className="mb-8">
          <LearningGoalsSection />
        </div>
        
        {/* Upcoming Lessons Section */}
        <UpcomingLessonsSection lessons={upcomingLessons} isLoading={lessonsLoading} />
        
        {/* Latest Reviews Section */}
        <ReviewsSection reviews={reviews} isLoading={reviewsLoading} />
      </div>
    </Layout>
  );
}
