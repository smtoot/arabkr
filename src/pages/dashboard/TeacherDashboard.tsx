
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import TeacherDashboardHeader from '@/components/teacher-dashboard/TeacherDashboardHeader';
import TeacherOverview from '@/components/teacher-dashboard/TeacherOverview';
import TeacherStudents from '@/components/teacher-dashboard/TeacherStudents';
import TeacherEarnings from '@/components/teacher-dashboard/TeacherEarnings';
import TeacherAvailability from '@/components/teacher-dashboard/TeacherAvailability';
import TeacherProfile from '@/components/teacher-dashboard/TeacherProfile';
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
            <TeacherOverview teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="students">
            <TeacherStudents teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="earnings">
            <TeacherEarnings teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="availability">
            <TeacherAvailability teacherId={user?.id} />
          </TabsContent>
          
          <TabsContent value="profile">
            <TeacherProfile teacherProfile={teacherProfile} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
