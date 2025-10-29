import React from "react";
import contactApi, { getQueueLength, getMetrics } from "@/api/contactApi";

export default function StatsPanel() {
  const [queueLen, setQueueLen] = React.useState(() => getQueueLength());
  const [metrics, setMetrics] = React.useState(() => getMetrics());

  React.useEffect(() => {
    const iv = setInterval(() => {
      setQueueLen(getQueueLength());
      setMetrics(getMetrics());
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="p-4 border rounded-md bg-muted">
      <h3 className="font-semibold mb-2">Métricas</h3>
      <div className="space-y-2 text-sm">
        <div>
          N° envíos OK: <strong>{metrics.ok}</strong>
        </div>
        <div>
          N° envíos fallidos: <strong>{metrics.error}</strong>
        </div>
        <div>
          Latencia promedio (ms):{" "}
          <strong>{Math.round(metrics.avgLatency)}</strong>
        </div>
        <div>
          En cola (offline): <strong>{queueLen}</strong>
        </div>
      </div>
    </div>
  );
}
