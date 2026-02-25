import { Sparkles, TrendingDown, Lightbulb, AlertTriangle } from "lucide-react";

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'saving';
  message: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

const insightConfig = {
  tip: {
    icon: Lightbulb,
    bgClass: "bg-sky/10",
    iconClass: "text-sky",
    borderClass: "border-sky/20",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-accent/10",
    iconClass: "text-accent",
    borderClass: "border-accent/20",
  },
  saving: {
    icon: TrendingDown,
    bgClass: "bg-emerald-50",
    iconClass: "text-emerald-500",
    borderClass: "border-emerald-200",
  },
};

const AIInsights = ({ insights }: AIInsightsProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gradient-ocean">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">AI Budget Insights</h3>
          <p className="text-sm text-muted-foreground">Smart suggestions to optimize your trip</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const config = insightConfig[insight.type];
          const Icon = config.icon;

          return (
            <div 
              key={insight.id}
              className={`flex items-start gap-3 p-4 rounded-xl ${config.bgClass} border ${config.borderClass} opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className={`p-1.5 rounded-lg bg-card ${config.iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-foreground leading-relaxed flex-1">{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;

