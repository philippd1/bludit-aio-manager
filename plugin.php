<?php
class AIO_Manager extends Plugin
{
	public function init()
	{
		$this->formButtons = false;
		// Check for zip extension installed
		$this->zip = extension_loaded('zip');
	}
	public function form()
	{
		return '
		<div class="alert alert-primary">
			Welcome to Bludit AIO_Manager by <a href="">philippd1</a>!<br>
			This plugin manages everything package-related
		</div>
		<h4>Bludit Updater</h4>
		<div id="autoupdater_dynamic_content">loading...</div>
		<h4>Theme Manager</h4>
		<div id="thememanager_dynamic_content">loading...</div>
		<h4>Plugin Manager</h4>
		<div id="pluginmanager_dynamic_content">loading...</div>
		';
	}
	public function adminSidebar()
	{
		global $L;
		$html = '';
		$html .= '<a href="' . HTML_PATH_ADMIN_ROOT . 'configure-plugin/AIO_Manager">AIO_Manager</a><hr>';
		$html .= '<p id="AUTOUPDATER-current-version">Version <span class="badge badge-warning">' . BLUDIT_VERSION . '</span></p>';
		$html .= '<a id="AUTOUPDATER-new-version" style="display: none;" href="' . HTML_PATH_ADMIN_ROOT . 'configure-plugin/autoUpdater">' . $L->get('New version available<br><button class="btn btn-outline-primary">Update now! 🚀</button>') . '</a>';
		$html .= '<p id="AUTOUPDATER-newest-version" style="display: none;">' . $L->get('This is the newest version 🔥') . '</p>';
		return $html;
	}
	public function adminBodyEnd()
	{
		$scripts = "";
		$scripts .= '<script>let aioManager_htmlPath="' . $this->htmlPath() . '";</script>';
		$scripts .= '<script>let aioManager_domainPath="' . $this->domainPath() . '";</script>';
		$scripts .= '<script>let aioManager_phpPath="' . $this->phpPath() . '";</script>';
		$scripts .= '<script>' . file_get_contents($this->phpPath() . DS . 'autoupdater.js') . '</script>';
		$scripts .= '<script>' . file_get_contents($this->phpPath() . DS . 'thememanager.js') . '</script>';
		$scripts .= '<script>' . file_get_contents($this->phpPath() . DS . 'pluginmanager.js') . '</script>';


		return $scripts;
	}
}
