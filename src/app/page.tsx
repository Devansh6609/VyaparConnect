// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
// FIX: Used type-only import to prevent module resolution errors.
import type { DashboardData } from '../types';
import { getSocket } from '@/lib/socket-client';
import { Socket } from 'socket.io-client';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      const newSocket = getSocket();
      setSocket(newSocket);

      const fetchData = async () => {
        try {
          const res = await fetch('/api/dashboard');
          if (res.ok) {
            setData(await res.json());
          } else {
            throw new Error("Failed to fetch dashboard data");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return <Dashboard initialData={data} socket={socket} />;
}