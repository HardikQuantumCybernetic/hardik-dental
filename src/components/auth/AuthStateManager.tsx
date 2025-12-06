import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Enhanced auth state cleanup utility
export const cleanupAuthState = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Auth cleanup failed:', error);
  }
};

interface AuthStateManagerProps {
  onAuthStateChange: (user: any) => void;
}

const AuthStateManager = ({ onAuthStateChange }: AuthStateManagerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event received:', event, session?.user?.id || 'no user');
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              toast({
                title: "Welcome!",
                description: "You have been successfully signed in.",
              });
              
              // Defer additional operations to prevent deadlocks
              setTimeout(() => {
                onAuthStateChange(session.user);
              }, 0);
            }
            break;
            
          case 'SIGNED_OUT':
            cleanupAuthState();
            onAuthStateChange(null);
            toast({
              title: "Signed Out",
              description: "You have been successfully signed out.",
            });
            break;
            
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed successfully');
            break;
            
          case 'USER_UPDATED':
            if (session?.user) {
              onAuthStateChange(session.user);
            }
            break;
            
          default:
            break;
        }
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      console.log('🔍 Checking initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Always call onAuthStateChange regardless of session state
        if (session?.user) {
          console.log('✅ Initial session found:', session.user.id);
          onAuthStateChange(session.user);
        } else {
          console.log('❌ No initial session found, showing login form');
          onAuthStateChange(null); // This was missing - causing infinite loading
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        cleanupAuthState();
        onAuthStateChange(null); // Also ensure we call this on error
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, [onAuthStateChange, toast]);

  return null;
};

export default AuthStateManager;