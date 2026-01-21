import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User, Mail, Lock, Eye, EyeOff, Fingerprint, Shield, 
  CheckCircle, XCircle, Loader2, ArrowRight, Smartphone,
  AlertTriangle, Key, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DemoStep = 
  | "idle" 
  | "credentials" 
  | "mfa_choice" 
  | "mfa_verify" 
  | "risk_check" 
  | "policy_check" 
  | "session_create" 
  | "success" 
  | "failed";

interface DemoState {
  step: DemoStep;
  email: string;
  password: string;
  mfaMethod: "otp" | "push" | "passkey" | null;
  otpCode: string;
  riskScore: number;
  logs: string[];
}

const stepDescriptions: Record<DemoStep, string> = {
  idle: "Enter your test credentials to begin",
  credentials: "Validating credentials with Identity Core...",
  mfa_choice: "Select your MFA method",
  mfa_verify: "Verifying multi-factor authentication...",
  risk_check: "Analyzing risk signals and calculating score...",
  policy_check: "Evaluating RBAC/ABAC policies...",
  session_create: "Establishing secure session...",
  success: "Authentication successful!",
  failed: "Authentication failed",
};

export const LiveDemoMode = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<DemoState>({
    step: "idle",
    email: "",
    password: "",
    mfaMethod: null,
    otpCode: "",
    riskScore: 0,
    logs: [],
  });

  const addLog = (message: string) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
    }));
  };

  const simulateDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleCredentialSubmit = async () => {
    if (!state.email || !state.password) return;

    setState((prev) => ({ ...prev, step: "credentials", logs: [] }));
    addLog("📧 Received authentication request");
    await simulateDelay(800);
    addLog(`👤 Looking up user: ${state.email}`);
    await simulateDelay(600);
    addLog("🔐 Validating password hash...");
    await simulateDelay(700);
    
    // Simulate password validation
    if (state.password.length < 4) {
      addLog("❌ Password validation failed");
      setState((prev) => ({ ...prev, step: "failed" }));
      return;
    }
    
    addLog("✅ Credentials validated");
    await simulateDelay(400);
    setState((prev) => ({ ...prev, step: "mfa_choice" }));
    addLog("🔑 MFA required - awaiting method selection");
  };

  const handleMfaSelect = async (method: "otp" | "push" | "passkey") => {
    setState((prev) => ({ ...prev, mfaMethod: method }));
    
    if (method === "otp") {
      addLog("📱 Sending OTP to registered device...");
      await simulateDelay(500);
      addLog("✉️ OTP sent successfully");
      setState((prev) => ({ ...prev, step: "mfa_verify" }));
    } else if (method === "push") {
      addLog("📲 Sending push notification...");
      setState((prev) => ({ ...prev, step: "mfa_verify" }));
      await simulateDelay(1500);
      addLog("✅ Push notification approved");
      await continueToRiskCheck();
    } else if (method === "passkey") {
      addLog("🔐 Initiating WebAuthn challenge...");
      setState((prev) => ({ ...prev, step: "mfa_verify" }));
      await simulateDelay(1200);
      addLog("✅ Passkey verified via biometrics");
      await continueToRiskCheck();
    }
  };

  const handleOtpSubmit = async () => {
    if (state.otpCode.length !== 6) {
      addLog("❌ Invalid OTP format");
      return;
    }
    
    addLog("🔍 Verifying OTP...");
    await simulateDelay(800);
    
    if (state.otpCode === "000000") {
      addLog("❌ Invalid OTP code");
      setState((prev) => ({ ...prev, step: "failed" }));
      return;
    }
    
    addLog("✅ OTP verified successfully");
    await continueToRiskCheck();
  };

  const continueToRiskCheck = async () => {
    setState((prev) => ({ ...prev, step: "risk_check" }));
    addLog("📊 Collecting device signals...");
    await simulateDelay(600);
    addLog("🌍 Analyzing geolocation...");
    await simulateDelay(500);
    addLog("🕐 Checking behavioral patterns...");
    await simulateDelay(700);
    
    const riskScore = Math.floor(Math.random() * 30) + 5; // 5-35 range
    setState((prev) => ({ ...prev, riskScore }));
    addLog(`📈 Risk score calculated: ${riskScore}/100`);
    
    if (riskScore > 70) {
      addLog("⚠️ High risk detected - additional verification required");
      setState((prev) => ({ ...prev, step: "failed" }));
      return;
    }
    
    addLog("✅ Risk assessment passed");
    await simulateDelay(400);
    
    // Policy check
    setState((prev) => ({ ...prev, step: "policy_check" }));
    addLog("📋 Loading user policies...");
    await simulateDelay(500);
    addLog("🔒 Evaluating RBAC permissions...");
    await simulateDelay(600);
    addLog("🎯 Checking ABAC attributes...");
    await simulateDelay(500);
    addLog("✅ Policy evaluation passed");
    await simulateDelay(400);
    
    // Session creation
    setState((prev) => ({ ...prev, step: "session_create" }));
    addLog("🔄 Generating session token...");
    await simulateDelay(600);
    addLog("💾 Storing session in Redis...");
    await simulateDelay(500);
    addLog("📝 Creating audit log entry...");
    await simulateDelay(400);
    addLog("✅ Session established");
    
    setState((prev) => ({ ...prev, step: "success" }));
    addLog("🎉 Authentication complete - access granted!");
  };

  const resetDemo = () => {
    setState({
      step: "idle",
      email: "",
      password: "",
      mfaMethod: null,
      otpCode: "",
      riskScore: 0,
      logs: [],
    });
  };

  const isProcessing = ["credentials", "mfa_verify", "risk_check", "policy_check", "session_create"].includes(state.step);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Interactive Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-card rounded-2xl border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Live Demo Mode</h3>
            <p className="text-xs text-muted-foreground">Test the authentication flow</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-muted/50">
          {state.step === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : state.step === "failed" ? (
            <XCircle className="w-5 h-5 text-destructive" />
          ) : isProcessing ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-sm">{stepDescriptions[state.step]}</span>
        </div>

        <AnimatePresence mode="wait">
          {/* Credentials Step */}
          {(state.step === "idle" || state.step === "credentials") && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="demo-email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="test@example.com"
                    className="pl-10"
                    value={state.email}
                    onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="demo-password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="demo-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={state.password}
                    onChange={(e) => setState((p) => ({ ...p, password: e.target.value }))}
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use any email and password (min 4 chars)
                </p>
              </div>

              <Button 
                variant="hero" 
                className="w-full" 
                onClick={handleCredentialSubmit}
                disabled={isProcessing || !state.email || !state.password}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* MFA Choice Step */}
          {state.step === "mfa_choice" && (
            <motion.div
              key="mfa-choice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">Choose your verification method:</p>
              
              <div className="grid gap-3">
                <button
                  onClick={() => handleMfaSelect("otp")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">SMS/Email OTP</p>
                    <p className="text-xs text-muted-foreground">Receive a 6-digit code</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleMfaSelect("push")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Push Notification</p>
                    <p className="text-xs text-muted-foreground">Approve on your device</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleMfaSelect("passkey")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Passkey</p>
                    <p className="text-xs text-muted-foreground">Use biometrics or security key</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* MFA Verify Step (OTP) */}
          {state.step === "mfa_verify" && state.mfaMethod === "otp" && (
            <motion.div
              key="mfa-otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="demo-otp">Enter OTP Code</Label>
                <Input
                  id="demo-otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="mt-1.5 text-center text-2xl tracking-widest"
                  value={state.otpCode}
                  onChange={(e) => setState((p) => ({ ...p, otpCode: e.target.value.replace(/\D/g, "") }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter any 6 digits (except 000000)
                </p>
              </div>
              
              <Button 
                variant="hero" 
                className="w-full" 
                onClick={handleOtpSubmit}
                disabled={state.otpCode.length !== 6}
              >
                Verify OTP
              </Button>
            </motion.div>
          )}

          {/* MFA Verify Step (Push/Passkey) */}
          {state.step === "mfa_verify" && state.mfaMethod !== "otp" && (
            <motion.div
              key="mfa-wait"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
              >
                {state.mfaMethod === "push" ? (
                  <Smartphone className="w-8 h-8 text-accent" />
                ) : (
                  <Fingerprint className="w-8 h-8 text-accent" />
                )}
              </motion.div>
              <p className="font-medium">
                {state.mfaMethod === "push" 
                  ? "Waiting for push approval..." 
                  : "Waiting for biometric verification..."
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {state.mfaMethod === "push"
                  ? "Check your registered device"
                  : "Complete the WebAuthn challenge"
                }
              </p>
            </motion.div>
          )}

          {/* Processing Steps */}
          {["risk_check", "policy_check", "session_create"].includes(state.step) && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
              >
                <RefreshCw className="w-8 h-8 text-accent" />
              </motion.div>
              <p className="font-medium">
                {state.step === "risk_check" && "Analyzing Risk..."}
                {state.step === "policy_check" && "Checking Policies..."}
                {state.step === "session_create" && "Creating Session..."}
              </p>
              {state.riskScore > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                  <span className="text-sm">Risk Score:</span>
                  <span className={`font-bold ${state.riskScore < 30 ? "text-green-500" : state.riskScore < 60 ? "text-yellow-500" : "text-red-500"}`}>
                    {state.riskScore}/100
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Success Step */}
          {state.step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h4 className="text-xl font-bold text-green-500 mb-2">Access Granted!</h4>
              <p className="text-sm text-muted-foreground mb-6">
                User authenticated successfully with OneAuth
              </p>
              <div className="flex items-center justify-center gap-3 text-sm mb-6">
                <div className="px-3 py-1.5 rounded-full bg-muted">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{state.email}</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-muted">
                  <span className="text-muted-foreground">Risk:</span>{" "}
                  <span className="font-medium text-green-500">{state.riskScore}/100</span>
                </div>
              </div>
              <Button variant="outline" onClick={resetDemo}>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Failed Step */}
          {state.step === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-destructive" />
              </motion.div>
              <h4 className="text-xl font-bold text-destructive mb-2">Authentication Failed</h4>
              <p className="text-sm text-muted-foreground mb-6">
                The authentication process was not successful
              </p>
              <Button variant="outline" onClick={resetDemo}>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Live Logs */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-card rounded-2xl border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Authentication Logs</h3>
              <p className="text-xs text-muted-foreground">Real-time event stream</p>
            </div>
          </div>
          {state.logs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          )}
        </div>

        <div className="h-[400px] overflow-y-auto rounded-lg bg-background/50 border border-border p-4 font-mono text-xs">
          {state.logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Waiting for authentication attempt...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {state.logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground"
                >
                  {log}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
