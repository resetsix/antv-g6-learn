import type { GraphData, Node } from "@antv/g6";

// 修改 G6NodeConfig 类型定义
type G6NodeConfig = Partial<Node> & {
    id: string;
    children?: string[];
    data?: {
        color?: string;
        [key: string]: any;
    };
};

const enum ColorEnum {
    RED = "#298EFB",
    BLUE = "#9A76FC",
    GREEN = "#5BC556",
    YELLOW = "#FFC300",
}

export const processGraphData = (data?: GraphData): GraphData => {
    if (!data) {
        return { nodes: [], edges: [] };
    }

    const rootNode = data.nodes?.find((node) => node.id === "根节点");
    if (!rootNode) {
        return data;
    }

    const newNodes: G6NodeConfig[] = [];
    const newEdges: { source: string; target: string }[] = [];

    const processNode = (node: G6NodeConfig, parentIds: string[] = []) => {
        const currentIds = [...parentIds, node.id];

        if (!node.children || node.children.length === 0) {
            const newChildId = currentIds.join("_");
            newNodes.push({
                id: newChildId,
                data: { color: ColorEnum.YELLOW },
            });
            newEdges.push({
                source: node.id,
                target: newChildId,
            });
        } else {
            if (node.children && node.children.length > 0) {
                node.children.forEach((childId) => {
                    const childNode = data.nodes?.find((n) => (n as G6NodeConfig).id === childId as any);
                    if (childNode) {
                        processNode(childNode as G6NodeConfig, currentIds);
                    }
                });
            }
        }

        return {
            ...node,
            data: {
                ...(node.data || {}),
                color: getNodeColor(currentIds.length),
            },
        };
    };

    const getNodeColor = (level: number): ColorEnum => {
        switch (level) {
            case 1:
                return ColorEnum.RED;
            case 2:
                return ColorEnum.BLUE;
            case 3:
                return ColorEnum.GREEN;
            default:
                return ColorEnum.YELLOW;
        }
    };

    const processedNodes = data.nodes?.map((node) => {
        if (node.id === rootNode.id) {
            return processNode(node as G6NodeConfig);
        }
        return node;
    });

    return {
        nodes: [...(processedNodes || []), ...newNodes],
        edges: [...(data.edges || []), ...newEdges],
    };
};
