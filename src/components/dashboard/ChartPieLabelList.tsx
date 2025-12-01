import { TrendingUp } from 'lucide-react';
import { LabelList, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  // Colores alineados con tailwind.config.js (primary, secondary, accent, muted, destructive)
  { browser: 'Desarrollo', visitors: 275, fill: '#1E40AF' }, // primary
  { browser: 'Marketing', visitors: 200, fill: '#1C80AF' }, // secondary
  { browser: 'Ventas', visitors: 187, fill: '#3B82F6' }, // accent
  { browser: 'RRHH', visitors: 173, fill: '#8C4F87' }, // muted
  { browser: 'Otros', visitors: 90, fill: '#DC2626' }, // destructive
];

const chartConfig = {
  visitors: {
    label: 'Visitantes',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--primary))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--accent))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--muted))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--secondary))',
  },
  other: {
    label: 'Otros',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export const ChartPieLabelList = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proyectos por departamento</CardTitle>
        <CardDescription>
          Distribución del número de proyectos activos en cada departamento
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="visitors"
                    hideLabel
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
              >
                <LabelList
                  dataKey="browser"
                  className="fill-background"
                  stroke="none"
                fontSize={12}
                formatter={(value) => {
                  const key = String(value) as keyof typeof chartConfig;
                  return chartConfig[key]?.label ?? value;
                }}
              />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Tendencia al alza del 5.2% de proyectos este mes
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
};


