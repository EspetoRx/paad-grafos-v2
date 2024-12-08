<template>
    <p v-if="!checkboxValue" class="m-0 p-1">Habilite para começar</p>
    <SwitchWithInfo
        v-if="checkboxValue"
        :switchId="'switch-with-info-object-sending'"
        :switchDisabled="false"
        :switchInitialValue="objectEnabled"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Scaling.Label (Toggle oject/boolean sending) - Alterne entre o envio de objeto e booleano.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(objectEnabled)?'Enviando objeto para o campo Label':'Enviando booleano para o campo Label'"
        @checkbox-status-changed="changeObjectSending"
    ></SwitchWithInfo>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-scaling-label-min'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="min"
        :labelValue="'Mínimo:'"
        :tooltip="'Options.Edges.Scaling.Label.Min - O tamanho mínimo da fonte usado para rótulos durante o dimensionamento.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="updateMin"
    ></InputRange>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-scaling-label-max'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="max"
        :labelValue="'Máximo:'"
        :tooltip="'Options.Edges.Scaling.Label.Max - O tamanho máximo da fonte usado para rótulos durante o dimensionamento.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="updateMax"
    ></InputRange>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-scaling-label-maxVisible'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="maxVisible"
        :labelValue="'Visível no Máximo:'"
        :tooltip="'Options.Edges.Scaling.Label.MaxVisible - Ao aumentar o zoom, a fonte também fica maior. Você pode limitar o tamanho da fonte percebido usando esta opção. Se definido como 30, a fonte nunca parecerá maior que 30 com zoom de 100%.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="updateMaxVisible"
    ></InputRange>
</template>
<script>
import InputRange from '../Common/Inputs/InputRange.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
export default {
    name: "Scaling Label Edge Base Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
        'arrowType'
    ],
    data(){
        return{
            objectEnabled: false,
            min: 14,
            max: 30,
            maxVisible: 30,
        }
    },
    methods:{
        changeObjectSending: function(value) {
            this.objectEnabled = value;
            this.$emit("message", "options-edges-scaling-object-sending", this.arrowType, value);
            this.$emit("message", "repaint-component", this.arrowType, value);
        },
        updateMin: function(value) {
            this.min = value;
            this.$emit("message", "options-edges-scaling-object-min", this.arrowType, value);
            this.$emit("message", "repaint-component", this.arrowType, value);
        },
        updateMax: function(value) {
            this.max = value;
            this.$emit("message", "options-edges-scaling-object-max", this.arrowType, value);
            this.$emit("message", "repaint-component", this.arrowType, value);
        },
        updateMaxVisible: function(value) {
            this.maxVisible = value;
            this.$emit("message", "options-edges-scaling-object-maxVisible", this.arrowType, value);
            this.$emit("message", "repaint-component", this.arrowType, value);
        }
    },
    components: {
        SwitchWithInfo,
        InputRange
    },
    mounted() {
        console.log("Scaling Label Edge Base Component Mounted");
    },
    emits: ["message", "open-bs-modal"]
}
</script>