<!DOCTYPE html>
<html lang="zh-hans">

<head>
    <script src="script.js"></script>
    <script src="../dropdowns.js"></script>
    <meta charset="UTF-8">
    <title>WBJ 局兵导航</title>
    <link rel="stylesheet" href="../style.css">
</head>

<body>
    <?php include '../header.php'; ?>
    <div class="content-page">
        <h3>该页面仅在重新加载时重置数据，如需更新市场数据请刷新页面</h3>
        <input type="text" id="query" placeholder="输入物品名称">
        <button id="search-button" onclick="generateContents()">搜索</button>
        <div id="results"></div>
    </div>
</body>

</html>