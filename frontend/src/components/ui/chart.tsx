import * as React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { Legend, Tooltip } from 'recharts';

export type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

interface ChartContainerProps {
  config: ChartConfig;
  className?: string;
  children: ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  config,
  className,
  children,
}) => {
  const cssVariables = Object.entries(config).reduce((vars, [key, value]) => {
    const safeKey = key.toLowerCase();
    const colorValue = value.color || 'hsl(var(--primary))';

    return {
      ...vars,
      [`--color-${safeKey}`]: colorValue,
    };
  }, {} as CSSProperties);

  return (
    <div
      className={className || ''}
      style={cssVariables}
    >
      {children}
    </div>
  );
};

export const ChartTooltip = Tooltip;

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    value?: number | string;
    name?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
  indicator?: 'dot' | 'line';
  labelFormatter?: (value: string) => string;
  nameKey?: string;
  hideLabel?: boolean;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = (
  props,
) => {
  const {
    active,
    payload,
    label,
    indicator = 'dot',
    labelFormatter,
    nameKey,
    hideLabel,
  } = props;
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel =
    typeof label === 'string' && labelFormatter
      ? labelFormatter(label)
      : label;

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-sm">
      {formattedLabel && !hideLabel && (
        <div className="mb-1 font-medium text-foreground">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item) => {
          if (!item || item.value == null) return null;

          const displayName =
            nameKey && item.payload && nameKey in item.payload
              ? String((item.payload as Record<string, unknown>)[nameKey])
              : item.name ?? item.dataKey;

          return (
            <div
              key={String(item.dataKey)}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                {indicator === 'dot' && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color || 'hsl(var(--primary))' }}
                  />
                )}
                <span className="text-muted-foreground">
                  {displayName}
                </span>
              </div>
              <span className="font-medium text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ChartLegend = Legend;

interface ChartLegendItem {
  value?: string | number;
  dataKey?: string | number;
  color?: string;
}

interface ChartLegendContentProps {
  payload?: ChartLegendItem[];
}

export const ChartLegendContent: React.FC<ChartLegendContentProps> = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {payload.map((item) => {
        if (!item) return null;

        const value = String(item.value ?? item.dataKey ?? '');

        if (!value) return null;

        return (
          <div
            key={value}
            className="flex items-center gap-1.5"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color || 'hsl(var(--primary))' }}
            />
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );
};


