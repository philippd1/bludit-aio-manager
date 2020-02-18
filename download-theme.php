<?php
$AUTOUPDATE_statusfile = dirname(__FILE__) . '/status.json';
function clean_status()
{
    global $AUTOUPDATE_statusfile;
    unlink($AUTOUPDATE_statusfile);
}
function update_status($content)
{
    global $AUTOUPDATE_statusfile;
    $myfile = fopen($AUTOUPDATE_statusfile, "a") or die("Unable to open file!");
    fwrite($myfile, $content . "\n");
    fclose($myfile);
}
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
    download($_POST['url'], 'theme_' . $_POST['process_id'] . '.zip');
    echo "download_complete";
}
if (isset($_POST['action_unpack'])) {
    unzip('theme_' . $_POST['process_id'] . '.zip', dirname(__FILE__) . "/theme_{$_POST['process_id']}_temp/");
    echo "unpack_complete";
}
if (isset($_POST['action_repack'])) {
    // TODO: repack so themename isnt existant anymore
    $source_path = dirname(__FILE__) . "/theme_{$_POST['process_id']}_temp/{$_POST['current_theme_name']}/";
    $zip = new ZipArchive();
    $zip->open(dirname(__FILE__) . "/theme_{$_POST['process_id']}-repacked.zip", ZipArchive::CREATE | ZipArchive::OVERWRITE);
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source_path),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($files as $name => $file) {
        if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($source_path) + 1);
            $zip->addFile($filePath, $relativePath);
        }
    }
    $zip->close();

    echo $source_path;
    echo "./theme_{$_POST['process_id']}-repacked.zip";

    echo "repack_complete";
}
if (isset($_POST['action_install'])) {
    // unzip('./bl-kernel-temp.zip', '../../bl-kernel/');
    // unlink('./bl-kernel-temp.zip');
    echo $_POST['process_id'];
    echo $_POST['current_theme_name'];
    echo "install_complete";
}
if (isset($_POST['action_clean'])) {
    // rmrf(dirname(__FILE__) . "/theme_{$_POST['process_id']}_temp/");
    // rmrf('theme_' . $_POST['process_id'] . '.zip');
    echo "clean_complete";
}
