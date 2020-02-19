<?php
// TODO: fix stuff like "mediumish-1.2"
$themeDirectories = scandir('../../bl-themes/');
$themeDirectories = array_slice($themeDirectories, 2);
$return = array();
foreach ($themeDirectories as $themeDir) {
    $metadata = json_decode(file_get_contents("../../bl-themes/{$themeDir}/metadata.json"));
    // $parsed_name = $themeDir;
    // $parsed_name = str_replace("-{$metadata->version}", '', $parsed_name);
    $parsed_name = preg_replace('/-\d.(?:.+)/', '', $themeDir);
    $parsed_name = preg_replace('/-master/', '', $parsed_name);
    array_push($return, array("name" => $themeDir, "parsed_name" => $parsed_name, "version" => $metadata->version));
}
echo json_encode($return);
