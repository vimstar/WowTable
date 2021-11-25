<template>
    <div class="table">
        <div :id="wowTableId">
            <b-overlay :show="showWaitSpinner || showOverideWaitSpinner" :opacity=".50" >
                <div ref="alertStatusMessage" class="alert-display align-left" v-show="showAlertMessage">
                    <span class="alert-message" v-html="alertMessage"></span>
                </div>
                <div class="row row-padding" v-show="showToggleColumns || showAdvancedSearch">
                    <div class="col-xl-12 align-left">
                        <ToggleColumns class="spacing-right" v-show="showToggleColumns"
                                       :columnData="toggleColumnsColumnData"
                                       :excludeColumns="excludedToggleColumns" />
                        <b-button v-show="showAdvancedSearch" size="sm" variant="secondary" @click="toggleShowFilters">{{advancedFiltersButtonText}} <span v-show="isFilterSet"><i class="fas fa-filter"></i></span></b-button>
                    </div>
                </div>
                <div class="row" v-show="showAdvancedSearch && showAdvancedFilters">
                    <div class="col-xl-12">
                        <AdvancedFilters ref="advancedFilters"
                                         @new-search="setTableFilters"
                                         :columnData="advancedFilterColumnData" />
                    </div>
                </div>
                <div class="row row-adjustment" v-show="(showAddNew || !doSingleRowEditing) && !doNoEditing">
                    <div v-show="!doSingleRowEditing" class="col-xl-6 align-left" style="min-height: 52px;">
                        <b-button class = "spacing-right" variant="warning" v-show="isDataEdited" size="sm" @click="cancelUpdatedData">Cancel</b-button>
                        <b-button variant="success" v-show="isDataEdited" size="sm" @click="handleSaveDataClick">Save Changes</b-button>
                    </div>
                    <div class="col-xl-6 align-right" v-show="showAddNew">
                        <b-button variant="primary" v-show="showAddNew" size="sm" @click="addNewClicked">Add New</b-button>
                    </div>
                </div>
                <div class="row row-padding row-adjustment top-padding">
                    <div class="col-xl-12">
                        <div :id="tableId" :style="{'font-size': tableFontSize}"></div>
                    </div>
                </div>
                <div class="row row-padding row-adjustment">
                    <div class="col-xl-4 align-left top-padding" v-show="!hideRowCount">
                        <span style="white-space: pre;">{{rowCount}}  <i v-show="doRemotePagination" class="fas fa-globe" style="color: Dodgerblue;"></i></span>
                    </div>
                    <div class="col-xl-8 align-right top-padding">
                        <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleExcelUploadInput">
                        <b-button class = "spacing-right" variant="primary" v-show="showImportExcel" size="sm" @click="handleImportExcelClick">Import Excel</b-button>
                        <b-button variant="primary" v-show="showExportExcel" size="sm" @click="exportExcel()">Export Excel</b-button>
                    </div>
                </div>
            </b-overlay>
        </div>
    </div>
</template>

