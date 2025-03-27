
import { useState, useEffect } from 'react';
import { Teacher, TeacherSpecialty } from '@/types/teacher';
import { 
  fetchTeacherById, 
  updateTeacherProfileComplete, 
  uploadProfilePicture 
} from '@/services/api/teacherService';
import { useToast } from '@/hooks/use-toast';

export function useTeacherProfile(teacherId?: string) {
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Load teacher profile
  useEffect(() => {
    const loadTeacherProfile = async () => {
      if (!teacherId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchTeacherById(teacherId);
        setTeacher(data);
      } catch (error) {
        console.error('Error loading teacher profile:', error);
        toast({
          title: "خطأ في تحميل الملف الشخصي",
          description: "حدث خطأ أثناء تحميل بيانات المعلم",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeacherProfile();
  }, [teacherId, toast]);

  // Update teacher profile
  const updateProfile = async (
    profileData: Partial<Teacher>,
    newSpecialties?: TeacherSpecialty[],
    removedSpecialties?: TeacherSpecialty[],
    newLanguages?: string[],
    removedLanguages?: string[]
  ) => {
    if (!teacherId) {
      toast({
        title: "خطأ",
        description: "معرف المعلم غير متوفر",
        variant: "destructive",
      });
      return false;
    }

    setIsUpdating(true);
    try {
      await updateTeacherProfileComplete(
        teacherId,
        profileData,
        newSpecialties,
        removedSpecialties,
        newLanguages,
        removedLanguages
      );
      
      // Refresh the teacher data
      const updatedTeacher = await fetchTeacherById(teacherId);
      setTeacher(updatedTeacher);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث الملف الشخصي بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Upload profile picture
  const uploadAvatar = async (file: File) => {
    if (!teacherId) {
      toast({
        title: "خطأ",
        description: "معرف المعلم غير متوفر",
        variant: "destructive",
      });
      return false;
    }

    setIsUpdating(true);
    try {
      const avatarUrl = await uploadProfilePicture(teacherId, file);
      
      // Update the local state with the new avatar URL
      if (teacher) {
        setTeacher({
          ...teacher,
          profile: {
            ...teacher.profile,
            avatar_url: avatarUrl
          }
        });
      }
      
      toast({
        title: "تم الرفع بنجاح",
        description: "تم تحديث الصورة الشخصية بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة الشخصية",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    teacher,
    isLoading,
    isUpdating,
    updateProfile,
    uploadAvatar
  };
}
