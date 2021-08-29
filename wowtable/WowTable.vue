<template>
    <div class="table">
        <b-overlay :show="showWaitSpinner || showOverideWaitSpinner" :opacity=".50" >
            <div ref="alertStatusMessage" class="alert alert-dismissible fade show" v-show="showAlertMessage" role="alert">
                <span v-html="alertMessage"></span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="row" v-show="showAdvancedSearch">
                <div class="col-xl-2 align-left">
                    <b-button size="sm" @click="toggleShowFilters">{{advancedFiltersButtonText}} <span v-show="isFilterSet"><i class="fas fa-filter"></i></span></b-button>
                </div>
            </div>
            <div class="row" v-show="showAdvancedSearch && showAdvancedFilters">
                <div class="col-xl-12">
                    <AdvancedFilters ref="advancedFilters"
                                     @new-search="setTableFilters"
                                     :columnData="advancedFilterColumnData" />
                </div>
            </div>
            <div class="row" style="min-height: 60px;">
                <div class="col-xl-6 align-left">
                    <ToggleColumns v-show="showToggleColumns" 
                                   :columnData="toggleColumnsColumnData" 
                                   :excludeColumns="excludedToggleColumns" />
                    <b-button variant="warning" v-show="isDataEdited" @click="cancelUpdatedData">Cancel</b-button>
                    <b-button variant="primary" v-show="isDataEdited" @click="handleSaveDataClick">Save Changes</b-button>
                </div>
                <div class="col-xl-6 align-right">
                    <b-button variant="primary" v-show="showAddNew" @click="addNewClicked">Add New</b-button>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-12">
                    <div id="table-component"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-12 align-right">
                    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleExcelUploadInput">
                    <b-button variant="primary" v-show="showImportExcel" @click="handleImportExcelClick">Import Excel</b-button>
                    <b-button variant="primary" v-show="showExportExcel" @click="exportExcel()">Export Excel</b-button>
                </div>
            </div>
        </b-overlay>
    </div>
</template>

