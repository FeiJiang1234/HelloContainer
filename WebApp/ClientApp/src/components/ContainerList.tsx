import React from 'react';

interface Container {
  id: string;
  name: string;
  capacity: number;
  currentVolume: number;
  isConnected: boolean;
}

interface ContainerListProps {
  containers: Container[];
}

const ContainerList: React.FC<ContainerListProps> = ({ containers }) => {
  const getVolumePercentage = (current: number, capacity: number): number => {
    return Math.round((current / capacity) * 100);
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage >= 80) return '#ff6b6b';
    if (percentage >= 60) return '#ffa726';
    return '#4caf50';
  };

  return (
    <div>
      <h2>📊 Container Status ({containers.length} containers)</h2>
      
      {containers.length === 0 ? (
        <div className="card">
          <p>No containers found.</p>
        </div>
      ) : (
        containers.map((container) => {
          const percentage = getVolumePercentage(container.currentVolume, container.capacity);
          
          return (
            <div key={container.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    {container.name}
                    {container.isConnected && <span style={{ color: '#4caf50', marginLeft: '10px' }}>🔗</span>}
                  </h3>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Volume:</strong> {container.currentVolume}L / {container.capacity}L ({percentage}%)
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Status:</strong> 
                    <span style={{ color: container.isConnected ? '#4caf50' : '#666' }}>
                      {container.isConnected ? ' Connected' : ' Disconnected'}
                    </span>
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div 
                    style={{
                      width: '100px',
                      height: '20px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: getStatusColor(percentage),
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <small style={{ color: '#666' }}>{percentage}% full</small>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ContainerList;