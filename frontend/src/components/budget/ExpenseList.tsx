import { Plus, Plane, Hotel, Utensils, Ticket, CreditCard, Banknote, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Expense } from "@/contexts/BudgetContext";

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense?: () => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (id: string) => void;
}

const categoryIcons: Record<string, any> = {
  Transport: Plane,
  Stay: Hotel,
  Food: Utensils,
  Activities: Ticket,
};

const paymentIcons: Record<string, any> = {
  Card: CreditCard,
  Cash: Banknote,
  UPI: CreditCard,
};

const categoryColors: Record<string, string> = {
  Transport: "bg-sky/10 text-sky",
  Stay: "bg-emerald-100 text-emerald-600",
  Food: "bg-amber-100 text-amber-600",
  Activities: "bg-violet-100 text-violet-600",
};

const ExpenseList = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense }: ExpenseListProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Recent Expenses</h3>
          <p className="text-sm text-muted-foreground">Track your spending</p>
        </div>
        <Button variant="default" size="sm" onClick={onAddExpense} className="bg-gradient-coral hover:opacity-90">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-3">
        {expenses.map((expense, index) => {
          const CategoryIcon = categoryIcons[expense.category] || Ticket;
          const PaymentIcon = paymentIcons[expense.paymentMethod] || CreditCard;
          const colorClass = categoryColors[expense.category] || "bg-muted text-muted-foreground";

          return (
            <div 
              key={expense.id} 
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200 opacity-0 animate-slide-in-right"
              style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className={`p-2.5 rounded-xl ${colorClass}`}>
                <CategoryIcon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{expense.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{expense.date}</span>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-display font-semibold text-foreground">₹{expense.amount.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <PaymentIcon className="w-3 h-3" />
                    <span>{expense.paymentMethod}</span>
                  </div>
                </div>
                {(onEditExpense || onDeleteExpense) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <span className="text-muted-foreground">⋯</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEditExpense && (
                        <DropdownMenuItem onClick={() => onEditExpense(expense)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDeleteExpense && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No expenses yet</p>
          <p className="text-sm text-muted-foreground/70">Start tracking your trip spending</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

