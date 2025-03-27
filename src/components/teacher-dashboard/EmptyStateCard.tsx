
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyStateCard = ({ icon: Icon, title, description }: EmptyStateCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-center">{title}</p>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
};
