type MetroControlsProps = { onZoomIn: () => void; onZoomOut: () => void; onReset: () => void; zoom: number };

export function MetroControls({ onZoomIn, onZoomOut, onReset, zoom }: MetroControlsProps) {
  return <div className="map-controls"><div className="zoom-readout"><span>ZOOM</span><strong>{Math.round(zoom * 100)}%</strong></div><button onClick={onZoomIn} aria-label="Zoom in">+</button><button onClick={onZoomOut} aria-label="Zoom out">−</button><button className="reset-button" onClick={onReset}>CENTER <span>⌖</span></button></div>;
}
