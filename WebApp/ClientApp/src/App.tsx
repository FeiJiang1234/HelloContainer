import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerList from './components/ContainerList';

interface Container {
  id: string;
  name: string;
  capacity: number;
  currentVolume: number;
  isConnected: boolean;
}

const App: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError("");

      // 调用后端 API
      const response = await axios.get("/api/containers", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setContainers(response.data || []);
    } catch (err: any) {
      console.error("Error fetching containers:", err);
      setError(err.message || "Failed to load containers");

      // 如果API调用失败，显示模拟数据
      setContainers([
        {
          id: "1",
          name: "Container A",
          capacity: 100,
          currentVolume: 75,
          isConnected: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchContainers();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🫙 HelloContainer React App</h1>
        <p>Container Management System - React TypeScript Client</p>
        <button className="btn" onClick={handleRefresh} disabled={loading}>
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {error && (
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <p>
            <small>Showing demo data instead...</small>
          </p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <p>Loading containers...</p>
        </div>
      ) : (
        <ContainerList containers={containers} />
      )}
    </div>
  );
};

export default App;