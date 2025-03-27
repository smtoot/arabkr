
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import TeacherDashboardHeader from '@/components/teacher-dashboard/TeacherDashboardHeader';
import { TeacherOverviewSection } from '@/components/teacher-dashboard/TeacherOverviewSection';
import { TeacherStudentsSection } from '@/components/teacher-dashboard/TeacherStudentsSection';
import { TeacherEarningsSection } from '@/components/teacher-dashboard/TeacherEarningsSection';
import { TeacherAvailabilitySection } from '@/components/teacher-dashboard/TeacherAvailabilitySection';
import { TeacherProfileSection } from '@/components/teacher-dashboard/TeacherProfileSection';
import { fetchTeacherProfile } from '@/services/api/teacherProfileService';
import { Teacher } from '@/types/teacher';

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeacherProfile = async () => {
      if (!user || !profile) return;
      
      try {
        setIsLoading(true);
        const data = await fetchTeacherProfile(user.id);
        setTeacherProfile(data);
      } catch (error) {
        console.error('Error loading teacher profile:', error);
        toast({
          title: "خطأ في تحميل ملف المعلم",
          description: "حدث خطأ أثناء تحميل بيانات ملفك الشخصي. يرجى المحاولة مرة أخرى لاحقًا.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherProfile();
  }, [user, profile, toast]);

  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <TeacherDashboardHeader teacher={teacherProfile} isLoading={isLoading} />

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6 w-full justify-start gap-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="earnings">الأرباح</TabsTrigger>
            <TabsTrigger value="availability">الجدول</TabsTrigger>
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <TeacherOverviewSection teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="students">
            <TeacherStudentsSection teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="earnings">
            <TeacherEarningsSection teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="availability">
            <TeacherAvailabilitySection teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="profile">
            <TeacherProfileSection teacherProfile={teacherProfile} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
