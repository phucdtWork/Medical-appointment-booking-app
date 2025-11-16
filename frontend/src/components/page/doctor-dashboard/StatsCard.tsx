import { Card } from "antd";

interface StatsCardProps {
  icon: string;
  value: number | string;
  label: string;
  color: "orange" | "green" | "blue" | "purple";
}

const colorClasses = {
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-500 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-500 dark:text-green-400",
    border: "border-green-100 dark:border-green-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-500 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-500 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800",
  },
};

export default function StatsCard({
  icon,
  value,
  label,
  color,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={`text-center shadow-sm transition-all hover:shadow-md ${colors.bg} ${colors.border} border`}
      bodyStyle={{ padding: "20px 16px" }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${colors.text} mb-1`}>{value}</div>
      <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
        {label}
      </div>
    </Card>
  );
}
