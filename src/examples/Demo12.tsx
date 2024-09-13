/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ExtensionCategory,
    Graph,
    register,
    type GraphData,
    treeToGraphData,
    type NodePortStyleProps,
    Line,
    CubicVertical,
} from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { getTextWidth } from "../utils/getTextWidth";
import { treeData } from "../__mock__/treeData";
// import { data } from "../data";

register(ExtensionCategory.NODE, "dtNode", ReactNode);

export interface DeNodeProps {
    id: string;
    data: { color: string; label: string; [key: string]: any };
    style: Record<string, any>;
}

const DtNode: React.FC<any> = ({ data }) => {
    return (
        <div style={{ height: 36 }}>
            <div className="node">测试</div>
        </div>
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

const data: GraphData = {
    nodes: [
        {
            id: "node1",
        },
        {
            id: "node2",
        },
        {
            id: "node3",
        },
        {
            id: "node4",
        },
        {
            id: "node5",
        },
        {
            id: "node6",
        },
    ],
    edges: [
        {
            source: "node1",
            target: "node2",
        },
        {
            source: "node1",
            target: "node3",
        },
        {
            source: "node1",
            target: "node4",
        },
        {
            source: "node2",
            target: "node5",
        },
        {
            source: "node2",
            target: "node6",
        },
    ],
};

export const Demo12: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph | null>(null);

    const data = treeToGraphData(treeData);

    useEffect(() => {
        if (containerRef.current) {
            const graph = new Graph({
                container: containerRef.current!,
                data,
                node: {
                    type: "rect",
                    // type: "dtNode",
                    style: {
                        // size: [60, 20],
                        // size(d: any) {
                        //     const labelWidth = getTextWidth(
                        //         d.id,
                        //         "14px sans-serif"
                        //     );
                        //     const width = labelWidth + 40; // 40px 用于图标和内边距
                        //     const height = 30;
                        //     return [width, height];
                        // },
                        portLinkToCenter: true,
                        component: ({ ...props }) => <DtNode data={props} />,
                        labelPlacement: "center",
                        labelText: ({ id }) => id,
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

                            return id === "根节点"
                                ? [bottomPort]
                                : [topPort, bottomPort];
                        },
                    },
                },
                edge: {
                    type({ id }) {
                        return id === "根节点-一级节点1"
                            ? "ant-line"
                            : "cubic-vertical";
                    },
                    style(d) {
                        return d.id === "根节点-一级节点1"
                            ? { lineDash: [10, 10] }
                            : {};
                    },
                },
                layout: {
                    type: "antv-dagre",
                    // begin: [50, 50],
                    rankdir: "TB",
                    nodesep: 35,
                    ranksep: 40,
                },
                behaviors: [
                    "drag-canvas",
                    "zoom-canvas",
                    // "drag-node",
                ],
                plugins: [
                    {
                        type: "grid-line",
                        key: "grid-line",
                        // follow: true,
                        size: 10,
                    },
                ],
                autoFit: "center",
                // autoFit: "view",
            });
            graphRef.current = graph;
            graph.render();
        }

        // 销毁
        return () => graphRef.current?.destroy();
    }, [data]);

    const handleUpdate = () => {
        // 通过切换 edge type 类型来终止动画
        graphRef.current?.setEdge({
            type: "cubic-vertical",
        });
        graphRef.current?.draw();
    };

    return (
        <>
            <h2>Graph简单示例12</h2>
            <div style={{ marginBlockEnd: 16 }}>
                <button onClick={handleUpdate}>更新边样式</button>
            </div>
            <div ref={containerRef} style={{ width: "99vw", height: "85vh" }} />
        </>
    );
};
