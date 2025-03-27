
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { Review } from '@/types/teacher';

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">جاري تحميل التقييمات...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لا توجد تقييمات بعد
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={review.student.avatar_url || ''} alt={review.student.first_name} />
                <AvatarFallback>
                  {review.student.first_name.charAt(0)}
                  {review.student.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {review.student.first_name} {review.student.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), 'yyyy/MM/dd')}
                </div>
              </div>
            </div>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <div className="mt-3 text-sm">
              {review.comment}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
