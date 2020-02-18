let AIO_ThemeManager = {
	generate_table: (callback) => {
		$('#thememanager_dynamic_content').html(`
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#aio_thememanager_table" aria-expanded="false" aria-controls="aio_thememanager_table">View all themes 🔍</button>
  <div class="collapse" id="aio_thememanager_table">
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
	load_table_data: () => {
		$.get('https://api.github.com/repos/bludit/themes-repository/contents/items', (data) => {
			for (var i = 0; i < data.length; i++) {
				$.get(
					'https://raw.githubusercontent.com/bludit/themes-repository/master/items/' +
						data[i].name +
						'/metadata.json',
					(pluginInformation) => {
						var pluginInformation = JSON.parse(pluginInformation);
						var theme_name = pluginInformation.name;
						var theme_version = pluginInformation.version;
						var theme_version = pluginInformation.version;
						var theme_download = pluginInformation.download_url;
						if (pluginInformation.download_url_v2 != '' && pluginInformation.download_url_v2 != undefined) {
							theme_download = pluginInformation.download_url_v2;
						}
						var theme_information_url = pluginInformation.information_url;
						var theme_description = pluginInformation.description;
						var theme_author_username = pluginInformation.author_username;

						var new_table_row = `<tr>
						<td class="align-middle pt-3 pb-3"><div data-id="name">${theme_name}</div><div class="mt-1"><button onclick="themeInstallerDialog(theme_name)" name="install" class="btn btn-primary my-2" type="submit" value="${theme_download}">Install 🚀</button></div></td>
						<td class="align-middle d-none d-sm-table-cell"><div data-id="description">${theme_description}</div><a href="${theme_information_url}" target="_blank">more information</a></td>
						<td class="text-center align-middle d-none d-lg-table-cell"><span>${theme_version}</span></td>
						<td class="text-center align-middle d-none d-lg-table-cell"><a data-id="author" target="_blank">${theme_author_username}</a></td>
						</tr>`;

						$('#theme-download-extension-table-body').append(new_table_row);
					}
				);
			}
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
	}
};
$(() => {
	AIO_ThemeManager.generate_table(() => {
		AIO_ThemeManager.load_table_data();
		AIO_ThemeManager.table_filter.init();
	});
});
