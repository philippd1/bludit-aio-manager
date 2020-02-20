<?php
// TODO: make the uninstallers ajax based
class AIO_Manager extends Plugin
{
	public function init()
	{
		$this->formButtons = false;
		// Check for zip extension installed
		$this->zip = extension_loaded('zip');
	}
	public function post()
	{
		if (isset($_POST['uninstall_theme'])) {
			Filesystem::deleteRecursive(PATH_THEMES . $_POST['uninstall_theme']);
		}
		if (isset($_POST['uninstall_plugin'])) {
			Filesystem::deleteRecursive(PATH_PLUGINS . $_POST['uninstall_plugin']);
		}
	}
	function uninstall_theme_ui()
	{
		$html  = '<table class="table"><thead><tr><th class="border-bottom-0" scope="col">Name</th><th class="border-bottom-0" scope="col">Action</th></tr></thead><tbody>';
		$installedThemes = glob(PATH_THEMES . '/*', GLOB_ONLYDIR);
		foreach ($installedThemes as $theme) {
			$theme = str_replace(PATH_THEMES . '/', '', $theme);
			$currentTheme = str_replace(PATH_THEMES, '', THEME_DIR);
			if ($theme . "\\" != $currentTheme) { //don't allow to uninstall current theme
				$html .= '<tr><td>' . $theme . '</td><td><button name="uninstall_theme" class="btn btn-danger my-2" type="submit" value="' . $theme . '">Uninstall</button></td></tr>';
			}
		}
		$html .= '</tbody></table>';
		return $html;
	}
	function uninstall_plugin_ui()
	{
		$html  = '<table class="table"><thead><tr><th class="border-bottom-0" scope="col">Name</th><th class="border-bottom-0" scope="col">Action</th></tr></thead><tbody>';
		$installedPlugins = glob(PATH_PLUGINS . '/*', GLOB_ONLYDIR);
		foreach ($installedPlugins as $plugin) {
			$plugin = str_replace(PATH_PLUGINS . '/', '', $plugin);
			// TODO: don't allow to uninstall AIO_Manager
			$html .= '<tr><td>' . $plugin . '</td><td><button name="uninstall_plugin" class="btn btn-danger my-2" type="submit" value="' . $plugin . '">Uninstall</button></td></tr>';
		}
		$html .= '</tbody></table>';
		return $html;
	}

	public function form()
	{
		return '
		<div class="alert alert-primary">Welcome to Bludit AIO_Manager by <a href="">philippd1</a>!<br>This plugin manages everything package-related</div>
		<h4>Bludit Updater</h4>
		<div id="autoupdater_dynamic_content">loading...</div>
		<h4>Theme Manager</h4>
		<div id="thememanager_dynamic_content">loading...</div>
		<h4>Theme Uninstaller</h4>
		<div id="thememanager_uninstall_dynamic_content">
		<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#aio_manager_theme_uninstall_table" aria-expanded="false" aria-controls="aio_manager_theme_uninstall_table">Uninstall Themes 🧹</button>
		<div class="collapse" id="aio_manager_theme_uninstall_table"><div class="card card-body">' . $this->uninstall_theme_ui() . '</div></div>
		</div>
		<h4>Plugin Manager</h4>
		<div id="pluginmanager_dynamic_content">loading...</div>
		<h4>Plugin Uninstaller</h4>
		<div id="pluginmanager_uninstall_dynamic_content">
		<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#aio_manager_plugin_uninstall_table" aria-expanded="false" aria-controls="aio_manager_plugin_uninstall_table">Uninstall Plugins 🧹</button>
		<div class="collapse" id="aio_manager_plugin_uninstall_table"><div class="card card-body">' . $this->uninstall_plugin_ui() . '</div></div>
		</div>
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
