export default function HeatmapViewer({ heatmap }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl mb-2">Visual Attention Heatmap</h3>
      <img
        src={`data:image/jpeg;base64,${heatmap}`}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
