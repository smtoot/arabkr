
import React from 'react';
import TeacherCard from '@/components/teachers/TeacherCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Teacher } from '@/types/teacher';

interface TeachersListProps {
  teachers: Teacher[];
  loading: boolean;
}

const TeachersList: React.FC<TeachersListProps> = ({ teachers, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground" dir="rtl">
        لم يتم العثور على معلمين مطابقين لمعايير البحث
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
};

export default TeachersList;
