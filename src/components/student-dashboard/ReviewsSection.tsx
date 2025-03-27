
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface ReviewType {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  teacher_id: string;
  teachers: {
    profiles: {
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    };
  };
}

interface ReviewsSectionProps {
  reviews?: ReviewType[];
  isLoading: boolean;
}

export const ReviewsSection = ({ reviews, isLoading }: ReviewsSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">آخر التقييمات</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(2).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : reviews && reviews.length > 0 ? (
          reviews.slice(0, 3).map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground mr-1">
                    ({review.rating}/5)
                  </span>
                </div>
                <p className="text-sm mb-2">{review.comment || 'لا يوجد تعليق'}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), 'PPP', { locale: ar })}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 bg-muted rounded-lg p-6 text-center">
            <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
};
