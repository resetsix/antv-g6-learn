/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CubicVertical,
  EdgeEvent,
  ExtensionCategory,
  Graph,
  GraphEvent,
  NodeEvent,
  register,
  treeToGraphData,
  type Combo,
  type Edge,
  type IElementEvent,
  type IPointerEvent,
  type Node,
  type NodePortStyleProps,
} from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { Avatar, Flex, Typography } from "antd";
import type React from "react";
import { useEffect, useRef } from "react";
import { treeData } from "../__mock__/treeData";
import { getTextWidth } from "../utils/getTextWidth";

register(ExtensionCategory.NODE, "reactNode", ReactNode);

export interface DeNodeProps {
  id: string;
  data: { color: string; label: string; [key: string]: any };
  style: Record<string, any>;
}

interface NodeStatus {
  id: string;
  status: "default" | "success" | "failed" | "running";
  label?: string;
}

const COLOR_MAP = {
  success: "#52c41a",
  normal: "#1890ff",
  failed: "#ff4d4f",
};

const IMAGE_MAP = {
  logo: "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ",
  success:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ",
  failed:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ",
  running:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ",
};

const DtNode: React.FC<any> = ({ data }) => {
  const { animation, ...newStyle } = data.style;
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        height: 34,
        background: "#fff",
        borderRadius: 4,
        border: "1px solid #c2c8d5",
        borderLeft: `4px solid ${COLOR_MAP.normal}`,
        paddingInline: 8,
        boxShadow: "0 2px 5px 1px rgba(0, 0, 0, 0.06)",
        ...newStyle,
      }}
    >
      <Flex gap={4} align="center">
        <Avatar size="small" draggable={false} src={IMAGE_MAP.logo} />
        <Typography.Text style={{ fontSize: 12, color: data.style.color }}>
          {data.data.label || data.id}
        </Typography.Text>
      </Flex>
    </Flex>
  );
};

class AntLine extends CubicVertical {
  onCreate() {
    const shape = this.shapeMap.key;
    shape.animate([{ lineDashOffset: 20 }, { lineDashOffset: 0 }], {
      duration: 500,
      iterations: Infinity,
    });
  }
}

const data = {
  nodes: [
    { id: "0" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
  ],
  edges: [
    { source: "0", target: "1" },
    { source: "0", target: "2" },
    { source: "1", target: "4" },
    { source: "0", target: "3" },
    { source: "3", target: "4" },
    { source: "4", target: "5" },
    { source: "4", target: "6" },
    { source: "5", target: "7" },
    { source: "5", target: "8" },
    { source: "8", target: "9" },
    { source: "2", target: "9" },
    { source: "3", target: "9" },
  ],
};

register(ExtensionCategory.EDGE, "ant-line", AntLine);

export const Demo15: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // const data = treeToGraphData(treeData);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current!,
      autoResize: true,
      //   autoFit: "view",
      data,
      node: {
        type: "reactNode",
        // type: "rect",
        style: {
          // size: [60, 20],
          size(d: any) {
            const labelWidth = getTextWidth(d.id, "14px sans-serif");
            // const width = labelWidth + 60; // 40px 用于图标和内边距
            // const height = 40;
            const width = 100;
            const height = 30;
            return [width, height];
          },
          // 修复 edge 偏移问题。https://github.com/antvis/G6/issues/6352#issuecomment-2359855854
          dx: -50,
          dy: -15,
          // dx: -90,
          portLinkToCenter: true,
          component: ({ ...props }) => <DtNode data={props} />,
          // labelPlacement: "center",
          // labelText: ({ id }) => id,
          port: true,
          ports({ id }) {
            const commonPort: Partial<NodePortStyleProps> = {
              r: 4,
              stroke: "#31d0c6",
              fill: "#fff",
            };
            const leftPort: NodePortStyleProps = {
              ...commonPort,
              key: "left",
              placement: "left",
            };
            const rightPort: NodePortStyleProps = {
              ...commonPort,
              key: "right",
              placement: "right",
            };

            return id === "根节点" ? [rightPort] : [leftPort, rightPort];
          },
        },
      },
      // edge: {
      //   type: 'line',
      //   style: {
      //     labelText: (d) => d.id,
      //     labelBackground: true,
      //     endArrow: true,
      //     badge: true,
      //     badgeText: '\ue603',
      //     badgeFontFamily: 'iconfont',
      //     badgeBackgroundWidth: 12,
      //     badgeBackgroundHeight: 12,
      //   },
      // },
      // layout: {
      //   type: "antv-dagre",
      //   rankdir: "LR",
      //   // nodesep: 20,
      //   // ranksep: 10,
      //   // controlPoints: true,
      // },
      layout: {
        type: "antv-dagre",
        rankdir:'LR',
        // nodesep: 100,
        // ranksep: 70,
        controlPoints: true,
      },
      // node: {
      //   type: "rect",
      //   style: {
      //     size: [60, 30],
      //     radius: 8,
      //     labelPlacement: "center",
      //     labelText: (d) => d.id,
      //   },
      // },
      edge: {
        type: "polyline",
        style: {
          endArrow: true,
          lineWidth: 2,
          stroke: "#C2C8D5",
        },
      },
      behaviors: [
        {
          type: "drag-canvas",
          key: "drag-canvas",
        },
        {
          type: "zoom-canvas",
          key: "zoom-canvas",
        },
      ],
      plugins: [
        {
          type: "grid-line",
          key: "grid-line",
          // follow: true,
          size: 10,
        },
        {
          type: "contextmenu",
          key: "contextmenu",
          onClick: (
            value: string,
            target: HTMLElement,
            current: Node | Edge | Combo | any
          ) => {
            if (current.type === "edge") {
              console.log("value", value, "current", current.id);
              graphRef.current?.removeEdgeData([current.id]);
              graphRef.current?.draw();
            }
          },
          getItems: (d: any) => {
            const type = d.targetType;
            if (type === "node") {
              return [{ name: "node菜单", value: "node-menu" }];
            }
            if (type === "edge") {
              return [{ name: "删除边", value: "delete" }];
            }
            return [];
          },
          enable: (e: IElementEvent) => {
            return e.targetType === "node" || e.targetType === "edge";
          },
        },
      ],
    });

    graphRef.current = graph;
    graph.render();

    graph.on(GraphEvent.AFTER_CANVAS_INIT, () => {
      //   graphRef.current?.fitView();
      const node = graphRef.current?.getNodeData();
      console.log("After rendering, the number of nodes is", node?.length);
    });

    // 销毁
    return () => graphRef.current?.destroy();
  }, []);

  const handleUpdate = () => {
    graphRef.current?.setEdge({ type: "cubic-vertical" });
    graphRef.current?.draw();
  };
  const handleAutoFit = () => {
    graphRef.current?.fitView();
  };
  const handleZoom = () => {
    graphRef.current?.zoomTo(1);
  };

  return (
    <>
      <h2>Graph简单示例15</h2>
      <div style={{ marginBlockEnd: 16 }}>
        <button onClick={handleUpdate}>更新边样式</button>
        <button onClick={handleAutoFit}>适配</button>
        <button onClick={handleZoom}>重置缩放</button>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "85vh" }} />
    </>
  );
};

// // 在组件外部或文件顶部添加以下样式
// const style = document.createElement("style");
// style.textContent = `
// @keyframes spin {
//     from { transform: rotate(0deg); }
//     to { transform: rotate(360deg); }
// }
// `;
// document.head.appendChild(style);
