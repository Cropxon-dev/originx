import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsageMetrics {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  activeApis: number;
  errorRate: number;
  avgLatency: number;
}

interface ApiUsageRecord {
  id: string;
  api_name: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  tokens_used: number;
  cost: number;
  environment: string;
  created_at: string;
}

export function useRealtimeUsage(environment: 'sandbox' | 'production' = 'sandbox') {
  const [metrics, setMetrics] = useState<UsageMetrics>({
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    activeApis: 0,
    errorRate: 0,
    avgLatency: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ApiUsageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch usage data for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: usageData, error } = await supabase
        .from('api_usage')
        .select('*')
        .eq('environment', environment)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (usageData && usageData.length > 0) {
        const totalRequests = usageData.length;
        const totalTokens = usageData.reduce((sum, r) => sum + (r.tokens_used || 0), 0);
        const totalCost = usageData.reduce((sum, r) => sum + Number(r.cost || 0), 0);
        const uniqueApis = new Set(usageData.map(r => r.api_name)).size;
        const errors = usageData.filter(r => r.status_code >= 400).length;
        const avgLatency = usageData.reduce((sum, r) => sum + (r.latency_ms || 0), 0) / totalRequests;

        setMetrics({
          totalRequests,
          totalTokens,
          totalCost,
          activeApis: uniqueApis,
          errorRate: (errors / totalRequests) * 100,
          avgLatency,
        });

        setRecentActivity(usageData.slice(0, 10) as ApiUsageRecord[]);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [environment]);

  useEffect(() => {
    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('api_usage_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_usage',
        },
        (payload) => {
          const newRecord = payload.new as ApiUsageRecord;
          
          if (newRecord.environment === environment) {
            // Update metrics
            setMetrics(prev => ({
              totalRequests: prev.totalRequests + 1,
              totalTokens: prev.totalTokens + (newRecord.tokens_used || 0),
              totalCost: prev.totalCost + Number(newRecord.cost || 0),
              activeApis: prev.activeApis, // Would need to recalculate
              errorRate: newRecord.status_code >= 400 
                ? ((prev.errorRate * prev.totalRequests + 100) / (prev.totalRequests + 1))
                : ((prev.errorRate * prev.totalRequests) / (prev.totalRequests + 1)),
              avgLatency: ((prev.avgLatency * prev.totalRequests) + newRecord.latency_ms) / (prev.totalRequests + 1),
            }));

            // Add to recent activity
            setRecentActivity(prev => [newRecord, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [environment, fetchInitialData]);

  return { metrics, recentActivity, isLoading, refetch: fetchInitialData };
}

export function useUserRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;
        setRoles(data?.map(r => r.role) || ['user']);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles(['user']);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isPublisher = () => hasRole('publisher');

  return { roles, isLoading, hasRole, isAdmin, isPublisher };
}