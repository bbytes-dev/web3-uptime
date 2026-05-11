"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface WebSite {
  id: string;
  url: string;
  ticks: {
    id: string;
    status: string;
    latency: number;
    createdAt: string;
    updatedAt: string;
  }[];
}
export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<WebSite[]>([]);

  const refreshWebsite = async () => {
    const token = await getToken();
    if (token) {
      const res = await axios.get(`${API_URL}/api/v1/websites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWebsites(res.data);
    }
  };
  useEffect(() => {
    refreshWebsite();

    const interval = setInterval(() => {
      refreshWebsite();
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [getToken]);

  return { websites };
}
