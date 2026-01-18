import { motion } from "framer-motion";
import { 
  Settings, User, Building, Users, Shield, 
  Bell, Webhook, Globe, ChevronRight
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User, description: "Manage your personal information" },
  { id: "organization", label: "Organization", icon: Building, description: "Company settings and preferences" },
  { id: "team", label: "Team Members", icon: Users, description: "Invite and manage team access" },
  { id: "security", label: "Security", icon: Shield, description: "Password, 2FA, and sessions" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Email and alert preferences" },
  { id: "webhooks", label: "Webhooks", icon: Webhook, description: "Configure event notifications" },
  { id: "api", label: "API Settings", icon: Globe, description: "Rate limits and preferences" },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, organization, and preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <nav className="space-y-1">
            {settingsSections.map((section, index) => (
              <button
                key={section.id}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  index === 0 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          <div className="bg-card border border-border rounded-xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information and preferences.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-glow-secondary flex items-center justify-center">
                  <User className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input id="org" placeholder="Acme Inc." />
              </div>

              <Separator />

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="font-medium">Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive email updates about your API usage
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Usage Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when approaching limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Marketing Emails</p>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about new features
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
