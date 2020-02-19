<?php
$pluginDirectories = scandir('../../bl-plugins/');
$pluginDirectories = array_slice($pluginDirectories, 2);
$return = array();
foreach ($pluginDirectories as $pluginDir) {
    $metadata = json_decode(file_get_contents("../../bl-plugins/{$pluginDir}/metadata.json"));
    array_push($return, array("name" => $pluginDir, "version" => $metadata->version));
}
echo json_encode($return);
// TODO: add '-master' at the end for GitHub compatibility
