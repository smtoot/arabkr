
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Teacher, TeacherSpecialty } from '@/types/teacher';

// Map specialties to Arabic
const specialtyLabels: Record<TeacherSpecialty, string> = {
  'conversation': 'محادثة',
  'grammar': 'قواعد',
  'vocabulary': 'مفردات',
  'reading': 'قراءة',
  'writing': 'كتابة',
  'business_korean': 'كورية الأعمال',
  'exam_preparation': 'تحضير الامتحانات'
};

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const { profile, hourly_rate, avg_rating, total_reviews, specialties } = teacher;
  
  const getInitials = () => {
    if (!profile) return 'NA';
    return `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`;
  };

  return (
    <Link to={`/teachers/${teacher.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative pt-4 px-4">
          <div className="flex justify-between items-start mb-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || ''} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-primary">{avg_rating.toFixed(1)}</span>
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-xs text-muted-foreground">({total_reviews})</span>
              </div>
              <div className="text-primary font-bold">
                {hourly_rate} ر.س/ساعة
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-1 text-right" dir="rtl">
            {profile.first_name} {profile.last_name}
          </h3>
          
          <div className="line-clamp-2 text-sm text-muted-foreground mb-3 text-right h-10" dir="rtl">
            {profile.bio || 'لا توجد معلومات متاحة'}
          </div>
        </div>
        
        <CardFooter className="flex flex-wrap gap-1 justify-end border-t p-3 bg-muted/30" dir="rtl">
          {specialties && specialties.map((specialty, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              {specialtyLabels[specialty] || specialty}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TeacherCard;
