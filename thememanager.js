let AIO_ThemeManager = {
	generate_table: (callback) => {
		$('#thememanager_dynamic_content').html(`
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#aio_manager_theme_table" aria-expanded="false" aria-controls="aio_manager_theme_table">View all themes 🔍</button>
  <div class="collapse" id="aio_manager_theme_table">
  <div class="card card-body">
  <input type="text" id="theme-light-table-filter" data-table="order-table" placeholder="Search by name, description or author">
  <table id="theme-download-extension-table" class="table mt-3 order-table">
  <thead>
  <tr>
  <th class="border-bottom-0 w-25" scope="col">Name</th>
  <th class="border-bottom-0 d-none d-sm-table-cell" scope="col">description</th>
  <th class="text-center border-bottom-0 d-none d-lg-table-cell" scope="col">version</th>
  <th class="text-center border-bottom-0 d-none d-lg-table-cell" scope="col">author</th>
  </tr>
  </thead>
  <tbody id="theme-download-extension-table-body"></tbody>
  </table>
  </div>
</div>
`);
		callback(true);
	},
	get_installed_themes: (cb) => {
		$.post(aioManager_htmlPath + 'get-installed-themes.php').done(function(data) {
			data = JSON.parse(data);
			cb(data);
		});
	},
	load_table_data: () => {
		// TODO: implement updates/versions
		AIO_ThemeManager.get_installed_themes((installed_themes) => {
			console.log('installed_themes');
			console.log(installed_themes);
			$.get('https://api.github.com/repos/bludit/themes-repository/contents/items', (data) => {
				for (var i = 0; i < data.length; i++) {
					let current_installname = data[i].name;
					$.get(
						'https://raw.githubusercontent.com/bludit/themes-repository/master/items/' +
							current_installname +
							'/metadata.json',
						(theme_info) => {
							theme_info = JSON.parse(theme_info);
							var theme_name = theme_info.name;
							var theme_version = theme_info.version;
							var theme_download = theme_info.download_url;
							if (theme_info.download_url_v2 != '' && theme_info.download_url_v2 != undefined) {
								theme_download = theme_info.download_url_v2;
							}
							var theme_information_url = theme_info.information_url;
							var theme_description = theme_info.description;
							var theme_author_username = theme_info.author_username;

							let install_btn = `<span data-action="install-theme" data-download="${theme_download}" data-theme-name="${current_installname}" class="btn btn-primary my-2">Install 🚀</span>`;
							installed_themes.forEach((installed_theme) => {
								if (
									installed_theme.name == current_installname ||
									installed_theme.parsed_name == current_installname
								) {
									install_btn = `<span class="btn btn-success my-2">UpToDate: ${installed_theme.version} ✔</span>`;
									if (installed_theme.version < theme_version) {
										console.log('local is older');
										install_btn = `<span data-action="update-theme" data-current-version="${installed_theme.version}" data-remote-version="${theme_version}" class="btn btn-danger my-2">Installed Version: ${installed_theme.version}<hr>Remote Version: ${theme_version}<br>Update now! ⬆</span>`;
									}
								}
							});

							var new_table_row = `<tr>
						<td class="align-middle pt-3 pb-3"><div data-id="name">${theme_name}</div><div class="mt-1">${install_btn}</div></td>
						<td class="align-middle d-none d-sm-table-cell"><div data-id="description">${theme_description}</div><a href="${theme_information_url}" target="_blank">more information</a></td>
						<td class="text-center align-middle d-none d-lg-table-cell"><span>${theme_version}</span></td>
						<td class="text-center align-middle d-none d-lg-table-cell"><a data-id="author" target="_blank">${theme_author_username}</a></td>
						</tr>`;

							$('#theme-download-extension-table-body').append(new_table_row);
						}
					);
				}
			});
		});
	},
	table_filter: {
		tableElement: undefined,
		init: () => {
			$('#theme-light-table-filter').keyup((e) => {
				AIO_ThemeManager.table_filter.filter($('#theme-light-table-filter').val());
			});
			AIO_ThemeManager.table_filter.tableElement = $('#theme-download-extension-table-body');
		},
		filter: (filter = '') => {
			filter = filter.toLowerCase();
			$('#theme-download-extension-table-body tr').each((index, row) => {
				var $row = $(row);
				$row.attr('data-rowid', index);
				let name = $('[data-rowid="' + index + '"] [data-id="name"]').html().toLowerCase();
				let description = $('[data-rowid="' + index + '"] [data-id="description"]').html().toLowerCase();
				let author = $('[data-rowid="' + index + '"] [data-id="author"]').html().toLowerCase();
				if (name.includes(filter) || description.includes(filter) || author.includes(filter)) {
					$row.fadeIn();
				} else {
					$row.fadeOut();
				}
			});
		}
	},
	table_actions: {
		set_install_listener: () => {
			$('[data-action="install-theme"]').click((e) => {
				e.preventDefault();
				$(e.currentTarget).unbind('click');
				$(e.currentTarget).removeClass('btn-primary');
				$(e.currentTarget).addClass('btn-warning');
				$(e.currentTarget).html('Starting...👨‍💻');
				let download_url = $(e.currentTarget).attr('data-download');
				let current_theme_name = $(e.currentTarget).attr('data-theme-name');
				let current_process_id = undefined;
				$.post(aioManager_htmlPath + 'download-theme.php', {
					action_start: ''
				}).done((data) => {
					console.log(data);
					current_process_id = data;
					$(e.currentTarget).html('Downloading...👨‍💻');
					$.post(aioManager_htmlPath + 'download-theme.php', {
						action_download: '',
						url: download_url,
						process_id: current_process_id
					}).done((data) => {
						console.log(data);
						$(e.currentTarget).html('Installing...👨‍💻');
						$.post(aioManager_htmlPath + 'download-theme.php', {
							action_install: '',
							process_id: current_process_id
						}).done((data) => {
							console.log(data);
							$(e.currentTarget).html('Cleaning...🧹');
							$.post(aioManager_htmlPath + 'download-theme.php', {
								action_clean: '',
								process_id: current_process_id
							}).done((data) => {
								console.log(data);
								$(e.currentTarget).html('Installed ✔');
								$(e.currentTarget).removeClass('btn-warning');
								$(e.currentTarget).addClass('btn-success');
							});
						});
					});
				});
			});
		}
	}
};
$(() => {
	AIO_ThemeManager.generate_table(() => {
		AIO_ThemeManager.load_table_data();
		AIO_ThemeManager.table_filter.init();
	});
	$('[data-target="#aio_manager_theme_table"]').click((e) => {
		$('[data-target="#aio_manager_theme_table"]').unbind('click');
		AIO_ThemeManager.table_actions.set_install_listener();
	});
});
