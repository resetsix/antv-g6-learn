import type { GraphData } from "@antv/g6";

const enum ColorEnum {
    RED = "#298EFB",
    BLUE = "#9A76FC",
    GREEN = "#5BC556",
}

export const processGraphData = (data?: GraphData): GraphData => {
    if (!data) {
        return {
            nodes: [],
            edges: [],
        };
    }
    const rootNode = data.nodes?.find((node) => node.id === "Modeling Methods");
    if (!rootNode) {
        return data;
    }

    const firstLevelNodes = rootNode.children || [];

    const processedNodes = data.nodes?.map((node) => {
        let color: ColorEnum | undefined;
        if (firstLevelNodes.includes(node.id)) {
            color = ColorEnum.BLUE;
        } else if (node.id !== "Modeling Methods") {
            color = ColorEnum.GREEN;
        }
        return {
            ...node,
            data: {
                ...(node.data || {}),
                ...(color && { color }),
            },
        };
    });

    return {
        nodes: processedNodes,
        edges: data.edges,
    };
};
