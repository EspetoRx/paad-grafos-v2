<template>
    <Multiselect :options="options" :id="this.selectId" v-model="this.value" :disabled="this.disabled"
        :searchable="true" :close-on-select="true" :show-labels="true" :label="'label'" :track-by="'id'"
        :placeholder="this.placeholder">
        <template #singleLabel="{ option }">
            <div class="d-flex">
                <div v-html="option.code"></div> - {{ option.label }}
            </div>
        </template>
        <template #option="{ option }">
            <div class="d-flex">
                <div v-html="option.code"></div> - {{ option.label }}
            </div>
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect';
export default {
    data() {
        return {
            value: null,
            disabled: false,
        }
    },
    props: [
        'selectId',
        'isDisabled',
        'placeholder',
        'options',
        'selected'
    ],
    components: {
        Multiselect
    },
    watch: {
        value: function (newValue, oldValue) {
            this.value = newValue;
            this.$emit("option-chosen", newValue);
        },
        selected: function(newValue, oldValue){
            this.value = newValue;
        }
    },
    mounted() {
        this.value = this.selected;
    },
    emits: ['option-chosen']
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style></style>