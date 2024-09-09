import { Graph } from "@antv/g6";

export const getAllParents = (
    graph: Graph,
    nodeId: string
): Record<string, string> => {
    const result: Record<string, string> = {};
    let currentId = nodeId;

    while (currentId !== "root") {
        const parent = graph.getParentData(currentId, "tree");
        if (!parent) break;

        result[parent.id] = parent.id;
        currentId = parent.id;
    }

    return result;
};