<script>
    const WowTableVersion = "1.3_2021-11-21";

    import Tabulator from "tabulator-tables";
    import axios from "axios";
    import xlsx from "xlsx";
    import AdvancedFilters from "./AdvancedFilters.vue";
    import ToggleColumns from "./ToggleColumns.vue";

    //const standardTheme = () => import("tabulator-tables/dist/css/tabulator.min.css");
    //const simpleTheme = () => import("tabulator-tables/dist/css/tabulator_simple.min.css");
    //const midnightTheme = () => import("tabulator-tables/dist/css/tabulator_midnight.min.css");
    //const modernTheme = () => import("tabulator-tables/dist/css/tabulator_modern.min.css");
    //const bootstrapTheme = () => import("tabulator-tables/dist/css/bootstrap/tabulator_bootstrap4.min.css");
    //const semanticTheme = () => import("tabulator-tables/dist/css/semantic-ui/tabulator_semantic-ui.min.css");
    //const bulmaTheme = () => import("tabulator-tables/dist/css/bulma/tabulator_bulma.min.css");
    //const materializeTheme = () => import("tabulator-tables/dist/css/materialize/tabulator_materialize.min.css");

    export default {
        name: "WowTable",
        props: {
            tableOptions: Object,
            dataValidation: Function
        },
        components: {
            AdvancedFilters,
            ToggleColumns
        },
        data() {
            return {
                table: null,
                tableId: this.createElementId(),
                wowTableId: this.createElementId(),
                columnData: this.tableOptions.columnData,
                columnDataApi: this.tableOptions.columnDataApi,
                rowData: this.tableOptions.rowData,
                rowDataApi: this.tableOptions.rowDataApi,
                rowKey: this.tableOptions.rowKey || "Id",
                groupRowBy: this.tableOptions.groupRowBy,
                groupHeaderTitle: this.tableOptions.groupHeaderTitle || [],
                groupStartOpenCount: this.tableOptions.groupStartOpenCount || 0,
                initialTableSort: this.tableOptions.initialTableSort,
                updateDataApi: this.tableOptions.updateDataApi,
                addDataApi: this.tableOptions.addDataApi,
                deleteDataApi: this.tableOptions.deleteDataApi,
                deleteValidationApi: this.tableOptions.deleteValidationApi,
                doDeleteValidation: this.tableOptions.doDeleteValidation,
                promptInfoColumn: this.tableOptions.promptInfoColumn,
                showAdvancedSearch: this.tableOptions.showAdvancedSearch,
                showAddNew: this.tableOptions.showAddNew,
                showDelete: this.tableOptions.showDelete,
                doAddNewInTable: this.tableOptions.doAddNewInTable,
                doSingleRowEditing: this.tableOptions.doSingleRowEditing,
                showEditOnLeft: this.tableOptions.showEditOnLeft || true,
                doNoEditing: this.tableOptions.doNoEditing,
                inTableEditing: this.tableOptions.inTableEditing,
                showImportExcel: this.tableOptions.showImportExcel,
                importExcelValidation: this.tableOptions.importExcelValidation || [],
                showExportExcel: this.tableOptions.showExportExcel,
                exportExcelFileName: this.tableOptions.exportExcelFileName || "data",
                showToggleColumns: this.tableOptions.showToggleColumns,
                excludedToggleColumns: this.tableOptions.excludedToggleColumns,
                disablePagination: this.tableOptions.disablePagination,
                paginationSize: this.tableOptions.paginationSize || 100,
                paginationSizeSelector: this.tableOptions.paginationSizeSelector || [50, 100, 250, 500, 1000],
                doRemotePagination: this.tableOptions.doRemotePagination,
                remotePaginationApi: this.tableOptions.remotePaginationApi,
                tableLayout: this.tableOptions.tableLayout || "fitData",
                tableTheme: this.tableOptions.tableTheme || "standard",
                tableFontSize: this.tableOptions.tableFontSize || "12px",
                wowTableClasses: this.tableOptions.wowTableClasses || [],
                hideRowCount: this.tableOptions.hideRowCount,
                toggleColumnsColumnData: [],
                advancedFilterColumnData: [],
                showAdvancedFilters: false,
                advancedFiltersButtonText: "Show Advanced Search",
                dataClone: [],
                editedData: [],
                isDataEdited: false,
                isEditing: false,
                isEditingNew: false,
                isFilterSet: false,
                showWaitSpinner: true,
                showOverideWaitSpinner: false,
                showAlertMessage: false,
                alertMessage: "",
                rowCount: "Rows:  0  -  0  of  0",
                isInitialLoad: true
            };
        },
        computed: {
            tableClasses() {
                if (this.tableOptions.tableClasses)
                    return this.tableOptions.tableClasses;
                var topRows = 0;
                if (this.tableOptions.showToggleColumns || this.tableOptions.showAdvancedSearch)
                    topRows += 1;
                if ((this.tableOptions.showAddNew || !this.tableOptions.doSingleRowEditing) && !this.tableOptions.doNoEditing)
                    topRows += 1;
                return [`sizing-toprow${topRows}`];
            },
        },
        async mounted() {
            //this.applyTableTheme();
            await this.setupTable();
        },
        methods: {
            //applyTableTheme() {
            //    switch (this.tableTheme) {
            //        case "standard":
            //            standardTheme();
            //            break;
            //        case "simple":
            //            simpleTheme();
            //            break;
            //        case "midnight":
            //            midnightTheme();
            //            break;
            //        case "modern":
            //            modernTheme();
            //            break;
            //        case "bootstrap":
            //            bootstrapTheme();
            //            break;
            //        case "semantic":
            //            semanticTheme();
            //            break;
            //        case "bulma":
            //            bulmaTheme();
            //            break;
            //        case "materialize":
            //            materializeTheme();
            //            break;
            //        default:
            //            // Dont apply any theme
            //    }
            //},
            async setupTable() {
                var that = this;
                var autoColumns = false;
                if (typeof this.columnData == "undefined" && this.columnDataApi == "undefined") {
                    autoColumns = true;
                }
                
                this.table = new Tabulator(`#${this.tableId}`, {
                    layout: this.tableLayout,
                    pagination: this.doRemotePagination ? "remote" : this.disablePagination ? false : "local",
                    paginationSize: this.paginationSize,
                    paginationSizeSelector: this.paginationSizeSelector,
                    ajaxURL: this.doRemotePagination ? this.remotePaginationApi : null,
                    ajaxSorting: this.doRemotePagination ? true : false,
                    ajaxFiltering: this.doRemotePagination ? true : false,
                    ajaxURLGenerator: this.doRemotePagination ? this.ajaxURLGenerator : null,
                    cellEdited: this.cellEdited,
                    dataLoaded: this.tableDataLoaded,
                    renderComplete: this.setPageCount,
                    autoColumns: autoColumns, //only do autoColumns if no column information is provided
                    groupBy: this.groupRowBy,
                    groupHeader: function (value, count, data, group) {
                        var index = that.groupRowBy.indexOf(group.getField());
                        return (that.groupHeaderTitle[index] || "") + "<span style='color:black; margin-left:10px;'>" + value + "</span>" +
                            "<span style='color:#1E90FF; margin-left:12px;'>(" + count + " "+ (count > 1 ? "items":"item") + ")</span>";
                    },
                    groupStartOpen: function (value, count, data, group) { return count >= that.groupStartOpenCount },
                    downloadConfig: { columnGroups: false, rowGroups: false }
                });

                document.getElementById(this.tableId).classList.add(...this.tableClasses);
                document.getElementById(this.wowTableId).classList.add(...this.wowTableClasses);
                await this.setTableColumns();
                await this.setTableData();
            },
            ajaxURLGenerator(url, config, params) {
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            async setTableColumns() {
                if (typeof this.columnData == "undefined" && typeof this.columnDataApi == "undefined" )
                    return;

                this.showWaitSpinner = true;
                if (typeof this.columnDataApi == "string") {
                    await axios
                        .get(this.columnDataApi)
                        .then(response => {
                            this.columnData = this.transformStringToFunction(response.data);
                        })
                        .catch(err => {
                            this.showWaitSpinner = false;
                            this.displayErrorMessage("Unable to retrieve column data.");
                            console.error("Error retrieving column data. " + err + " : " + JSON.stringify(err.response.data));
                        });
                }
                this.addEditColumns();
                this.table.setColumns(this.columnData); // set column data
                this.advancedFilterColumnData = (this.showAdvancedSearch) ? this.flattenColumnData() : [];
                this.toggleColumnsColumnData = this.table.getColumns();
                this.showWaitSpinner = false;
            },
            flattenColumnData(){
                // Removes 1st and 2nd level group columns to create list of selectable columns without being grouped.
                var flattenedColumns = [];
                for (var i = 0; i < this.columnData.length; i++) {
                    if (this.columnData[i]["columns"]) {
                        for (var j = 0; j < this.columnData[i]["columns"].length; j++) {
                            if (this.columnData[i]["columns"][j]["columns"]) {
                                for (var k = 0; k < this.columnData[i]["columns"][j]["columns"].length; k++) {
                                    flattenedColumns.push(this.columnData[i]["columns"][j]["columns"][k]);
                                }
                            } else {
                                flattenedColumns.push(this.columnData[i]["columns"][j]);
                            }
                        }
                    } else {
                        flattenedColumns.push(this.columnData[i]);
                    }
                }
                return flattenedColumns;
            },
            addEditColumns() {
                // Add editable attribute function to colums. This is to prevent table editing when adding a new row or doing single row editing.
                if (this.doAddNewInTable || this.doSingleRowEditing) {
                    for (var i = 0; i < this.columnData.length; i++) {
                        if (this.columnData[i]["columns"] != null) {
                            for (var x = 0; x < this.columnData[i]["columns"].length; x++) {
                                this.columnData[i]["columns"][x]["editable"] = this.isRowSelected;
                            }
                        } else {
                            this.columnData[i]["editable"] = this.isRowSelected;
                        }
                    }
                }
                var editRowButtons = [];
                if (this.doSingleRowEditing) {
                    var editColumn = [{ field: "EditButton", formatter: this.formatter_EditButton, cellClick: this.cellClick_EditButton, headerSort: false, headerFilter: false, align: "center", resizable: false, download: false, width: 70 }];
                    editRowButtons = editRowButtons.concat(editColumn);
                    //this.columnData = this.columnData.concat(editColumn);
                }
                if (this.doSingleRowEditing || this.doAddNewInTable) {
                    var saveCancelColumns = [{ field: "CancelButton", formatter: this.formatter_CancelButton, cellClick: this.cellClick_CancelButton, headerSort: false, headerFilter: false, align: "center", resizable: false, visible: false, download: false, width: 70 },
                        { field: "SaveButton", formatter: this.formatter_SaveButton, cellClick: this.cellClick_SaveButton, headerSort: false, headerFilter: false, align: "center", resizable: false, visible: false, download: false, width: 70 }];
                    editRowButtons = editRowButtons.concat(saveCancelColumns);
                    //this.columnData = this.columnData.concat(saveCancelColumns);
                }
                if (this.showDelete) {
                    var deleteColumn = [{ field: "DeleteButton", formatter: this.formatter_DeleteButton, cellClick: this.cellClick_DeleteButton, headerSort: false, headerFilter: false, align: "center", resizable: false, download: false, width: 70 }];
                    editRowButtons = editRowButtons.concat(deleteColumn);
                    //this.columnData = this.columnData.concat(deleteColumn);
                }
                
                if ((this.doSingleRowEditing || this.doAddNewInTable || this.showDelete) && !this.doNoEditing) {
                    if (this.showEditOnLeft)
                        this.columnData = editRowButtons.concat(this.columnData);
                    else
                        this.columnData = this.columnData.concat(editRowButtons)
                }
            },
            async setTableData(refreshData = false) {
                if(this.inTableEditing && !this.isInitialLoad)
                    return;
                
                if (this.doRemotePagination) {
                    this.loadData(null, refreshData);
                    return;
                }

                if ((typeof this.rowData == "undefined" && typeof this.rowDataApi == "undefined") || this.doRemotePagination)
                    return;

                this.showWaitSpinner = true;
                if (typeof this.rowDataApi == "string") {
                    await axios
                        .get(this.rowDataApi)
                        .then(response => {
                            this.rowData = response.data;
                        })
                        .catch(err => {
                            this.showWaitSpinner = false;
                            this.displayErrorMessage("Unable to retrieve table data.");
                            console.error("Error retrieving table data. " + err + " : " + JSON.stringify(err.response.data));
                        });
                }
                this.loadData(this.rowData, refreshData);
                if (this.initialTableSort)
                    this.table.setSort(this.initialTableSort);
                
                this.isInitialLoad = false;
            },
            loadData(data, refreshData = false) {
                if (refreshData)
                    this.doRemotePagination == true ?  this.table.replaceData() : this.table.replaceData(data);
                else
                    this.doRemotePagination == true ? this.table.setData() : this.table.setData(data);
            },
            transformStringToFunction(jsonInput) {
                var returnData = jsonInput.reduce((columns, col) => {
                    if (col.headerFilterEmptyCheck) {
                        col.headerFilterEmptyCheck = new Function(
                            'return ' + col.headerFilterEmptyCheck
                        )();
                    }
                    columns.push(col);
                    return columns;
                }, []);
                return returnData;
            },
            tableDataLoaded() {
                this.dataClone = this.table == null ? [] : this.table.getData();
                this.editedData = [];
                this.isDataEdited = false;
                this.setPageCount();
                this.$emit('data-updated');
                this.showWaitSpinner = false;
            },
            setPageCount() {
                if (this.table == null)
                {
                    this.rowCount = "Rows:  0  -  0  of  0";
                    return;
                }

                var initialRows = (this.table.getPage() - 1) * this.table.getPageSize();
                var showAprox = false;
                var currentRows;
                var total;

                if (this.doRemotePagination) {
                    currentRows = initialRows + this.table.getDataCount("active");
                    if (this.table.getPage() == this.table.getPageMax()) {
                        total = currentRows;
                    } else {
                        total = this.table.getPageMax() * this.table.getPageSize();
                        showAprox = true;
                    }
                } else {
                    total = this.table.getDataCount("active");
                    if (this.table.getPage() == this.table.getPageMax())
                        currentRows = total;
                    else
                        currentRows = this.table.getPage() * this.table.getPageSize();
                }

                this.rowCount = `Rows:  ${currentRows == 0 ? 0 : (initialRows + 1)}  -  ${currentRows}  of ${showAprox ? "aprox " : ""} ${total}`;
            },
            isRowSelected(cell) {
                if (this.doSingleRowEditing || (this.doAddNewInTable && this.isEditingNew))
                    return cell.getRow().isSelected();
                else
                    return true;
            },
            formatter_EditButton(cell, formatterParams, onRendered) {
                return "<button type='button' class='btn btn-sm btn-secondary'>Edit</button>";
            },
            formatter_CancelButton(cell, formatterParams, onRendered) {
                if (cell.getRow().isSelected())
                    return "<button type='button' class='btn btn-sm btn-warning'>Cancel</button>";
            },
            formatter_SaveButton(cell, formatterParams, onRendered) {
                if (cell.getRow().isSelected())
                    return "<button type='button' class='btn btn-sm btn-success'>Save</button>";
            },
            formatter_DeleteButton(cell, formatterParams, onRendered) {
                return "<button type='button' class='btn btn-sm btn-outline-danger'>Delete</button>";
            },
            cellClick_EditButton(e, cell) {
                var currentRow = cell.getRow();
                var currentTable = cell.getTable();
                var selectedRows = currentTable.getSelectedRows();
                if (selectedRows.length == 0) {
                    this.$emit("edit-row", currentRow.getData());
                    for (var i = 0; i < selectedRows.length; i++) {
                        selectedRows[i].deselect();
                        selectedRows[i].reformat();
                    }
                    currentTable.deselectRow();
                    currentRow.select();
                    currentRow.reformat();

                    var cells = currentRow.getCells();
                    for (i = 0; i < cells.length; i++) {
                        cells[i].setValue(cells[i].getValue());
                    }
                    currentTable.hideColumn("EditButton");
                    currentTable.hideColumn("DeleteButton");
                    currentTable.showColumn("CancelButton");
                    currentTable.showColumn("SaveButton");
                    this.table.redraw();
                    this.isEditing = true;
                }
            },
            cellClick_CancelButton(e, cell) {
                if (!cell.getRow().isSelected()) {
                    return;
                }
                var currentRow = cell.getRow()
                if (currentRow.isSelected()) {
                    var cells = currentRow.getCells()
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].restoreInitialValue();
                        //cells[i].restoreOldValue();
                    }

                    this.stopEditing(cell)

                    if (this.isEditingNew) {
                        currentRow.delete();
                        this.isEditingNew = false;
                    }
                }
            },
            async cellClick_SaveButton(e, cell) {
                if (!cell.getRow().isSelected()) {
                    return;
                }

                var rowData = cell.getRow().getData();
                if (this.isEditingNew) {
                    var newData = [];
                    newData.push(rowData);
                    var id = await this.saveNewData(newData);
                    if (Array.isArray(id))
                        cell.getRow().getCell(this.rowKey).setValue(id[0], true);
                    else if (id === true)
                        await this.setTableData();
                    else
                        return;
                    this.isEditingNew = false;
                    this.dataClone = this.table.getData();
                    this.$emit('data-updated');
                } else {
                    this.editedData = [];
                    this.editedData.push(rowData);
                    var result = await this.saveUpdatedData();
                    if (!result)
                        return;
                    this.displaySuccessMessage("Updated data has been saved.");
                }

                this.stopEditing(cell);
            },
            async cellClick_DeleteButton(e, cell) {
                var message = "Are you sure you want to delete the selected item";
                if (typeof this.promptInfoColumn == "string") {
                    var promptInfo = ` (${cell.getRow().getCell(this.promptInfoColumn).getColumn().getDefinition().title} = ${cell.getRow().getCell(this.promptInfoColumn).getValue()})`;
                    message += promptInfo;
                }
                message += "?";

                var response = false;
                await this.$bvModal.msgBoxConfirm(message, {
                    title: "Delete Item",
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    hideHeaderClose: true,
                    centered: true,
                    noCloseOnBackdrop: true,
                    headerBgVariant: "warning"
                }).then(value => {
                    response = value;
                }).catch(err => {
                    // An error occurred
                });

                if (response) {
                    var rowData = cell.getRow().getData();
                    var data = [];
                    data.push(rowData);
                    var success = await this.deleteData(data);
                    if (success) {
                        cell.getRow().delete();
                        this.displaySuccessMessage("Item has been deleted.");
                    }
                }
            },
            stopEditing(cell) {
                var currentRow = cell.getRow();
                var currentTable = cell.getTable();
                currentTable.deselectRow();
                currentTable.showColumn("EditButton");
                currentTable.showColumn("DeleteButton");
                currentTable.hideColumn("CancelButton");
                currentTable.hideColumn("SaveButton");
                currentRow.reformat();
                this.table.redraw();
                this.isEditing = false;
            },
            cellEdited(editedCell) {
                if (!this.isEditingNew && !this.doSingleRowEditing) {
                    //get cell data
                    const cellData = editedCell._cell.row.data;
                    //check if there already is an object with same id
                    const existingIndex = this.editedData.findIndex(
                        (user) => user[this.rowKey] == cellData[this.rowKey]
                    );
                    //if object exist, replace editedData with new data
                    if (existingIndex >= 0) {
                        this.editedData[existingIndex] = cellData;
                    } else {
                        //if object doesnt exist, add that object to editedData
                        this.editedData.push(cellData);
                    }
                    this.isDataEdited = true;
                }
            },
            async handleSaveDataClick() {
                if(await this.saveUpdatedData())
                    this.displaySuccessMessage("Updated data has been saved.");
                else
                    await this.setTableData();
            },
            async saveUpdatedData() {
                if (!await this.validateData(this.editedData))
                    return false;
                
                if (this.inTableEditing)
                    return true;
                    
                this.showWaitSpinner = true;
                var success = false;
                if (typeof this.updateDataApi == "string") {
                    await axios.post(this.updateDataApi, this.editedData, {
                            headers: {
                            "content-type": "application/json",
                            },
                        })
                        .then(response => {
                            this.dataClone = this.table.getData();
                            this.editedData = [];
                            this.isDataEdited = false;
                            success = true;
                            this.$emit('data-updated');
                        })
                        .catch(err => {
                            if (err.response.status === 555)
                                this.displayErrorDialog("Error Saving", err.response.data);
                            else
                                this.displayErrorMessage("An error occured trying to save data.");
                            console.error("Error saving data. " + err + " : " + JSON.stringify(err.response.data));
                        });
                } else {
                    this.displayErrorMessage("Cannot save updated data. No API is set.");
                    console.error("Error! Update data API is not set.");
                }
                this.showWaitSpinner = false;
                return success;
            },
            cancelUpdatedData() {
                this.$bvModal.msgBoxConfirm("Are you sure you want to cancel? All changes will be lost.", {
                    title: "Cancel Changes",
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    hideHeaderClose: true,
                    centered: true,
                    noCloseOnBackdrop: true,
                    headerBgVariant: "warning"
                }).then(value => {
                    if (value) {
                        this.showWaitSpinner = true;
                        this.loadData(this.dataClone, true);
                        this.editedData = [];
                        this.isDataEdited = false;
                        this.showWaitSpinner = false;
                    }
                }).catch(err => {
                    // An error occurred
                });
            },
            addNewClicked() {
                if (this.doAddNewInTable) {
                    if (this.isEditingNew || this.isEditing)
                        return;

                    this.isEditingNew = true;
                    this.table.addRow({}, true)
                        .then((row) => {
                            this.cellClick_EditButton(null, row.getCell('SaveButton'));
                        });
                } else {
                    this.$emit("add-new-item");
                }
            },
            async saveNewData(data, reloadTable = false) {
                if (!await this.validateData(data))
                    return false;

                // This is primarily used for demos
                if (this.inTableEditing) {
                    this.rowData.push(data);
                    this.displaySuccessMessage("New item has been saved.");
                    return true;
                }

                if (typeof this.addDataApi == "string") {
                    this.showWaitSpinner = true;
                    var success = false;
                    var result = await axios.post(this.addDataApi, data, {
                            headers: {
                            "content-type": "application/json",
                            },
                        })
                        .then(response => {
                            success = true;
                            return response.data;
                        })
                        .catch(err => {
                            if (err.response.status === 555)
                                this.displayErrorDialog("Error Saving New Item", err.response.data);
                            else
                                this.displayErrorMessage("Unable to save new item.");
                            console.error("Error saving new data. " + err + " : " + JSON.stringify(err.response.data));
                        });
                    this.showWaitSpinner = false;
                    if (success) {
                        if (reloadTable)
                            await this.setTableData();
                        this.displaySuccessMessage("New item has been saved.");
                        if (Array.isArray(result))
                            return result;
                        else
                            return true;
                    } else {
                        return false;
                    }
                } else {
                    this.displayErrorMessage("Cannot save new item. No API is set.");
                    console.error("Error! Add data API has not been set.");
                    return false;
                }
            },
            async validateData(data) {
                if (this.dataValidation == null)
                    return true;

                this.showWaitSpinner = true;
                var validated = await this.dataValidation(data);
                if (typeof validated == "string") {
                    await this.displayErrorDialog("Invalid Data", validated);
                    this.showWaitSpinner = false;
                    return false;
                } else {
                    this.showWaitSpinner = false;
                    return true;
                }
            },
            async deleteData(data, reloadTable = false) {
                if (this.inTableEditing)
                    return true;

                this.showWaitSpinner = true;
                var success = false;
                if (typeof this.deleteDataApi == "string") {
                    await axios.post(this.deleteDataApi, data, {
                            headers: {
                            "content-type": "application/json",
                            },
                        })
                        .then(response => {
                            success = true;
                        })
                        .catch(err => {
                            if (err.response.status === 555)
                                this.displayErrorDialog("Cannot Delete Item", err.response.data);
                            else
                                this.displayErrorMessage("Unable to delete selected item.");
                            console.error("Error deleting data. " + err + " : " + JSON.stringify(err.response.data));
                        });

                    if (success && reloadTable)
                        await this.setTableData();
                } else {
                    this.displayErrorMessage("Cannot delete data. No API is set.");
                    console.error("Error! Delete data API has not been set.");
                }
                this.showWaitSpinner = false;
                return success;
            },
            toggleShowFilters() {
                if (this.showAdvancedFilters) {
                    this.showAdvancedFilters = false;
                    this.advancedFiltersButtonText = "Show Advanced Search";
                } else {
                    this.showAdvancedFilters = true;
                    this.advancedFiltersButtonText = "Hide Advanced Search";
                }
            },
            exportExcel(fileName = null) {
                if (fileName == null)
                    fileName = this.exportExcelFileName;

                fileName += "_" + this.getDateTimeStamp() + ".xlsx";
                this.table.download("xlsx", fileName, { sheetName: "Data" });
            },
            handleImportExcelClick() {
                if (this.isDataEdited) {
                    this.$bvModal.msgBoxConfirm("You have unsaved changes. If you import an Excel file your changes will be lost. Do you wish to continue?", {
                        title: "Unsaved Changes",
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'danger',
                        okTitle: 'YES',
                        cancelTitle: 'NO',
                        hideHeaderClose: true,
                        centered: true,
                        noCloseOnBackdrop: true,
                        headerBgVariant: "warning"
                    }).then(value => {
                        if (value) {
                            this.$refs['excel-upload-input'].click();
                        }
                    }).catch(err => {
                        // An error occurred
                    });
                } else {
                    this.$refs['excel-upload-input'].click();
                }
            },
            handleExcelUploadInput(event) {
                if (event.target.files[0])
                    this.importExcel(event.target.files[0]);
                event.target.value = null;
            },
            importExcel(file) {
                try {
                    this.isDataEdited = false;
                    this.editedData = [];
                    var fileReader = new FileReader();
                    fileReader.onload = (event) => this.saveExcelData(event);
                    fileReader.readAsBinaryString(file);
                }
                catch (err) {
                    this.displayErrorMessage("An unknown error occured importing spreadsheet.");
                    console.error("Error importing spreadsheet. " + err);
                }
            },
            async saveExcelData(event) {
                try {
                    this.showWaitSpinner = true;
                    var data = event.target.result;
                    var workbook = xlsx.read(data, {
                        type: "binary"
                    });
                    var sheetRows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                    // Check if the spreadsheet contains the required columns
                    var valid = true;
                    var errorMsg = "";
                    if (sheetRows == null || sheetRows.length <= 0) {
                        errorMsg = "The selected Excel file is not valid and cannot be parsed. Please select a valid file and try again.";
                        valid = false;
                    } else if (Array.isArray(this.importExcelValidation)) {
                        for (var i = 0; i < this.importExcelValidation.length; i++) {
                            var row = sheetRows[0];
                            var hasProperty = {}.hasOwnProperty.call(row, this.importExcelValidation[i]);
                            if (!hasProperty) {
                                errorMsg = `The selected Excel file is missing required columns. Please ensure the following columns exist and try again: ${this.importExcelValidation.join(", ")}`
                                valid = false;
                                break;
                            }
                        }
                    }

                    if (!valid) {
                        this.displayErrorDialog("Invalid Excel File", errorMsg);
                    } else {
                        //this.editedData = JSON.parse(JSON.stringify(sheetRows));
                        this.editedData = sheetRows;
                        if (await this.saveUpdatedData()) {
                            await this.setTableData();
                            this.displaySuccessMessage("Spreadsheet has been imported.");
                        } else {
                            this.editedData = [];
                            await this.setTableData();
                        }
                    }
                }
                catch (err) {
                    this.displayErrorMessage("An unknown error occured importing spreadsheet.");
                    console.error("Error importing spreadsheet. " + err);
                }
                finally {
                    this.showWaitSpinner = false;
                }
            },
            getDateTimeStamp() {
                var date = new Date();
                var timeStamp = date.getFullYear() + this.padNumber((date.getMonth() + 1), 2) + this.padNumber(date.getDate(), 2) + 
                    this.padNumber(date.getHours(), 2) + this.padNumber(date.getMinutes(), 2) + this.padNumber(date.getSeconds(), 2)
                return timeStamp;
            },
            padNumber (num, size) {
                var padded = "0000000000" + num;
                return padded.substr(padded.length - size);
            },
            setTableFilters(filters) {
                if (filters == null || filters.length <= 0)
                    this.isFilterSet = false;
                else
                    this.isFilterSet = true;

                this.table.setFilter(filters);
            },
            displaySuccessMessage(message) {
                this.$refs.alertStatusMessage.classList.remove('alert-danger');
                this.$refs.alertStatusMessage.classList.add('alert-success');

                this.alertMessage = "<strong>Success! </strong>" + message;
                this.showAlertMessage = true;
                var vm = this;
                setTimeout(function () {
                    vm.showAlertMessage = false;
                }, 3000);
            },
            displayErrorMessage(message) {
                this.$refs.alertStatusMessage.classList.remove('alert-success');
                this.$refs.alertStatusMessage.classList.add('alert-danger');

                this.alertMessage = "<strong>Error! </strong>" + message;
                this.showAlertMessage = true;
                var vm = this;
                setTimeout(function () {
                    vm.showAlertMessage = false;
                }, 6000);
            },
            async displayErrorDialog(title, message) {
                const h = this.$createElement;
                const titleHtml = h('div', { domProps: { innerHTML: title } });
                const messageHtml = h('div', { domProps: { innerHTML: message } });
                await this.$bvModal.msgBoxOk([messageHtml], {
                    title: [titleHtml],
                    size: 'sm',
                    buttonSize: 'sm',
                    hideHeaderClose: true,
                    centered: true,
                    noCloseOnBackdrop: true,
                    headerBgVariant: "danger",
                    scrollable: true
                }).catch(err => {
                    // An error occurred
                });
            },
            createElementId() {
                var rndInt = Math.floor(Math.random() * 9999999) + 1;
                return "element-" + rndInt;
            }
        }
    }
