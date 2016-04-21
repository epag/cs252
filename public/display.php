<?php

$con=mysql_connect("75.126.155.153","user17809","PWHK2WEyIvEo");  

mysql_select_db("SQLDB",$con);

$result=mysql_query("SELECT dictionary FROM USER17809.words ORDER BY RAND() LIMIT 1",$con);

$data = mysql_fetch_row($result)
echo "<h1>$data</h1>";

?>