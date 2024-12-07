<template>
    <SwitchWithInfo :switchDisabled="false" :switchId="'options-edges-color'"
        :switchInitialValue="colorStringSendingEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Color (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(colorStringSendingEnabled) ? 'Enviando objeto para ' : 'Enviando string'"
        @checkbox-status-changed="changeObjectSending"></SwitchWithInfo>
    <InputText v-if="!colorStringSendingEnabled" :inputId="'options-edges-color-string-input'"
        :inputEnabled="colorStringSendingEnabled" :inputInitialValue="colorStringSendingValue"
        :inputPlaceholder="'Coloque uma cor'" :isLabelEnabled="false"
        :tooltip="'Options.Edges.Color (String sending value) - Defina o valor da string de cor das arestas.'"
        :hasSwitch="false" @input-value-change="updateColorString"></InputText>
    <LabelWithTooltip v-if="colorStringSendingEnabled" :labelValue="'Herdar'"
        :tooltip="'Options.Edges.Color.Inherit. Quando cor, destaque ou foco são definidos, herdar é definido ' +
            'como falso! As opções suportadas são: verdadeiro, falso, \'de\',\'para\',\'ambos\'. O valor padrão ' +
            'é \'de\', que faz o mesmo que verdadeiro: a borda herdará a cor da borda do nó no lado \'de\'. ' +
            'Quando definido como \'to\', a cor da borda do nó \'to\' será usada. Quando definido como \'ambos\', ' +
            'a cor desaparecerá da cor inicial para a cor inicial. \'ambos\' é computacionalmente intensivo porque o gradiente é recalculado a cada redesenho. Isto é necessário porque os ângulos mudam quando os nós se movem.'"
        :forId="'input-select-inherit'" :hasSwitch="false">
    </LabelWithTooltip>
    <InputSelect v-if="colorStringSendingEnabled" :selectId="'input-select-inherit'" :options="[
        { value: false, label: 'Falso', selected: true },
        { value: true, label: 'Verdadeiro', selected: false },
        { value: 'from', label: 'De (From)', selected: false },
        { value: 'to', label: 'Para (To)', selected: false },
        { value: 'both', label: 'Ambos', selected: false },
    ]" :disabled="false" @update-selection="changeInherit"></InputSelect>
    <LabelWithTooltip v-if="colorStringSendingEnabled && (colorInherit == false)" :forId="'options-edges-color-color'" :hasSwitch="false"
        :labelValue="'Selecione a cor das arestas'" :switchDisabled="false"
        :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'">
    </LabelWithTooltip>
    <InputColorPicker v-if="colorStringSendingEnabled && (colorInherit == false)" :colorPickerId="'options-edges-color-color'"
        :colorPickerDefaultColor="colorObjectColor "
        :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'"
        @update-color="sendColor"></InputColorPicker>
    <LabelWithTooltip v-if="colorStringSendingEnabled && (colorInherit == false)" :forId="'options-edges-color-highlight'" :hasSwitch="false"
        :labelValue="'Cor da aresta selecionada'" :switchDisabled="false"
        :tooltip="'Options.Edges.Color.Highlight - A cor da aresta quando está selecionada.'"></LabelWithTooltip>
    <InputColorPicker v-if="colorStringSendingEnabled && (colorInherit == false)" :colorPickerId="'options-edges-color-highlight'"
        :colorPickerDefaultColor="colorHighlight"
        :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'"
        @update-color="sendHighlight"></InputColorPicker>
    <LabelWithTooltip v-if="colorStringSendingEnabled && (colorInherit == false)" :forId="'options-edges-color-hover'" :hasSwitch="false"
        :labelValue="'Cor da aresta c/ mouse pairando'" :switchDisabled="false"
        :tooltip="'Options.Edges.Color.Hover - A cor da aresta quando o mouse passa sobre ela (assumindo que o foco está ativado no módulo de interação).'">
    </LabelWithTooltip>
    <InputColorPicker v-if="colorStringSendingEnabled && (colorInherit == false)" :colorPickerId="'options-edges-color-hover'"
        :colorPickerDefaultColor="colorHover"
        :tooltip="'Options.Edges.Color.Hover - A cor da aresta quando o mouse passa sobre ela (assumindo que o foco está ativado no módulo de interação).'"
        @update-color="sendHover"></InputColorPicker>
    <InputRange v-if="colorStringSendingEnabled" :inputId="'opacity-range'" :isLabelEnabled="true" :min="0" :max="1" :step="0.1" :initialValue="colorOpacity"
            :labelValue="'Opacidade'" :tooltip="'Options.Edges.Color.Opacity - Pode ser útil definir a opacidade de uma aresta sem alterar manualmente todas as cores. A opção de opacidade converterá todas as cores (também ao usar herdar) para aderir à opacidade fornecida. O intervalo permitido da opção de opacidade está entre 0 e 1. Isso é feito apenas uma vez para que o impacto no desempenho não seja muito grande.'"
            @update-value-from-range-input="changeOpacity"
    ></InputRange>
</template>
<script>
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import InputText from '../Common/Inputs/InputText.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Color Edge Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data() {
        return {
            colorStringSendingEnabled: false, //False for String, true for objec
            colorStringSendingValue: "#2B7CE9",
            colorObjectColor: "#2B7CE9",
            colorHighlight: "#2B7CE9",
            colorHover: "#2B7CE9",
            colorInherit: "false",
            colorOpacity: "1"
        }
    },
    components: {
        SwitchWithInfo,
        InputText,
        InputColorPicker,
        LabelWithTooltip,
        InputSelect,
        InputRange
    },
    methods: {
        changeObjectSending: function (value) {
            this.colorStringSendingEnabled = value;
        },
        updateColorString: function (value) {
            this.colorStringSendingValue = value;
            this.$emit("message", "options-edges-color-string", value);
        },
        sendColor: function (value) {
            this.colorObjectColor = value;
            this.$emit("message", "options-edges-color-color", value);
        },
        sendHighlight: function (value) {
            this.colorHighlight = value;
            this.$emit("message", "options-edges-color-highlight", value);
        },
        sendHover: function (value) {
            this.colorHover = value;
            this.$emit("message", "options-edges-color-hover", value);
        },
        changeInherit: function (value) {
            this.colorInherit = value;
            this.$emit("message", "options-edges-color-inherit", value);
        },
        changeOpacity: function (value) {
            this.colorOpacity = value;
            this.$emit("message", "options-edges-color-opacity", parseFloat(value));
        }
    },
    mounted() {
        console.log("Color Edge Component Mounted");
    },
    emits: ['message', 'open-bs-modal']
}
</script>