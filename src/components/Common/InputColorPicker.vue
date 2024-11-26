<template>
    <input type="color" class="form-control form-control-color w-100 mb-1" :id="this.colorPickerId" v-model="this.color" :title="this.tooltip" :disabled="this.disabled || false">
</template>
<script>
export default {
    name: "Color Picker Component",
    props: [
        'colorPickerId',
        'colorPickerDefaultColor',
        'tooltip',
        'disabled',
    ],
    data() {
        return {
            color: ''
        }
    },
    watch: {
        color: function(newValue, oldValue) {
            this.$emit("update-color", newValue);
        }
    },
    mounted(){
        this.color = this.colorPickerDefaultColor;
    },
    emits: ['update-color']
}
</script>