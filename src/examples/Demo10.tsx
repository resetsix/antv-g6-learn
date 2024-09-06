/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ExtensionCategory,
    Graph,
    register,
    treeToGraphData,
    type Combo,
    type Edge,
    type GraphData,
    type ID,
    type IElementEvent,
} from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { Flex, Typography } from "antd";
import type React from "react";
import { useEffect, useRef } from "react";
import { treeData } from "../__mock__/treeData";
import LibraryFolder from "../assets/LibraryFolder";
import { COLOR_ENUM } from "../constants";
import { layoutAlgorithms } from "../layoutAlgorithms";
import { getRandomIndex } from "../utils/getRandomIndex";
import { getTextWidth } from "../utils/getTextWidth";
// import { data } from "../data";

register(ExtensionCategory.NODE, "dtNode", ReactNode);

export interface DeNodeProps {
    data: {
        id: string;
        data: { color: string; label: string; [key: string]: any };
        style: Record<string, any>;
    };
}
const flexStyle: React.CSSProperties = {
    width: "100%",
    minWidth: 60,
    height: "100%",
    paddingInlineStart: 6,
    background: "#fff",
    // padding: 4,
    borderRadius: 6,
    border: "1px solid gray",
};

const DtNode: React.FC<DeNodeProps> = ({ data }) => {
    return (
        <Flex align="center" gap="small" style={flexStyle}>
            <LibraryFolder />
            <Typography.Text>{data.id}</Typography.Text>
        </Flex>
        // <Card style={{ borderRadius: 2 }} styles={{ body: { padding: 0 } }}>
        //   文本文本
        // </Card>
    );
};

const data: GraphData = {
    nodes: Array.from({ length: 10 }).map((_, i) => ({
        id: `node-${i}`,
        data: {
            color: i % 2 === 0 ? "color1" : "color2",
            label:
                i % 2 !== 0
                    ? "文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本"
                    : "文本文本文本文本文本文本",
        },
    })),
    edges: Array.from({ length: 9 }).map((_, i) => ({
        id: `edge-${i}`,
        source: "node-0",
        target: `node-${i + 1}`,
    })),
};

