import { useRef, useState, useEffect } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

function DrawingCanvas({ user, onSave, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const endDraw = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !user?.uid) return;
    setSaving(true);
    setSaveError("");
    try {
      const MAX_W = 400;
      const MAX_H = 300;
      const w = Math.min(canvas.width, MAX_W);
      const h = Math.min(canvas.height, MAX_H);
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h);
      const dataUrl = off.toDataURL("image/jpeg", 0.82);
      const path = `drawings/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, path);
      await uploadString(storageRef, dataUrl, "data_url");
      const url = await getDownloadURL(storageRef);
      onSave(url);
      onClose();
    } catch (err) {
      setSaveError(err.message || "Failed to save drawing. Check Storage rules for drawings path.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="drawing-canvas-modal">
      <div className="drawing-canvas-header">
        <h3>Draw</h3>
        <button type="button" className="drawing-canvas-close" onClick={onClose}>×</button>
      </div>
      <div className="drawing-canvas-tools">
        <label>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="drawing-color-input"
          />
        </label>
        <label>
          Size
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </label>
        <button type="button" className="btn btn-secondary" onClick={clear}>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="drawing-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      {saveError && <p className="auth-error drawing-save-error">{saveError}</p>}
      <div className="drawing-canvas-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save drawing"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
}

export default DrawingCanvas;
