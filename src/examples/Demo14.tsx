/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CubicVertical,
  ExtensionCategory,
  Graph,
  GraphEvent,
  NodeEvent,
  register,
  treeToGraphData,
  type Combo,
  type Edge,
  type IElementEvent,
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
      <div style={{ display: "inline-block" }}>
        <img
          src={
            IMAGE_MAP[(data.data.state as keyof typeof IMAGE_MAP) || "running"]
          }
          alt="img"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            marginLeft: 8,
            animation: data.style.animation,
          }}
        />
      </div>
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

register(ExtensionCategory.EDGE, "ant-line", AntLine);

export const Demo14: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  const data = treeToGraphData(treeData);

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
            const width = 180;
            const height = 36;
            return [width, height];
          },
          dx: -90,
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
            const topPort: NodePortStyleProps = {
              ...commonPort,
              key: "top",
              placement: "top",
            };
            const bottomPort: NodePortStyleProps = {
              ...commonPort,
              key: "bottom",
              placement: "bottom",
            };

            return id === "根节点" ? [bottomPort] : [topPort, bottomPort];
          },
        },
      },
      edge: {
        type({ id }) {
          return id === "根节点-一级节点1" ? "ant-line" : "cubic-vertical";
        },
        style(d) {
          return d.id === "根节点-一级节点1"
            ? { lineDash: [10, 10], loop: false }
            : { loop: false };
        },
      },
      layout: {
        type: "antv-dagre",
        nodesep: 6,
        ranksep: -30,
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
        {
          type: "create-edge",
          trigger: "drag",
          style: {
            lineDash: [10, 10],
          },
          onCreate: (edge: any) => {
            const e = graphRef.current?.getEdgeData();
            const { style, ...rest } = edge;
            return {
              ...rest,
              style: {
                ...style,
                lineDash: undefined,
              },
            };
          },
          // onFinish: (edge: any) => {
          //     graphRef.current?.removeEdgeData([edge.id]);
          // },
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

    graph.on(NodeEvent.POINTER_ENTER, (event: any) => {
      const nodeId = event.target.id;
      //   graph.setElementState(nodeId, "active", true);

      graph.updateNodeData([
        {
          id: nodeId,
          data: {
            label: "新文本",
            state: "running",
          },
          style: {
            color: "green",
            animation: "spin 1s linear infinite",
            borderLeft: `4px solid ${COLOR_MAP.normal}`,
          },
        },
      ]);

      graph.draw();
    });
    graph.on(NodeEvent.POINTER_LEAVE, (event: any) => {
      const nodeId = event.target.id;
      graph.updateNodeData([
        {
          id: nodeId,
          data: {
            label: nodeId,
            state: nodeId === "一级节点2" ? "success" : "failed",
          },
          style: {
            color: "#1F1F1F",
            animation: undefined,
            borderLeft: `4px solid ${
              nodeId === "一级节点2" ? COLOR_MAP.success : COLOR_MAP.failed
            }`,
          },
        },
      ]);

      graph.draw();
    });
    graph.on(GraphEvent.AFTER_CANVAS_INIT, () => {
      //   graphRef.current?.fitView();
      const node = graphRef.current?.getNodeData();
      console.log("After rendering, the number of nodes is", node?.length);
    });

    // 销毁
    return () => graphRef.current?.destroy();
  }, [data]);

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
      <h2>Graph简单示例14</h2>
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
