<template>
    <SwitchWithInfo :switchId="'send-object-nodes-font-enabled'" :switchDisabled="!this.checkboxValue"
        :switchInitialValue="this.objectEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.Font as Object - Se há a necessidade de somente uma cor nos vértices, use a forma de string {tamanho fonte cor}. Desative o marcador para alternar entre string e objeto.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(this.objectEnabled) ? 'Usando Fonte como Objeto' : 'Usando Fonte como String'"
        @checkbox-status-changed="changeOptionsEnabledToggled"></SwitchWithInfo>
    <div v-if="this.objectEnabled">
        <label-tooltip :labelValue="'Cor da fonte'"
            :tooltip="'Options.Nodes.Font.Color - Altere a cor da fonte dos rótulos dos vértices.'"
            :forId="'node-label-node-font-color'" :hasSwitch="false"></label-tooltip>
        <color-picker :colorPickerId="'node-label-node-font-color'" :colorPickerDefaultColor="this.fontColor"
            :tooltip="'Options.Nodes.Font.Color - Altere a cor da fonte dos rótulos dos vértices.'" :disabled="!this.checkboxValue"
            @update-color="updateBorderColor"></color-picker>
        <InputRange :inputId="'size-range'" :isLabelEnabled="true" :min="1" :max="50" :step="1" :initialValue="this.size"
            :labelValue="'Tamanho'" :tooltip="'Options.Nodes.Font.Size - Tamanho da fonte do rótulo dos vértices'"
            @update-value-from-range-input="emitSizeUpdate" :disabled="!this.checkboxValue"></InputRange>
        <label-tooltip :labelValue="'Fonte'"
            :tooltip="'Options.Nodes.Font.Face - Altere o tipo da fonte dos rótulos dos vértices.'"
            :forId="'options-nodes-font-face'" :hasSwitch="false"></label-tooltip>
        <InputSelect :selectId="'options-nodes-font-face'" :disabled="!this.checkboxValue" :options="[
            { value: 'arial', label: 'Arial', selected: true },
            { value: 'verdana', label: 'Verdana', selected: false },
            { value: 'tahoma', label: 'Tahoma', selected: false },
            { value: 'Trebuchet MS', label: 'Trebuchet MS', selected: false },
            { value: 'Times New Roman', label: 'Times New Roman', selected: false },
            { value: 'Georgia', label: 'Georgia', selected: false },
            { value: 'Geramond', label: 'Geramond', selected: false },
            { value: 'Courier New', label: 'Courier New', selected: false },
            { value: 'Brush Script MT', label: 'Brush Script MT', selected: false }
        ]" @update-selection="updateNodesFontFace"></InputSelect>
        <label-tooltip :labelValue="'Cor de Plano de fundo'"
            :tooltip="'Options.Nodes.Font.Background - Altere o plano de fundo da fonte dos rótulos dos vértices.'"
            :forId="'options-nodes-font-background'" :hasSwitch="true" :switchId="'options-nodes-font-background'"
            :switchTooltip="'Toggle Font Background On/Off. Altere entre a ativação do plano de fundo dos rótulos dos vértices.'"
            :switchDisabled="!this.checkboxValue" :switchInitialValue="false" :switchLabelEnabled="false" :switchLabelValue="''"
            @checkbox-status-changed="updateEnableFontBackground"></label-tooltip>
        <color-picker v-if="this.fontBackgroundEnabled" :colorPickerId="'options-nodes-font-background'"
            :colorPickerDefaultColor="'#ffffff'"
            :tooltip="'Options.Nodes.Font.Background - Altere a cor do plano de fundo da fonte dos rótulos dos vértices.'"
            :disabled="!this.checkboxValue"
            @update-color="updateFontBackgroundColor"></color-picker>
        <InputRange :inputId="'stroke-size-range'" :isLabelEnabled="true" :min="0" :max="30" :step="1" :initialValue="0"
            :labelValue="'Tamanho da borda do rótulo'"
            :tooltip="'Options.Nodes.Font.StrokeWidth - Tamanho da borda da fonte do rótulo dos vértices'"
            :disabled="!this.checkboxValue"
            @update-value-from-range-input="emitStrokeWidthUpdate"></InputRange>
        <label-tooltip v-if="this.strokeWidthValue > 0" :labelValue="'Cor da borda do rótulo'"
            :tooltip="'Options.Nodes.Font.StrokeColor - Altere a cor da borda da fonte do rótudo dos vértices.'"
            :forId="'options-nodes-font-strokeColor'" :hasSwitch="false"></label-tooltip>
        <color-picker v-if="this.strokeWidthValue > 0" :colorPickerId="'options-nodes-font-strokeColor'"
            :colorPickerDefaultColor="this.strokeColor"
            :tooltip="'Options.Nodes.Font.StrokeColor - Altere a cor da borda da fonte do rótudo dos vértices.'"
            @update-color="updateNodesFontStrokeColor"></color-picker>
    </div>
    <div v-else>
        <InputText
            :inputId="'input-nodes-font'"
            :inputEnabled="!this.checkboxValue"
            :inputInitialValue="this.stringFont"
            :inputPlaceholder="'size face color'"
            :isLabelEnabled="true"
            :labelValue="'String de estilização de fonte'"
            :tooltip="'Options.Nodes.Font - Altere a fonte dos vértices em seu tamanho fonte e cor da mesma forma da string mostrada.'"
            :hasSwitch="false"
            @input-value-change="nodesFontValueChanged"
        ></InputText>
    </div>
