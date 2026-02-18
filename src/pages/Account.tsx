import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Account() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("login");

  if (!loggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 pt-4">
              <div><Label className="text-xs">Email</Label><Input type="email" className="h-9" /></div>
              <div><Label className="text-xs">Password</Label><Input type="password" className="h-9" /></div>
              <Button className="w-full" onClick={() => setLoggedIn(true)}>Login</Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 pt-4">
              <div><Label className="text-xs">Full Name</Label><Input className="h-9" /></div>
              <div><Label className="text-xs">Email</Label><Input type="email" className="h-9" /></div>
              <div><Label className="text-xs">Password</Label><Input type="password" className="h-9" /></div>
              <Button className="w-full" onClick={() => { setLoggedIn(true); }}>Register</Button>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Account</h1>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>Logout</Button>
        </div>
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="pt-4">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          </TabsContent>
          <TabsContent value="profile" className="pt-4 space-y-4 max-w-sm">
            <div><Label className="text-xs">Full Name</Label><Input className="h-9" defaultValue="John Doe" /></div>
            <div><Label className="text-xs">Email</Label><Input className="h-9" type="email" defaultValue="john@example.com" /></div>
            <Button size="sm">Update Profile</Button>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
