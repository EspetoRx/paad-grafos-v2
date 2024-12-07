<template>
    <label-tooltip
        :labelValue="'Cor da borda'"
        :tooltip="'Options.Nodes.Color.Border - Configure a cor da borda dos vértices quando não estiver selecionado ou pairado sobre.'"
        :forId="'border-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'border-color-pick'"
        :colorPickerDefaultColor="'#2B7CE9'"
        :tooltip="'Options.Nodes.Color.Border - Configure a cor da borda dos vértices quando não estiver selecionado ou pairado sobre.'"
        @update-color="updateBorderColor"
    ></input-color>
    <label-tooltip
        :labelValue="'Cor de fundo'"
        :tooltip="'Options.Nodes.Color.Background - Configure a cor de background dos vértices quando não estiver selecionado ou pairado sobre.'"
        :forId="'background-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'background-color-pick'"
        :colorPickerDefaultColor="'#97C2FC'"
        :tooltip="'Options.Nodes.Color.Background - Configure a cor de background dos vértices quando não estiver selecionado ou pairado sobre.'"
        @update-color="updateBackgroundColor"
    ></input-color>
    <label-tooltip
        :labelValue="'Cor da borda do vértice selecionado'"
        :tooltip="'Options.Nodes.Color.Highlight.Border - Configure a cor da borda dos vértices quando o vértice estiver selecionado.'"
        :forId="'border-highlight-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'border-highlight-color-pick'"
        :colorPickerDefaultColor="'#2B7CE9'"
        :tooltip="'Options.Nodes.Color.Highlight.Border - Configure a cor da borda dos vértices quando o vértice estiver selecionado.'"
        @update-color="updateHighlightBorderColor"
    ></input-color>
    <label-tooltip
        :labelValue="'Cor de fundo do vértice selecionado'"
        :tooltip="'Options.Nodes.Color.Highlight.Background - Configure a cor de background dos vértices quando o vértice estiver selecionado.'"
        :forId="'background-highlight-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'background-highlight-color-pick'"
        :colorPickerDefaultColor="'#D2E5FF'"
        :tooltip="'Options.Nodes.Color.Highlight.Background - Configure a cor de background dos vértices quando o vértice estiver selecionado.'"
        @update-color="updateHighlightBackgroundColor"
    ></input-color>
    <label-tooltip
        :labelValue="'Cor da borda do vértice pairado'"
        :tooltip="'Options.Nodes.Color.Hover.Border - Configure a cor da borda dos vértices quando o vértice estiver sendo pairado.'"
        :forId="'border-hover-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'border-hover-color-pick'"
        :colorPickerDefaultColor="'#2B7CE9'"
        :tooltip="'Options.Nodes.Color.Hover.Border - Configure a cor da borda dos vértices quando o vértice estiver sendo pairado.'"
        @update-color="updateHoverBorderColor"
    ></input-color>
    <label-tooltip
        :labelValue="'Cor de fundo do vértice pairado'"
        :tooltip="'Options.Nodes.Color.Hover.Background - Configure a cor de background dos vértices quando o vértice estiver pairado sobre.'"
        :forId="'background-hover-color-pick'"
        :hasSwitch="false"
        :switchId="''"
        :switchTooltip="''"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="false"
        :switchLabelValue="''"
    ></label-tooltip>
    <input-color
        :colorPickerId="'background-hover-color-pick'"
        :colorPickerDefaultColor="'#D2E5FF'"
        :tooltip="'Options.Nodes.Color.Hover.Background - Configure a cor de background dos vértices quando o vértice estiver pairado sobre.'"
        @update-color="updateHoverBackgroundColor"
    ></input-color>
</template>
<script>

import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';

export default {
    name: "Nodes Color Component",
    props: ['checkboxValue', 'bsModalReturnValue', 'openBsModal'],
    methods: {
        updateBorderColor: function(value) {
            this.$emit("message", "update-node-color-border", value);
        },
        updateBackgroundColor: function(value) {
            this.$emit("message", "update-node-color-background", value);
        },
        updateHighlightBorderColor: function(value) {
            this.$emit("message", "update-node-highlight-border-color", value);
        },
        updateHighlightBackgroundColor: function(value) {
            this.$emit("message", "update-node-highlight-background-color", value);
        },
        updateHoverBorderColor: function(value) {
            this.$emit("message", "update-node-hover-border-color", value);
        },
        updateHoverBackgroundColor: function(value) {
            this.$emit("message", "update-node-hover-background-color", value);
        },
    },
    components: {
        'label-tooltip': LabelWithTooltip,
        'input-color': InputColorPicker
    },
    emits: ['message', 'open-bs-modal']
}
</script>