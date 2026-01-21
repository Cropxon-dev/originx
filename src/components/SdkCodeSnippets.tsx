import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "javascript" | "python" | "dotnet" | "java" | "go";

interface LanguageConfig {
  id: Language;
  name: string;
  icon: string;
  color: string;
}

const languages: LanguageConfig[] = [
  { id: "javascript", name: "JavaScript", icon: "JS", color: "bg-yellow-500" },
  { id: "python", name: "Python", icon: "PY", color: "bg-blue-500" },
  { id: "dotnet", name: ".NET Core", icon: "C#", color: "bg-purple-500" },
  { id: "java", name: "Java", icon: "JV", color: "bg-orange-500" },
  { id: "go", name: "Go", icon: "GO", color: "bg-cyan-500" },
];

const codeSnippets: Record<Language, { install: string; code: string }> = {
  javascript: {
    install: "npm install @originx/oneauth-sdk",
    code: `import { OneAuth } from '@originx/oneauth-sdk';

// Initialize OneAuth client
const auth = new OneAuth({
  clientId: 'your-client-id',
  domain: 'your-tenant.oneauth.io',
  redirectUri: 'https://your-app.com/callback'
});

// Authenticate user with OIDC
async function login() {
  try {
    const result = await auth.loginWithRedirect({
      scope: 'openid profile email',
      audience: 'https://api.your-app.com'
    });
    
    console.log('User authenticated:', result.user);
    console.log('Access token:', result.accessToken);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}

// Verify MFA with passkey
async function verifyMFA() {
  const challenge = await auth.mfa.createChallenge('passkey');
  const verification = await auth.mfa.verify(challenge);
  
  if (verification.success) {
    console.log('MFA verified, risk score:', verification.riskScore);
  }
}

// Get current session
const session = await auth.getSession();
console.log('Session valid:', session.isValid);`,
  },
  python: {
    install: "pip install oneauth-sdk",
    code: `from oneauth import OneAuthClient
from oneauth.exceptions import AuthenticationError

# Initialize OneAuth client
client = OneAuthClient(
    client_id="your-client-id",
    client_secret="your-client-secret",
    domain="your-tenant.oneauth.io"
)

# Authenticate user with credentials
def authenticate_user(email: str, password: str):
    try:
        result = client.authenticate(
            email=email,
            password=password,
            scope=["openid", "profile", "email"]
        )
        
        print(f"User authenticated: {result.user.email}")
        print(f"Access token: {result.access_token}")
        return result
    except AuthenticationError as e:
        print(f"Authentication failed: {e.message}")
        raise

# Verify MFA with OTP
def verify_mfa(session_id: str, otp_code: str):
    verification = client.mfa.verify_otp(
        session_id=session_id,
        code=otp_code
    )
    
    if verification.success:
        print(f"MFA verified, risk score: {verification.risk_score}")
    return verification

# Validate access token
def validate_token(token: str):
    claims = client.validate_token(token)
    print(f"Token valid for: {claims.sub}")
    return claims`,
  },
  dotnet: {
    install: "dotnet add package OriginX.OneAuth.Sdk",
    code: `using OriginX.OneAuth;
using OriginX.OneAuth.Models;

// Configure OneAuth in Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddOneAuth(options =>
    {
        options.ClientId = "your-client-id";
        options.ClientSecret = "your-client-secret";
        options.Domain = "your-tenant.oneauth.io";
    });
}

// Inject and use OneAuth client
public class AuthController : ControllerBase
{
    private readonly IOneAuthClient _authClient;
    
    public AuthController(IOneAuthClient authClient)
    {
        _authClient = authClient;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            var result = await _authClient.AuthenticateAsync(
                request.Email,
                request.Password,
                new[] { "openid", "profile", "email" }
            );
            
            return Ok(new { 
                User = result.User,
                AccessToken = result.AccessToken 
            });
        }
        catch (AuthenticationException ex)
        {
            return Unauthorized(ex.Message);
        }
    }
    
    [HttpPost("mfa/verify")]
    public async Task<IActionResult> VerifyMfa(MfaRequest request)
    {
        var verification = await _authClient.Mfa.VerifyAsync(
            request.SessionId, 
            request.Code
        );
        
        return Ok(new { RiskScore = verification.RiskScore });
    }
}`,
  },
  java: {
    install: `<!-- Maven -->
<dependency>
    <groupId>io.originx</groupId>
    <artifactId>oneauth-sdk</artifactId>
    <version>2.0.0</version>
</dependency>`,
    code: `import io.originx.oneauth.OneAuthClient;
import io.originx.oneauth.models.*;

public class AuthService {
    
    private final OneAuthClient client;
    
    public AuthService() {
        this.client = OneAuthClient.builder()
            .clientId("your-client-id")
            .clientSecret("your-client-secret")
            .domain("your-tenant.oneauth.io")
            .build();
    }
    
    // Authenticate user with credentials
    public AuthResult authenticate(String email, String password) 
            throws AuthenticationException {
        try {
            AuthResult result = client.authenticate(
                AuthRequest.builder()
                    .email(email)
                    .password(password)
                    .scopes(List.of("openid", "profile", "email"))
                    .build()
            );
            
            System.out.println("User authenticated: " + result.getUser().getEmail());
            System.out.println("Access token: " + result.getAccessToken());
            return result;
        } catch (AuthenticationException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            throw e;
        }
    }
    
    // Verify MFA with passkey
    public MfaVerification verifyMfa(String sessionId, String code) {
        MfaVerification verification = client.mfa()
            .verify(sessionId, code);
        
        if (verification.isSuccess()) {
            System.out.println("Risk score: " + verification.getRiskScore());
        }
        return verification;
    }
    
    // Validate JWT token
    public TokenClaims validateToken(String token) {
        return client.validateToken(token);
    }
}`,
  },
  go: {
    install: "go get github.com/originx/oneauth-go",
    code: `package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/originx/oneauth-go"
)

func main() {
    // Initialize OneAuth client
    client, err := oneauth.NewClient(oneauth.Config{
        ClientID:     "your-client-id",
        ClientSecret: "your-client-secret",
        Domain:       "your-tenant.oneauth.io",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Authenticate user
    result, err := client.Authenticate(context.Background(), oneauth.AuthRequest{
        Email:    "user@example.com",
        Password: "secure-password",
        Scopes:   []string{"openid", "profile", "email"},
    })
    if err != nil {
        log.Printf("Authentication failed: %v", err)
        return
    }
    
    fmt.Printf("User authenticated: %s\\n", result.User.Email)
    fmt.Printf("Access token: %s\\n", result.AccessToken)
    
    // Verify MFA with OTP
    verification, err := client.MFA.VerifyOTP(context.Background(), 
        result.SessionID, 
        "123456",
    )
    if err != nil {
        log.Printf("MFA verification failed: %v", err)
        return
    }
    
    fmt.Printf("MFA verified, risk score: %d\\n", verification.RiskScore)
    
    // Validate access token
    claims, err := client.ValidateToken(result.AccessToken)
    if err != nil {
        log.Printf("Token validation failed: %v", err)
        return
    }
    
    fmt.Printf("Token valid for: %s\\n", claims.Subject)
}`,
  },
};

