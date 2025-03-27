
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchPlatformStatistics } from '@/services/api/adminService';

export default function PlatformStatistics() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchPlatformStatistics,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { userStats, lessonStats, revenueStats } = data || {
    userStats: [],
    lessonStats: [],
    revenueStats: []
  };

  // Mocked data for the pie chart
  const userTypeData = [
    { name: 'طلاب', value: 60, color: '#8884d8' },
    { name: 'معلمين', value: 30, color: '#82ca9d' },
    { name: 'مشرفين', value: 10, color: '#ffc658' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="إجمالي المستخدمين" 
          value={data?.totalUsers || 0} 
          description="مجموع كل المستخدمين المسجلين" 
          trend={+8}
        />
        <StatsCard 
          title="الدروس المكتملة" 
          value={data?.completedLessons || 0} 
          description="إجمالي الدروس المنجزة" 
          trend={+15}
        />
        <StatsCard 
          title="الإيرادات (ر.س)" 
          value={data?.totalRevenue?.toLocaleString() || '0'} 
          description="إجمالي الإيرادات" 
          trend={+12}
        />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="lessons">الدروس</TabsTrigger>
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>نمو المستخدمين</CardTitle>
              <CardDescription>عدد المستخدمين الجدد المسجلين شهريًا</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    users: { label: "المستخدمين", color: "hsl(var(--primary))" },
                  }}
                >
                  <AreaChart data={userStats}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الدروس</CardTitle>
              <CardDescription>عدد الدروس المحجوزة والمكتملة شهريًا</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    booked: { label: "محجوزة", color: "#8884d8" },
                    completed: { label: "مكتملة", color: "#82ca9d" },
                  }}
                >
                  <BarChart data={lessonStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="booked" fill="#8884d8" name="محجوزة" />
                    <Bar dataKey="completed" fill="#82ca9d" name="مكتملة" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>تقرير الإيرادات</CardTitle>
              <CardDescription>إجمالي الإيرادات الشهرية (ر.س)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    revenue: { label: "الإيرادات", color: "#82ca9d" },
                  }}
                >
                  <AreaChart data={revenueStats}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع المستخدمين</CardTitle>
            <CardDescription>نسب المستخدمين حسب نوع الحساب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أداء المنصة</CardTitle>
            <CardDescription>المقاييس الرئيسية للأداء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PerformanceMetric 
                label="معدل إكمال الدروس" 
                value={92} 
                color="bg-green-500" 
              />
              <PerformanceMetric 
                label="معدل الرضا" 
                value={87} 
                color="bg-blue-500" 
              />
              <PerformanceMetric 
                label="معدل الحجز المتكرر" 
                value={65} 
                color="bg-purple-500" 
              />
              <PerformanceMetric 
                label="نسبة النمو الشهري" 
                value={23} 
                color="bg-amber-500" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, trend }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`mt-2 flex items-center text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% من الشهر الماضي
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceMetric({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
