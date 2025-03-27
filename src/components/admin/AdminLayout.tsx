
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }
  
  // Redirect if not admin
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto py-4">
          <Alert className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>وضع المشرف</AlertTitle>
            <AlertDescription>
              أنت تستخدم الآن صلاحيات المشرف. يرجى توخي الحذر عند إجراء تغييرات.
            </AlertDescription>
          </Alert>
          {children}
        </div>
      </div>
    </Layout>
  );
}
