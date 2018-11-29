import { dataTableId, dataRelatedTable, dataEnableRowClick, dataRowClickUrl, rowClickedPopupPrefix, dataEnableCellClick, dataCellClickUrl, cellClickedPopupPrefix, dataPopulateHeaders } from '../components/common';
import { getGridOptionsIdentifier, pagination, paginationAutoPageSize, paginationPageSize } from '../components/@common/table';
import { gridOptions } from '../common';

export function template(node) {
    const id = node.attr('id') || (node.attr('id', `table${node.attr(dataTableId)}`), node.attr('id'));
    const key = node.attr(dataTableId);
    const populateHeaders = node.attr(dataPopulateHeaders) === 'true';
    const gridOptionsIdentifier = document.getElementById('iframeId').contentWindow[getGridOptionsIdentifier(node)];
    const columnDefs = populateHeaders ? '[]' : JSON.stringify(gridOptionsIdentifier.columnDefs);
    return `
    var eGridDiv${key} = $('#${id}');
    var ${gridOptions}${key} = {
        columnDefs: ${columnDefs},
        enableSorting: true,
        enableFilter: false,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        suppressFieldDotNotation: true,
        ${pagination}: ${gridOptionsIdentifier[pagination]},
        ${paginationAutoPageSize}: ${gridOptionsIdentifier[paginationAutoPageSize]},
        ${paginationPageSize}: ${gridOptionsIdentifier[paginationPageSize]},
        onCellClicked: function (event) {
            if (eGridDiv${key}.attr('${dataEnableCellClick}') == 'true') {
                if (typeof popupCommon !== 'undefined' && typeof popupCommon == 'function') {
                    var popup = $('#' + '${cellClickedPopupPrefix}' + '${key}');
                    popupCommon(event, popup, eGridDiv${key});
                }
            }
        },
        onRowClicked: function (event) {
            if (eGridDiv${key}.attr('${dataEnableRowClick}') == 'true') {
                popupDetail(eGridDiv${key}.attr('${dataRowClickUrl}'), event.data, $('#' + '${rowClickedPopupPrefix}' + '${key}'));
            }
        },
        onRowSelected: function (event) {
            if (event.node.isSelected() && eGridDiv${key}.attr('${dataRelatedTable}')) {
                if (window['gridOptions' + eGridDiv${key}.attr('${dataRelatedTable}')]) {
                    window['gridOptions' + eGridDiv${key}.attr('${dataRelatedTable}')]
                        .api.setRowData([event.data]);
                }
            }
        }
      };
    new agGrid.Grid(eGridDiv${key}.get(0), ${gridOptions}${key});
    ${gridOptions}${key}.api.setRowData([]);
    `;
}

export const tableScriptType = 'table-script';