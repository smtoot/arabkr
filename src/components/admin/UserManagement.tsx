
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, updateUserStatus } from '@/services/api/adminService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserCog, Ban, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const { toast } = useToast();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspendUser = async () => {
    try {
      await updateUserStatus(selectedUser.id, 'suspended');
      toast({
        title: "تم تعليق المستخدم",
        description: `تم تعليق حساب المستخدم ${selectedUser.first_name} ${selectedUser.last_name} بنجاح.`,
      });
      refetch();
      setShowSuspendDialog(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تعليق حساب المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await updateUserStatus(userId, 'active');
      toast({
        title: "تم تفعيل المستخدم",
        description: "تم تفعيل حساب المستخدم بنجاح.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تفعيل حساب المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="البحث عن مستخدم بالاسم أو البريد الإلكتروني" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-64">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="دور المستخدم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="student">طالب</SelectItem>
              <SelectItem value="teacher">معلم</SelectItem>
              <SelectItem value="admin">مشرف</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ التسجيل</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
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
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  لا توجد نتائج مطابقة لبحثك
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={`${user.first_name} ${user.last_name}`} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span>{user.first_name} {user.last_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewUser(user)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.status === 'suspended' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleActivateUser(user.id)}
                          title="تفعيل المستخدم"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSuspendUser(user)}
                          title="تعليق المستخدم"
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
            <DialogDescription>
              عرض معلومات المستخدم الكاملة
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar_url ? (
                    <img 
                      src={selectedUser.avatar_url} 
                      alt={`${selectedUser.first_name} ${selectedUser.last_name}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCog className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الاسم الأول</p>
                  <p className="font-medium">{selectedUser.first_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الاسم الأخير</p>
                  <p className="font-medium">{selectedUser.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                  <p className="font-medium">{selectedUser.phone || 'غير متوفر'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الدور</p>
                  <RoleBadge role={selectedUser.role} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <StatusBadge status={selectedUser.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                  <p className="font-medium">
                    {new Date(selectedUser.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">آخر تسجيل دخول</p>
                  <p className="font-medium">
                    {selectedUser.last_sign_in_at 
                      ? new Date(selectedUser.last_sign_in_at).toLocaleDateString('ar-SA')
                      : 'لم يسجل الدخول بعد'}
                  </p>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">نبذة</p>
                  <p className="font-medium">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Confirmation */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تعليق حساب المستخدم</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في تعليق حساب هذا المستخدم؟ لن يتمكن من تسجيل الدخول أو استخدام المنصة حتى يتم إعادة تفعيل حسابه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspendUser} className="bg-destructive text-destructive-foreground">
              تعليق الحساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleBadge({ role }) {
  const roleConfig = {
    admin: { label: 'مشرف', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    teacher: { label: 'معلم', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    student: { label: 'طالب', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
  };

  const config = roleConfig[role] || { label: role, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    active: { label: 'نشط', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    suspended: { label: 'معلق', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    pending: { label: 'في الانتظار', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' }
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
