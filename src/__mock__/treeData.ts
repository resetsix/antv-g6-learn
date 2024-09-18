interface TreeNode {
    id: string;
    children?: TreeNode[];
}

function generateMockData(): TreeNode {
    const mockData: TreeNode = {
        id: "根节点",
        children: [],
    };

    for (let i = 1; i <= 3; i++) {
        const level1: TreeNode = {
            id: `一级节点${i}`,
            children: [],
        };

        // for (let j = 1; j <= 2; j++) {
        //     const level2: TreeNode = {
        //         id: `二级节点${i}-${j}`,
        //         children: [],
        //     };

        //     for (let k = 1; k <= 2; k++) {
        //         const level3: TreeNode = {
        //             id: `三级节点${i}-${j}-${k}`,
        //         };
        //         level2.children!.push(level3);
        //     }

        //     level1.children!.push(level2);
        // }

        mockData.children!.push(level1);
    }

    return mockData;
}

export const treeData: TreeNode = generateMockData();