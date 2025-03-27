
import React from 'react';
import Layout from '@/components/Layout';
import TeacherFilters from '@/components/teachers/TeacherFilters';
import TeachersList from '@/components/teachers/TeachersList';
import TeachersPagination from '@/components/teachers/TeachersPagination';
import { useTeachersList } from '@/hooks/useTeachersList';

const TeachersPage: React.FC = () => {
  const {
    teachers,
    loading,
    currentPage,
    filters,
    sort,
    totalPages,
    handleFiltersChange,
    handleSortChange,
    handlePageChange
  } = useTeachersList(9); // Display 9 teachers per page
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" dir="rtl">معلمي اللغة الكورية</h1>
          <p className="text-muted-foreground" dir="rtl">ابحث عن المعلم المناسب لتعلم اللغة الكورية</p>
        </div>
        
        <TeacherFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          activeSort={sort}
          onSortChange={handleSortChange}
        />
        
        <TeachersList 
          teachers={teachers} 
          loading={loading} 
        />
        
        <TeachersPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};

export default TeachersPage;
