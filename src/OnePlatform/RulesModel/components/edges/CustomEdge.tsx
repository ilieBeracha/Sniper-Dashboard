import { getBezierPath, EdgeProps } from "@xyflow/react";

export default function CustomEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath(props);
  
  const isTrue = props.sourceHandleId === "true";
  const isFalse = props.sourceHandleId === "false";
  
  const strokeColor = isTrue ? "#10b981" : isFalse ? "#ef4444" : "#94a3b8";
  const strokeDasharray = isFalse ? "3 3" : "0";

  return (
    <g>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 1.5,
          strokeDasharray,
          fill: "none",
        }}
      />
      <circle r="2" fill={strokeColor}>
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </g>
  );
}