// Syntax highlighting helper
const highlightCode = (code: string, language: Language): JSX.Element[] => {
  const lines = code.split("\n");
  
  const getTokenClass = (token: string, lang: Language): string => {
    // Keywords
    const keywords = {
      javascript: /\b(import|from|const|let|var|async|await|function|try|catch|if|return|new|console|throw)\b/g,
      python: /\b(from|import|def|try|except|if|return|print|raise|class|async|await)\b/g,
      dotnet: /\b(using|public|private|class|void|async|await|try|catch|return|new|var|throw|readonly)\b/g,
      java: /\b(import|public|private|class|void|try|catch|return|new|throws|final|static|this)\b/g,
      go: /\b(package|import|func|if|err|return|var|nil|context|log|fmt)\b/g,
    };
    
    if (keywords[lang].test(token)) return "text-pink-400";
    if (/^["'`].*["'`]$/.test(token)) return "text-green-400";
    if (/^\d+$/.test(token)) return "text-orange-400";
    if (/^\/\/.*$/.test(token) || /^#.*$/.test(token)) return "text-muted-foreground italic";
    if (/\.([\w]+)\(/.test(token)) return "text-blue-400";
    
    return "text-foreground";
  };
  
  return lines.map((line, i) => {
    // Simple syntax highlighting
    let highlighted = line;
    
    // Comments
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return (
        <span key={i} className="text-muted-foreground italic">
          {line}
          {"\n"}
        </span>
      );
    }
    
    // Strings
    highlighted = line.replace(
      /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
      '<span class="text-green-400">$&</span>'
    );
    
    // Keywords based on language
    const keywordPatterns: Record<Language, RegExp> = {
      javascript: /\b(import|from|const|let|var|async|await|function|try|catch|if|return|new|console|throw)\b/g,
      python: /\b(from|import|def|try|except|if|return|print|raise|class|async|await|as)\b/g,
      dotnet: /\b(using|public|private|class|void|async|await|try|catch|return|new|var|throw|readonly|Task|IActionResult|HttpPost)\b/g,
      java: /\b(import|public|private|class|void|try|catch|return|new|throws|final|static|this|List)\b/g,
      go: /\b(package|import|func|if|err|return|var|nil|context|log|fmt|main)\b/g,
    };
    
    highlighted = highlighted.replace(
      keywordPatterns[language],
      '<span class="text-pink-400 font-medium">$&</span>'
    );
    
    // Types
    highlighted = highlighted.replace(
      /\b(OneAuth|AuthResult|MfaVerification|TokenClaims|IOneAuthClient|OneAuthClient|AuthRequest|AuthenticationException|Config|string|bool|int|error)\b/g,
      '<span class="text-cyan-400">$&</span>'
    );
    
    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-orange-400">$&</span>'
    );
    
    return (
      <span 
        key={i} 
        dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
      />
    );
  });
};

export const SdkCodeSnippets = () => {
  const [activeLanguage, setActiveLanguage] = useState<Language>("javascript");
  const [copied, setCopied] = useState<"install" | "code" | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedLines, setDisplayedLines] = useState(0);

  const currentSnippet = codeSnippets[activeLanguage];
  const codeLines = currentSnippet.code.split("\n");

  // Animate typing effect when language changes
  const handleLanguageChange = (lang: Language) => {
    setActiveLanguage(lang);
    setIsTyping(true);
    setDisplayedLines(0);
  };

  // Typing animation
  useState(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setDisplayedLines((prev) => {
          if (prev >= codeLines.length) {
            setIsTyping(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  });

  // Reset displayed lines when not typing
  useState(() => {
    if (!isTyping) {
      setDisplayedLines(codeLines.length);
    }
  });

  const copyToClipboard = async (text: string, type: "install" | "code") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {languages.map((lang) => (
          <motion.button
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${activeLanguage === lang.id
                ? "bg-accent/20 border-accent text-accent"
                : "bg-card border-border hover:border-muted-foreground/50"
              }
            `}
          >
            <span className={`w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center text-white ${lang.color}`}>
              {lang.icon}
            </span>
            <span className="text-sm font-medium">{lang.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Code Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLanguage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Install Command */}
          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <span className="text-xs text-muted-foreground font-medium">Installation</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => copyToClipboard(currentSnippet.install, "install")}
              >
                {copied === "install" ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="text-accent">{currentSnippet.install}</code>
              </pre>
            </div>
          </div>

          {/* Main Code Block */}
          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">
                  OneAuth SDK Integration
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => copyToClipboard(currentSnippet.code, "code")}
              >
                {copied === "code" ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  {highlightCode(currentSnippet.code, activeLanguage)}
                </code>
              </pre>
            </div>
            
            {/* Animated cursor line */}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-0.5 w-2 bg-accent ml-4 mb-4"
            />
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Type Safe", desc: "Full TypeScript/typing support" },
              { label: "Async Ready", desc: "Promise-based APIs" },
              { label: "MFA Built-in", desc: "OTP, Push, Passkeys" },
              { label: "Risk Scoring", desc: "Automatic threat detection" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-muted/50 border border-border text-center"
              >
                <p className="text-sm font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
