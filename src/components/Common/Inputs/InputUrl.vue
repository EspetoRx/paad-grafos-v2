<template>
    <LabelWithTooltip
        :forId="this.idInput"
        :hasSwitch="false"
        :labelValue="this.labelValue"
        :tooltip="this.tooltip"
    ></LabelWithTooltip>
    <input type="text" class="form-control" :placeholder="placeholder" :id="idInput" v-model="value">
</template>

<script>
import LabelWithTooltip from '../LabelWithTooltip.vue';
export default {
    name: "Input Url Component",
    props: [
        'idInput',
        'labelValue',
        'tooltip',
        'placeholder',
        'urlInitalValue'
    ],
    data() {
        return {
            value: '',
            isUrlValue: false,
        }
    },
    watch: {
        value: function(newValue, oldValue) {
            this.$emit("url-value-update", newValue);
        }
    },
    components: {
        LabelWithTooltip
    },
    mounted() {
        console.log("Input Url Component Mounted");
        this.value = this.urlInitalValue;
    },
    emits: ['url-value-update']
}
</script>

<style></style>