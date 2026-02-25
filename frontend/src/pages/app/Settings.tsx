import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <Card className="rounded-2xl border-border/80 shadow-soft">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={user?.username ?? ""} readOnly className="rounded-xl bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} readOnly className="rounded-xl bg-muted/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
