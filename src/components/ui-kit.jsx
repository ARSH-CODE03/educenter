import { cn } from "@/lib/utils";
import { X, Inbox, Loader2 } from "lucide-react";
import { useEffect } from "react";

/* ---------------------------------- Button --------------------------------- */
const buttonStyles = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-lift active:scale-[0.99]",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-secondary hover:border-primary/30",
  soft: "bg-primary-soft text-accent-foreground hover:bg-primary/15",
  ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const buttonSizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        buttonStyles[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------- Card ---------------------------------- */
export function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, className, align = "center" }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[42px] lg:text-[48px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">{subtitle}</p>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Badge ---------------------------------- */
const badgeStyles = {
  neutral: "bg-secondary text-secondary-foreground",
  primary: "bg-primary-soft text-accent-foreground",
  success: "bg-success/12 text-success",
  warning: "bg-warning/18 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        badgeStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Paid: "success",
    Active: "success",
    Present: "success",
    Pending: "danger",
    Absent: "danger",
    Closed: "neutral",
    "On Leave": "warning",
    Full: "warning",
    "Partially Paid": "warning",
  };
  return <Badge variant={map[status] ?? "neutral"}>{status}</Badge>;
}

/* ---------------------------------- Inputs --------------------------------- */
export function Input({ label, hint, id, className, icon: Icon, ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label ? (
        <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      ) : null}
      <span className="relative block">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        ) : null}
        <input
          id={id}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
            Icon && "pl-9",
            className,
          )}
          {...props}
        />
      </span>
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Select({ label, id, className, children, ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label ? (
        <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      ) : null}
      <select
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border border-input bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, id, className, ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label ? (
        <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      ) : null}
      <textarea
        id={id}
        rows={4}
        className={cn(
          "w-full rounded-xl border border-input bg-surface p-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          className,
        )}
        {...props}
      />
    </label>
  );
}

/* ---------------------------------- Modal ---------------------------------- */
export function Modal({ open, onClose, title, description, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="animate-fade-up w-full max-w-lg rounded-t-3xl border border-border bg-card p-6 shadow-lift sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-5 max-h-[65vh] overflow-y-auto pr-1">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ---------------------------------- Table ---------------------------------- */
export function Table({ columns, rows, renderCell, emptyMessage = "No records found" }) {
  if (!rows.length) return <EmptyState title={emptyMessage} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id ?? index}
              className="border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/60"
            >
              {columns.map((column) => (
                <td key={column} className="whitespace-nowrap px-4 py-3.5 text-sm">
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------- Stat cards ------------------------------- */
export function StatCard({ label, value, icon: Icon, trend, trendTone = "success" }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-[26px] font-extrabold tracking-tight sm:text-[30px]">
            {value}
          </p>
        </div>
        {Icon ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
      {trend ? (
        <p
          className={cn(
            "mt-3 text-xs font-semibold",
            trendTone === "success" ? "text-success" : "text-destructive",
          )}
        >
          {trend}
        </p>
      ) : null}
    </Card>
  );
}

export function ChartCard({ title, subtitle, action, children, className }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold tracking-tight">{title}</h3>
          {subtitle ? <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

/* --------------------------- Empty / loading states ------------------------ */
export function EmptyState({ title = "Nothing here yet", description, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface text-muted-foreground shadow-soft">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-[15px] font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-[26px] font-extrabold tracking-tight sm:text-[32px]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
