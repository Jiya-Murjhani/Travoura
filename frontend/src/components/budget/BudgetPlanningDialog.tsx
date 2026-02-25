import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BudgetCategory } from '@/contexts/BudgetContext';

const budgetSchema = z.object({
  total: z.number().positive('Total budget must be greater than 0'),
  transport: z.number().min(0, 'Amount cannot be negative'),
  stay: z.number().min(0, 'Amount cannot be negative'),
  food: z.number().min(0, 'Amount cannot be negative'),
  activities: z.number().min(0, 'Amount cannot be negative'),
  shopping: z.number().min(0, 'Amount cannot be negative').optional(),
  other: z.number().min(0, 'Amount cannot be negative').optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetPlanningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (total: number, categories: BudgetCategory[]) => void;
  currentBudget?: {
    total: number;
    categories: BudgetCategory[];
  };
}

const BudgetPlanningDialog = ({
  open,
  onOpenChange,
  onSubmit,
  currentBudget,
}: BudgetPlanningDialogProps) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      total: currentBudget?.total || 150000,
      transport: currentBudget?.categories.find(c => c.name === 'Transport')?.allocated || 45000,
      stay: currentBudget?.categories.find(c => c.name === 'Stay')?.allocated || 50000,
      food: currentBudget?.categories.find(c => c.name === 'Food')?.allocated || 30000,
      activities: currentBudget?.categories.find(c => c.name === 'Activities')?.allocated || 25000,
      shopping: currentBudget?.categories.find(c => c.name === 'Shopping')?.allocated || 0,
      other: currentBudget?.categories.find(c => c.name === 'Other')?.allocated || 0,
    },
  });

  const handleSubmit = (values: BudgetFormValues) => {
    const categories: BudgetCategory[] = [
      { name: 'Transport', allocated: values.transport, spent: 0 },
      { name: 'Stay', allocated: values.stay, spent: 0 },
      { name: 'Food', allocated: values.food, spent: 0 },
      { name: 'Activities', allocated: values.activities, spent: 0 },
    ];

    if (values.shopping && values.shopping > 0) {
      categories.push({ name: 'Shopping', allocated: values.shopping, spent: 0 });
    }

    if (values.other && values.other > 0) {
      categories.push({ name: 'Other', allocated: values.other, spent: 0 });
    }

    onSubmit(values.total, categories);
    onOpenChange(false);
  };

  const transport = form.watch('transport') || 0;
  const stay = form.watch('stay') || 0;
  const food = form.watch('food') || 0;
  const activities = form.watch('activities') || 0;
  const shopping = form.watch('shopping') || 0;
  const other = form.watch('other') || 0;
  const totalBudget = form.watch('total') || 0;
  
  const totalAllocated = transport + stay + food + activities + shopping + other;
  const difference = totalBudget - totalAllocated;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plan Your Budget</DialogTitle>
          <DialogDescription>
            Set your total budget and allocate amounts to different categories for your trip.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="150000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transport (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stay (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="food"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activities (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shopping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shopping (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Allocated:</span>
                <span className="font-semibold">₹{totalAllocated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget:</span>
                <span className="font-semibold">₹{totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Remaining:</span>
                <span className={`font-semibold ${difference < 0 ? 'text-destructive' : 'text-foreground'}`}>
                  ₹{difference.toLocaleString()}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Budget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetPlanningDialog;

