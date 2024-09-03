## a repository to learn antv/g6 

antv/g6 v5.0.19

## 遇到问题

### antv/g6 source code mapping warning

warning info: antv/g6 source code mapping points to a non-existent path

> antv/g6 源码映射指向不存在路径。

在项目启动编译时提示 warning 信息，不影响项目正常运行

![source-mapping-error.png](./src/assets/source-mapping-error.png)

**解决方案**：**关闭**构建工具生成源码映射文件开关  

根目录新增`.env`文件，内容如下
```
GENERATE_SOURCEMAP=false
```