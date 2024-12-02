<template>
    <SwitchWithInfo :switchId="'options-edges-arrowStrikethrough'" :switchDisabled="false"
        :switchInitialValue="optionsEdgesArrowStrikethrough" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.ArrowStrikethrough - Quando falso, a aresta para na seta. Isso pode ser útil se você tiver linhas grossas e quiser que a seta termine em um ponto. As setas do meio não são afetadas por isso.'"
        :switchLabelEnabled="true" :switchLabelValue="'Tachamento da seta?'"
        @checkbox-status-changed="emitArrowStriketrhough"></SwitchWithInfo>
    <SwitchWithInfo :switchId="'options-edges-dashes'" :switchDisabled="false" :switchInitialValue="optionsEdgesDashes"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Dashes - Quando verdadeiro, a aresta será desenhada como uma linha tracejada. Você pode personalizar os travessões fornecendo um Array. Matriz formart: Matriz de números, comprimento do intervalo, comprimento do traço, comprimento do intervalo, comprimento do traço, ... etc. A matriz é repetida até que a distância seja preenchida. Ao usar linhas tracejadas em versões do IE anteriores a 11, a linha será desenhada em linha reta, não suave.'"
        :switchLabelEnabled="true" :switchLabelValue="'Traçado'" @checkbox-status-changed="emitDashes"></SwitchWithInfo>
    <div class="border mt-2 mb-2 p-2" v-if="optionsEdgesDashes">
        <SwitchWithInfo :switchId="'options-edges-dashes-object'" :switchDisabled="false"
            :switchInitialValue="optionsEdgesDashesArraySending" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Edges.Dashes (Toggle array sending) - Alterne entre envio de booleano e de vetor.'"
            :switchLabelEnabled="true"
            :switchLabelValue="(optionsEdgesDashesArraySending) ? 'Enviando vetor' : 'Enviando booleano'"
            @checkbox-status-changed="emitDashesArray">
        </SwitchWithInfo>
        <InputGroupWithLabel v-if="optionsEdgesDashesArraySending" :prepend="'Tamanho do traço:'" :append="true"
            :inputType="'number'" :tooltip="'Options.Edges.Dashes[0] - Tamanho do traço.'"
            :inputInitialValue="optionsEdgesDashesArray[0]" @input-value-change="chngeEdgesDashesOf0">
        </InputGroupWithLabel>
        <InputGroupWithLabel v-if="optionsEdgesDashesArraySending" :prepend="'Tamanho do espaço:'" :append="true"
            :inputType="'number'" :tooltip="'Options.Edges.Dashes[1] - Tamanho do espaço.'"
            :inputInitialValue="optionsEdgesDashesArray[1]" @input-value-change="chngeEdgesDashesOf1">
        </InputGroupWithLabel>
    </div>
    <SwitchWithInfo :switchId="'options-edges-hidden'" :switchDisabled="false" :switchInitialValue="optionsEdgesHidden"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Hidden - Quando verdadeiro, a aresta não é desenhada. No entanto, ainda faz parte da simulação de física!'"
        :switchLabelEnabled="true" :switchLabelValue="'Ocultar'" @checkbox-status-changed="emitHidden"></SwitchWithInfo>
    <SwitchWithInfo :switchId="'options-edges-hover-width-function'" :switchDisabled="false"
        :switchInitialValue="optionsEdgesHoverWidthFunctionSending" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.HoverWidth - Quando verdadeiro, a aresta não é desenhada. No entanto, ainda faz parte da simulação de física!'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Largura do foco - ' + ((optionsEdgesHoverWidthFunctionSending) ? 'Enviando função' : 'Enviando número')"
        @checkbox-status-changed="emitHoverWidth"></SwitchWithInfo>
    <div class="border mt-2 mb-2 p-2" v-if="!optionsEdgesHoverWidthFunctionSending">
        <InputGroupWithLabel :prepend="'Largura do foco:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Edges.HoverWidth - Tamanho da largura do foco.'"
            :inputInitialValue="optionsEdgesHoverWidthValue" @input-value-change="changeHoverWidth" :step="0.5">
        </InputGroupWithLabel>
    </div>
    <div class="border mt-2 mb-2 p-2" v-else>
        <InputTextArea :inputId="'options-edges-hoverwidth-function'"
            :inputEnabled="optionsEdgesHoverWidthFunctionInputEnabled"
            :inputInitialValue="optionsEdgesHoverWidthFunctionText" :inputPlaceholder="'//JS code para o hoverWidth'"
            :inputRows="3" :isLabelEnabled="true" :labelValue="'Função para a largura de foco'"
            :tooltip="'Options.Edges.HoverWidth (As function) - Função do tamanho da largura do foco'" :hasSwitch="true"
            :switchId="'options-edges-hoverwidth-funtion-switch'"
            :switchTooltip="'Options.Edges.HoverWidth (As function) - Função do tamanho da largura do foco'"
            :switchDisabled="false" :switchInitialValue="optionsEdgesHoverWidthFunctionSwitchValue"
            :switchLabelEnabled="false" @checkbox-value-change="enableHoverWidthFunction"
            @input-value-change="changeHoverWidthFunction"></InputTextArea>
        <button v-if="optionsEdgesHoverWidthFunctionInputEnabled" type="button" class="btn btn-primary form-control mt-2"
            @click.prevent="sendEdgesHoverWidthFunction">Registrar função</button>
    </div>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
