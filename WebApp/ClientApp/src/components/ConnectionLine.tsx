interface Props {
  sourceIndex: number
  targetIndex: number
  onDisconnect: () => void
}

export default function ConnectionLine({ sourceIndex, targetIndex, onDisconnect }: Props) {
  const handleDisconnect = () => {
    if (window.confirm('Disconnect these containers?')) {
      onDisconnect()
    }
  }

  // 计算连接线的位置和长度
  const containerSpacing = 150 // spacing between containers
  const containerWidth = 90 // container-tank width
  const distance = (targetIndex - sourceIndex) * containerSpacing
  
  const style = {
    left: `${sourceIndex * containerSpacing + 50 + containerWidth + 10}px`, // 从容器右侧开始
    top: '165px', // 容器水箱中心高度
    width: `${distance - containerWidth - 20}px`,
  }

  return (
    <div className="connection-line-container" style={style}>
      <div className="connection-line-visual" />
      <button 
        className="disconnect-btn"
        onClick={handleDisconnect}
        title="Disconnect containers"
      >
        ×
      </button>
    </div>
  )
}
