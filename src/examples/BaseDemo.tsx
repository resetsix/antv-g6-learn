import { Graph, treeToGraphData } from "@antv/g6";
import type React from "react";
import { useEffect, useRef } from "react";
import { treeData } from "../__mock__/treeData";

export const Demo14: React.FC = () => {
    const contsinerRef = useRef<HTMLDivElement | null>(null);
    const graphRef = useRef<Graph | null>(null);

    useEffect(() => {
        const graph = new Graph({
            container: contsinerRef.current!,
            data: treeToGraphData(treeData),
            background: "#fee",
            layout: {
                type: "compact-box",
                direction: "TB",
                getHeight: function getHeight() {
                    return 16;
                },
                getWidth: function getWidth() {
                    return 16;
                },
                getVGap: function getVGap() {
                    return 80;
                },
                getHGap: function getHGap() {
                    return 20;
                },
            },
        });
        graphRef.current = graph;

        graph.render();
        graph.fitCenter();

        return () => graphRef.current?.destroy();
    }, []);

    return (
        <div ref={contsinerRef} style={{ width: "100%", height: 1200 }}></div>
    );
};
