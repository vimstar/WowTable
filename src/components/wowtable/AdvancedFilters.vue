<template>
    <b-card bg-variant="light">
        <div class="advanced-filters">
            <div id="filter-components">
                <AdvancedFilterBar v-for="filterBar in filterBars"
                                   :key="filterBar.uniqueId"
                                   :uniqueId="filterBar"
                                   :filterIndex="filterBar.filterIndex"
                                   :filterColumnOptions="filterBar.filterColumnOptions"
                                   :ref="filterBar"
                                   @delete-filter="deleteFilter"
                                   @keyup-filter="doSearchClicked" />
            </div>
            <b-row class="filter-button-padding">
                <b-col cols="6" class="align-left">
                    <b-button class="spacing-right" size="sm" @click="addFilterClicked" variant="primary">Add Filter</b-button>
                    <b-button size="sm" @click="doSearchClicked" variant="outline-success">Search</b-button>
                </b-col>
                <b-col cols="6" class="align-right">
                    <b-button size="sm" variant="outline-danger" @click="clearAllFilters">Clear All Filters</b-button>
                </b-col>
            </b-row>
        </div>
    </b-card>
</template>

<script>
    import AdvancedFilterBar from "./AdvancedFilterBar.vue";

    export default {
        name: "AdvancedFilters",
        components: { AdvancedFilterBar },
        props: ["columnData"],
        data() {
            return {
                filterBars: [],
            };
        },
        computed: {
            formattedColumnData() {
                return this.columnData.reduce((colData, col) => {
                    if (col.visible == false || col.headerFilter == false) {
                        return colData;
                    } else {
                        colData.push(col);
                        return colData;
                    }
                }, []);
            },
        },
        watch: {},
        mounted() { },
        methods: {
            addFilterClicked() {
                this.addFilter();
            },
            doSearchClicked() {
                this.$emit("new-search", this.currentFilterSearch());
            },
            async addFilter() {
                const filterBarData = {
                    filterColumnOptions: this.formattedColumnData,
                    uniqueId: Math.round((Math.random() * Math.random()) * 1000000),
                    filterIndex: this.filterBars.length
                };
                this.filterBars.push(filterBarData);
            },
            async deleteFilter(_id) {
                this.filterBars.splice(this.filterBars.indexOf(_id), 1);
                this.filterBars.forEach((item, index) => { item.filterIndex = index; });
                await this.$nextTick();
                this.$emit("new-search", this.currentFilterSearch());
            },
            async clearAllFilters() {
                this.filterBars = [];
                await this.$nextTick();
                this.$emit("new-search", this.currentFilterSearch());
            },
            currentFilterSearch() {
                var filterBarObjects = Object.values(this.$refs)[0];
                var filters = [];
                var filterGroup = [];

                for (var i = 0; i < filterBarObjects.length; i++) {
                    if (filterBarObjects[i].filterGrouping === 'and' && i > 0) {
                        filters.push(filterGroup);
                        filterGroup = [];
                    }
                    const compoundFilter = {
                        field: filterBarObjects[i].filterCol,
                        type: filterBarObjects[i].filterType,
                        value: filterBarObjects[i].filterSearchTerm,
                    };
                    filterGroup.push(compoundFilter);
                    if (i >= filterBarObjects.length - 1) {
                        filters.push(filterGroup);
                    }
                }
                return filters;
            },
            createUniqueId() {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            }
        },
    };
</script>

<style lang="scss">
    .filter-button-padding {
        padding: 15px 0px 0px 0px;
    }
</style>
