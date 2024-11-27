<template>
    <select class="form-select" v-model="this.selected" :id="this.selectId" :disabled="this.disabled || false" v-if="!options[0].group">
        <option v-for="(item, i) in options" :key="i" :value="item.value" :selected="item.selected">{{ item.label }}</option>
    </select>
    <select class="form-select" v-model="this.selected" :id="this.selectId" :disabled="this.disabled || false" v-else>
        <optgroup v-for="(group, j) in optionsGroups" :key="j" :label="group.label">
            <option v-for="(item, i) in group.options" :key="i" :value="item.value">{{ item.label }}</option>
        </optgroup>
    </select>
</template>
<script>
export default {
    name: "Select Component",
    data() {
        return {
            selected: null,
            optionsGroups: [],
        }
    },
    props: [
        'selectId',
        'options',
        'disabled'
    ],
    mounted() {
        this.selected = this.options.find((element) => element.selected == true).value;
        if (Object.hasOwn(this.options[0], "group")) {
            this.optionsGroups = Object.entries(
                this.options.reduce((acc, { value, label, selected, group }) => {
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    acc[group].push({value, label, selected});
                    return acc;
                }, {})
            ).map(([label, options]) => ({ label, options}))
        }
    },
    watch: {
        selected: function(newValue, oldValue) {
            this.$emit('update-selection', newValue);
        }
    },
    emits: ['update-selection']
}
</script>