
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import TeacherVerification from '@/components/admin/TeacherVerification';
import PlatformStatistics from '@/components/admin/PlatformStatistics';
import ContentManagement from '@/components/admin/ContentManagement';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-3xl font-bold mb-6">لوحة تحكم المشرف</h1>
        
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="statistics" className="flex-1">الإحصائيات</TabsTrigger>
            <TabsTrigger value="users" className="flex-1">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="teachers" className="flex-1">طلبات المعلمين</TabsTrigger>
            <TabsTrigger value="content" className="flex-1">إدارة المحتوى</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics">
            <PlatformStatistics />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="teachers">
            <TeacherVerification />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