export default {
    name: "Edges Component",
    props: [
        'network',
        'options',
    ],
    data() {
        return {
            localOptions: null,
            localNetwork: null,
            optionsEdgesArrowStrikethrough: true,
            optionsEdgesDashes: false,
            optionsEdgesDashesArraySending: false,
            optionsEdgesDashesArray: [5, 5],
            optionsEdgesHidden: false,
            optionsEdgesHoverWidthFunctionSending: false,
            optionsEdgesHoverWidthValue: 0.5,
            optionsEdgesHoverWidthFunctionText: "",
            optionsEdgesHoverWidthFunctionInputEnabled: false,
            optionsEdgesHoverWidthFunctionSwitchValue: false,
            optionsEdgesHoverWidthFunction: null,
        }
    },
    components: {
        SwitchWithInfo,
        InputGroupWithLabel,
        InputTextArea
    },
    mounted() {
        console.log("Edges Component Mounted");
        this.localNetwork = this.network;
        this.localOptions = this.options;
    },
    methods: {
        emitArrowStriketrhough: function (value) {
            this.optionsEdgesArrowStrikethrough = value;
            this.localOptions.edges.arrowStrikethrough = value;
        },
        emitDashes: function (value) {
            this.optionsEdgesDashes = value;
            this.localOptions.edges.dashes = value;
        },
        emitDashesArray: function (value) {
            this.optionsEdgesDashesArraySending = value;
            if (value) {
                this.localOptions.edges.dashes = this.optionsEdgesDashesArray
            } else {
                this.localOptions.edges.dashes = true;
            }
        },
        chngeEdgesDashesOf0: function (value) {
            this.optionsEdgesDashesArray[0] = value;
            this.localOptions.edges.dashes[0] = value;
        },
        chngeEdgesDashesOf1: function (value) {
            this.optionsEdgesDashesArray[1] = value;
            this.localOptions.edges.dashes[1] = value;
        },
        emitHidden: function (value) {
            this.optionsEdgesHidden = value;
            this.localOptions.edges.hidden = value;
        },
        emitHoverWidth: function (value) {
            this.optionsEdgesHoverWidthFunctionSending = value;
            console.log("hoverwidthvalue " + value);
            if (!value) {
                this.localOptions.edges.hoverWidth = this.optionsEdgesHoverWidthValue;
            } else {
                import('./scripts/edgesHoverWidthFunction.js?raw')
                    .then(res => res.default)
                    .then((t) => {
                        this.optionsEdgesHoverWidthFunctionText = t;
                        this.optionsEdgesHoverWidthFunction = eval(t);

                        if (this.optionsEdgesHoverWidthFunction != null) {
                            this.localOptions.edges.hoverWidth = this.optionsEdgesHoverWidthFunction;
                            this.$emit("send-toast", {
                                toastTitle: "Cuidado",
                                toastIcon: "fa-circle-exclamation",
                                toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                toastClasses: " bg-danger text-black"
                            });
                        }
                    });
            }

        },
        changeHoverWidth: function (value) {
            this.optionsEdgesHoverWidthValue = value;
            this.options.edges.hoverWidth = parseFloat(value);
        },
        enableHoverWidthFunction: function (value) {
            this.optionsEdgesHoverWidthFunctionSwitchValue = value;
            this.optionsEdgesHoverWidthFunctionInputEnabled = value;
        },
        sendEdgesHoverWidthFunction: function () {
            this.optionsEdgesHoverWidthFunction = eval(this.optionsEdgesHoverWidthFunctionText);
            this.localOptions.edges.hoverWidth = this.optionsEdgesHoverWidthFunction;
            this.optionsEdgesHoverWidthFunctionInputEnabled = false;
            this.optionsEdgesHoverWidthFunctionSwitchValue = false;
        },
        changeHoverWidthFunction: function(value) {
            this.optionsEdgesHoverWidthFunctionText = value;
        }
    },
    watch: {
        localOptions: {
            handler: function (newValue, oldValue) {
                this.$emit("options-has-changed", newValue);
            },
            deep: true
        }

    },
    emits: ["options-has-changed", "send-toast"]
}
</script>