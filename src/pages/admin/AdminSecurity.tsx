import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Key, Activity } from "lucide-react";

export default function AdminSecurity() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Security</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Role-Based Access</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Super Admin:</strong> Full access, manage settings, logs, other admins</p>
            <p>• <strong>Admin:</strong> Products, orders, users, reviews, coupons</p>
            <p>• <strong>Inventory Manager:</strong> Stock management only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Row Level Security</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• All tables protected with RLS policies</p>
            <p>• Role verification via <code>has_role()</code> security definer function</p>
            <p>• Users can only access their own data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• JWT-based authentication</p>
            <p>• Session-based admin verification</p>
            <p>• Passwords hashed with bcrypt via auth system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Audit Trail</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Admin activity logs (super admin only)</p>
            <p>• Stock movement history tracked per product</p>
            <p>• Order modification timestamps</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
