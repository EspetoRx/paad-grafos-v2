<template>
    <p class="mt-1 mb-1" v-if="!checkboxValue">Ative para começar</p>
    <SwitchWithInfo v-if="checkboxValue" :switchId="'options-nodes-shadow-object'" :switchDisabled="!checkboxValue"
        :switchInitialValue="enabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.Shadow.Enabled - Alterne a projeção de sombras. Se esta opção não estiver definida, ela será definida como verdadeira se alguma das propriedades deste objeto estiver definida.'"
        :switchLabelEnabled="true" :switchLabelValue="(!enabled) ? 'Enviando booleano' : 'Enviando objeto'"
        @checkbox-status-changed="sendObject"></SwitchWithInfo>
    <LabelWithTooltip v-if="checkboxValue && enabled" :labelValue="'Cor da sombra'"
        :tooltip="'Options.Nodes.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
        :forId="'options-nodes-shadow-color'" :hasSwitch="false"></LabelWithTooltip>
    <InputColorPicker v-if="checkboxValue && enabled" :colorPickerId="'options-nodes-shadow-color'"
        :colorPickerDefaultColor="color"
        :tooltip="'Options.Nodes.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
        :disabled="!checkboxValue" @update-color="sendColor"></InputColorPicker>
    <InputGroupWithLabel v-if="checkboxValue && enabled" :disabled="!checkboxValue" :prepend="'Tamanho da sombra:'"
        :append="true" :inputType="'number'" :tooltip="'Options.Nodes.Shadow.Size - O tamanho do desfoque da sombra.'"
        :inputInitialValue="size" @input-value-change="sendSize"></InputGroupWithLabel>
    <InputGroupWithLabel v-if="checkboxValue && enabled" :disabled="!checkboxValue" :prepend="'Deslocamento x:'"
        :append="true" :inputType="'number'" :tooltip="'Options.Nodes.Shadow.x - Deslocamento em x.'"
        :inputInitialValue="x" @input-value-change="sendX"></InputGroupWithLabel>
    <InputGroupWithLabel v-if="checkboxValue && enabled" :disabled="!checkboxValue" :prepend="'Deslocamento y:'"
        :append="true" :inputType="'number'" :tooltip="'Options.Nodes.Shadow.Y - Deslocamento em Y.'"
        :inputInitialValue="y" @input-value-change="sendY"></InputGroupWithLabel>
</template>
<script>
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
export default {
    name: "Shadow Node Accordion",
    data() {
        return {
            enabled: false,
            color: '#000000',
            size: 10,
            x: 5,
            y: 5
        }
    },
    props: {
        checkboxValue: {
            required: false,
            default: false
        },
        bsOpenModal: Boolean,
        bsModalReturnValue: {}
    },
    methods: {
        sendObject: function (value) {
            this.enabled = value;
            this.$emit("message", "option-nodes-shadow-object", value);
        },
        sendColor: function (value) {
            this.color = value;
            this.$emit("message", "option-nodes-shadow-object-color", value);
        },
        sendSize: function (value) {
            this.size = value;
            this.$emit("message", "option-nodes-shadow-object-size", value);
        },
        sendX: function (value) {
            this.x = value;
            this.$emit("message", "option-nodes-shadow-object-x", value);
        },
        sendY: function (value) {
            this.y = value;
            this.$emit("message", "option-nodes-shadow-object-y", value);
        }
    },
    watch: {
        checkboxValue: function (newValue, oldValue) {
            this.$emit("message", "option-nodes-shadow", newValue);
        }
    },
    mountd() {
        console.log("Shadow Node Accordion Component Mounted");
    },
    components: {
        SwitchWithInfo,
        InputColorPicker,
        LabelWithTooltip,
        InputGroupWithLabel
    },
    emits: ["message", "open-bs-modal"]
}
</script>