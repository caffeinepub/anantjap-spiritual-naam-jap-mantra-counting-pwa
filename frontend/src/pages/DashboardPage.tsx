import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useDevotee } from '../contexts/DevoteeContext';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<string>('');

  useEffect(() => {
    if (currentDevotee) {
      loadChartData();
    }
  }, [currentDevotee, viewMode]);

  const loadChartData = () => {
    if (!currentDevotee) return;

    const gods = ['ganesh', 'vishnu', 'shiv', 'durga', 'surya'];
    const data: any[] = [];

    if (viewMode === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData: any = { date: dateStr };

        gods.forEach(god => {
          const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
          const saved = localStorage.getItem(key);
          dayData[god] = saved ? JSON.parse(saved).count : 0;
        });

        data.push(dayData);
      }
    } else if (viewMode === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekData: any = { week: `Week ${4 - i}` };
        
        gods.forEach(god => {
          let total = 0;
          for (let j = 0; j < 7; j++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7 + j));
            const dateStr = date.toISOString().split('T')[0];
            const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
            const saved = localStorage.getItem(key);
            total += saved ? JSON.parse(saved).count : 0;
          }
          weekData[god] = total;
        });

        data.push(weekData);
      }
    } else if (viewMode === 'monthly') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthData: any = { month: date.toLocaleDateString('en', { month: 'short' }) };

        gods.forEach(god => {
          let total = 0;
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          
          for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
            const dateStr = checkDate.toISOString().split('T')[0];
            const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
            const saved = localStorage.getItem(key);
            total += saved ? JSON.parse(saved).count : 0;
          }
          monthData[god] = total;
        });

        data.push(monthData);
      }
    } else if (viewMode === 'yearly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthData: any = { month: date.toLocaleDateString('en', { month: 'short' }) };

        gods.forEach(god => {
          let total = 0;
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          
          for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
            const dateStr = checkDate.toISOString().split('T')[0];
            const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
            const saved = localStorage.getItem(key);
            total += saved ? JSON.parse(saved).count : 0;
          }
          monthData[god] = total;
        });

        data.push(monthData);
      }
    }

    setChartData(data);
  };

  const generateAIReport = () => {
    if (!currentDevotee) return;

    const gods = ['ganesh', 'vishnu', 'shiv', 'durga', 'surya'];
    const totals: Record<string, number> = {};
    let totalJaps = 0;

    gods.forEach(god => {
      const key = `anantjap_${currentDevotee.id}_${god}`;
      const saved = localStorage.getItem(key);
      const count = saved ? JSON.parse(saved).japCount : 0;
      totals[god] = count;
      totalJaps += count;
    });

    const mostChanted = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    const consistency = totalJaps > 1000 ? 'excellent' : totalJaps > 500 ? 'good' : 'developing';

    const report = `🙏 Divine Progress Report

Dear ${currentDevotee.name},

Your spiritual journey shows ${consistency} consistency with ${totalJaps} total japs completed. 

Your most devoted practice is with ${mostChanted[0].charAt(0).toUpperCase() + mostChanted[0].slice(1)} (${mostChanted[1]} japs), showing deep connection and dedication.

${totalJaps > 1000 
  ? 'Your unwavering devotion is truly inspiring. Continue this beautiful practice with the same dedication.' 
  : totalJaps > 500 
  ? 'You are building a strong spiritual foundation. Keep nurturing this sacred practice daily.' 
  : 'Every jap brings you closer to divine peace. Start with small daily goals and watch your practice flourish.'}

May your path be filled with divine blessings and inner peace. 🕉️`;

    setAiReport(report);
    toast.success('Divine report generated');
  };

  const chartConfig = {
    ganesh: { label: 'Ganesh', color: 'oklch(var(--chart-1))' },
    vishnu: { label: 'Vishnu', color: 'oklch(var(--chart-2))' },
    shiv: { label: 'Shiv', color: 'oklch(var(--chart-3))' },
    durga: { label: 'Durga', color: 'oklch(var(--chart-4))' },
    surya: { label: 'Surya', color: 'oklch(var(--chart-5))' },
  };

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 spiritual-gradient bg-clip-text text-transparent">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground">Track your spiritual progress</p>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">{t('daily')}</TabsTrigger>
          <TabsTrigger value="weekly">{t('weekly')}</TabsTrigger>
          <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
          <TabsTrigger value="yearly">{t('yearly')}</TabsTrigger>
        </TabsList>

        <TabsContent value={viewMode} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Jap Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={viewMode === 'daily' ? 'date' : viewMode === 'weekly' ? 'week' : 'month'} 
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ganesh" fill="var(--color-ganesh)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="vishnu" fill="var(--color-vishnu)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="shiv" fill="var(--color-shiv)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="durga" fill="var(--color-durga)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="surya" fill="var(--color-surya)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendar View */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-lotus" />
            <CardTitle>{t('calendar_view')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* AI Divine Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-golden" />
              <CardTitle>{t('ai_report')}</CardTitle>
            </div>
            <Button onClick={generateAIReport} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {t('generate_report')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiReport ? (
            <div className="whitespace-pre-line text-sm leading-relaxed p-4 bg-muted/30 rounded-lg">
              {aiReport}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Click "Generate Report" to see your divine progress analysis
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

