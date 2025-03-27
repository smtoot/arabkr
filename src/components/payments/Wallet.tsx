
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet as WalletIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WalletProps {
  balance: number;
  currency: string;
  isLoading: boolean;
  onRecharge: () => void;
}

export function Wallet({ balance, currency, isLoading, onRecharge }: WalletProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="h-6 w-6 text-primary" />
          المحفظة الإلكترونية
        </CardTitle>
        <CardDescription>
          رصيد محفظتك ومعلومات الدفع
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16 w-40" />
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">الرصيد الحالي</h3>
              <div className="text-3xl font-bold mt-1">
                {balance.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">{currency}</span>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium">آخر تحديث</h4>
                <p className="text-lg">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium">المعاملات</h4>
                <Button 
                  variant="link" 
                  onClick={() => document.getElementById('history-tab')?.click()}
                  className="p-0 h-auto"
                >
                  عرض السجل
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={onRecharge}>
          شحن المحفظة
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/teachers')}
        >
          حجز درس
        </Button>
      </CardFooter>
    </Card>
  );
}
