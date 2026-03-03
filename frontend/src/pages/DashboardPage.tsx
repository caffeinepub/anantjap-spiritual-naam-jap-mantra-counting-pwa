import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useDevotee } from '../contexts/DevoteeContext';
import { toast } from 'sonner';

const GODS = [
  { key: 'ganesh', label: 'Ganesh', emoji: '🐘' },
  { key: 'vishnu', label: 'Vishnu', emoji: '🔱' },
  { key: 'shiv', label: 'Shiv', emoji: '🕉️' },
  { key: 'durga', label: 'Durga', emoji: '⚔️' },
  { key: 'surya', label: 'Surya', emoji: '☀️' },
];

interface DayJapData {
  god: string;
  label: string;
  emoji: string;
  count: number;
}

function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<string>('');
  const [dayJapData, setDayJapData] = useState<DayJapData[]>([]);

  useEffect(() => {
    if (currentDevotee) {
      loadChartData();
    }
  }, [currentDevotee, viewMode]);

  useEffect(() => {
    if (currentDevotee && selectedDate) {
      loadDayJapData(selectedDate);
    }
  }, [currentDevotee, selectedDate]);

  const loadDayJapData = (date: Date) => {
    if (!currentDevotee) return;
    const dateStr = getLocalDateKey(date);
    const data: DayJapData[] = GODS.map(god => {
      const key = `anantjap_history_${currentDevotee.id}_${god.key}_${dateStr}`;
      const saved = localStorage.getItem(key);
      const count = saved ? JSON.parse(saved).count : 0;
      return { god: god.key, label: god.label, emoji: god.emoji, count };
    });
    setDayJapData(data);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && currentDevotee) {
      loadDayJapData(date);
    }
  };

  const loadChartData = () => {
    if (!currentDevotee) return;
    const gods = GODS.map(g => g.key);
    const data: any[] = [];

    if (viewMode === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = getLocalDateKey(date);
        const dayData: any = { date: dateStr };
        gods.forEach(god => {
          const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
          const saved = localStorage.getItem(key);
          dayData[god] = saved ? JSON.parse(saved).count : 0;
        });
        data.push(dayData);
      }
    } else if (viewMode === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        const weekData: any = { week: `Week ${4 - i}` };
        gods.forEach(god => {
          let total = 0;
          for (let j = 0; j < 7; j++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7 + j));
            const dateStr = getLocalDateKey(date);
            const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
            const saved = localStorage.getItem(key);
            total += saved ? JSON.parse(saved).count : 0;
          }
          weekData[god] = total;
        });
        data.push(weekData);
      }
    } else if (viewMode === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthData: any = { month: date.toLocaleDateString('en', { month: 'short' }) };
        gods.forEach(god => {
          let total = 0;
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
            const dateStr = getLocalDateKey(checkDate);
            const key = `anantjap_history_${currentDevotee.id}_${god}_${dateStr}`;
            const saved = localStorage.getItem(key);
            total += saved ? JSON.parse(saved).count : 0;
          }
          monthData[god] = total;
        });
        data.push(monthData);
      }
    } else if (viewMode === 'yearly') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthData: any = { month: date.toLocaleDateString('en', { month: 'short' }) };
        gods.forEach(god => {
          let total = 0;
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
            const dateStr = getLocalDateKey(checkDate);
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
    const gods = GODS.map(g => g.key);
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

  const totalDayJaps = dayJapData.reduce((sum, d) => sum + d.count, 0);
  const formattedSelectedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="container px-3 py-5 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="mb-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 spiritual-gradient bg-clip-text text-transparent">
          {t('dashboard')}
        </h1>
        <p className="text-xs text-muted-foreground">Track your spiritual progress</p>
      </div>

      {/* Chart Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="mb-5">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily" className="text-xs sm:text-sm">{t('daily')}</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs sm:text-sm">{t('weekly')}</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">{t('monthly')}</TabsTrigger>
          <TabsTrigger value="yearly" className="text-xs sm:text-sm">{t('yearly')}</TabsTrigger>
        </TabsList>

        <TabsContent value={viewMode} className="mt-3">
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-sm">Jap Progress</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <ChartContainer config={chartConfig} className="h-[220px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={viewMode === 'daily' ? 'date' : viewMode === 'weekly' ? 'week' : 'month'}
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis fontSize={10} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ganesh" fill="var(--color-ganesh)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="vishnu" fill="var(--color-vishnu)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="shiv" fill="var(--color-shiv)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="durga" fill="var(--color-durga)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="surya" fill="var(--color-surya)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendar + Day Detail */}
      <Card className="mb-5">
        <CardHeader className="pb-1 pt-3 px-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-terracotta" />
            <CardTitle className="text-sm">{t('calendar_view')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start">

            {/* Compact Calendar */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-start shrink-0">
              <div
                style={{ '--cell-size': '2rem' } as React.CSSProperties}
                className="rounded-lg border border-terracotta/20 overflow-hidden bg-background"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-2 text-xs [&_[role=gridcell]]:text-xs [&_th]:text-xs [&_th]:font-medium [&_button]:text-xs"
                />
              </div>
            </div>

            {/* Day Detail Panel */}
            <div className="flex-1 w-full min-w-0">
              {selectedDate ? (
                <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 dark:bg-terracotta/10 overflow-hidden h-full">
                  {/* Header */}
                  <div className="px-3 py-2 bg-terracotta/15 dark:bg-terracotta/20 border-b border-terracotta/20 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-terracotta shrink-0" />
                    <span className="text-xs font-semibold text-terracotta font-cinzel truncate">
                      {formattedSelectedDate}
                    </span>
                  </div>

                  {/* God-wise counts */}
                  <div className="p-3 space-y-1.5">
                    {totalDayJaps === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-2xl mb-1">🙏</p>
                        <p className="text-xs font-medium text-muted-foreground">
                          No japs recorded on this day
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 opacity-70">
                          Start your practice to see counts here
                        </p>
                      </div>
                    ) : (
                      <>
                        {dayJapData.map(item =>
                          item.count > 0 ? (
                            <div
                              key={item.god}
                              className="flex items-center justify-between rounded-lg px-3 py-2 bg-background/60 dark:bg-background/30 border border-terracotta/15"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{item.emoji}</span>
                                <span className="text-xs font-medium text-foreground">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-terracotta">
                                  {item.count.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground">japs</span>
                              </div>
                            </div>
                          ) : null
                        )}
                        <div className="pt-2 border-t border-terracotta/20 flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">Total</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-terracotta">
                              {totalDayJaps.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">japs</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-terracotta/30 p-6 text-center h-full flex flex-col items-center justify-center">
                  <CalendarIcon className="h-7 w-7 text-terracotta/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Select a date to view jap counts</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Divine Report */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-golden" />
              <CardTitle className="text-sm">{t('ai_report')}</CardTitle>
            </div>
            <Button onClick={generateAIReport} variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-2">
              <Sparkles className="h-3 w-3" />
              {t('generate_report')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {aiReport ? (
            <div className="whitespace-pre-line text-sm leading-relaxed p-3 bg-muted/30 rounded-lg">
              {aiReport}
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-xs py-5">
              Click "Generate Report" to see your divine progress analysis
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
