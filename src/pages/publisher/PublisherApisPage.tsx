import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Plus, MoreHorizontal, Eye, Edit2, Pause, Play, Trash2,
  ExternalLink, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PublisherApi {
  id: string;
  name: string;
  category: string;
  status: string;
  version: string;
  created_at: string;
  billing_unit: string;
  price_per_unit: number;
}

export default function PublisherApisPage() {
  const [apis, setApis] = useState<PublisherApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('publisher_apis')
        .select('*')
        .eq('publisher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApis(data || []);
    } catch (error) {
      console.error('Error fetching APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApiStatus = async (api: PublisherApi) => {
    const newStatus = api.status === 'active' ? 'paused' : 'active';
    try {
      const { error } = await supabase
        .from('publisher_apis')
        .update({ status: newStatus })
        .eq('id', api.id);

      if (error) throw error;
      toast.success(`API ${newStatus === 'active' ? 'activated' : 'paused'}`);
      fetchApis();
    } catch (error) {
      toast.error('Failed to update API status');
    }
  };

  const deleteApi = async (id: string) => {
    try {
      const { error } = await supabase
        .from('publisher_apis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('API deleted');
      fetchApis();
    } catch (error) {
      toast.error('Failed to delete API');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary",
      draft: "outline",
      deprecated: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  // Mock usage data - in production this would come from api_usage table
  const mockUsage: Record<string, { requests: number; revenue: number }> = {};
  apis.forEach(api => {
    mockUsage[api.id] = {
      requests: Math.floor(Math.random() * 50000),
      revenue: Math.random() * 500,
    };
  });

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My APIs</h1>
            <p className="text-muted-foreground">Manage your published APIs</p>
          </div>
          <Link to="/publisher/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New API
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No APIs yet</h3>
            <p className="text-muted-foreground mb-6">
              Publish your first API and start earning revenue.
            </p>
            <Link to="/publisher/create">
              <Button>Create Your First API</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>API Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Usage (30d)</TableHead>
                  <TableHead className="text-right">Revenue (30d)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell>
                      <div className="font-medium">{api.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${api.price_per_unit} / {api.billing_unit}
                      </div>
                    </TableCell>
                    <TableCell>{api.category}</TableCell>
                    <TableCell>{getStatusBadge(api.status)}</TableCell>
                    <TableCell>{api.version}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {mockUsage[api.id]?.requests.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${mockUsage[api.id]?.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Docs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleApiStatus(api)}>
                            {api.status === 'active' ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause API
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Activate API
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteApi(api.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}