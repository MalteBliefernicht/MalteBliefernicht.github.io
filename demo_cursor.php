<html>
    <head>
        <meta charset="utf-8" />
        <title>Personal Website - Demos</title>
        <link rel="stylesheet" href="CSS/main.css" />
        <link rel="stylesheet" href="CSS/demo_selectionbar.css" />
        <link rel="stylesheet" href="CSS/demo_cursor.css" />
    </head>
    <body>
        <?php include ("./templates/menubar.php") ?>
        
        <div class="content">
            <?php include ("./templates/demo_selectionbar.php") ?>
            
            <div class="demo-description">
                <h1>Follow The Cursor [A] - Javascript Demo</h1>
                <p>Eine simple Demo, die meine Fähigkeit zur Entwicklung von Algorithmen und meine Kenntnisse in Javascript demonstrieren soll.</p>
                <p>Start drücken und die kleinen Fähnchen mit dem Cursor "lenken". Betätigen der linken Maustaste löst einen Welleneffekt aus.</p>
            </div>
            
            <div class="demo-container" id="canvas-container">
                <canvas id="canvas"></canvas>
                <button id="demo-startbutton">Start</button>
            </div>
            
            <div class="demo-description">
                <h1>Follow The Cursor [A] - Javascript Demo</h1>
                <p>Eine simple Demo, die meine Fähigkeit zur Entwicklung von Algorithmen und meine Kenntnisse in Javascript demonstrieren soll.</p>
                <p>Start drücken und die kleinen Fähnchen mit dem Cursor "lenken". Betätigen der linken Maustaste löst einen Welleneffekt aus.</p>
            </div>
        </div>
        
        <script src="js/demo_cursor.js" type="text/javascript"></script>
    </body>
</html>