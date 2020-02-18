let AIO_PluginManager = {
	generate_table: (callback) => {
		$('#pluginmanager_dynamic_content').html(`
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#aio_pluginmanager_table" aria-expanded="false" aria-controls="aio_pluginmanager_table">View all plugins 🔍</button>
  <div class="collapse" id="aio_pluginmanager_table">
  <div class="card card-body">
  <input type="text" id="plugin-light-table-filter" data-table="order-table" placeholder="Search by name, description or author">
  <table id="plugin-download-extension-table" class="table mt-3 order-table">
  <thead>
  <tr>
  <th class="border-bottom-0 w-25" scope="col">Name</th>
  <th class="border-bottom-0 d-none d-sm-table-cell" scope="col">description</th>
  <th class="text-center border-bottom-0 d-none d-lg-table-cell" scope="col">version</th>
  <th class="text-center border-bottom-0 d-none d-lg-table-cell" scope="col">author</th>
  </tr>
  </thead>
  <tbody id="plugin-download-extension-table-body"></tbody>
  </table>
  </div>
</div>
`);
		callback(true);
	},
	load_table_data: () => {
		$.get('https://api.github.com/repos/bludit/plugins-repository/contents/items', function(data) {
			for (let i = 0; i < data.length; i++) {
				$.get(
					'https://raw.githubusercontent.com/bludit/plugins-repository/master/items/' +
						data[i].name +
						'/metadata.json',
					function(data) {
						data = JSON.parse(data);
						let plugin_name = data.name;
						let plugin_version = data.version;
						let plugin_download_url_v2 = data.download_url_v2;
						let plugin_information_url = data.information_url;
						let plugin_description = data.description;
						let plugin_author_username = data.author_username;

						let new_table_row = `<tr>
                        <td class="align-middle pt-3 pb-3"><div data-id="name">${plugin_name}</div><div class="mt-1"><button name="install" class="btn btn-primary my-2" type="submit" value="${plugin_download_url_v2}">Install</button></div></td>
                        <td class="align-middle d-none d-sm-table-cell"><div data-id="description">${plugin_description}</div><a href="${plugin_information_url}" target="_blank">More information</a></td>
                        <td class="text-center align-middle d-none d-lg-table-cell"><span>${plugin_version}</span></td>
                        <td class="text-center align-middle d-none d-lg-table-cell"><a data-id="author" target="_blank">${plugin_author_username}</a></td>
                        </tr>`;

						$('#plugin-download-extension-table-body').append(new_table_row);
					}
				);
			}
		});
	},
	table_filter: {
		tableElement: undefined,
		init: () => {
			$('#plugin-light-table-filter').keyup((e) => {
				AIO_PluginManager.table_filter.filter($('#plugin-light-table-filter').val());
			});
			AIO_PluginManager.table_filter.tableElement = $('#plugin-download-extension-table-body');
		},
		filter: (filter = '') => {
			filter = filter.toLowerCase();
			$('#plugin-download-extension-table-body tr').each((index, row) => {
				let $row = $(row);
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
	AIO_PluginManager.generate_table(() => {
		AIO_PluginManager.load_table_data();
		AIO_PluginManager.table_filter.init();
	});
});