<script>
    import Tabulator from "tabulator-tables";
    import axios from "axios";
    import xlsx from "xlsx";
    import AdvancedFilters from "./AdvancedFilters.vue";
    import ToggleColumns from "./ToggleColumns.vue";

    const WowTableVersion = "1.2_2021-7-9";

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
                columnData: this.tableOptions.columnData,
                columnDataApi: this.tableOptions.columnDataApi,
                rowData: this.tableOptions.rowData,
                rowDataApi: this.tableOptions.rowDataApi,
                rowKey: this.tableOptions.rowKey || "id",
                groupRowBy: this.tableOptions.groupRowBy,
                groupStartOpenCount: this.tableOptions.groupStartOpenCount || 0,
                updateDataApi: this.tableOptions.updateDataApi,
                addDataApi: this.tableOptions.addDataApi,
                deleteDataApi: this.tableOptions.deleteDataApi,
                deleteValidationApi: this.tableOptions.deleteValidationApi,
                promptInfoColumn: this.tableOptions.promptInfoColumn,
                showAdvancedSearch: this.tableOptions.showAdvancedSearch,
                showAddNew: this.tableOptions.showAddNew,
                showDelete: this.tableOptions.showDelete,
                doDeleteValidation: this.tableOptions.doDeleteValidation,
                doAddNewInTable: this.tableOptions.doAddNewInTable,
                doSingleRowEditing: this.tableOptions.doSingleRowEditing,
                showImportExcel: this.tableOptions.showImportExcel,
                importExcelValidation: this.tableOptions.importExcelValidation || [],
                showExportExcel: this.tableOptions.showExportExcel,
                exportExcelFileName: this.tableOptions.exportExcelFileName || "data",
                showToggleColumns: this.tableOptions.showToggleColumns,
                excludedToggleColumns: this.tableOptions.excludedToggleColumns,
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
                alertMessage: ""
            };
        },
        computed: {},
        watch: {},
        async mounted() {
            await this.setupTable();
        },
        methods: {
            async setupTable() {
                var that = this;
                var autoColumns = false;
                if (typeof this.columnData == "undefined" && this.columnDataApi == "undefined") {
                    autoColumns = true;
                }
                console.log("groupStartOpenCount = " + this.groupStartOpenCount);
                this.table = new Tabulator("#table-component", {
                    pagination: "local",
                    paginationSizeSelector: [15, 30, 60, 100],
                    cellEdited: this.cellEdited,
                    dataLoaded: this.tableDataLoaded,
                    autoColumns: autoColumns, //only do autoColumns if no column information is provided
                    groupBy: this.groupRowBy,
                    groupStartOpen: function (value, count, data, group) { return count >= that.groupStartOpenCount },
                    downloadConfig: { columnGroups: false, rowGroups: false }
                });
                await this.setTableColumns();
                await this.setTableData();
            },
            async setTableColumns() {
                if (typeof this.columnData == "undefined" && typeof this.columnDataApi == "undefined")
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
                this.advancedFilterColumnData = (this.showAdvancedSearch) ? this.columnData : [];
                this.toggleColumnsColumnData = this.table.getColumns();
                this.showWaitSpinner = false;
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

                if (this.doSingleRowEditing) {
                    var editColumn = [{ field: "EditButton", formatter: this.formatter_EditButton, cellClick: this.cellClick_EditButton, headerSort: false, align: "center", resizable: false, download: false }];
                    this.columnData = this.columnData.concat(editColumn);
                }
                if (this.doSingleRowEditing || this.doAddNewInTable) {
                    var saveCancelColumns = [{ field: "CancelButton", formatter: this.formatter_CancelButton, cellClick: this.cellClick_CancelButton, headerSort: false, align: "center", resizable: false, visible: false, download: false },
                        { field: "SaveButton", formatter: this.formatter_SaveButton, cellClick: this.cellClick_SaveButton, headerSort: false, align: "center", resizable: false, visible: false, download: false }];
                    this.columnData = this.columnData.concat(saveCancelColumns);
                }
                if (this.showDelete) {
                    var deleteColumn = [{ field: "DeleteButton", formatter: this.formatter_DeleteButton, cellClick: this.cellClick_DeleteButton, headerSort: false, align: "center", resizable: false, download: false }];
                    this.columnData = this.columnData.concat(deleteColumn);
                }
            },
            async setTableData(refreshData = false) {
                if (typeof this.rowData == "undefined" && typeof this.rowDataApi == "undefined")
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
            },
            loadData(data, refreshData = false) {
                if (refreshData)
                    this.table.replaceData(data);
                else
                    this.table.setData(data);
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
                this.showWaitSpinner = false;
            },
            isRowSelected(cell) {
                if (this.doSingleRowEditing || (this.doAddNewInTable && this.isEditingNew))
                    return cell.getRow().isSelected();
                else
                    return true;
            },
            formatter_EditButton(cell, formatterParams, onRendered) {
                return "<button type='button' class='btn btn-sm btn-outline-secondary'>Edit</button>";
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
                    
                this.showWaitSpinner = true;
                var success = false;
                if (typeof this.updateDataApi == "string") {
                    console.log(JSON.stringify(this.editedData));
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
                this.table.download("xlsx", `${fileName}.xlsx`, { sheetName: "Data" });
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
                    if (sheetRows == null || sheetRows.length <= 0) {
                        valid = false;
                    } else if (Array.isArray(this.importExcelValidation)) {
                        for (var i = 0; i < this.importExcelValidation.length; i++) {
                            var row = sheetRows[0];
                            var hasProperty = {}.hasOwnProperty.call(row, this.importExcelValidation[i]);
                            if (!hasProperty) {
                                valid = false;
                                break;
                            }
                        }
                    }

                    if (!valid) {
                        const message = "The selected Excel file is not valid. Please select a valid file and try again.";
                        this.displayErrorDialog("Invalid Excel File", message);
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
        }
    }
</script>

<style lang="scss">
    @import "~tabulator-tables/dist/css/tabulator.min";
    /*$fa-font-path: '~font-awesome/fonts/';
    @import '~font-awesome/scss/font-awesome.scss';*/

    @mixin table-sizing($breakpoint) {
        @if($breakpoint == level5) {
            @media(max-height: 1152px) {
                @content
            }
        }
        @if($breakpoint == level4) {
            @media(max-height: 1007px) {
                @content
            }
        }
        @if($breakpoint == level3) {
            @media(max-height: 895px) {
                @content
            }
        }
        @if($breakpoint == level2) {
            @media(max-height: 790px) {
                @content
            }
        }
        @if($breakpoint == level1) {
            @media(max-height: 707px) {
                @content
            }
        }
    }

    #table-component {
        height: 65vh;
        @include table-sizing(level5) {
            height: 60vh;
        }
        @include table-sizing(level4) {
            height: 55vh;
        }
        @include table-sizing(level3) {
            height: 49vh;
        }
        @include table-sizing(level2) {
            height: 43vh;
        }
        @include table-sizing(level1) {
            height: 36vh;
        }
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
</style>
