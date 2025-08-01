import { getBezierPath, EdgeProps } from "@xyflow/react";

export default function CustomEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <path className="react-flow__edge-path" d={edgePath} markerEnd={props.markerEnd} style={props.style} />
      {props.data?.label && (
        <text x={labelX} y={labelY} className="text-xs fill-current">
          {props.data.label as string}
        </text>
      )}
    </>
  );
}
