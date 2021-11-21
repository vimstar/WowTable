<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-xl-12">
                <h2>WowTable Vue JS Demo</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-12">
                <hr class="seperator-line">
            </div>
        </div>
        <WowTable :tableOptions="tableOptions" ref="wowTable" v-if="dataLoaded"/>
    </div>
</template>

<script>
    import WowTable from "@/components/wowtable/WowTable.vue";
    import { CollectorGroups, AuctionInfo, MemberStatus, ItemType, DemoData } from '@/js/wowtable-demo-data.js';

    export default {
        name: "WowTableDemo",
        components: {
            WowTable
        },
        computed: {
            tableOptions() {
                return {
                    columnData: this.columnData,
                    rowData: this.rowData,
                    rowKey: "Id",
                    showAddNew: true,
                    doAddNewInTable: true,
                    showDelete: true,
                    doSingleRowEditing: true,
                    inTableEditing: true,
                    showAdvancedSearch: true,
                    initialTableSort: [{column:"ItemId", dir:"asc"}],
                    showToggleColumns: true,
                    excludedToggleColumns: ["Id", "hiddenColumnData"],
                    showImportExcel: true,
                    importExcelValidation: ["Id", "ItemId", "ItemName", "Type"],
                    showExportExcel: true,
                    exportExcelFileName: "MyItemCollections",
                    tableClasses: ["sizing-toprow2"],
                    showEditOnLeft: true,
                    paginationSize: 15,
                    paginationSizeSelector: [15, 25, 50, 100]

                }
            }
        },
        created() {
            this.dataLoaded = false;

            this.setupColumns();
            this.loadRowData();
        },
         mounted() {
             this.loadAuctionInfo();
             this.loadMemberStatusList();
             this.loadItemTypeList();        
         },
        data() {
            return {
                columnData: null,
                rowData: null,
                auctionLib: [],
                memberStatusList: [],
                itemListData: [],
                catagoryList: [],
                subCategoryList: [],
                typeList: [],
                dataLoaded: false,
                customerGroups: []
            };
        },
        methods: {
            loadRowData() {
                this.rowData = DemoData;
            },
            loadAuctionInfo() {
                // This would be a call to a service
                this.auctionLib = AuctionInfo;
            },
            loadMemberStatusList(){
                this.memberStatusList = MemberStatus;
            },
            loadItemTypeList () {
                this.itemListData = ItemType;

                const map = new Map();
                for (const item of this.itemListData) {
                    if (!map.has(item.CategoryId)) {
                        map.set(item.CategoryId, true);
                        this.catagoryList.push(
                            { CategoryId: item.CategoryId, CategoryName: item.CategoryName }
                        );
                    }
                }
            },
            setSubCategoriesList(categoryId) {
                this.subCategoryList = [];

                var filteredList = this.itemListData.filter(function (f) {
                    return f.CategoryId === categoryId;
                });

                const map = new Map();
                for (const item of filteredList) {
                    if (!map.has(item.SubCategoryId)) {
                        map.set(item.SubCategoryId, true);
                        this.subCategoryList.push(
                            { SubCategoryId: item.SubCategoryId, SubCategoryName: item.SubCategoryName }
                        );
                    }
                }
            },
            setTypesList(categoryId, subCategoryId) {
                this.typeList = [];

                var filteredList = this.itemListData.filter(function (f) {
                    return f.CategoryId === categoryId && f.SubCategoryId === subCategoryId;
                });

                const map = new Map();
                for (const item of filteredList) {
                    if (!map.has(item.Type)) {
                        map.set(item.Type, true);
                        this.typeList.push(
                            { Type: item.Type }
                        );
                    }
                }
            },
            async setupColumns() {
                var that = this;

                var itemTypeCols = this.getItemTypeCols();
                var groupColumns = await this.setupDynamicColumns();

                var columns = [
                    { title: "hiddenColumnData", field: "hiddenColumnData", visible: false, download: false, editor: false },
                    { title: "Id", field: "Id", titleDownload: "Id", visible: false, download: true, editor: false },
                    {
                        title: "Item ID", field: "ItemId", titleDownload: "ItemId", editor: "autocomplete", headerFilter: "input", validator: "numeric",
                        cellEdited: function (cell) {
                            var name = that.getItemNameById(cell.getValue());
                            if (name)
                                cell.getRow().getCell('ItemName').setValue(name);
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                freetext: true,
                                sortValuesList: "asc",
                                values: true
                            };
                        }
                    },
                    {
                        title: "Item Name", field: "ItemName", titleDownload: "ItemName", editor: "autocomplete", headerFilter: "input",
                        cellEdited: function (cell) {
                            var id = that.getItemIdByName(cell.getValue());
                            if (id)
                                cell.getRow().getCell('ItemId').setValue(id);
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                freetext: true,
                                sortValuesList: "asc",
                                values: true
                            };
                        }
                    },
                    { title: "Item Type Selection", headerHozAlign: "center", columns: itemTypeCols },
                    { title: "Description", field: "Description", titleDownload: "Description", editor: "textarea", formatter: "input", download: true, headerFilter: "input", tooltip: true, width: 300, mutatorEdit: this.bulletMutator },
                    {
                        title: "For Sale", field: "ForSale", titleDownload: "ForSale", download: true, align: "center", editor: "tickCross",
                        formatter: "tickCross", headerFilter: "tickCross", headerFilterParams: { "tristate": true },
                        headerFilterEmptyCheck: function (value) { return value === null },
                        cellEdited: function (cell) {
                            if (cell.getValue() == false)
                                cell.getRow().getCell('AuctionCode').setValue("");
                        },
                    },
                    {
                        title: "Auction Code", field: "AuctionCode", titleDownload: "AuctionCode", download: true, headerFilter: "input", editor: "autocomplete",
                        cellEdited: function (cell) {
                            var item = that.auctionLib.find(c => { return c.AuctionCode === cell.getValue(); });
                            cell.getRow().getCell('AuctionDetail').setValue(item != null ? item.AuctionDetail : "");
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: "(must be marked for sale)",
                                sortValuesList: "asc",
                                values: that.checkValueFalseOrNull(cell.getRow().getCell('ForSale').getValue()) ? null : that.auctionLib.map(a => a.AuctionCode).sort(function (a, b) { return a - b })
                            };
                        }
                    },
                    { title: "Auction Details", field: "AuctionDetail", titleDownload: "AuctionDetail", download: true, width: 450, editor: false, tooltip: true, headerFilter: false, headerSort: false, cssClass: "no-filter-column" },
                    { title: "Collector Group Memberships", headerHozAlign: "center", columns: groupColumns }
                ];

                this.columnData = columns;
                this.dataLoaded = true;
            },
            getItemTypeCols() {
                var that = this;

                var itemTypeCols = [
                    {
                        title: "Category ID", field: "CategoryId", titleDownload: "CategoryId", download: true, headerFilter: "input", editor: "autocomplete", validator: "numeric",
                        cellEdited: function (cell) {
                            var item = that.catagoryList.find(c => { return c.CategoryId === cell.getValue(); });
                            cell.getRow().getCell('CategoryName').setValue(item != null ? item.CategoryName : "");

                            cell.getRow().getCell('SubCategoryId').setValue("");
                            that.buildListsFromRow(cell.getRow().getData());
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: (that.isLoadingDropdownData ? "(Please wait, loading...)": "(no results found)"),
                                sortValuesList: "asc",
                                values: that.catagoryList.map(a => a.CategoryId).sort(function (a, b) { return a - b })
                            };
                        }
                    },
                    {
                        title: "Category Name", field: "CategoryName", titleDownload: "CategoryName", headerFilter: "input", editor: "autocomplete",
                        cellEdited: function (cell) {
                            var item = that.catagoryList.find(c => { return c.CategoryName === cell.getValue(); });
                            cell.getRow().getCell('CategoryId').setValue(item != null ? item.CategoryId : "");
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: (that.isLoadingDropdownData ? "(Please wait, loading...)" : "(no results found)"),
                                sortValuesList: "asc",
                                values: that.catagoryList.map(a => a.CategoryName).sort()
                            };
                        }
                    },
                    {
                        title: "Sub-Category ID", field: "SubCategoryId", titleDownload: "SubCategoryId", headerFilter: "input", editor: "autocomplete", validator: "numeric",
                        cellEdited: function (cell) {
                            var item = that.subCategoryList.find(c => { return c.SubCategoryId === cell.getValue(); });
                            cell.getRow().getCell('SubCategoryName').setValue(item != null ? item.SubCategoryName : "");

                            cell.getRow().getCell('Type').setValue("");
                            that.buildListsFromRow(cell.getRow().getData());
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: "(no results found)",
                                sortValuesList: "asc",
                                values: that.subCategoryList.map(a => a.SubCategoryId).sort(function (a, b) { return a - b })
                            };
                        },
                        cellClick: function (e, cell) {
                        }
                    },
                    {
                        title: "Sub-Category Name", field: "SubCategoryName", titleDownload: "SubCategoryName", headerFilter: "input", editor: "autocomplete",
                        cellEdited: function (cell) {
                            var item = that.subCategoryList.find(c => { return c.SubCategoryName === cell.getValue(); });
                            cell.getRow().getCell('SubCategoryId').setValue(item != null ? item.SubCategoryId : "");
                        },
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: "(no results found)",
                                sortValuesList: "asc",
                                values: that.subCategoryList.map(a => a.SubCategoryName).sort()
                            };
                        },
                        cellClick: function (e, cell) {
                        }
                    },
                    {
                        title: "Type", field: "Type", titleDownload: "Type", headerFilter: "input", editor: "autocomplete",
                        editorParams: function (cell) {
                            return {
                                showListOnEmpty: true,
                                allowEmpty: true,
                                emptyPlaceholder: "(no results found)",
                                sortValuesList: "asc",
                                values: that.typeList.map(a => a.Type).sort(function (a, b) { return a - b })
                            };
                        },
                        cellClick: function (e, cell) {
                        }
                    }
                ];

                return itemTypeCols;
            },
            async getCollectorGroups() {
                // Axios is used to get data from a remote API
                // try {
                //     let response = await axios.get(collectorGroups_api);
                //     return response.data;
                // } catch (error) {
                //     console.error("Error retrieving Collector Groups. " + error + " : " + JSON.stringify(error.response.data));
                //     return [];
                // }
                return CollectorGroups;
            },
            async setupDynamicColumns() {
                var that = this;
                var columns = [];

                var groups = await this.getCollectorGroups();

                for (const group of groups) {
                    var groupName = group.GroupName;

                    var groupColumns = [
                        {
                            title: `${groupName} - Member`, field: `${groupName}_IsMember`, titleDownload: `${groupName}_IsMember`, download: true, align: "center", editor: "tickCross",
                            formatter: "tickCross", headerFilter: "tickCross", headerFilterParams: { "tristate": true },
                            headerFilterEmptyCheck: function (value) { return value === null },
                            cellEdited: this.groupMember_CellEdited,
                        },
                        {
                            title: `${groupName} - Status Code`, field: `${groupName}_StatCode`, titleDownload: `${groupName}_StatCode`, download: true, headerFilter: "input", headerSort: false, editor: "autocomplete", validator: "numeric",
                            cellEdited: this.groupStatus_CellEdited,
                            editorParams: function (cell) {
                                return {
                                    showListOnEmpty: true,
                                    allowEmpty: true,
                                    emptyPlaceholder: "(must be a group member)",
                                    sortValuesList: "asc",
                                    values: that.checkIsNotGroupMember(cell) ? null : that.memberStatusList.map(a => a.StatusCode).sort(function (a, b) { return a - b })
                                };
                            }
                        },
                        {
                            title: `${groupName} - Status Description`, field: `${groupName}_StatusDesc`, titleDownload: `${groupName}_StatusDesc`, headerFilter: "input", editor: "autocomplete", tooltip: true,
                            cellEdited: this.groupDesc_CellEdited,
                            editorParams: function (cell) {
                                return {
                                    showListOnEmpty: true,
                                    allowEmpty: true,
                                    emptyPlaceholder: "(must be a group member)",
                                    sortValuesList: "asc",
                                    values: that.checkIsNotGroupMember(cell) ? null : that.memberStatusList.map(a => a.StatusDesc).sort()
                                };
                            }
                        }
                    ];

                    var groupColumnsGroup = [{ title: groupName, headerHozAlign: "center", columns: groupColumns }];

                    columns = columns.concat(groupColumnsGroup);
                }

                return columns;
            },
            checkValueFalseOrNull(val) {
                return (val == null || val == false);
            },
            getItemNameById(id) {
                var filteredList = this.wowTable.dataClone.filter(function (f) {
                    return f.ItemId == id;
                });

                var name = null;
                for (const item of filteredList) {
                    if (item.ItemName) {
                        name = item.ItemName;
                        break;
                    }
                }

                return name;
            },
            getItemIdByName(name) {
                var filteredList = this.wowTable.dataClone.filter(function (f) {
                    return f.ItemName == name;
                });

                var id = null;
                for (const item of filteredList) {
                    if (item.ItemId) {
                        id = item.ItemId;
                        break;
                    }
                }

                return id;
            },
            groupStatus_CellEdited(cell) {
                var groupName = cell.getField().replace("_StatCode", "");
                var item = this.memberStatusList.find(c => { return c.StatusCode === cell.getValue(); });
                cell.getRow().getCell(`${groupName}_StatusDesc`).setValue(item != null ? item.StatusDesc : "");
            },
            groupDesc_CellEdited(cell) {
                var groupName = cell.getField().replace("_StatusDesc", "");
                var item = this.memberStatusList.find(c => { return c.StatusDesc === cell.getValue(); });
                cell.getRow().getCell(`${groupName}_StatCode`).setValue(item != null ? item.StatusCode : "");
            },
            groupMember_CellEdited(cell){
                var groupName = cell.getField().replace("_IsMember", "");
                if (this.checkValueFalseOrNull(cell.getValue())) {
                    cell.getRow().getCell(`${groupName}_StatCode`).setValue("");
                }       
            },
            checkIsNotGroupMember(cell) {
                var groupName = cell.getField().replace("_StatCode", "");
                groupName = groupName.replace("_StatusDesc", "");
                return this.checkValueFalseOrNull(cell.getRow().getCell(`${groupName}_IsMember`).getValue())
            },
            buildListsFromRow(row) {
                if (!row.CategoryId) {
                    this.subCategoryList = [];
                    this.typeList = [];
                    return;
                }     
                this.setSubCategoriesList(row.CategoryId);

                if (!row.SubCategoryId) {
                    this.typeList = [];
                    return;
                }    
                this.setTypesList(row.CategoryId, row.SubCategoryId);
            },
            bulletMutator(value, data, type, params, component) {
                return value.replace(/\*\s/gm, '• ');
            }
        }
    }
</script>

<style lang="scss">

    .seperator-line {
        height: 2px;
        border-width: 0;
        color: gray;
        background-color: gray
    }

    .no-edit-column {
        color: rgb(90, 120, 150);
    }

    .no-filter-column {
        color: rgb(70, 135, 90);
    }

</style>