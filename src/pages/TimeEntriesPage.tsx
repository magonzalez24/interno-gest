import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from '@/contexts/AuthContext';
import type { TimeEntry } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { NewTimeEntryModal } from '@/components/time-entries/NewTimeEntryModal';
import { TimeEntryDetailModal } from '@/components/time-entries/TimeEntryDetailModal';

type ViewMode = 'week' | 'month';

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Domingo) - 6 (Sábado)
  const diff = (day === 0 ? -6 : 1) - day; // Ajustar para que la semana empiece en lunes
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const createMonthMatrix = (baseDate: Date): Date[][] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = getStartOfWeek(firstOfMonth);

  const weeks: Date[][] = [];
  let current = new Date(start);

  // Generar hasta 6 semanas para cubrir cualquier mes
  for (let w = 0; w < 6; w += 1) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d += 1) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    // Si ya hemos pasado el mes y hemos cerrado una semana entera después del final de mes, paramos
    const lastDayInWeek = week[6];
    if (lastDayInWeek.getMonth() !== month && lastDayInWeek > firstOfMonth) {
      break;
    }
  }

  return weeks;
};

export const TimeEntriesPage = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => new Date().toISOString().slice(0, 7), // YYYY-MM
  );
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    () => getStartOfWeek(new Date()),
  );

  const employeeId = user?.employee?.id;

  useEffect(() => {
    const loadTimeEntries = async () => {
      if (!employeeId) return;
      try {
        setLoading(true);
        const data = await mockApi.getTimeEntries(employeeId);
        setTimeEntries(data);
      } catch (error) {
        console.error('Error loading time entries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTimeEntries();
  }, [employeeId]);

  const handleNewEntry = async () => {
    if (!employeeId) return;
    const data = await mockApi.getTimeEntries(employeeId);
    setTimeEntries(data);
  };

  const handleOpenDetail = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  const handleChangeWeek = (direction: 'prev' | 'next') => {
    if (viewMode !== 'week') {
      return;
    }

    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + (direction === 'prev' ? -7 : 7));
      return next;
    });
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const [yearStr, monthStr] = value.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      const firstDay = new Date(year, month - 1, 1);
      setCurrentWeekStart(getStartOfWeek(firstDay));
    }
  };

  const handleChangeMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth((prev) => {
      const [yearStr, monthStr] = prev.split('-');
      let year = Number(yearStr);
      let month = Number(monthStr); // 1-12

      if (Number.isNaN(year) || Number.isNaN(month)) {
        const today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
      }

      const delta = direction === 'prev' ? -1 : 1;
      let newMonth = month + delta;
      let newYear = year;

      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      const firstDay = new Date(newYear, newMonth - 1, 1);
      setCurrentWeekStart(getStartOfWeek(firstDay));

      const monthStrPadded = String(newMonth).padStart(2, '0');
      return `${newYear}-${monthStrPadded}`;
    });
  };

  if (loading) {
    return <div>Cargando imputaciones...</div>;
  }

  if (!employeeId) {
    return <div>No se encontró información del empleado</div>;
  }

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + index);
    return date;
  });

  const entriesByDay: TimeEntry[][] = weekDays.map((day) =>
    timeEntries.filter((entry) => isSameDay(entry.date, day)),
  );

  const [selectedYear, selectedMonthIndex] = selectedMonth
    .split('-')
    .map((v) => Number(v));
  const baseMonthDate = new Date(
    selectedYear || new Date().getFullYear(),
    (selectedMonthIndex || new Date().getMonth() + 1) - 1,
    1,
  );
  const monthMatrix = createMonthMatrix(baseMonthDate);

  const entriesByDateKey = new Map<string, TimeEntry[]>();
  timeEntries.forEach((entry) => {
    const d = entry.date;
    if (
      d.getFullYear() === baseMonthDate.getFullYear() &&
      d.getMonth() === baseMonthDate.getMonth()
    ) {
      const key = d.toISOString().slice(0, 10);
      const list = entriesByDateKey.get(key) ?? [];
      list.push(entry);
      entriesByDateKey.set(key, list);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Imputaciones</h1>
          <p className="mt-2 text-muted-foreground">
            Visualiza tus horas imputadas en un calendario semanal
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {timeEntries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No hay imputaciones registradas. Crea una nueva imputación para comenzar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                  >
                    Mes
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="month-selector"
                    className="text-xs text-muted-foreground"
                  >
                    Mes
                  </label>
                  <input
                    id="month-selector"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="h-8 rounded-md border bg-background px-2 text-xs text-foreground"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleChangeMonth('prev')}
                    aria-label="Mes anterior"
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleChangeMonth('next')}
                    aria-label="Mes siguiente"
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {viewMode === 'week' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleChangeWeek('prev')}
                    aria-label="Semana anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleChangeWeek('next')}
                    aria-label="Semana siguiente"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Semana del {formatDate(weekDays[0])} al {formatDate(weekDays[6])}
                  </p>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {(viewMode === 'week'
                      ? weekDays
                      : monthMatrix[0] ?? []
                    ).map((day) => (
                      <th
                        key={day.toISOString()}
                        className="px-3 py-2 text-left text-xs font-medium text-muted-foreground"
                      >
                        <div className="flex flex-col">
                          <span>
                            {day.toLocaleDateString('es-ES', {
                              weekday: 'short',
                            })}
                          </span>
                          <span className="text-[11px] text-muted-foreground/80">
                            {day.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'week' ? (
                    <tr>
                      {entriesByDay.map((entries, index) => (
                        <td
                          key={weekDays[index].toISOString()}
                          className="min-w-[150px] border-b px-3 py-3 align-top"
                        >
                          {entries.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              Sin imputaciones
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {entries.map((entry) => (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => handleOpenDetail(entry)}
                                  className="w-full rounded-md border bg-muted px-2 py-1 text-left text-xs hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="line-clamp-1 font-medium">
                                      {entry.project?.name ?? 'Proyecto'}
                                    </span>
                                    <span className="whitespace-nowrap text-[11px]">
                                      {entry.hours}h
                                    </span>
                                  </div>
                                  {entry.description && (
                                    <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                                      {entry.description}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ) : (
                    monthMatrix.map((week, weekIndex) => (
                      <tr key={weekIndex}>
                        {week.map((day) => {
                          const key = day.toISOString().slice(0, 10);
                          const entries = entriesByDateKey.get(key) ?? [];
                          const isCurrentMonth =
                            day.getMonth() === baseMonthDate.getMonth();

                          return (
                            <td
                              key={day.toISOString()}
                              className="min-w-[150px] border-b px-3 py-3 align-top"
                            >
                              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                                <span
                                  className={
                                    isCurrentMonth
                                      ? 'font-medium'
                                      : 'text-muted-foreground/60'
                                  }
                                >
                                  {day.getDate()}
                                </span>
                              </div>
                              {entries.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                  Sin imputaciones
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {entries.map((entry) => (
                                    <button
                                      key={entry.id}
                                      type="button"
                                      onClick={() => handleOpenDetail(entry)}
                                      className="w-full rounded-md border bg-muted px-2 py-1 text-left text-xs hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="line-clamp-1 font-medium">
                                          {entry.project?.name ?? 'Proyecto'}
                                        </span>
                                        <span className="whitespace-nowrap text-[11px]">
                                          {entry.hours}h
                                        </span>
                                      </div>
                                      {entry.description && (
                                        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                                          {entry.description}
                                        </p>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <NewTimeEntryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleNewEntry}
      />

      <TimeEntryDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        entry={selectedEntry}
      />
    </div>
  );
};
