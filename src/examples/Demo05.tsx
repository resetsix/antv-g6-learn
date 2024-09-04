import {
  Graph,
  type Combo,
  type Edge,
  type GraphData,
  type IElementEvent,
} from "@antv/g6";
import type React from "react";
import { useEffect, useRef } from "react";
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

export const Demo05: React.FC = () => {
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
          // type: antv-dagre combo-combined compact-box force-atlas2 circular concentric d3-force dagre dendrogram force fruchterman grid indented mds mindmap radial random
          type: "circular",
        },
        // autoFit: "center",
        // background: "#E8D6E8",
        behaviors: [
          "drag-canvas",
          "zoom-canvas",
          "drag-element",
          "click-select",
          "zoom-canvas",
        ],
        plugins: [
          { type: "grid-line", follow: true, key: "grid-line" },
          { type: "tooltip", key: "tooltip" },
          {
            type: "contextmenu",
            key: "contextmenu",
            // trigger: "click", // click or contextmenu。default contextmenu
            onClick: (
              value: string,
              target: HTMLElement,
              current: Node | Edge | Combo
            ) => {
              console.log("value", value, "target", target, "current", current);
            },
            getItems: () => {
              return [
                { name: "test01", value: "test01" },
                { name: "test02", value: "test02" },
              ];
            },
            enable: (e: IElementEvent) => {
              return e.targetType === "node";
            },
          },
        ],
      });
      graphRef.current = graph;
      graph.render();
    }

    // 销毁
    return () => graphRef.current?.destroy();
  }, []);

  const handleRandomSelected = () => {
    const randomIndex = getRandomIndex(data.nodes?.length);
    console.log("randomIndex", randomIndex);
    graphRef.current?.setElementState(`node-${randomIndex}`, "selected");
  };
  const handleRandomSelectedClear = () => {
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

      // 居中
      // graphRef.current.once("afterlayout", async () => {
      //   await graphRef.current?.fitCenter()
      // });
    }
  };
  const handleFocus = () => {
    const randomIndex = getRandomIndex(data.nodes?.length);
    graphRef.current?.focusElement(`node-${randomIndex}`);
  };
  const handleZoomAbsolutionUp = () => {
    graphRef.current?.zoomBy(1.6);
  };
  const handleZoomAbsolutionDown = () => {
    graphRef.current?.zoomBy(0.6);
  };
  const handleZoomRelationUp = () => {
    graphRef.current?.zoomTo(1.6);
  };
  const handleZoomRelationDown = () => {
    graphRef.current?.zoomTo(0.6);
  };
  const handleCenter = () => {
    graphRef.current?.fitCenter();
  };
  const handleView = () => {
    graphRef.current?.fitView();
  };

  return (
    <>
      <h2>Graph简单示例05</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleRandomSelected}>随机选中</button>
        <button onClick={handleRandomSelectedClear}>
          清除 node-1 为选中状态
        </button>
        <button onClick={handleLayout}>随机布局(console查看布局名称)</button>
        <button onClick={handleFocus}>定位</button>
        <button onClick={handleCenter}>居中</button>
        <button onClick={handleView}>适配窗口</button>
        <button title="仅能缩放一次" onClick={handleZoomRelationUp}>
          缩放(绝对)↑
        </button>
        <button title="仅能缩放一次" onClick={handleZoomRelationDown}>
          缩放(绝对)↓
        </button>
        <button title="可连续缩放" onClick={handleZoomAbsolutionUp}>
          缩放(相对)↑
        </button>
        <button title="可连续缩放" onClick={handleZoomAbsolutionDown}>
          缩放(相对)↓
        </button>
      </div>
      <div ref={containerRef} style={{ width: "99vw", height: "90vh" }} />
    </>
  );
};
