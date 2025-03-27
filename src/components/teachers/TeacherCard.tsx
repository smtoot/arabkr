
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Book } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TeacherCardProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  hourlyRate: number;
  reviewCount: number;
  specialties: string[];
  experience: number;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  name,
  avatar,
  rating,
  hourlyRate,
  reviewCount,
  specialties,
  experience
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground mr-1">({reviewCount} مراجعة)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{hourlyRate} ريال</div>
              <div className="text-sm text-muted-foreground">في الساعة</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-muted-foreground ml-1" />
              <span className="text-sm">{experience} سنوات خبرة في التدريس</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">{specialty}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-muted/30 flex justify-between">
        <Button asChild variant="outline">
          <Link to={`/teachers/${id}`}>عرض الملف الشخصي</Link>
        </Button>
        <Button asChild>
          <Link to={`/booking/${id}`}>
            <Book className="h-4 w-4 ml-1" />
            حجز درس
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherCard;
