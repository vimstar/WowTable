<template>
    <b-row align-h="start">
        <b-col cols="auto">
            <div style="min-width:45px;">
                <div v-show="filterIndex > 0">
                    <b-form-radio size="sm" v-model="filterGrouping" value="and" style="font-size: 0.75rem;">And</b-form-radio>
                    <b-form-radio size="sm" v-model="filterGrouping" value="or" style="font-size: 0.75rem;">Or</b-form-radio>
                </div>
            </div>
        </b-col>
        <b-col cols="2">
            <b-form-select size="sm" v-model="filterCol">
                <template #first>
                    <b-form-select-option :value="null" disabled>-- Column to filter --</b-form-select-option>
                </template>
                <b-form-select-option v-for="option in filterColumnOptions" :value="option.field" :key="option.field">{{ option.title }}</b-form-select-option>
            </b-form-select>
        </b-col>
        <b-col cols="2">
            <b-form-select size="sm" v-model="filterType">
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
        </b-col>
        <b-col cols="2">
            <b-form-input size="sm" v-on:keyup="keyUp" v-model="filterSearchTerm" placeholder="-- Value to filter --"></b-form-input>
        </b-col>
        <b-col cols="2">
            <b-button size="sm" @click="removeClicked">Remove Filter</b-button>
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
                filterGrouping: (this.filterValues && this.filterValues.filterGrouping) || "and"
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
                this.$emit('keyup-filter', this.uniqueId);
            },
        },
    }
</script>

<style lang="scss">
</style>
