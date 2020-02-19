<?php
$themes = scandir('../../bl-themes/');
$themes = array_slice($themes, 2);
echo json_encode($themes);
