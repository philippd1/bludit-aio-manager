let AIO_AutoUpdater = {
	previous_status: undefined,
	current_progress: undefined,
	current_version: {},
	releases: undefined,
	release_count: undefined,
	get_releases: (callback) => {
		$.get('https://api.github.com/repos/bludit/bludit/releases', (data) => {
			callback(data);
		});
	},
	set_sidebar: () => {
		$.get('https://version.bludit.com', (json) => {
			if (json.stable.build > BLUDIT_BUILD) {
				$('#AUTOUPDATER-new-version').show();
			}
			if (json.stable.build == BLUDIT_BUILD) {
				$('#AUTOUPDATER-newest-version').show();
			}
		});
	},
	update_done: () => {
		AIO_AutoUpdater.current_progress = 7;
		$('#autoupdate_start_update').html('Update done 😎');
		$('#autoupdate_start_update').removeClass('btn-warning');
		$('#autoupdate_start_update').addClass('btn-success');
		setTimeout(() => {
			$('#autoupdater_dynamic_content').fadeOut();
			$('#autoupdater_dynamic_content').html(`
			<div class="alert alert-info">
			installed version: <code>${AIO_AutoUpdater.releases[0].name}</code>
			</div>
			<div class="alert alert-info">
			This is the newest version available on GitHub.
			</div>
			`);
			setTimeout(() => {
				$('#autoupdater_dynamic_content').fadeIn();
			}, 1000);
		}, 2500);
	}
};
AIO_AutoUpdater.set_sidebar();
AIO_AutoUpdater.get_releases((releases) => {
	AIO_AutoUpdater.releases = releases;
	AIO_AutoUpdater.release_count = releases.length;
	counter = 0;
	releases.forEach((release) => {
		if (BLUDIT_VERSION == release.tag_name) {
			AIO_AutoUpdater.current_version.tag_name = release.tag_name;
			AIO_AutoUpdater.current_version.name = release.name;
			AIO_AutoUpdater.current_version.zipball_url = release.zipball_url;
			AIO_AutoUpdater.current_version.tarball_url = release.tarball_url;
			AIO_AutoUpdater.current_version.published_at = release.published_at;
		} else {
			counter++;
		}
	});
	if (counter < AIO_AutoUpdater.release_count) {
		$('#autoupdater_dynamic_content').html(`
        <div class="alert alert-info">
		installed version: <code>${BLUDIT_VERSION} (BUILD ${BLUDIT_BUILD}) (name: "${AIO_AutoUpdater.current_version
			.name}")</code>
        </div>
        <div class="alert alert-info">
        UPDATE AVAILABLE: <code>${AIO_AutoUpdater.releases[0].tag_name}</code> (<code>${AIO_AutoUpdater.releases[0]
			.name}</code>)
        <br>
        published at: <code>${AIO_AutoUpdater.releases[0].published_at}</code>
        <br>
        zipball: <code>${AIO_AutoUpdater.releases[0].zipball_url}</code>
        </div>
		<div id="AUTOUPDATER_Progress" class="progress" style="display:none;"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div></div>
        <br>
        <button type="button" id="autoupdate_start_update" class="btn btn-primary">Update now! 🚀</button>
		<div id="update_progress"></div>
        `);
		$('#autoupdate_start_update').click(() => {
			$('#AUTOUPDATER_Progress').css('display', 'block');
			$('#AUTOUPDATER_Progress .progress-bar').html('0%');
			$('#AUTOUPDATER_Progress .progress-bar').attr('aria-valuenow', '0');
			$('#AUTOUPDATER_Progress .progress-bar').css('width', '0%');
			$('#autoupdate_start_update').unbind('click');
			$('#autoupdate_start_update').html('Updating... 🔨');
			$('#autoupdate_start_update').removeClass('btn-primary');
			$('#autoupdate_start_update').addClass('btn-warning');
			let zip_path = `https://github.com/bludit/bludit/archive/${AIO_AutoUpdater.releases[0].tag_name}.zip`;
			AIO_AutoUpdater.current_progress = 1;
			$.post(aioManager_htmlPath + 'perform-update.php', {
				url: zip_path,
				tag: AIO_AutoUpdater.releases[0].tag_name,
				action_init: true
			}).done((data) => {
				console.log(data);
				if (data == 'init-done') {
					AIO_AutoUpdater.current_progress = 2;
					$.post(aioManager_htmlPath + 'perform-update.php', {
						url: zip_path,
						tag: AIO_AutoUpdater.releases[0].tag_name,
						action_download: true
					}).done((data) => {
						console.log(data);
						if (data == 'download-done') {
							AIO_AutoUpdater.current_progress = 3;
							$.post(aioManager_htmlPath + 'perform-update.php', {
								url: zip_path,
								tag: AIO_AutoUpdater.releases[0].tag_name,
								action_unzip: true
							}).done((data) => {
								console.log(data);
								if (data == 'unzip-done') {
									AIO_AutoUpdater.current_progress = 4;
									$.post(aioManager_htmlPath + 'perform-update.php', {
										url: zip_path,
										tag: AIO_AutoUpdater.releases[0].tag_name,
										name: AIO_AutoUpdater.releases[0].name,
										action_update_language: true,
										HTML_PATH_ROOT: HTML_PATH_ROOT
									}).done((data) => {
										console.log(data);
										if (data == 'action_update_language-done') {
											AIO_AutoUpdater.current_progress = 5;
											$.post(aioManager_htmlPath + 'perform-update.php', {
												url: zip_path,
												tag: AIO_AutoUpdater.releases[0].tag_name,
												action_update_kernel: true
											}).done((data) => {
												if (data == 'action_update_kernel-done') {
													AIO_AutoUpdater.current_progress = 6;
													$.post(aioManager_htmlPath + 'perform-update.php', {
														url: zip_path,
														tag: AIO_AutoUpdater.releases[0].tag_name,
														cleanup: true
													}).done((data) => {
														if (data == 'cleanup-done') {
															AIO_AutoUpdater.update_done();
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
			setInterval(() => {
				$.get(aioManager_htmlPath + 'get-status.php').done((data) => {
					if (AIO_AutoUpdater.previous_status != data) {
						$('#update_progress').html(data);
						AIO_AutoUpdater.previous_status = data;
					}
				});
			}, 50);
			setInterval(() => {
				let value = AIO_AutoUpdater.current_progress * 100 / 7;
				$('#AUTOUPDATER_Progress .progress-bar').html(value + '%');
				$('#AUTOUPDATER_Progress .progress-bar').attr('aria-valuenow', value + '');
				$('#AUTOUPDATER_Progress .progress-bar').css('width', value + '%');
				if (value == 100) {
					setTimeout(() => {
						$('#AUTOUPDATER_Progress').fadeOut();
					}, 1000);
				}
			}, 25);
		});
	} else {
		$.get('https://version.bludit.com', (json) => {
			if (json.stable.build == BLUDIT_BUILD) {
				$('#autoupdater_dynamic_content').html(`
				<div class="alert alert-info">
				Installed version: <code>${BLUDIT_VERSION} (BUILD ${BLUDIT_BUILD}) (name: "${json.stable.codeName}")</code>
				</div>
				<div class="alert alert-info">
				This is the newest version available on GitHub. 🎉
				</div>
				`);
			}
		});
	}
});