</template>
<script>

import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputText from '../Common/Inputs/InputText.vue';

export default {
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data() {
        return {
            objectEnabled: true,
            fontColor: "#000000",
            fontFace: "arial",
            size: '14',
            fontBackgroundColor: undefined,
            fontBackgroundEnabled: false,
            strokeWidthValue: 0,
            strokeColor: "#ffffff",
            stringFont: "15px arial black"
        }
    },
    components: {
        'color-picker': InputColorPicker,
        'label-tooltip': LabelWithTooltip,
        InputRange,
        InputSelect,
        SwitchWithInfo,
        InputText
    },
    methods: {
        changeOptionsEnabledToggled: function (value) {
            this.objectEnabled = value;
            this.$emit("message", "node-font-object-enabled", value)
        },
        nodesFontValueChanged: function (value) {
            if (!this.objectEnabled) {
                this.stringFont = value;
                this.$emit("message", 'node-font-string', value);
            }
        },
        updateBorderColor: function (value) {
            if (this.objectEnabled) {
                this.fontColor = value;
                this.$emit("message", "node-font-color", value);
            }
        },
        emitSizeUpdate: function (value) {
            if (this.objectEnabled) {
                this.size = parseInt(value);
                this.$emit("message", "node-font-size", value);
            }
        },
        updateNodesFontFace: function (value) {
            if (this.objectEnabled){
                this.fontFace = value;
                this.$emit("message", "node-font-face", value);
            }
        },
        updateEnableFontBackground: function (value) {
            if (this.objectEnabled) {
                this.fontBackgroundEnabled = value;
                this.$emit("message", "enable-font-background", value);
            }
        },
        updateFontBackgroundColor: function (value) {
            if (this.objectEnabled) {
                this.fontBackgroundColor = value;
                this.$emit("message", "node-font-background", value);
            }
        },
        emitStrokeWidthUpdate: function (value) {
            if (this.objectEnabled) {
                this.strokeWidthValue = parseInt(value);
                this.$emit("message", "node-stroke-width", value);
            }
        },
        updateNodesFontStrokeColor: function (value) {
            if (this.objectEnabled) {
                this.strokeColor = value;
                this.$emit("message", "node-stroke-color", value);
            }
        }
    },
    emits: ['message', 'open-bs-modal']
}
</script>