</script>

<style lang="scss">

    @import "~tabulator-tables/dist/css/tabulator.css";
    /*@import "~tabulator-tables/dist/css/tabulator_simple.min.css";*/
    /*@import "~tabulator-tables/dist/css/tabulator_modern.min.css";*/
    /*@import "~tabulator-tables/dist/css/semantic-ui/tabulator_semantic-ui.min.css";*/
    /*@import "~tabulator-tables/dist/css/bootstrap/tabulator_bootstrap4.min.css";*/
    /*@import "~tabulator-tables/dist/css/bulma/tabulator_bulma.min.css";*/
    /*@import "~tabulator-tables/dist/css/materialize/tabulator_materialize.min.css";*/
    /*@import "~tabulator-tables/dist/css/tabulator_midnight.min.css";*/
    
    /*$fa-font-path: '~font-awesome/fonts/';
    @import '~font-awesome/scss/font-awesome.scss';*/

    /*.tabulator-row {
        border-bottom: 1px solid rgb(150, 150, 150);

        &.tabulator-selectable:hover {
            border-bottom: 2px solid rgb(120, 120, 150);
            border-top: 2px solid rgb(120, 120, 150);
            background-color: rgb(215, 215, 225);
            margin-top: -2px;
        }

        &.tabulator-selected {
            border-bottom: 2px solid rgb(40, 40, 40);
            border-top: 2px solid rgb(40, 40, 40);
            background-color: rgb(255, 255, 220);
            margin-top: -2px;
        }

        &.tabulator-selected:hover {
            border-bottom: 2px solid rgb(40, 40, 40);
            border-top: 2px solid rgb(40, 40, 40);
            background-color: rgb(255, 255, 220);
            margin-top: -1px;
        }
    }*/

    @mixin table-sizing($breakpoint) {
        @if($breakpoint == level9) {
            @media(max-height: 1390px) {
                @content
            }
        }
        @if($breakpoint == level8) {
            @media(max-height: 1265px) {
                @content
            }
        }
        @if($breakpoint == level7) {
            @media(max-height: 1140px) {
                @content
            }
        }
        @if($breakpoint == level6) {
            @media(max-height: 1055px) {
                @content
            }
        }
        @if($breakpoint == level5) {
            @media(max-height: 970px) {
                @content
            }
        }
        @if($breakpoint == level4) {
            @media(max-height: 885px) {
                @content
            }
        }
        @if($breakpoint == level3) {
            @media(max-height: 815px) {
                @content
            }
        }
        @if($breakpoint == level2) {
            @media(max-height: 755px) {
                @content
            }
        }
        @if($breakpoint == level1) {
            @media(max-height: 700px) {
                @content
            }
        }
    }

    .sizing-toprow3 {
        height: 72vh;
        @include table-sizing(level9) {
            height: 68vh;
        }
        @include table-sizing(level8) {
            height: 65vh;
        }
        @include table-sizing(level7) {
            height: 62vh;
        }
        @include table-sizing(level6) {
            height: 59vh;
        }
        @include table-sizing(level5) {
            height: 55vh;
        }
        @include table-sizing(level4) {
            height: 51vh;
        }
        @include table-sizing(level3) {
            height: 47vh;
        }
        @include table-sizing(level2) {
            height: 43vh;
        }
        @include table-sizing(level1) {
            height: 39vh;
        }
    }

    .sizing-toprow2 {
        height: 77vh;
        @include table-sizing(level9) {
            height: 73vh;
        }
        @include table-sizing(level8) {
            height: 70vh;
        }
        @include table-sizing(level7) {
            height: 67vh;
        }
        @include table-sizing(level6) {
            height: 64vh;
        }
        @include table-sizing(level5) {
            height: 61vh;
        }
        @include table-sizing(level4) {
            height: 58vh;
        }
        @include table-sizing(level3) {
            height: 55vh;
        }
        @include table-sizing(level2) {
            height: 51vh;
        }
        @include table-sizing(level1) {
            height: 48vh;
        }
    }

    .sizing-toprow1 {
        height: 79vh;
        @include table-sizing(level9) {
            height: 76vh;
        }
        @include table-sizing(level8) {
            height: 74vh;
        }
        @include table-sizing(level7) {
            height: 72vh;
        }
        @include table-sizing(level6) {
            height: 69vh;
        }
        @include table-sizing(level5) {
            height: 66vh;
        }
        @include table-sizing(level4) {
            height: 63vh;
        }
        @include table-sizing(level3) {
            height: 60vh;
        }
        @include table-sizing(level2) {
            height: 57vh;
        }
        @include table-sizing(level1) {
            height: 54vh;
        }
    }

    .sizing-toprow0 {
        height: 83vh;

        @include table-sizing(level9) {
            height: 80vh;
        }
        @include table-sizing(level8) {
            height: 78vh;
        }
        @include table-sizing(level7) {
            height: 76vh;
        }
        @include table-sizing(level6) {
            height: 74vh;
        }
        @include table-sizing(level5) {
            height: 71vh;
        }
        @include table-sizing(level4) {
            height: 69vh;
        }
        @include table-sizing(level3) {
            height: 66vh;
        }
        @include table-sizing(level2) {
            height: 63vh;
        }
        @include table-sizing(level1) {
            height: 60vh;
        }
    }

    input[type=checkbox] {
        cursor: default;
    }

    input:read-only[type=checkbox] {
        cursor: default;
    }

    .align-right {
        display: block;
        margin-left: auto;
        margin-right: 0;
        text-align: right;
    }

    .align-left {
        display: block;
        margin-left: 0;
        margin-right: auto;
        text-align: left;
    }

    .excel-upload-input {
        display: none;
        z-index: -9999;
    }

    // .row-padding {
    //     padding: 0px 0px 0px 0px;
    // }

    .spacing-right {
        margin-left :0px;
        margin-right :7px;
    }

    .spacing-left {
        margin-left :5px;
        margin-right :0px;
    }

    .alert-display {
        display: block;
        position: absolute;
        overflow: visible;
        border: 1px solid rgb(0, 0, 0);
        z-index: 1;
        width: 100%;
        min-height: 40px;
        border-radius: 7px;
    }

    .alert-message {
        height: 100%;
        vertical-align: middle;
    }

    .top-padding {
        padding-top: 10px;
    }

    //.row-adjustment {
    //    margin: -15px;
    //}

</style>
