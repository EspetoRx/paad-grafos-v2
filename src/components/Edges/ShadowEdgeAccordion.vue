<template>
    <p v-if="!checkboxValue" class="m-0">Ative para começar</p>
    <SwitchWithInfo
        v-if="checkboxValue"
        :switchId="'options-edges-shadow-object-enabled'"
        :switchDisabled="false"
        :switchInitialValue="objectEnabled"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Shadow (Toggle boolean/object sending) - Quando verdadeiro, a aresta projeta uma sombra usando as configurações padrão. Isso fornece o raio do círculo e a posição.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(objectEnabled)?'Enviando objeto de sombra':'Enviando booleano de sombra'"
        @checkbox-status-changed="changeObjectShadowSending"
    ></SwitchWithInfo>
    <LabelWithTooltip
        v-if="checkboxValue && objectEnabled"
        :labelValue="'Cor da sombra'"
        :tooltip="'Options.Edges.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
        :forId="'options-edges-shadow-color'"
        :hasSwitch="false"
    ></LabelWithTooltip>
    <InputColorPicker
        v-if="checkboxValue && objectEnabled"
        :colorPickerId="'options-edges-shadow-color'"
        :colorPickerDefaultColor="color"
        :tooltip="'Options.Edges.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
        :disabled="false"
        @update-color="updateColor"
    ></InputColorPicker>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-shadow-size'"
        :isLabelEnabled="true"
        :min="1"
        :max="100"
        :step="1"
        :initialValue="size"
        :labelValue="'Tamanho'"
        :tooltip="'Options.Edges.Shadow.Size - O tamanho do desfoque da sombra.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="changeSize"
    ></InputRange>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-shadow-x'"
        :isLabelEnabled="true"
        :min="1"
        :max="100"
        :step="1"
        :initialValue="x"
        :labelValue="'Desvio em X'"
        :tooltip="'Options.Edges.Shadow.X - Desvio em X.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="changeX"
    ></InputRange>
    <InputRange
        v-if="checkboxValue && objectEnabled"
        :inputId="'options-edges-shadow-y'"
        :isLabelEnabled="true"
        :min="1"
        :max="100"
        :step="1"
        :initialValue="y"
        :labelValue="'Desvio em Y'"
        :tooltip="'Options.Edges.Shadow.Y - Desvio em Y.'"
        :disabled="false"
        :labelHasSwitch="false"
        @update-value-from-range-input="changeY"
    ></InputRange>
</template>
<script>
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default{
    name: "Shadow Edge Accordion Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data(){
        return{
            objectEnabled: false,
            color: '#000000',
            size: 10,
            x: 5,
            y: 5
        }
    },
    methods: {
        changeObjectShadowSending: function(value) {
            this.objectEnabled = value;
            this.$emit("message", "options-edges-shadow-object-enabled", value);
        },
        updateColor: function(value) {
            this.color = value;
            this.$emit("message", "options-edges-shadow-color", value);
        },
        changeSize: function(value) {
            this.size = value
            this.$emit("message", "options-edges-shadow-size", value);
        },
        changeX: function(value) {
            this.x = value;
            this.$emit("message", "options-edges-shadow-x", value);
        },
        changeY: function(value) {
            this.y = value;
            this.$emit("message", "options-edges-shadow-y", value);
        }
    },
    mounted() {
        console.log("Shadow Edge Accordion Component Mounted")
    },
    components: {
        SwitchWithInfo,
        LabelWithTooltip,
        InputColorPicker,
        InputRange
    },
    emits: ["message", "open-bs-modal"]
}
</script>