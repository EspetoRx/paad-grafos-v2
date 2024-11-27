<template>
    <LabelWithTooltip
        :forId="this.idInput"
        :hasSwitch="false"
        :labelValue="this.labelValue"
        :tooltip="this.tooltip"
    ></LabelWithTooltip>
    <input type="text" class="form-control" :placeholder="placeholder" :id="idInput" v-model="value" @input="urlValueUpdate">
</template>

<script>
import LabelWithTooltip from './LabelWithTooltip.vue';
import isUrl from 'is-url';
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
            if (isUrl(newValue)) {
                this.isUrlValue = true;
                this.$emit("url-value-update", newValue);
            } else {
                this.isUrlValue = true;
                this.$emit("url-value-update", oldValue);
            }
        }
    },
    components: {
        LabelWithTooltip
    },
    methods: {
        urlValueUpdate: function(newUrl, oldUrl) {
            if (isUrl(newUrl)) {
                this.isUrlValue = true;
                this.$emit("url-value-update", newUrl);
            } else {
                this.isUrlValue = true;
                this.$emit("url-value-update", oldUrl);
            }
        }
    },
    mounted() {
        console.log("Input Url Component Mounted");
        this.value = this.urlInitalValue;
    },
    emits: ['url-value-update']
}
</script>

<style></style>