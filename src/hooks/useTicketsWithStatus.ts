import { useEffect, useState } from 'react';
import axios from 'axios';

export interface TicketStatus {
  id: number;
  ticketId: number;
  status: string;
}

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
  custom_fields?: { catchmentPointId?: number; [key: string]: unknown };
  status?: string;
}

interface TicketsApiResponse {
  success: boolean;
  message: string;
  data: Ticket[];
}

interface StatusApiResponse {
  success: boolean;
  message: string;
  data: TicketStatus[];
}

function extractArray<T>(responseData: unknown): T[] {
  if (Array.isArray(responseData)) return responseData as T[];
  if (responseData && typeof responseData === 'object') {
    const arr = Object.values(responseData).find((v) => Array.isArray(v));
    if (arr) return arr as T[];
  }
  return [];
}

export function useTicketsWithStatus() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [ticketsRes, statusRes] = await Promise.all([
          axios.get<TicketsApiResponse | Ticket[]>('/api/tickets/'),
          axios.get<StatusApiResponse | TicketStatus[]>('/api/status-tickets/')
        ]);
        const ticketsData = extractArray<Ticket>(ticketsRes.data);
        const statusData = extractArray<TicketStatus>(statusRes.data);
        // Mapear el estado actual a cada ticket (el último status por ticketId)
        const statusMap: Record<number, string> = {};
        const statusIdMap: Record<number, number> = {};
        statusData.forEach((s) => {
          if (!statusIdMap[s.ticketId] || (s.id > statusIdMap[s.ticketId])) {
            statusMap[s.ticketId] = s.status;
            statusIdMap[s.ticketId] = s.id;
          }
        });
        const merged: Ticket[] = ticketsData.map((t) => ({
          ...t,
          status: statusMap[t.id] || 'open',
        }));
        if (mounted) setTickets(merged);
      } catch (err) {
        setError((err as Error).message || 'Error al cargar tickets');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  return { tickets, loading, error };
} 