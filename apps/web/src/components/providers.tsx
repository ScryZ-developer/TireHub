'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore, useCartStore } from '@/stores';

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const bindUser = useCartStore((s) => s.bindUser);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let authOk = useAuthStore.persist.hasHydrated();
    let cartOk = useCartStore.persist.hasHydrated();

    const markReady = () => {
      if (authOk && cartOk) setHydrated(true);
    };

    markReady();
    const offAuth = useAuthStore.persist.onFinishHydration(() => {
      authOk = true;
      markReady();
    });
    const offCart = useCartStore.persist.onFinishHydration(() => {
      cartOk = true;
      markReady();
    });

    return () => {
      offAuth();
      offCart();
    };
  }, []);

  useEffect(() => {
    if (token) fetchMe();
  }, [token, fetchMe]);

  useEffect(() => {
    if (!hydrated) return;
    bindUser(userId);
  }, [hydrated, userId, bindUser]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  );
}
