<template>
    <b-row align-h="start" class="row-padding">
        <b-col cols="auto">
            <div style="min-width:75px;">
                <div v-show="filterIndex > 0" class="align-left">
                    <b-form-radio-group
                        v-model="filterGrouping"
                        :options="radioOptions"
                        button-variant="outline-secondary"
                        size="sm"
                        buttons
                    ></b-form-radio-group>
                </div>
            </div>
        </b-col>
        <b-col cols="2">
            <b-form-select size="sm" v-model="filterCol" @change="colChange">
                <template #first>
                    <b-form-select-option :value="null" disabled>-- Column to filter --</b-form-select-option>
                </template>
                <b-form-select-option v-for="option in filterColumnOptions" :value="option.field" :key="option.field">{{ option.title }}</b-form-select-option>
            </b-form-select>
        </b-col>
        <b-col cols="2">
            <b-form-select size="sm" v-model="filterType" v-show="!isBoolCol">
                <template #first>
                    <b-form-select-option value="null" disabled>-- Filter type --</b-form-select-option>
                </template>
                <b-form-select-option value="like">Contains</b-form-select-option>
                <b-form-select-option value="starts">Starts With</b-form-select-option>
                <b-form-select-option value="ends">Ends With</b-form-select-option>
                <b-form-select-option value="=">Equal</b-form-select-option>
                <b-form-select-option value="!=">Not Equal</b-form-select-option>
                <b-form-select-option value="<"> Less Than</b-form-select-option>
                <b-form-select-option value="<=">Less Than or Equal</b-form-select-option>
                <b-form-select-option value=">">Greater Than</b-form-select-option>
                <b-form-select-option value=">=">Greater Than or Equal</b-form-select-option>
                <b-form-select-option value="keywords">Keywords (Any)</b-form-select-option>
                <b-form-select-option value="regex">Regular Expression</b-form-select-option>
            </b-form-select>
            <b-form-select size="sm" v-model="filterType" v-show="isBoolCol">
                <template #first>
                    <b-form-select-option value="=">Equal</b-form-select-option>
                </template>
            </b-form-select>
        </b-col>
        <b-col cols="2">
            <b-form-input size="sm" v-on:keyup="keyUp" v-model="filterSearchTerm" v-if="!isBoolCol && !isNumericCol" placeholder="-- Value to filter --"></b-form-input>
            <b-form-input size="sm" type="number" min="0" @change="keyUp" v-model="filterSearchTerm" v-if="isNumericCol" placeholder="-- Value to filter --"></b-form-input>
            <b-form-select size="sm" v-model="filterSearchTerm" v-if="isBoolCol" @change="keyUp">
                <template #first>
                    <b-form-select-option value="" disabled>-- Value to filter --</b-form-select-option>
                </template>
                <b-form-select-option value="true">True</b-form-select-option>
                <b-form-select-option value="false">False</b-form-select-option>
            </b-form-select>
        </b-col>
        <b-col cols="2" class="align-left">
            <b-button size="sm" @click="removeClicked" variant="outline-warning">Remove Filter</b-button>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "AdvancedFilterBar",
        props: ["filterColumnOptions","uniqueId","filterIndex","filterValues"],
        data() {
            return {
                filterCol: (this.filterValues && this.filterValues.filterCol) || null,
                filterType: (this.filterValues && this.filterValues.filterType) || null,
                filterSearchTerm: (this.filterValues && this.filterValues.filterSearchTerm) || "",
                filterGrouping: (this.filterValues && this.filterValues.filterGrouping) || "and",
                isBoolCol: false,
                isNumericCol: false,
                radioOptions: [
                    {text: 'And', value: 'and'},
                    {text: 'Or', value: 'or'}
                ]
            };
        },
        computed: {},
        watch: {
            filterIndex(val){
                if (val <= 0)
                    this.filterGrouping = "and";
            }
        },
        mounted() {},
        methods: {
            removeClicked() {
                this.$emit('delete-filter', this.uniqueId);
            },
            keyUp() {
                if (this.filterSearchTerm)
                    this.$emit('keyup-filter', this.uniqueId);
            },
            numberChanged() {
                if (this.filterSearchTerm)
                    this.$emit('keyup-filter', this.uniqueId);
            },
            colChange(value){
                for (var i = 0; i < this.filterColumnOptions.length; i++)
                {
                    if (this.filterColumnOptions[i].field == value){
                        if(this.filterColumnOptions[i].headerFilter && this.filterColumnOptions[i].headerFilter == "tickCross"){
                            this.filterType = "=";
                            this.filterSearchTerm = "";
                            this.isNumericCol = false;
                            this.isBoolCol = true;
                        } else if(this.filterColumnOptions[i].validator && this.filterColumnOptions[i].validator == "numeric"){
                            this.filterType = null;
                            this.filterSearchTerm = "";
                            this.isNumericCol = true;
                            this.isBoolCol = false;
                        } else {
                            this.filterType = null;
                            this.filterSearchTerm = "";
                            this.isNumericCol = false;
                            this.isBoolCol = false;
                        }
                        break;
                    }
                }
            }
        },
    }
</script>

<style lang="scss">

</style>
