<?php
function download($url, $filename)
{
    $content = file_get_contents($url);
    $file = fopen($filename, 'w+');
    fwrite($file, $content);
    fclose($file);
}
function unzip($filename, $extract_location)
{
    $zip = new ZipArchive;
    $res = $zip->open($filename);
    if ($res === true) {
        $zip->extractTo($extract_location);
        $zip->close();
    } else {
        echo 'Error: Unzip failed';
    }
}
function rmrf($dir)
{
    foreach (glob($dir) as $file) {
        if (is_dir($file)) {
            rmrf("$file/*");
            rmdir($file);
        } else {
            unlink($file);
        }
    }
}
if (isset($_POST['action_start'])) {
    $process_id = time() . rand(0, 999);
    echo $process_id;
}
if (isset($_POST['action_download'])) {
    download($_POST['url'], 'plugin_' . $_POST['process_id'] . '.zip');
    echo "download_complete";
}
if (isset($_POST['action_install'])) {
    unzip('plugin_' . $_POST['process_id'] . '.zip', '../../bl-plugins/');
    echo "install_complete";
}
if (isset($_POST['action_clean'])) {
    rmrf('plugin_' . $_POST['process_id'] . '.zip');
    echo "clean_complete";
}
