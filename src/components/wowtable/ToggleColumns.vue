<template>
    <div class="dropdown">
        <b-button size="sm" @click="toggleList" block variant="secondary"><i class="fas fa-columns"></i></b-button>
        <div ref="columnDropdown" class="dropdown-content" @mouseleave="toggleList">
            <b-button class="dropdown-button" size="sm" @click="toggleAllColumns(true)" squared variant="outline-secondary">Show All</b-button><!-- The comment between buttons is needed to remove white space since float is not working
            --><b-button class="dropdown-button" size="sm" @click="toggleAllColumns(false)" squared variant="outline-secondary">Hide All</b-button>
            <b-form-checkbox v-for="col in formattedColumnData" :key="col.getField()" size="sm" @change="toggleColumn(col)" :checked="col.isVisible()">{{col.getDefinition().title}}</b-form-checkbox>
        </div>
    </div>
</template>

<script>

    export default {
        name: "ToggleColumns",
        components: {},
        props: {
            columnData: Array,
            excludeColumns: Array
        },
        data() {
            return {
            };
        },
        computed: {
            formattedColumnData() {
                return this.columnData.reduce((colData, col) => {
                    if (!col.getDefinition().title) {
                        return colData;
                    } else if (Array.isArray(this.excludeColumns)) {
                        if (this.excludeColumns.includes(col.getField())) {
                            return colData;
                        } else {
                            colData.push(col);
                            return colData;
                        }
                    } else {
                        colData.push(col);
                        return colData;
                    }
                }, []);
            }
        },
        watch: {},
        mounted() { },
        methods: {
            toggleList() {
                this.$refs["columnDropdown"].classList.toggle("show");
            },
            toggleColumn(col) {
                col.toggle();
            },
            toggleAllColumns(show) {
                this.formattedColumnData.forEach(col => {
                    if (show)
                        col.show();
                    else
                        col.hide();
                });
            }
        },
    };
</script>

<style lang="scss">
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f6f6f6;
        min-width: 230px;
        overflow: auto;
        overflow-y: scroll;
        border: 1px solid #ddd;
        z-index: 1;
        height: 200px;
    }

    .dropdown-button {
        width: 50%;
    }

    .show {
        display: block;
    }
</style>
