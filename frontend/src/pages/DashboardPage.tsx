import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

// ─── Stylish Custom Calendar ────────────────────────────────────────────────
interface SpiritualCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  datesWithData: Set<string>;
}

function SpiritualCalendar({ selected, onSelect, datesWithData }: SpiritualCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid: 6 rows × 7 cols
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Leading days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), isCurrentMonth: true });
    }

    // Trailing days to fill 6 rows
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(viewYear, viewMonth + 1, d), isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  return (
    <div className="spiritual-calendar w-full select-none">
      {/* Month / Year Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={goToPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200
            hover:bg-terracotta/15 active:scale-90 text-terracotta"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="font-heading font-semibold text-base tracking-wide text-foreground">
            {MONTH_NAMES[viewMonth]}
          </span>
          <span className="ml-2 text-sm font-medium text-muted-foreground">{viewYear}</span>
        </div>

        <button
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200
            hover:bg-terracotta/15 active:scale-90 text-terracotta"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(label => (
          <div
            key={label}
            className="text-center text-[11px] font-semibold tracking-widest uppercase text-terracotta py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Thin divider */}
      <div className="h-px bg-terracotta/20 mb-2 mx-1" />

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const dateKey = getLocalDateKey(date);
          const isToday = isSameDay(date, today);
          const isSelected = selected ? isSameDay(date, selected) : false;
          const hasData = datesWithData.has(dateKey);

          return (
            <div key={idx} className="flex justify-center">
              <button
                onClick={() => onSelect(date)}
                className={[
                  'relative flex flex-col items-center justify-center w-9 h-9 rounded-full text-sm font-medium',
                  'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60',
                  isSelected
                    ? 'bg-terracotta text-cream shadow-md scale-105'
                    : isToday
                      ? 'ring-2 ring-terracotta text-terracotta font-bold hover:bg-terracotta/10'
                      : isCurrentMonth
                        ? 'text-foreground hover:bg-terracotta/10 hover:text-terracotta'
                        : 'text-muted-foreground/40 hover:bg-muted/30',
                ].join(' ')}
                aria-label={date.toDateString()}
                aria-pressed={isSelected}
              >
                <span className="leading-none">{date.getDate()}</span>
                {/* Jap data dot */}
                {hasData && isCurrentMonth && (
                  <span
                    className={[
                      'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                      isSelected ? 'bg-cream/80' : 'bg-terracotta',
                    ].join(' ')}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const { t } = useLanguage();
  const { currentDevotee } = useDevotee();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<string>('');
  const [dayJapData, setDayJapData] = useState<DayJapData[]>([]);

  // Collect all dates that have any jap data for the current devotee
  const datesWithData = useMemo<Set<string>>(() => {
    if (!currentDevotee) return new Set();
    const keys = Object.keys(localStorage);
    const prefix = `anantjap_history_${currentDevotee.id}_`;
    const dates = new Set<string>();
    keys.forEach(k => {
      if (k.startsWith(prefix)) {
        // key format: anantjap_history_{id}_{god}_{YYYY-MM-DD}
        const parts = k.replace(prefix, '').split('_');
        if (parts.length >= 2) {
          const dateKey = parts[parts.length - 1];
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
            try {
              const saved = localStorage.getItem(k);
              if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.count > 0) dates.add(dateKey);
              }
            } catch { /* ignore */ }
          }
        }
      }
    });
    return dates;
  }, [currentDevotee, dayJapData]);

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (currentDevotee) {
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
    ? selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
      <div className="mb-5">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <CalendarIcon className="h-4 w-4 text-terracotta" />
          <h2 className="text-sm font-semibold font-heading text-foreground tracking-wide">
            {t('calendar_view')}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* ── Stylish Calendar Card ── */}
          <div className="w-full lg:w-auto lg:shrink-0">
            <div className="
              relative overflow-hidden rounded-2xl
              bg-card border border-terracotta/25
              shadow-sacred
              p-4 sm:p-5
            ">
              {/* Decorative top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 anant-gradient rounded-t-2xl" />

              {/* Om symbol watermark */}
              <div className="absolute bottom-3 right-4 text-5xl opacity-[0.04] pointer-events-none select-none font-heading">
                🕉
              </div>

              <SpiritualCalendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                datesWithData={datesWithData}
              />

              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-terracotta/15 flex items-center gap-4 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
                  <span>Jap recorded</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full ring-2 ring-terracotta inline-block" />
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Day Detail Panel ── */}
          <div className="flex-1 w-full min-w-0">
            {selectedDate ? (
              <div className="rounded-2xl border border-terracotta/25 bg-card shadow-sacred overflow-hidden h-full">
                {/* Header */}
                <div className="px-4 py-3 anant-gradient flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-cream shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-cream/70 font-medium uppercase tracking-widest leading-none mb-0.5">
                      Selected Date
                    </p>
                    <p className="text-sm font-semibold text-cream font-heading truncate leading-tight">
                      {formattedSelectedDate}
                    </p>
                  </div>
                </div>

                {/* God-wise counts */}
                <div className="p-4 space-y-2">
                  {totalDayJaps === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">🙏</p>
                      <p className="text-sm font-medium text-muted-foreground">
                        No japs recorded on this day
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-70">
                        Start your practice to see counts here
                      </p>
                    </div>
                  ) : (
                    <>
                      {dayJapData.map(item =>
                        item.count > 0 ? (
                          <div
                            key={item.god}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5
                              bg-terracotta/5 dark:bg-terracotta/10
                              border border-terracotta/15
                              hover:border-terracotta/30 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{item.emoji}</span>
                              <span className="text-sm font-medium text-foreground">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-base font-bold text-terracotta">
                                {item.count.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">japs</span>
                            </div>
                          </div>
                        ) : null
                      )}
                      <div className="pt-2 border-t border-terracotta/20 flex items-center justify-between px-1">
                        <span className="text-sm font-semibold text-foreground font-heading">Total</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-terracotta">
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
              <div className="rounded-2xl border border-dashed border-terracotta/30 p-8 text-center
                h-full flex flex-col items-center justify-center bg-card/50">
                <CalendarIcon className="h-8 w-8 text-terracotta/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a date to view jap counts</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
