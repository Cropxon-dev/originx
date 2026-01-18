import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Check, Upload, AlertCircle,
  FileJson, Server, Key, DollarSign, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "AI & Machine Learning", "Payments & Finance", "Communication", 
  "Data & Analytics", "DevOps & Cloud", "E-commerce", "Authentication",
  "Media & Files", "Location & Maps", "Social & Messaging",
  "Productivity", "Security", "IoT", "Blockchain", "Other"
];

const steps = [
  { id: 1, title: "Basic Info", icon: FileJson },
  { id: 2, title: "API Specification", icon: Server },
  { id: 3, title: "Test Key Config", icon: Key },
  { id: 4, title: "Pricing", icon: DollarSign },
  { id: 5, title: "Activation", icon: Rocket },
];

interface ApiFormData {
  name: string;
  category: string;
  module: string;
  description: string;
  baseUrl: string;
  authType: string;
  rateLimit: number;
  regions: string[];
  billingUnit: string;
  pricePerUnit: number;
  freeTierLimit: number;
  openApiSpec: string;
}

export default function CreateApiPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testKeyVerified, setTestKeyVerified] = useState(false);
  const [testKey, setTestKey] = useState("");
  
  const [formData, setFormData] = useState<ApiFormData>({
    name: "",
    category: "",
    module: "",
    description: "",
    baseUrl: "",
    authType: "api_key",
    rateLimit: 1000,
    regions: ["us-east", "eu-west"],
    billingUnit: "request",
    pricePerUnit: 0.001,
    freeTierLimit: 100,
    openApiSpec: "",
  });

  const updateField = (field: keyof ApiFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateTestKey = () => {
    const key = `ox_pub_test_${Math.random().toString(36).substring(2, 15)}`;
    setTestKey(key);
    toast.success("Test key generated! Map your endpoint and run validation.");
  };

  const verifyTestKey = async () => {
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestKeyVerified(true);
    toast.success("Test endpoint verified successfully!");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('publisher_apis').insert({
        publisher_id: user.id,
        name: formData.name,
        category: formData.category,
        module: formData.module,
        description: formData.description,
        base_url: formData.baseUrl,
        auth_type: formData.authType,
        rate_limit: formData.rateLimit,
        billing_unit: formData.billingUnit,
        price_per_unit: formData.pricePerUnit,
        free_tier_limit: formData.freeTierLimit,
        regions: formData.regions,
        test_key_verified: testKeyVerified,
        status: 'active',
      });

      if (error) throw error;

      toast.success("API published successfully!");
      navigate("/publisher/apis");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish API");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name && formData.category && formData.description;
      case 2: return formData.baseUrl && formData.authType;
      case 3: return testKeyVerified;
      case 4: return formData.billingUnit && formData.pricePerUnit >= 0;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate("/publisher")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Create New API</h1>
        <p className="text-muted-foreground">Publish your API to the OriginX marketplace</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                currentStep > step.id ? 'bg-accent border-accent' :
                currentStep === step.id ? 'border-accent' : 'border-border'
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-5 h-5 text-accent-foreground" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? 'bg-accent' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us about your API. This information will be displayed in the marketplace.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">API Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g., Smart Image Recognition API"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="module">Module (Optional)</Label>
                  <Input
                    id="module"
                    value={formData.module}
                    onChange={(e) => updateField('module', e.target.value)}
                    placeholder="e.g., Object Detection"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe what your API does and its key features..."
                    className="mt-1.5 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">API Specification</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Configure your API endpoints and authentication.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="baseUrl">Base URL *</Label>
                  <Input
                    id="baseUrl"
                    value={formData.baseUrl}
                    onChange={(e) => updateField('baseUrl', e.target.value)}
                    placeholder="https://api.yourservice.com/v1"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="authType">Authentication Type *</Label>
                  <Select value={formData.authType} onValueChange={(v) => updateField('authType', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={formData.rateLimit}
                    onChange={(e) => updateField('rateLimit', parseInt(e.target.value))}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>OpenAPI Specification (Optional)</Label>
                  <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your OpenAPI spec or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JSON and YAML formats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Test Key Configuration</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Generate a test key and validate your API endpoints before going live.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Test Key Required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You must verify your test endpoint before publishing. This ensures your API works correctly with OriginX routing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!testKey ? (
                  <Button onClick={generateTestKey} className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Generate Test Key
                  </Button>
                ) : (
                  <>
                    <div>
                      <Label>Your Test Key</Label>
                      <div className="mt-1.5 flex gap-2">
                        <Input value={testKey} readOnly className="font-mono text-sm" />
                        <Button variant="outline" onClick={() => navigator.clipboard.writeText(testKey)}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">Validation Checklist</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border ${testKey ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                            {testKey && <Check className="w-3 h-3 text-white m-auto" />}
                          </div>
                          Test key generated
                        </li>
                        <li className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border ${testKeyVerified ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                            {testKeyVerified && <Check className="w-3 h-3 text-white m-auto" />}
                          </div>
                          Endpoint verified
                        </li>
                      </ul>
                    </div>

                    {!testKeyVerified && (
                      <Button onClick={verifyTestKey} variant="outline" className="w-full">
                        Run Validation
                      </Button>
                    )}

                    {testKeyVerified && (
                      <div className="flex items-center gap-2 text-green-500 p-3 bg-green-500/10 rounded-lg">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Test endpoint verified successfully!</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Pricing Configuration</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Set your pricing. OriginX applies a transparent 15% commission on all transactions.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="billingUnit">Billing Unit *</Label>
                  <Select value={formData.billingUnit} onValueChange={(v) => updateField('billingUnit', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="request">Per Request</SelectItem>
                      <SelectItem value="token">Per 1K Tokens</SelectItem>
                      <SelectItem value="minute">Per Minute</SelectItem>
                      <SelectItem value="image">Per Image</SelectItem>
                      <SelectItem value="character">Per 1K Characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pricePerUnit">Price per Unit (USD) *</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    step="0.0001"
                    value={formData.pricePerUnit}
                    onChange={(e) => updateField('pricePerUnit', parseFloat(e.target.value))}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="freeTierLimit">Free Tier Limit (Optional)</Label>
                  <Input
                    id="freeTierLimit"
                    type="number"
                    value={formData.freeTierLimit}
                    onChange={(e) => updateField('freeTierLimit', parseInt(e.target.value))}
                    placeholder="Number of free requests per month"
                    className="mt-1.5"
                  />
                </div>

                {/* Pricing Preview */}
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-medium mb-3">Pricing Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your price per {formData.billingUnit}</span>
                      <span>${formData.pricePerUnit.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OriginX commission (15%)</span>
                      <span>${(formData.pricePerUnit * 0.15).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-border">
                      <span>Developer pays</span>
                      <span>${formData.pricePerUnit.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-accent">
                      <span>You earn</span>
                      <span>${(formData.pricePerUnit * 0.85).toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Review & Activate</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Review your API configuration before publishing to the marketplace.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">API Summary</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="font-medium">{formData.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd>{formData.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Base URL</dt>
                      <dd className="font-mono text-xs">{formData.baseUrl}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pricing</dt>
                      <dd>${formData.pricePerUnit} / {formData.billingUnit}</dd>
                    </div>
                  </dl>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Test endpoint verified</span>
                    </div>
                    <span className="text-xs text-green-500">Complete</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Pricing configured</span>
                    </div>
                    <span className="text-xs text-green-500">Complete</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <Switch defaultChecked />
                      <span className="text-sm">Enable monitoring & alerts</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-accent text-accent-foreground"
          >
            {isSubmitting ? "Publishing..." : "Activate API"}
            <Rocket className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}