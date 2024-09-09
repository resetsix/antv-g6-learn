interface TreeNode {
    id: string;
    children?: TreeNode[];
}

interface PathObject {
    [key: string]: string;
    name: string;
}

const idMapping = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

export function generatePaths(node: TreeNode): PathObject[] {
    function generatePathsRecursive(
        currentNode: TreeNode,
        currentPath: string[] = []
    ): PathObject[] {
        const newPath = [...currentPath, currentNode.id];

        if (!currentNode.children || currentNode.children.length === 0) {
            const pathObj: PathObject = {
                name: newPath.join("_"),
            };
            newPath.forEach((id, index) => {
                if (index < idMapping.length) {
                    pathObj[idMapping[index]] = id;
                } else {
                    pathObj[`id${index + 1}`] = id;
                }
            });
            return [pathObj];
        } else {
            return currentNode.children.flatMap((child) =>
                generatePathsRecursive(child, newPath)
            );
        }
    }

    // 从根节点的子节点开始生成路径
    return node.children
        ? node.children.flatMap((child) => generatePathsRecursive(child))
        : [];
}
