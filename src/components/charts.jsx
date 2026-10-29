import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { attendanceTrend, feeTrend } from "@/data/mock";

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 13,
  boxShadow: "var(--shadow-card)",
};

export function AttendanceChart({ height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={attendanceTrend} margin={{ left: -18, right: 6, top: 6 }}>
        <defs>
          <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} domain={[60, 100]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
        <Area
          type="monotone"
          dataKey="present"
          name="Present"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#attendanceFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FeeChart({ height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={feeTrend} margin={{ left: -6, right: 6, top: 6 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(value) => `${value / 1000}k`} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => new Intl.NumberFormat("en-IN").format(value)}
        />
        <Bar dataKey="collected" name="Collected" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const pieColors = ["var(--color-chart-1)", "var(--color-chart-4)", "var(--color-chart-3)"];

export function StatusPie({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
