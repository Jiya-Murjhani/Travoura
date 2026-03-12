import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ActionCardProps {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export const ActionCard = ({ to, title, description, icon }: ActionCardProps) => {
  return (
    <Link to={to} className="block">
      <Card className="h-full cursor-pointer border-border/60 bg-card/95 shadow-soft transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-elevated">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

