<template>
    <InputGroupWithLabel
        :prepend="'Tamanho: '"
        :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.SelfReference.Size - O raio do círculo.'"
        :inputInitialValue="size"
        :disabled="false"
        :min="1"
        :max="100"
        :step="1"
        @input-value-change="changeSize"
    ></InputGroupWithLabel>
    <InputGroupWithLabel
        :prepend="'Angulo em radianos: '"
        :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.SelfReference.Angle - Este é o ângulo (fornecido em radianos) para indicar a posição do círculo. Se a posição não for fornecida, será o canto superior direito (π/4).'"
        :inputInitialValue="angle"
        :disabled="false"
        :min="0"
        :max="2*Math.PI"
        :step="0.1"
        @input-value-change="changeAngle"
    ></InputGroupWithLabel>
    <SwitchWithInfo
        :switchId="'options-edges-selfReference-renderBehindTheNode'"
        :switchDisabled="false"
        :switchInitialValue="renderBehindTheNode"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.SelfReference.RenderBehindTheNode - Este é um sinalizador que indica se o círculo de auto-referência deve ser desenhado como um círculo completo ou não deve se sobrepor ao vértice pai.'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Renderizar atrás do vértice'"
        @checkbox-status-changed="changeRenderBehindTheNode"
    ></SwitchWithInfo>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Self Reference Edge Accordion",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
    ],
    data(){
        return {
            size: "20",
            angle: Math.PI/4,
            renderBehindTheNode: true,
        }
    },
    mounted() {
        console.log("Self Reference Edge Accordion Mounted");
    },
    methods: {
        changeSize: function(value) {
            this.size = value;
            this.$emit("message", "options-edges-selfReference-size", value);
        },
        changeAngle: function(value) {
            this.angle = value;
            this.$emit("message", "options-edges-selfReference-angle", value);
        },
        changeRenderBehindTheNode: function(value) {
            this.renderBehindTheNode = value;
            this.$emit("message", "options-edges-selfReference-render-behind-the-node", value);
        }
    },
    components: {
        InputGroupWithLabel,
        SwitchWithInfo
    },
    emits: ["message", "open-bs-modal"]
}
</script>