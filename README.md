## 抓取 **智联招聘** 网站数据


- config 文件配置基本信息
- api 包括主要函数
- data 包括抓取公司列表，需要通过 **db.runCommand({"distinct": `COLLECTION` , "key": `FIELD` })** 命令生成
