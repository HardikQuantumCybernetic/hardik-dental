import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Optimized query hook with caching and error handling
export const useOptimizedQuery = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) => {
  return useQuery({
    queryKey: key,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Optimistic mutation hook
export const useOptimisticMutation = <T, TVariables>(
  mutationFn: (variables: TVariables) => Promise<T>,
  options?: {
    onSuccess?: (data: T, variables: TVariables) => void;
    onError?: (error: any, variables: TVariables) => void;
    invalidateQueries?: string[][];
    optimisticUpdate?: {
      queryKey: string[];
      updater: (oldData: any, variables: TVariables) => any;
    };
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (options?.optimisticUpdate) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: options.optimisticUpdate.queryKey });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(options.optimisticUpdate.queryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(
          options.optimisticUpdate.queryKey,
          (old: any) => options.optimisticUpdate!.updater(old, variables)
        );

        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (options?.optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(options.optimisticUpdate.queryKey, context.previousData);
      }
      options?.onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data, variables);
    },
  });
};

// Specialized hooks for common queries
export const usePatients = (options?: Partial<UseQueryOptions<any>>) => {
  return useOptimizedQuery(
    ['patients'],
    async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    options
  );
};

export const useAppointments = (patientId?: string, options?: Partial<UseQueryOptions<any>>) => {
  return useOptimizedQuery(
    ['appointments', patientId || 'all'],
    async () => {
      let query = supabase
        .from('appointments')
        .select('*, patients(name, email)');
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query.order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    {
      enabled: true, // Always enabled, but filter by patientId if needed
      ...options,
    }
  );
};

// Prefetching utility
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchPatients = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['patients'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }, [queryClient]);

  const prefetchAppointments = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['appointments', 'all'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('appointments')
          .select('*, patients(name, email)')
          .order('appointment_date', { ascending: true });
        
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  return {
    prefetchPatients,
    prefetchAppointments,
  };
};