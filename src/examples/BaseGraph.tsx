import { Graph } from "@antv/g6";
import type React from "react";
import { useRef, useEffect } from "react";

const data = {
  nodes: [
    { id: "node-1", style: { x: 50, y: 100 } },
    { id: "node-2", style: { x: 150, y: 100 } },
  ],
  edges: [{ id: "edge-1", source: "node-1", target: "node-2" }],
};

export const BaseGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const graph = new Graph({
        container: containerRef.current!,
        width: 400,
        height: 400,
        data,
      });
      graphRef.current = graph;
      graph.render();
    }

    // 销毁
    return () => graphRef.current?.destroy();
  }, []);

  return (
    <>
      <h2>Graph简单示例</h2>
      <div ref={containerRef} />
    </>
  );
};
