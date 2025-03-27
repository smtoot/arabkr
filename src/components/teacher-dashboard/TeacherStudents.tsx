
import { useState } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TeacherStudentsProps {
  teacherId?: string;
}

export default function TeacherStudents({ teacherId }: TeacherStudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - will be replaced with real data later
  const students: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <h2 className="text-2xl font-bold">الطلاب</h2>
        
        <div className="w-full md:w-auto flex gap-2">
          <Input
            placeholder="بحث عن طالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>
      
      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">لا يوجد طلاب حاليًا</p>
            <p className="text-muted-foreground text-center mb-4">
              سيظهر الطلاب هنا بمجرد أن يشتركوا في الدروس معك
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>عدد الدروس</TableHead>
                <TableHead>آخر درس</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Student rows will be mapped here */}
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  لا توجد بيانات متاحة
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