export const Demo10: React.FC = () => {
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
                data: treeToGraphData(treeData),
                node: {
                    // type: (t) => (t.id === "node-0" ? "rect" : "dtNode"),
                    type: "dtNode",
                    style: {
                        // size: [60, 20],
                        size(d: any) {
                            const labelWidth = getTextWidth(
                                d.id,
                                "14px sans-serif"
                            );
                            const width = labelWidth + 40; // 40px 用于图标和内边距
                            const height = 30;
                            return [width, height];
                        },
                        portLinkToCenter: true,
                        component: (data: any) => <DtNode data={data} />,
                        labelPlacement: "center",
                        labelText: (d) => d.id,
                        port: true,
                        ports: [{ placement: "left" }, { placement: "right" }],
                    },
                    state: {
                        selected: {
                            fill: "orange",
                        },
                    },
                    palette: {
                        field: "color",
                        color: ["red", "green", "blue"],
                    },
                },
                // edge: { type: "cubic-vertical", style: { stroke: "red" } },
                edge: {
                    type: "cubic-horizontal",
                    style: {
                        // curveOffset: 8,
                        // curvePosition: 1,
                        // labelText: (d) => d.id,
                        // labelBackground: true,
                        // endArrow: true,
                    },
                },
                layout: {
                    // type: antv-dagre combo-combined compact-box force-atlas2 circular concentric d3-force dagre dendrogram force fruchterman grid indented mds mindmap radial random
                    type: "compact-box",
                    // nodesep: 30,
                    // ranksep: 40,
                    direction: "LR",
                    getSide: (d: any) => {
                        return "right";
                    },
                    getId: function getId(d: any) {
                        return d.id;
                    },
                    getHeight: function getHeight() {
                        return 16;
                    },
                    getVGap: function getVGap() {
                        return 10;
                    },
                    getHGap: function getHGap() {
                        return 140;
                    },
                    // getWidth: function getWidth(d: any) {
                    //     return 70;
                    // },
                },
                autoFit: "center",
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
                    {
                        type: "tooltip",
                        key: "tooltip",
                        enable: (event: IElementEvent) => {
                            return event.targetType === "node";
                        },
                    },
                    {
                        type: "contextmenu",
                        key: "contextmenu",
                        // trigger: "click", // click or contextmenu。default contextmenu
                        onClick: (
                            value: string,
                            target: HTMLElement,
                            current: Node | Edge | Combo
                        ) => {
                            console.log(
                                "value",
                                value,
                                "target",
                                target,
                                "current",
                                current
                            );
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
        console.log(treeData, treeToGraphData(treeData));
        // 销毁
        return () => graphRef.current?.destroy();
    }, []);

    const handleRandomSelected = () => {
        const randomIndex = getRandomIndex(data.nodes?.length);
        graphRef.current?.setElementState(`node-${randomIndex}`, "selected");
    };
    const handleRandomSelectedClear = () => {
        graphRef.current?.setElementState("node-1", []);
    };
    const handleLayout = () => {
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
            graphRef.current.layout();

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
    const handleZoomTo = () => {
        graphRef.current?.zoomTo(1);
    };
    const handleAdd = () => {
        graphRef.current?.addNodeData([
            { id: `node-${graphRef.current?.getNodeData().length + 1}` },
        ]);
        graphRef.current?.render();
    };
    const handleGetNode = () => {
        const nodeLength = graphRef.current?.getNodeData().length;
        const nodeId = `node-${getRandomIndex(nodeLength)}`;
        const node = graphRef.current?.getNodeData(nodeId);
        console.log("node: ", node);
    };
    const handleGetEdge = () => {
        const edgeLength = graphRef.current?.getEdgeData().length;
        const edgeId = `edge-${getRandomIndex(edgeLength)}`;
        const edge = graphRef.current?.getEdgeData(edgeId);
        console.log("edge: ", edge);
    };
    const handleRemoveNode = () => {
        const nodeData = graphRef.current?.getNodeData();
        if (nodeData?.length) {
            const nodeId = `${nodeData?.[0].id}`;
            graphRef.current?.removeNodeData([nodeId]);
            graphRef.current?.render();
        } else {
            window.alert("没有可删除的node啦");
        }
    };
    const handleRemoveNodes = () => {
        const nodeData = graphRef.current?.getNodeData();
        if (nodeData?.length) {
            const nodeIds = nodeData.map(({ id }) => id);
            graphRef.current?.removeNodeData(nodeIds);
            graphRef.current?.render();
        } else {
            window.alert("没有可删除的node啦");
        }
    };
    const handleRemoveEdge = () => {
        const edgeData = graphRef.current?.getEdgeData();
        if (edgeData?.length) {
            const edgeId = `${edgeData?.[0].id}`;
            graphRef.current?.removeEdgeData([edgeId]);
            graphRef.current?.render();
        } else {
            window.alert("没有可删除的edge啦");
        }
    };
    const handleRemoveEdges = () => {
        const edgeData = graphRef.current?.getEdgeData();
        if (edgeData?.length) {
            const edgeIds = edgeData.map(({ id }) => id) as ID[];
            graphRef.current?.removeEdgeData(edgeIds);
            graphRef.current?.render();
        } else {
            window.alert("没有可删除的edge啦");
        }
    };
    const handleClear = () => {
        graphRef.current?.clear();
    };
    const handleSetNull = () => {
        graphRef.current?.setData({});
        graphRef.current?.draw();
    };
    const handleUpdateNode = () => {
        const nodeLength = graphRef.current?.getNodeData().length;
        graphRef.current?.updateNodeData([
            {
                id: `node-${getRandomIndex(nodeLength)}`,
                style: { fill: COLOR_ENUM[getRandomIndex(nodeLength)] },
            },
        ]);
        graphRef.current?.draw();
    };
    const handleUpdateEdge = () => {
        const edgeLength = graphRef.current?.getEdgeData().length;
        graphRef.current?.updateEdgeData([
            {
                id: `edge-${getRandomIndex(edgeLength)}`,
                style: {
                    stroke: COLOR_ENUM[getRandomIndex(edgeLength)],
                    strokeWidth: "80%",
                },
            },
        ]);
        graphRef.current?.draw();
    };

    return (
        <>
            <h2>Graph简单示例10</h2>
            <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleRandomSelected}>随机选中</button>
                <button onClick={handleRandomSelectedClear}>
                    清除 node-1 为选中状态
                </button>
                <button onClick={handleLayout}>随机布局</button>
                <button onClick={handleFocus}>定位</button>
                <button onClick={handleCenter}>居中</button>
                <button onClick={handleView}>适配窗口</button>
                <button title="还原" onClick={handleZoomTo}>
                    1:1
                </button>
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
            <div style={{ display: "flex", gap: 12, marginBlock: 12 }}>
                <button onClick={handleAdd}>新增 node</button>
                <button onClick={handleGetNode}>获取 node 信息</button>
                <button onClick={handleGetEdge}>获取 edge 信息</button>
                <button onClick={handleRemoveNode}>移除一条 node</button>
                <button onClick={handleRemoveNodes}>移除全部node</button>
                <button onClick={handleRemoveEdge}>移除一条 edge</button>
                <button onClick={handleRemoveEdges}>移除全部edge</button>
                <button onClick={handleClear}>清空元素(clear)</button>
                <button onClick={handleSetNull}>清空元素(setNull)</button>
                <button onClick={handleUpdateNode}>更新节点</button>
                <button onClick={handleUpdateEdge}>更新边</button>
            </div>
            <div ref={containerRef} style={{ width: "99vw", height: "85vh" }} />
        </>
    );
};
