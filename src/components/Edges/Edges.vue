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
    <div class="border mt-1 mb-1 p-2" v-if="optionsEdgesDashes">
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
    <div v-if="!optionsEdgesHoverWidthFunctionSending">
        <InputGroupWithLabel :prepend="'Largura do foco:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Edges.HoverWidth - Tamanho da largura do foco.'"
            :inputInitialValue="optionsEdgesHoverWidthValue" @input-value-change="changeHoverWidth" :step="0.5">
        </InputGroupWithLabel>
    </div>
    <div class="border mt-1 mb-1 p-1" v-else>
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
        <button v-if="optionsEdgesHoverWidthFunctionInputEnabled" type="button"
            class="btn btn-primary form-control mt-2" @click.prevent="sendEdgesHoverWidthFunction">Registrar
            função</button>
    </div>
    <SwitchWithInfo :switchId="'options-edges-label-highlight-bold'" :switchDisabled="false"
        :switchInitialValue="optionsEdgesLabelHighlightBold" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.LabelHighlightBold - Determina se o rótulo fica em negrito ou não quando a borda é selecionada.'"
        :switchLabelEnabled="true" :switchLabelValue="'Destaque do rótulo em negrito'"
        @checkbox-status-changed="emitLabelHighlightBold"></SwitchWithInfo>
    <InputGroupWithLabel :prepend="'Comprimento da mola:'" :append="true" :inputType="'number'"
        :tooltip="'Options.Edges.length - A simulação física dá às arestas um comprimento de mola. Esse valor pode substituir o comprimento da mola em repouso.'"
        :inputInitialValue="optionsEdgesLength" @input-value-change="changeLength" :step="0.5">
    </InputGroupWithLabel>
    <SwitchWithInfo :switchId="'options-edges-selectionWidth-choice'" :switchDisabled="false"
        :switchInitialValue="optionsEdgesSelectionWidthFunctionSending" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.SelectionWidth (Toggle function/number sending) - A selectionWidth determina a largura da aresta quando a aresta é selecionada. Se um número for fornecido, esse número será adicionado à largura.'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Largura da seleção - ' + ((optionsEdgesSelectionWidthFunctionSending) ? 'Enviando objeto' : 'Enviando número')"
        @checkbox-status-changed="toggleSelectionWidth"></SwitchWithInfo>
    <div class="border mt-1 mb-1 p-1" v-if="optionsEdgesSelectionWidthFunctionSending">
        <InputTextArea :inputId="'options-edges-selectionWidth-function'"
            :inputEnabled="optionsEdgesSelectionWidthSwithcValue"
            :inputInitialValue="optionsEdgesSelectionWidthValueFunctionText"
            :inputPlaceholder="'//JS code para o hoverWidth'" :inputRows="3" :isLabelEnabled="true"
            :labelValue="'Função para largura da seleção'"
            :tooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
            :hasSwitch="true" :switchId="'options-edges-selectionWidth-function-switch'"
            :switchTooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
            :switchDisabled="false" :switchInitialValue="optionsEdgesSelectionWidthSwithcValue"
            :switchLabelEnabled="false" @checkbox-value-change="enableSelectionWidthFunction"
            @input-value-change="changeSelectionWidthFunctionValue"></InputTextArea>
        <button v-if="optionsEdgesSelectionWidthSwithcValue" type="button" class="btn btn-primary form-control mt-2"
            @click.prevent="sendEdgesSelectionWidthFunction">Registrar
            função</button>
    </div>
    <div v-else>
        <InputGroupWithLabel :prepend="'Valor da largura de seleção:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Edges.SelectionWidth (Number value) - A selectionWidth determina a largura da aresta quando a aresta é selecionada. Se um número for fornecido, esse número será adicionado à largura.'"
            :inputInitialValue="optionsEdgesSelectionWidthValue" @input-value-change="changeSelectionWidthValue"
            :step="0.5"></InputGroupWithLabel>
    </div>
    <InputGroupWithLabel :prepend="'Largura:'" :append="true" :inputType="'number'"
        :tooltip="'Options.Edges.Width - A largura da aresta. Se o valor for definido, ele não será usado.'"
        :inputInitialValue="optionsEdgesWidth" @input-value-change="changeWidth"
        :step="0.5"></InputGroupWithLabel>
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
            optionsEdgesLabelHighlightBold: true,
            optionsEdgesLength: undefined,
            optionsEdgesPhysics: true,
            optionsEdgesSelectionWidthFunctionSending: false,
            optionsEdgesSelectionWidthValue: 1,
            optionsEdgesSelectionWidthSwitchEnabled: true,
            optionsEdgesSelectionWidthSwithcValue: false,
            optionsEdgesSelectionWidthValueFunctionText: "",
            optionsEdgesSelectionWidthValueFunction: null,
            optionsEdgesWidth: 1,
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
        changeHoverWidthFunction: function (value) {
            this.optionsEdgesHoverWidthFunctionText = value;
        },
        emitLabelHighlightBold: function (value) {
            this.optionsEdgesLabelHighlightBold = value;
            this.localOptions.edges.labelHighlightBold = value;
        },
        changeLength: function (value) {
            if (!isNaN(value) && !isNaN(parseFloat(value))) {
                this.optionsEdgesLength = value;
                this.localOptions.edges.length = value;
            } else {
                this.optionsEdgesLength = undefined;
                this.localOptions.edges.length = undefined;
            }
        },
        emitPhysics: function (value) {
            this.optionsEdgesPhysics = value;
            this.localOptions.edges.physics = value;
        },
        toggleSelectionWidth: function (value) {
            this.optionsEdgesSelectionWidthFunctionSending = value;
            if (value) {
                import('./scripts/edgesSelectedWidthFunction.js?raw')
                    .then(res => res.default)
                    .then((t) => {
                        this.optionsEdgesSelectionWidthValueFunctionText = t;
                        this.optionsEdgesSelectionWidthValueFunction = eval(t);

                        if (this.optionsEdgesSelectionWidthValueFunction != null) {
                            this.localOptions.edges.selectionWidth = this.optionsEdgesSelectionWidthValueFunction;
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
        changeSelectionWidthValue: function (value) {
            this.optionsEdgesSelectionWidthValue = parseFloat(value);
            this.localOptions.edges.selectionWidth = parseFloat(value);
        },
        enableSelectionWidthFunction: function (value) {
            this.optionsEdgesSelectionWidthSwithcValue = value;
        },
        changeSelectionWidthFunctionValue: function (value) {
            this.optionsEdgesSelectionWidthValueFunctionText = value;
        },
        sendEdgesSelectionWidthFunction: function () {
            this.optionsEdgesSelectionWidthSwithcValue = false;
            this.optionsEdgesSelectionWidthValueFunction = eval(this.optionsEdgesSelectionWidthValueFunctionText);
            this.options.edges.selectionWidth = this.optionsEdgesSelectionWidthValueFunction;
        },
        changeWidth: function (value) {
            this.optionsEdgesWidth = parseFloat(value);
            this.options.edges.width = parseFloat(value);
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