import { Graph, type GraphData } from "@antv/g6";
import type React from "react";
import { useRef, useEffect } from "react";
import { layoutAlgorithms } from "../layoutAlgorithms";
import { getRandomIndex } from "../utils/getRandomIndex";

const data: GraphData = {
  nodes: Array.from({ length: 10 }).map((_, i) => ({
    id: `node-${i}`,
    data: {
      color: i % 2 === 0 ? "color1" : "color2",
    },
  })),
  edges: Array.from({ length: 9 }).map((_, i) => ({
    id: `edge-${i}`,
    source: "node-0",
    target: `node-${i + 1}`,
  })),
};

export const Demo04: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const graph = new Graph({
        container: containerRef.current!,
        // 自动配置画布大小可忽略 width 和 height
        autoResize: true,
        // width: 800,
        // height: 800,
        data,
        node: {
          type: (t) => (t.id === "node-1" ? "circle" : "rect"),
          palette: {
            field: "color",
            color: ["red", "green", "blue"],
          },
          state: {
            selected: {
              fill: "orange",
            },
          },
        },
        edge: { style: { stroke: "red" } },
        layout: {
          // type: circular random grid mds concentric radial fruchterman fruchtermanGPU d3-force d3-force3d force gforce forceAtlas2 antv-dagre dagre
          type: "indented",
          enableWorker: true,
        },
        // autoFit: "center",
        // background: "#E8D6E8",
        behaviors: ["drag-canvas", "zoom-canvas", "drag-element"],
        plugins: [
          { type: "grid-line", key: "grid-line", follow: true },
          { type: "tooltip", key: "tooltip" },
        ],
      });
      graphRef.current = graph;
      graph.render();
    }

    // 销毁
    return () => graphRef.current?.destroy();
  }, []);

  const handleButtonSelected = () => {
    graphRef.current?.setElementState("node-1", "selected");
  };
  const handleButtonSelectedClear = () => {
    graphRef.current?.setElementState("node-1", []);
  };
  const handleLayout = async () => {
    // 随机选择一个布局
    const randomIndex = getRandomIndex(layoutAlgorithms.length);
    const randomLayout = layoutAlgorithms[randomIndex];
    console.log("布局类型：", graphRef.current?.getLayout());
    // 设置选中的随机布局
    if (graphRef.current) {
      graphRef.current.setLayout({
        type: randomLayout,
      });

      // 执行布局
      await graphRef.current.layout();
    }
  };

  return (
    <>
      <h2>Graph简单示例04</h2>
      <button onClick={handleButtonSelected}>设置 node-1 为选中状态</button>
      <button onClick={handleButtonSelectedClear}>
        清除 node-1 为选中状态
      </button>
      <button onClick={handleLayout}>随机布局</button>
      <div ref={containerRef} style={{ width: "99vw", height: "90vh" }} />
    </>
  );
};
