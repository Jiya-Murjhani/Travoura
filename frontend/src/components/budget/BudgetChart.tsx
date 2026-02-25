import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BudgetChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const BudgetChart = ({ data }: BudgetChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-card rounded-xl p-3 shadow-medium border border-border/50">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-secondary font-display font-bold">₹{item.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 opacity-0 animate-fade-in relative" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">Spending Breakdown</h3>
      <p className="text-sm text-muted-foreground mb-4">Visual overview of your expenses</p>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: '-40px' }}>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-xl font-display font-bold text-foreground">₹{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;

