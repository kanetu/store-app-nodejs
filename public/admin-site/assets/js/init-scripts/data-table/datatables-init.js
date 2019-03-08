(function ($) {
    //    "use strict";


    /*  Data Table
    -------------*/

    $('#bootstrap-data-table').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    });
    // Code nguyen mau
    $('#bootstrap-data-table-export').DataTable({
        dom: 'lBftip',
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print']

    });
    // var table = $('#bootstrap-data-table-export').DataTable({
    //     dom: 'lBftip',
    //     lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
    //     buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    //
    // });
    // table.on('order.dt search.dt', function () {
    //             table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
    //                 cell.innerHTML = i + 1;
    //             });
    //         }).draw();

	$('#row-select').DataTable( {
        initComplete: function () {
				this.api().columns().every( function () {
					var column = this;
					var select = $('<select class="form-control"><option value=""></option></select>')
						.appendTo( $(column.footer()).empty() )
						.on( 'change', function () {
							var val = $.fn.dataTable.util.escapeRegex(
								$(this).val()
							);

							column
								.search( val ? '^'+val+'$' : '', true, false )
								.draw();
						} );

					column.data().unique().sort().each( function ( d, j ) {
						select.append( '<option value="'+d+'">'+d+'</option>' )
					} );
				} );
			}
		} );

})(jQuery);
