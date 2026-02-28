<!DOCTYPE html>
<html lang="zh-hans">

<head>
    <script src="script.js"></script>
    <script src="dropdowns.js"></script>
    <meta charset="UTF-8">
    <title>WBJ 局兵导航</title>
    <link rel="stylesheet" href="style.css">
    <?php
    if(isset($_GET['code'])) {
        echo '<script> let code = "'.$_GET['code'].'"; </script>';
    } else {
        echo '<script> let code = null; </script>';
    }
    ?>
</head>

<body style="display: flex">
    <?php include 'header.php'; ?>
    <div class="article-page">
        <div class="article" onclick="window.location.href='/buyback'">
            <h2 id="buyback"> >>> WBJ回收服务 <<< </h2>
            <h3> WBJ回收业务已经重新启动！点击了解更多 </h3>
        </div>
        <div class="article" onclick="window.location.href='/about'">
            <h2> 网暴局正在招新！ </h2>
            <h3> 待遇优厚，环境友好，内容多样，点进来就完事了 </h3>
        </div>
    </div>
    <div class="login-page">
        <div id="accounts">
            <h2>已登录人物（点击以退出登录）<h2>
        </div>
        <input style="transform: scale(0.6); align-self: center" type="image" src="login.png" onclick="window.location.href=createAuthorizationUrl()">
    </div>
</body>

</html>