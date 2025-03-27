
import { useState } from 'react';
import { Edit, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Teacher } from '@/types/teacher';
import { updateTeacherProfile } from '@/services/api/teacherProfileService';
import { useToast } from '@/hooks/use-toast';

interface TeacherProfileSectionProps {
  teacherProfile: Teacher | null;
  isLoading: boolean;
}

export const TeacherProfileSection = ({ teacherProfile, isLoading }: TeacherProfileSectionProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<Partial<Teacher>>(teacherProfile || {});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (profile object)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...(profileData as any)[parent],
          [child]: value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };
  
  const handleSaveProfile = async () => {
    if (!teacherProfile?.id) return;
    
    try {
      await updateTeacherProfile(teacherProfile.id, profileData);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث ملفك الشخصي بنجاح",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ في حفظ الملف الشخصي",
        description: "حدث خطأ أثناء حفظ التغييرات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> تعديل الملف الشخصي
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>إلغاء</Button>
            <Button onClick={handleSaveProfile}>حفظ التغييرات</Button>
          </div>
        )}
      </div>
      
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
          <CardDescription>معلوماتك الأساسية التي ستظهر للطلاب</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Name Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={teacherProfile?.profile.avatar_url || ""} alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {teacherProfile?.profile.first_name?.[0] || "M"}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> تغيير الصورة
                </Button>
              )}
            </div>
            
            {/* Name and Basic Info Fields */}
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">الاسم الأول</label>
                  {isEditing ? (
                    <Input 
                      name="profile.first_name"
                      value={profileData.profile?.first_name || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{teacherProfile?.profile.first_name || "-"}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">الاسم الأخير</label>
                  {isEditing ? (
                    <Input 
                      name="profile.last_name"
                      value={profileData.profile?.last_name || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{teacherProfile?.profile.last_name || "-"}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">اللغة الأم</label>
                  {isEditing ? (
                    <Input 
                      name="profile.native_language"
                      value={profileData.profile?.native_language || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{teacherProfile?.profile.native_language || "-"}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">التخصص</label>
                  {isEditing ? (
                    <Input 
                      name="teaching_style"
                      value={profileData.teaching_style || ""}
                      onChange={handleInputChange}
                      placeholder="مثال: محادثة، قواعد، نطق..."
                    />
                  ) : (
                    <p>{teacherProfile?.teaching_style || "-"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio Field */}
          <div>
            <label className="text-sm font-medium mb-1 block">نبذة عني</label>
            {isEditing ? (
              <Textarea 
                name="profile.bio"
                value={profileData.profile?.bio || ""}
                onChange={handleInputChange}
                rows={5}
                placeholder="اكتب نبذة عنك وعن خبرتك في تدريس اللغة الكورية..."
              />
            ) : (
              <p className="whitespace-pre-line">{teacherProfile?.profile.bio || "-"}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Qualifications Card */}
      <Card>
        <CardHeader>
          <CardTitle>المؤهلات والخبرات</CardTitle>
          <CardDescription>مؤهلاتك الدراسية وخبراتك في تدريس اللغة الكورية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">المؤهل العلمي</label>
              {isEditing ? (
                <Input 
                  name="education"
                  value={profileData.education || ""}
                  onChange={handleInputChange}
                  placeholder="مثال: بكالوريوس في اللغة الكورية"
                />
              ) : (
                <p>{teacherProfile?.education || "-"}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">سنوات الخبرة</label>
              {isEditing ? (
                <Input 
                  type="number"
                  name="years_experience"
                  value={profileData.years_experience?.toString() || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{teacherProfile?.years_experience || "-"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Intro Video Card */}
      <Card>
        <CardHeader>
          <CardTitle>فيديو التعريف</CardTitle>
          <CardDescription>فيديو قصير يعرف الطلاب بك وبطريقة تدريسك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teacherProfile?.introduction_video_url ? (
            <div className="aspect-video rounded-md overflow-hidden">
              <iframe 
                src={teacherProfile.introduction_video_url}
                className="w-full h-full"
                title="Introduction Video"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-8 text-center">
              <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">لم تقم بإضافة فيديو تعريفي بعد</p>
              <p className="text-muted-foreground mb-4">
                الفيديو التعريفي يساعد الطلاب على التعرف عليك وعلى أسلوبك في التدريس
              </p>
              {isEditing && (
                <Button onClick={() => setVideoDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" /> إضافة فيديو
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <CardTitle>التسعير</CardTitle>
          <CardDescription>سعر الساعة لدروسك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-grow max-w-xs">
              {isEditing ? (
                <div className="flex items-center">
                  <Input 
                    type="number"
                    name="hourly_rate"
                    value={profileData.hourly_rate?.toString() || ""}
                    onChange={handleInputChange}
                  />
                  <span className="mr-2">ريال / ساعة</span>
                </div>
              ) : (
                <p className="text-lg font-semibold">{teacherProfile?.hourly_rate || 0} ريال / ساعة</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فيديو تعريفي</DialogTitle>
            <DialogDescription>
              أضف رابط فيديو من يوتيوب أو أي منصة مشابهة
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="video-url" className="text-sm font-medium">رابط الفيديو</label>
              <Input
                id="video-url"
                name="introduction_video_url"
                value={profileData.introduction_video_url || ""}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-xs text-muted-foreground">
                يجب أن يكون رابط التضمين (Embed URL) وليس رابط المشاهدة العادي
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setVideoDialogOpen(false)}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
