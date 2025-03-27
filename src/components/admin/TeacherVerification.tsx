
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTeacherApplications, updateTeacherStatus } from '@/services/api/adminService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherVerification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const { toast } = useToast();

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ['teacherApplications', statusFilter],
    queryFn: () => fetchTeacherApplications(statusFilter),
  });

  const filteredApplications = applications.filter(app => 
    app.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherDetails(true);
  };

  const handleApproveTeacher = async (teacherId) => {
    try {
      await updateTeacherStatus(teacherId, 'approved');
      toast({
        title: "تم قبول المعلم",
        description: "تم قبول طلب المعلم بنجاح.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من قبول طلب المعلم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleRejectClick = (teacher) => {
    setSelectedTeacher(teacher);
    setRejectionReason('');
    setShowRejectionDialog(true);
  };

  const handleRejectTeacher = async () => {
    try {
      await updateTeacherStatus(selectedTeacher.id, 'rejected', rejectionReason);
      toast({
        title: "تم رفض المعلم",
        description: "تم رفض طلب المعلم بنجاح.",
      });
      setShowRejectionDialog(false);
      refetch();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من رفض طلب المعلم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full" onValueChange={setStatusFilter}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="pending" className="flex-1">
            قيد الانتظار
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">
            مقبولة
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">
            مرفوضة
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <TeachersList 
            applications={filteredApplications}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewDetails={handleViewTeacher}
            onApprove={handleApproveTeacher}
            onReject={handleRejectClick}
            status="pending"
          />
        </TabsContent>
        <TabsContent value="approved">
          <TeachersList 
            applications={filteredApplications}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewDetails={handleViewTeacher}
            onApprove={handleApproveTeacher}
            onReject={handleRejectClick}
            status="approved"
          />
        </TabsContent>
        <TabsContent value="rejected">
          <TeachersList 
            applications={filteredApplications}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewDetails={handleViewTeacher}
            onApprove={handleApproveTeacher}
            onReject={handleRejectClick}
            status="rejected"
          />
        </TabsContent>
      </Tabs>

      {/* Teacher Details Dialog */}
      <Dialog open={showTeacherDetails} onOpenChange={setShowTeacherDetails}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب المعلم</DialogTitle>
            <DialogDescription>
              مراجعة كاملة لطلب المعلم ومؤهلاته
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-4">
                    {selectedTeacher.avatar_url ? (
                      <img 
                        src={selectedTeacher.avatar_url} 
                        alt={`${selectedTeacher.first_name} ${selectedTeacher.last_name}`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-muted-foreground">
                        {selectedTeacher.first_name?.charAt(0)}{selectedTeacher.last_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-center">
                    {selectedTeacher.first_name} {selectedTeacher.last_name}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {selectedTeacher.email}
                  </p>
                  <ApplicationStatusBadge status={selectedTeacher.status} />
                </div>
                
                <div className="md:w-2/3 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">سعر الساعة</p>
                      <p className="font-medium">{selectedTeacher.hourly_rate} ر.س</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">سنوات الخبرة</p>
                      <p className="font-medium">{selectedTeacher.years_experience} سنوات</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">اللغة الأم</p>
                      <p className="font-medium">{selectedTeacher.native_language}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المنطقة الزمنية</p>
                      <p className="font-medium">{selectedTeacher.timezone || 'غير محدد'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">المؤهلات التعليمية</p>
                    <p className="font-medium">{selectedTeacher.education || 'لم يتم توفير معلومات'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">نبذة شخصية</p>
                    <p className="font-medium">{selectedTeacher.bio || 'لم يتم توفير نبذة'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">أسلوب التدريس</p>
                    <p className="font-medium">{selectedTeacher.teaching_style || 'لم يتم توفير معلومات'}</p>
                  </div>
                </div>
              </div>

              {selectedTeacher.introduction_video_url && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Video className="h-5 w-5 mr-2" /> 
                      فيديو التعريف
                    </CardTitle>
                    <CardDescription>
                      فيديو تعريفي شخصي من المعلم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full" 
                        src={selectedTeacher.introduction_video_url}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedTeacher.status === 'rejected' && selectedTeacher.rejection_reason && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-red-600">سبب الرفض</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedTeacher.rejection_reason}</p>
                  </CardContent>
                </Card>
              )}
              
              <DialogFooter className="gap-2 flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setShowTeacherDetails(false)}>
                  إغلاق
                </Button>
                {selectedTeacher.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50" 
                      onClick={() => {
                        setShowTeacherDetails(false);
                        handleRejectClick(selectedTeacher);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      رفض الطلب
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={() => {
                        handleApproveTeacher(selectedTeacher.id);
                        setShowTeacherDetails(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      قبول الطلب
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>رفض طلب المعلم</DialogTitle>
            <DialogDescription>
              يرجى تقديم سبب للرفض ليتم إعلام المعلم به
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="اذكر سبب رفض الطلب"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectTeacher}
              disabled={!rejectionReason.trim()}
            >
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeachersList({ 
  applications, 
  isLoading, 
  searchQuery, 
  setSearchQuery, 
  onViewDetails, 
  onApprove, 
  onReject, 
  status 
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="البحث عن معلم بالاسم أو البريد الإلكتروني" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعلم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>المؤهلات</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>فيديو تعريفي</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  {status === 'pending' 
                    ? 'لا توجد طلبات معلمين قيد الانتظار'
                    : status === 'approved'
                    ? 'لا يوجد معلمين مقبولين'
                    : 'لا يوجد معلمين مرفوضين'}
                </TableCell>
              </TableRow>
            ) : (
              applications.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        {teacher.avatar_url ? (
                          <img 
                            src={teacher.avatar_url} 
                            alt={`${teacher.first_name} ${teacher.last_name}`} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {teacher.first_name?.charAt(0)}{teacher.last_name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span>{teacher.first_name} {teacher.last_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell className="truncate max-w-xs">
                    {teacher.education || 'غير متوفر'}
                  </TableCell>
                  <TableCell>
                    {new Date(teacher.created_at).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    {teacher.introduction_video_url ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        متوفر
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        غير متوفر
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onViewDetails(teacher)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onApprove(teacher.id)}
                            title="قبول الطلب"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onReject(teacher)}
                            title="رفض الطلب"
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ApplicationStatusBadge({ status }) {
  const statusConfig = {
    pending: { 
      label: 'قيد الانتظار', 
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      icon: <Clock className="h-4 w-4 mr-1" />
    },
    approved: { 
      label: 'مقبول', 
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: <CheckCircle className="h-4 w-4 mr-1" />
    },
    rejected: { 
      label: 'مرفوض', 
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: <XCircle className="h-4 w-4 mr-1" />
    }
  };

  const config = statusConfig[status] || { 
    label: status, 
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };

  return (
    <Badge variant="outline" className={`${config.className} flex items-center text-sm px-3 py-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
