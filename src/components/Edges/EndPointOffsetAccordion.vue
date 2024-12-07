<template>
    <p v-if="!checkboxValue" class="mb-0">Ative para começar</p>
    <InputGroupWithLabel
    v-if="checkboxValue" :prepend="'De (From):'" :append="true" :inputType="'number'"
        :tooltip="'Options.Edges.EndPointOffset.From - Um número negativo aproxima o ponto final do ponto médio do nó e um número positivo faz o oposto.'"
        :inputInitialValue="from" @input-value-change="changeFrom" :step="0.1"
    ></InputGroupWithLabel>
    <InputGroupWithLabel
    v-if="checkboxValue" :prepend="'Para (To):'" :append="true" :inputType="'number'"
        :tooltip="'Options.Edges.EndPointOffset.To - Um número negativo aproxima o ponto final do ponto médio do nó e um número positivo faz o oposto.'"
        :inputInitialValue="to" @input-value-change="updateTo" :step="0.1"
    ></InputGroupWithLabel>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
export default {
    name: "End Point Offset Component",
    props: ['checkboxValue', 'openBsModal','bsModalReturnValue'],
    data() {
        return {
            from: 0,
            to: 0
        }
    },
    mounted() {
        console.log("End Point Offset Component Mounted");
    },
    methods: {
        changeFrom: function(value) {
            this.from = value;
            this.$emit("message", 'options-edges-endpointoffset-from', value);
        },
        updateTo: function(value) {
            this.to = value;
            this.$emit("message", 'options-edges-endpointoffset-to', value);
        }
    },
    components: {
        InputGroupWithLabel
    },
    emits: ["message", "open-bs-modal"]
}
</script>