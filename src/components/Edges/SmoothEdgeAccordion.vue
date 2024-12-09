<template>
    <p v-if="!checkboxValue" class="m-0">Habilite para começar.</p>
    <SwitchWithInfo v-if="checkboxValue" :switchId="'options-edges-smooth-enabled'" :switchDisabled="false"
        :switchInitialValue="optionsEnabled" :switchTooltipEnabled="true" :switchTooltip="'Options.Edges.Smooth (Toggle false/true) - Quando verdadeiro, a aresta é desenhada como uma ' +
            'curva Bézier dinâmica. O desenho dessas curvas demora mais que o das curvas retas, mas fica melhor. ' +
            'Há uma diferença entre curvas suaves dinâmicas e curvas suaves estáticas. As curvas suaves dinâmicas ' +
            'possuem um nó de suporte invisível que participa da simulação física. Se você tiver muitas arestas, ' +
            'considere escolher um tipo diferente de curvas suaves e dinâmicas para obter melhor desempenho.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(optionsEnabled) ? 'Enviando objeto para a maciez.' : 'Enviando booleano para maciez'"
        @checkbox-status-changed="optionsEnabledChange"></SwitchWithInfo>
    <LabelWithTooltip v-if="checkboxValue && optionsEnabled" :labelValue="'Tipo'"
        :tooltip="'Options.Edges.Smooth.Type - Opções possíveis: \'dinâmico\', \'contínuo\', \'discreto\', \'diagonalCross\', \'straightCross\', \'horizontal\', \'vertical\', \'curvedCW\', \'curvedCCW\', \'cubicBezier\'. Dê uma olhada neste exemplo para ver como são e escolha o que você mais gosta! Ao usar dinâmico, as arestas terão um vértice de suporte invisível guiando a forma. Este vértice faz parte da simulação física.'"
        :forId="'options-edges-smooth-type'" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect v-if="checkboxValue && optionsEnabled" :selectId="'options-edges-smooth-type'" :options="options"
        :disabled="false" @update-selection="updateType"></InputSelect>
    <SwitchWithInfo v-if="checkboxValue && optionsEnabled && type == 'cubicBezier'"
        :switchId="'options-edges-smooth-enabled'" :switchDisabled="false" :switchInitialValue="forceDirection"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Smooth.ForceDirecetion (Toggle false/true) - Opções aceitas: [\'horizontal\', \'vertical\', \'none\']. Esta opção é usada apenas com curvas cúbicas de Bezier. Quando verdadeiro, é escolhido horizontal, quando falso, é usada a direção maior (x distância entre nós vs y distância entre nós). Se a distância x for maior, horizontal. Isso deve ser usado com layouts hierárquicos.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(forceDirection) ? 'Enviando objeto para a forçar a direção.' : 'Enviando booleano para forçar a direção'"
        @checkbox-status-changed="forceDirectionEnabledChange"></SwitchWithInfo>
    <InputSelect v-if="checkboxValue && optionsEnabled && type == 'cubicBezier' && forceDirection"
        :selectId="'options-edges-smooth-forceDirection'" :options="optionsForceDirection" :disabled="false"
        @update-selection="chageForceDirection"></InputSelect>
    <InputRange
        v-if="checkboxValue && optionsEnabled && type != 'dynamic'"
        :inputId="'options-edges-smooth-roundness'"
        :isLabelEnabled="true"
        :min="0"
        :max="1"
        :step="0.1"
        :initialValue="roundness"
        :labelValue="'Arredondamento'"
        :tooltip="'Options.Edges.Smooth.Roundnessa - Faixa aceita: 0 .. 1,0. Este parâmetro ajusta a redondeza das curvas suaves para todos os tipos, EXCETO dinâmicas.'"
        :disabled="false"
        @update-value-from-range-input="changeRoundness"
    ></InputRange>
</template>
<script>
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Smooth Edge Accordion Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data() {
        return {
            optionsEnabled: false,
            options: [
                { value: 'dynamic', label: 'Dinâmico', selected: true },
                { value: 'continuous', label: 'Contínulo', selected: false },
                { value: 'discrete', label: 'Discreto', selected: false },
                { value: 'diagonalCross', label: 'Cruz Diagonal', selected: false },
                { value: 'straightCross', label: 'Cruz Reta', selected: false },
                { value: 'horizontal', label: 'Horizontal', selected: false },
                { value: 'vertical', label: 'Vertical', selected: false },
                { value: 'curvedCW', label: 'Curva CW', selected: false },
                { value: 'curvedCCW', label: 'Curva CCW', selected: false },
                { value: 'cubicBezier', label: 'Bezier Cúbico', selected: false },
            ],
            type: 'dynamic',
            forceDirection: false,
            optionsForceDirection: [
                { value: 'horizontal', label: 'Horizontal', selected: true },
                { value: 'vertical', label: 'Vertical', selected: false },
                { value: 'none', label: 'Nenhum', selected: false },
            ],
            roundness: "0.5"
        }
    },
    mounted() {
        console.log("Smooth Edge Accordion Component Mounted")
    },
    components: {
        SwitchWithInfo,
        InputSelect,
        LabelWithTooltip,
        InputRange
    },
    methods: {
        optionsEnabledChange: function (value) {
            this.optionsEnabled = value;
            this.$emit("message", "options-edges-smooth-enabled", value);
        },
        updateType: function (value) {
            this.type = value;
            this.$emit("message", "options-edges-smooth-type", value);
        },
        forceDirectionEnabledChange: function (value) {
            this.forceDirection = value;
            this.$emit("message", "options-edges-smooth-forceDirection", value);
        },
        chageForceDirection: function (value) {
            this.forceDirection = value;
            this.$emit("message", "options-edges-smooth-forceDirection", value);
        },
        changeRoundness: function(value) {
            this.roundness = value;
            this.$emit("message", "options-edges-smooth-roundness", value);
        }
    },
    emits: ['message', 'open-bs-modal']
}
</script>