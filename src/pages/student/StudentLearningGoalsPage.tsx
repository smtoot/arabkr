
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { LearningGoalsSection } from '@/components/student-dashboard/LearningGoalsSection';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from 'lucide-react';

export default function StudentLearningGoalsPage() {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div dir="rtl" className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')}>
                <HomeIcon className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/student/dashboard')}>
                لوحة التحكم
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>أهداف التعلم</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="mb-6 text-3xl font-bold">أهداف التعلم</h1>
        
        <div className="mb-8">
          <LearningGoalsSection />
        </div>
      </div>
    </Layout>
  );
}
