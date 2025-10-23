import { useState, useEffect } from "react";
import { ContainerDto } from "../../../types";
import { containerApi } from "../../../api";
import { Button, LoadingSpinner } from "../../../common";

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadContainers = async () => {
    try {
      setLoading(true);
      const data = await containerApi.getContainers();
      setContainers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load containers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContainers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading containers..." />
      </div>
    );
  }

  return (
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <h5>Connect Container</h5>
        
        <div className="connect-options">
          {containers.length === 0 ? (
            <p className="text-muted">No containers available to connect.</p>
          ) : (
            containers.map(container => (
              <div
                key={container.id}
                className="connect-option"
              >
                <strong>{container.name}</strong>
                <br />
                <small>Capacity: {container.capacity}L, Amount: {container.amount}L</small>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-3">
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
  );
}
