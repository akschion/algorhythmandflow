import { useState, useEffect } from 'react';

interface TrafficStats {
  count?: number;
  uniques?: number;
  timestamp?: string;
}

export function Analytics() {
  const [stats, setStats] = useState<TrafficStats>({});

  useEffect(() => {
    // This endpoint only works for repo owners/collaborators
    // and requires GitHub authentication
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/akschion/algorhythmandflow/traffic/views', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Token should be added by the repo owner
            'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            count: data.count,
            uniques: data.uniques,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to fetch traffic stats:', error);
      }
    };

    // Only fetch stats in production
    if (import.meta.env.PROD) {
      fetchStats();
    }
  }, []);

  // Component doesn't render anything
  return null;
}
