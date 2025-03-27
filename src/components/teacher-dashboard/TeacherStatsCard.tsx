
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TeacherStatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

export const TeacherStatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  isLoading = false
}: TeacherStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
