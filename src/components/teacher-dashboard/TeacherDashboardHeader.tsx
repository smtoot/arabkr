
import { Skeleton } from '@/components/ui/skeleton';
import { Teacher } from '@/types/teacher';

interface TeacherDashboardHeaderProps {
  teacher: Teacher | null;
  isLoading: boolean;
}

export default function TeacherDashboardHeader({ teacher, isLoading }: TeacherDashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">لوحة تحكم المعلم</h1>
        {isLoading ? (
          <Skeleton className="h-6 w-40 mt-2" />
        ) : (
          <p className="text-muted-foreground mt-2">
            مرحبًا، {teacher?.profile.first_name || 'المعلم'} - معلم اللغة الكورية
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="text-lg">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-right">
              <div className="font-semibold">{teacher?.hourly_rate || 0} ريال/ساعة</div>
              <div className="text-sm text-muted-foreground">سعر الدرس</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
