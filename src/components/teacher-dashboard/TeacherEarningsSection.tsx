
import { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TeacherStatsCard } from './TeacherStatsCard';

interface TeacherEarningsSectionProps {
  teacherId?: string;
}

export const TeacherEarningsSection = ({ teacherId }: TeacherEarningsSectionProps) => {
  // This would be connected to real data in a full implementation
  const [period, setPeriod] = useState('month');
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الأرباح</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TeacherStatsCard
          title="الأرباح الإجمالية"
          value="0 ريال"
          description="منذ بداية الاشتراك"
          icon={DollarSign}
        />
        
        <TeacherStatsCard
          title="أرباح الشهر الحالي"
          value="0 ريال"
          description="هذا الشهر"
          icon={TrendingUp}
        />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">المتاح للسحب</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0 ريال</div>
            <div className="mt-2">
              <Button disabled size="sm">طلب سحب</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>تاريخ المعاملات</CardTitle>
          <CardDescription>سجل بجميع المعاملات المالية الخاصة بك</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="earnings" className="mb-4">
            <TabsList>
              <TabsTrigger value="earnings">الأرباح</TabsTrigger>
              <TabsTrigger value="withdrawals">عمليات السحب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="earnings" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الطالب</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        لا توجد معاملات متاحة
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="withdrawals" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>رقم المعاملة</TableHead>
                      <TableHead>الطريقة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        لا توجد عمليات سحب متاحة
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
