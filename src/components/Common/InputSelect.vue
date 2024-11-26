<template>
    <select class="form-select" v-model="this.selected" :id="this.selectId" :disabled="this.disabled || false">
        <option v-for="(item, i) in options" :key="i" :value="item.value" :selected="item.selected">{{ item.label }}</option>
    </select>
</template>
<script>
export default {
    name: "Select Component",
    data() {
        return {
            selected: null
        }
    },
    props: [
        'selectId',
        'options',
        'disabled'
    ],
    mounted() {
        this.selected = this.options.find((element) => element.selected == true).value;
    },
    watch: {
        selected: function(newValue, oldValue) {
            this.$emit('update-selection', newValue);
        }
    },
    emits: ['update-selection']
}
</script>