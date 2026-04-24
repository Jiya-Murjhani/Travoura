import { useState, useMemo } from "react";
import { Plane, Hotel, Utensils, Ticket, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BudgetHeader from "@/components/budget/BudgetHeader";
import BudgetCard from "@/components/budget/BudgetCard";
import BudgetChart from "@/components/budget/BudgetChart";
import ExpenseList from "@/components/budget/ExpenseList";
import ExpenseFormDialog from "@/components/budget/ExpenseFormDialog";
import BudgetPlanningDialog from "@/components/budget/BudgetPlanningDialog";
import AIInsights from "@/components/budget/AIInsights";
import CTASection from "@/components/budget/CTASection";
import { Button } from "@/components/ui/button";
import { useBudget, Expense } from "@/contexts/BudgetContext";

const categoryIcons: Record<string, any> = {
  Transport: Plane,
  Stay: Hotel,
  Food: Utensils,
  Activities: Ticket,
};

const categoryColors: Record<string, string> = {
  Transport: "hsl(210, 100%, 65%)",
  Stay: "hsl(150, 60%, 50%)",
  Food: "hsl(38, 92%, 50%)",
  Activities: "hsl(270, 70%, 60%)",
  Shopping: "hsl(320, 70%, 60%)",
  Other: "hsl(200, 70%, 60%)",
};

const BudgetTracker = () => {
  const {
    budgetData,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudget,
    activeTripName,
  } = useBudget();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const chartData = useMemo(() => {
    return budgetData.categories
      .filter(cat => cat.spent > 0)
      .map(cat => ({
        name: cat.name,
        value: cat.spent,
        color: categoryColors[cat.name] || "hsl(200, 70%, 60%)",
      }));
  }, [budgetData.categories]);

  const insights = useMemo(() => {
    const insightsList = [];
    
    budgetData.categories.forEach(cat => {
      const percentage = (cat.spent / cat.allocated) * 100;
      
      if (percentage > 100) {
        insightsList.push({
          id: `warning-${cat.name}`,
          type: "warning" as const,
          message: `You've exceeded your ${cat.name} budget by ${((cat.spent - cat.allocated) / cat.allocated * 100).toFixed(0)}%. Consider adjusting your spending.`,
        });
      } else if (percentage > 80) {
        insightsList.push({
          id: `tip-${cat.name}`,
          type: "tip" as const,
          message: `Your ${cat.name} budget is ${(100 - percentage).toFixed(0)}% remaining. Plan your remaining expenses carefully.`,
        });
      }
    });

    const totalPercentage = (budgetData.spent / budgetData.total) * 100;
    if (totalPercentage < 50) {
      insightsList.push({
        id: "saving-1",
        type: "saving" as const,
        message: "Great job! You're well within budget. Consider booking premium experiences through Travoura.",
      });
    }

    return insightsList.slice(0, 3);
  }, [budgetData]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  const handleSubmitExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleUpdateBudget = (total: number, categories: any[]) => {
    updateBudget(total, categories);
    setIsBudgetDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8 mt-16">
        {/* Budget Header */}
        <div className="mb-8 relative">
          <BudgetHeader 
            totalBudget={budgetData.total} 
            totalSpent={budgetData.spent} 
            tripName={activeTripName}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsBudgetDialogOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Plan Budget
          </Button>
        </div>

        {/* Budget Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {budgetData.categories.map((category, index) => {
            const Icon = categoryIcons[category.name] || Ticket;
            return (
              <BudgetCard
                key={category.name}
                title={category.name}
                icon={Icon}
                allocated={category.allocated}
                spent={category.spent}
                iconBgClass={
                  index === 0 ? "bg-sky/10" :
                  index === 1 ? "bg-emerald-100" :
                  index === 2 ? "bg-amber-100" :
                  "bg-violet-100"
                }
                delay={index * 100}
              />
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Expenses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <BudgetChart data={chartData} />
            </div>
            <ExpenseList 
              expenses={expenses} 
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

          {/* Right Column - AI Insights & CTA */}
          <div className="space-y-6">
            <AIInsights insights={insights} />
            <CTASection />
          </div>
        </div>

        {/* Expense Form Dialog */}
        <ExpenseFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmitExpense}
          expense={editingExpense}
        />

        {/* Budget Planning Dialog */}
        <BudgetPlanningDialog
          open={isBudgetDialogOpen}
          onOpenChange={setIsBudgetDialogOpen}
          onSubmit={handleUpdateBudget}
          currentBudget={budgetData}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BudgetTracker;

