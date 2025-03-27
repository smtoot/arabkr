
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WalletCardProps {
  walletData?: {
    balance: number;
    currency: string;
  };
  isLoading: boolean;
}

export const WalletCard = ({ walletData, isLoading }: WalletCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          الرصيد
        </CardTitle>
        <CardDescription>رصيد محفظتك الحالي</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-3xl font-bold">
            {walletData?.balance.toFixed(2) || 0} 
            <span className="text-lg font-normal text-muted-foreground mr-1">
              {walletData?.currency || 'ر.س'}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/wallet')}>
          شحن الرصيد
        </Button>
      </CardFooter>
    </Card>
  );
};
