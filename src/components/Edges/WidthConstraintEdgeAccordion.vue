<template>
    <p v-if="!checkboxValue" class="m-0 pt-1">Ative para começar</p>
    <InputRange
        v-if="checkboxValue"
        :inputId="'options-edges-widthConstraint-value'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="widthCosntraint"
        :labelValue="'Máximo da Constante de Largura'"
        :tooltip="'Options.Edges.WidthConstraint.Maximum - Se um número for especificado, a largura máxima do rótulo da borda será definida como o valor. As linhas do rótulo da borda serão quebradas em espaços para ficarem abaixo do máximo.'"
        :disabled="false"
        @update-value-from-range-input="widthConstraintChange"
    ></InputRange>
</template>
<script>
import InputRange from '../Common/Inputs/InputRange.vue';

export default {
    name: "Width Constraint Edge Accordion Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data(){
        return{
            widthCosntraint: 0
        }
    },
    mounted() {
        console.log("Width Constraint Edge Accordion Component Mounted");
    },
    components: {
        InputRange
    },
    methods: {
        widthConstraintChange: function(value) {
            this.widthCosntraint = value;
            this.$emit("message", "options-edges-widthConstraint-value", value);
        }
    },
    emits: ["message", "open-bs-modal"]
}
</script>