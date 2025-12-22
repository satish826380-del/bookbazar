import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { BookOpen, ShoppingCart, Store, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'buyer'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const redirect = user.role === 'admin' ? '/admin' :
        user.role === 'seller' ? '/seller' : '/';
      navigate(redirect);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        console.log('Attempting login with:', email);
        const result = await login(email, password);
        console.log('Login result:', result);
        if (!result.success) {
          const errorMsg = result.error || 'Unknown error occurred';
          console.error('Login failed:', errorMsg);
          toast({
            title: 'Login failed',
            description: errorMsg,
            variant: 'destructive',
            duration: 5000
          });
        } else {
          console.log('Login successful, waiting for redirect...');
          toast({ title: 'Welcome back!' });
          // Redirect will happen via useEffect when user state updates
        }
      } else {
        if (!name.trim()) {
          toast({ title: 'Name is required', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        console.log('Attempting signup with:', { email, name, role });
        const result = await signup(email, password, name, role, phone);
        console.log('Signup result:', result);
        if (!result.success) {
          const errorMsg = result.error || 'Unknown error occurred';
          console.error('Signup failed:', errorMsg);
          toast({
            title: 'Signup failed',
            description: errorMsg,
            variant: 'destructive',
            duration: 5000
          });
        } else {
          console.log('Signup successful, waiting for redirect...');
          toast({ title: 'Account created successfully!' });
          // Redirect will happen via useEffect when user state updates
          // The onAuthStateChange listener should trigger loadUser which sets the user state
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err);
      toast({
        title: 'An error occurred',
        description: err instanceof Error ? err.message : 'Please check the console for details',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-soft animate-scale-in border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? 'Sign in to your account' : 'Join BookBazaar today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">I want to</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="grid grid-cols-2 gap-3">
                      <Label
                        htmlFor="buyer"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'buyer'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                          }`}
                      >
                        <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                        <ShoppingCart className={`h-6 w-6 ${role === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${role === 'buyer' ? 'text-primary' : 'text-foreground'}`}>
                          Buy Books
                        </span>
                      </Label>
                      <Label
                        htmlFor="seller"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'seller'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                          }`}
                      >
                        <RadioGroupItem value="seller" id="seller" className="sr-only" />
                        <Store className={`h-6 w-6 ${role === 'seller' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${role === 'seller' ? 'text-primary' : 'text-foreground'}`}>
                          Sell Books
                        </span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-medium" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="font-medium text-primary">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
