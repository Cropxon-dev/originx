-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'publisher', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create api_usage table for realtime tracking
CREATE TABLE public.api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    api_name TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'GET',
    status_code INTEGER NOT NULL DEFAULT 200,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
    environment TEXT NOT NULL DEFAULT 'sandbox',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on api_usage
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for api_usage
CREATE POLICY "Users can view their own usage"
ON public.api_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.api_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
ON public.api_usage
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create publisher_apis table
CREATE TABLE public.publisher_apis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    module TEXT,
    description TEXT,
    openapi_spec JSONB,
    base_url TEXT,
    auth_type TEXT NOT NULL DEFAULT 'api_key',
    rate_limit INTEGER DEFAULT 1000,
    billing_unit TEXT NOT NULL DEFAULT 'request',
    price_per_unit DECIMAL(10, 6) NOT NULL DEFAULT 0.001,
    free_tier_limit INTEGER DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'draft',
    test_key_verified BOOLEAN DEFAULT false,
    live_key_verified BOOLEAN DEFAULT false,
    version TEXT DEFAULT '1.0.0',
    regions TEXT[] DEFAULT ARRAY['us-east', 'eu-west'],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on publisher_apis
ALTER TABLE public.publisher_apis ENABLE ROW LEVEL SECURITY;

-- RLS policies for publisher_apis
CREATE POLICY "Publishers can view their own APIs"
ON public.publisher_apis
FOR SELECT
USING (auth.uid() = publisher_id);

CREATE POLICY "Publishers can manage their own APIs"
ON public.publisher_apis
FOR ALL
USING (auth.uid() = publisher_id);

CREATE POLICY "Users can view active APIs"
ON public.publisher_apis
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can view all APIs"
ON public.publisher_apis
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all APIs"
ON public.publisher_apis
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create subscribed_apis table for tracking user API subscriptions
CREATE TABLE public.subscribed_apis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    api_id UUID REFERENCES public.publisher_apis(id) ON DELETE CASCADE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active',
    UNIQUE (user_id, api_id)
);

-- Enable RLS on subscribed_apis
ALTER TABLE public.subscribed_apis ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribed_apis
CREATE POLICY "Users can view their own subscriptions"
ON public.subscribed_apis
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscriptions"
ON public.subscribed_apis
FOR ALL
USING (auth.uid() = user_id);

-- Create publisher_payouts table
CREATE TABLE public.publisher_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payout_method TEXT DEFAULT 'stripe',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on publisher_payouts
ALTER TABLE public.publisher_payouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for publisher_payouts
CREATE POLICY "Publishers can view their own payouts"
ON public.publisher_payouts
FOR SELECT
USING (auth.uid() = publisher_id);

CREATE POLICY "Admins can manage payouts"
ON public.publisher_payouts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for api_usage table
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_usage;

-- Create trigger for updated_at on publisher_apis
CREATE TRIGGER update_publisher_apis_updated_at
BEFORE UPDATE ON public.publisher_apis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();