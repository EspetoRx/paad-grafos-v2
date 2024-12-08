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
            :inputEnabled="optionsEdgesSelectionWidthSwitchValue"
            :inputInitialValue="optionsEdgesSelectionWidthValueFunctionText"
            :inputPlaceholder="'//JS code para o hoverWidth'" :inputRows="3" :isLabelEnabled="true"
            :labelValue="'Função para largura da seleção'"
            :tooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
            :hasSwitch="true" :switchId="'options-edges-selectionWidth-function-switch'"
            :switchTooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
            :switchDisabled="false" :switchInitialValue="optionsEdgesSelectionWidthSwitchValue"
            :switchLabelEnabled="false" @checkbox-value-change="enableSelectionWidthFunction"
            @input-value-change="changeSelectionWidthFunctionValue"></InputTextArea>
        <button v-if="optionsEdgesSelectionWidthSwitchValue" type="button" class="btn btn-primary form-control mt-2"
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
        :inputInitialValue="optionsEdgesWidth" @input-value-change="changeWidth" :step="0.5" :disabled="optionsEdgesScalingSwitchValue"></InputGroupWithLabel>
    <AccordionFlush :id="'first-accordion'" :accordionItems="firstAccordionItems"
        :accordionItemsComponents="firstAccordionItemsComponents" class="mt-2"
        @toggle-switch-event="accordionToggleSwitchEvent" @message="message" @open-bs-modal="openBsModal"
        :bsModalReturnValue="bsModalReturnValue">
    </AccordionFlush>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import AccordionFlush from '../Common/AccordionFlush.vue';
export default {
    name: "Edges Component",
    props: [
        'network',
        'options',
        'edges',
        'bsModalReturnValue'
    ],
    data() {
        return {
            localOptions: null,
            localNetwork: null,
            localEdges: null,
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
            optionsEdgesSelectionWidthSwitchValue: false,
            optionsEdgesSelectionWidthValueFunctionText: "",
            optionsEdgesSelectionWidthValueFunction: null,
            optionsEdgesWidth: 1,
            firstAccordionItems: [],
            firstAccordionItemsComponents: [],
            optionsEdgesArrowSwitchCheck: false,
            optionsEdgesArrowsString: '',
            optionsEdgesArrows: {
                from: {
                    enabled: false,
                },
                middle: {
                    enabled: false,
                },
                to: {
                    enabled: false,
                }
            },
            optionsImageHeightEnabled: {
                from: false,
                middle: false,
                to: false
            },
            optionsImageWidthEnabled: {
                from: false,
                middle: false,
                to: false
            },
            optionsEdgesEndPointOffsetSwitchChecked: false,
            optionsEdgesEndpointOffset: null,
            optionsEdgesChosenSwitchChecked: true,
            awatingResponse: [],
            optionsEdgesFontSwitchValue: false,
            optionsEdgesFontString: "",
            optionsEdgesScalingSwitchValue: false,
        }
    },
    components: {
        SwitchWithInfo,
        InputGroupWithLabel,
        InputTextArea,
        AccordionFlush
    },
    mounted() {
        console.log("Edges Component Mounted");
        this.localNetwork = this.network;
        this.localOptions = this.options;
        this.localEdges = this.edges;

        this.firstAccordionItemsComponents.push({ item: 'arrows', component: 'edges.arrows' });
        this.firstAccordionItems.push(
            {
                item: 'arrows',
                title: 'Setas',
                switch: true,
                isChecked: this.optionsEdgesEndPointOffsetSwitchChecked,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Para desenhar uma seta com configurações padrão, uma string pode ser fornecida. Por ' +
                    'exemplo: <code>arrows:\'to, from, middle\'</code> ou <code>\'to;from\'</code>' +
                    ', qualquer combinação com qualquer símbolo separador está bem. Se quiser controlar ' +
                    'o tamanho das pontas das setas, você pode fornecer um objeto'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'endPointOffset', component: 'edges.endPointOffset' });
        this.firstAccordionItems.push(
            {
                item: 'endPointOffset',
                title: 'Deslocamento do ponto final',
                switch: true,
                isChecked: this.optionsEdgesArrowSwitchCheck,
                isCheckedEnabled: this.optionsEdgesArrowStrikethrough,
                hasTooltip: true,
                tooltip: 'Ajuste os pontos finais. Pode ser útil se você quiser que os pontos finais sejam' +
                    ' colocados nas bordas dos nós. Este recurso só é possível quando o arrowStrikethrough for verdadeiro.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'chosen', component: 'edges.chosen' });
        this.firstAccordionItems.push(
            {
                item: 'chosen',
                title: 'Escolhido',
                switch: true,
                isChecked: this.optionsEdgesChosenSwitchChecked,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Quando verdadeiro, selecionar ou passar o mouse sobre uma borda irá alterá-la' +
                    ' e as características de seu rótulo de acordo com o padrão. Quando falso, nenhuma alteração na ' +
                    'aresta ou em seu rótulo ocorrerá quando a aresta for escolhida. Se um objeto for fornecido, um ' +
                    'ajuste mais refinado das características da borda e da etiqueta estará disponível quando uma borda for escolhida.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'color', component: 'edges.color' });
        this.firstAccordionItems.push(
            {
                item: 'color',
                title: 'Cor',
                switch: false,
                hasTooltip: true,
                tooltip: 'O objeto de cor contem as informações de cor da aresta em todas as situações. ' +
                    ' Quando as arestas somente precisam de uma única cor, um valor de cor \'rbg(120, 32, 14)\',  ' +
                    '\'#ffffff\' ou \'red\' pode ser aplicado ao invés de um objeto.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'font', component: 'edges.font' });
        this.firstAccordionItems.push(
            {
                item: 'font',
                title: 'Fonte',
                switch: true,
                isChecked: this.optionsEdgesFontSwitchValue,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Esse objeto define os detalhes do rótulo. Um versão curta também é suportada na forma ' +
                    ' \'size face color\' por exemplo \'14px arial red\'.' 
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'scaling', component: 'edges.scaling' });
        this.firstAccordionItems.push(
            {
                item: 'scaling',
                title: 'Dimensionamento',
                switch: true,
                isChecked: this.optionsEdgesScalingSwitchValue,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Se a opção de valor for especificada, a largura das bordas será dimensionada de acordo com as propriedades deste objeto. Lembre-se de que ao usar o dimensionamento, a opção de largura é negligenciada.' 
            }
        );
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
            this.optionsEdgesSelectionWidthSwitchValue = value;
        },
        changeSelectionWidthFunctionValue: function (value) {
            this.optionsEdgesSelectionWidthValueFunctionText = value;
        },
        sendEdgesSelectionWidthFunction: function () {
            this.optionsEdgesSelectionWidthSwitchValue = false;
            this.optionsEdgesSelectionWidthValueFunction = eval(this.optionsEdgesSelectionWidthValueFunctionText);
            this.localOptions.edges.selectionWidth = this.optionsEdgesSelectionWidthValueFunction;
        },
        changeWidth: function (value) {
            this.localOptionsoptionsEdgesWidth = parseFloat(value);
            this.localOptions.edges.width = parseFloat(value);
        },
        accordionToggleSwitchEvent: function (id, value) {
            if (id == 'arrows') {
                this.optionsEdgesArrowSwitchCheck = value;
                if (!value && Object.hasOwn(this.localOptions.edges, "arrows")) {
                    this.optionsEdgesArrows.from.enabled = false;
                    this.optionsEdgesArrows.middle.enabled = false;
                    this.optionsEdgesArrows.to.enabled = false;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (id == 'endPointOffset') {
                if (this.optionsEdgesArrowStrikethrough) {
                    if (!value && Object.hasOwn(this.localOptions.edges, 'endPointOffset')) {
                        this.optionsEdgesEndpointOffset = 0;
                        this.localOptions.edges.endPointOffset = { from: 0, to: 0 };
                    } else {
                        this.optionsEdgesEndpointOffset = {};
                        this.localOptions.edges.endPointOffset = this.optionsEdgesEndpointOffset;
                    }
                }
            }
            if (id == 'chosen') {
                if (!value && this.optionsEdgesChosenSwitchChecked) {
                    this.optionsEdgesChosenSwitchChecked = value;
                    this.awatingResponse.push("repaint_canvas_edges_chosen_unselecting");
                    this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                } else if (value && !this.optionsEdgesChosenSwitchChecked) {
                    this.optionsEdgesChosenSwitchChecked = value;
                    this.awatingResponse.push("repaint_canvas_edges_chosen_selecting");
                    this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                }
            }
            if (id == 'font') {
                this.optionsEdgesFontSwitchValue = value;
                if (this.optionsEdgesFontString != "") {
                    this.localOptions.edges.font = this.optionsEdgesFontString;
                }
            }
            if (id == 'scaling') {
                this.optionsEdgesScalingSwitchValue = value;
                this.firstAccordionItems[5].isChecked = this.optionsEdgesScalingSwitchValue;
                if (value) {
                    this.awatingResponse.push("repaint_canvas_edges_scaling_selecting");
                } else {
                    this.awatingResponse.push("repaint_canvas_edges_scaling_unselecting");
                }
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
        },
        message: function (message, value) {
            console.log("Message: " + message + " Value: " + value);
            if (message == 'send-toast') this.$emit('send-toast', value);
            if (message == 'repaint-component') this.$emit("canvas-key-change", true);
            if (message == 'arrow-string-changed') {
                this.optionsEdgesArrowsString = value;
                this.localOptions.edges.arrows = value;
            }
            if (message == 'options-edges-arrows-disabled') {
                this.optionsEdgesArrows.from.enabled = false;
                this.optionsEdgesArrows.middle.enabled = false;
                this.optionsEdgesArrows.to.enabled = false;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-from-enabled') {
                this.optionsEdgesArrows.from.enabled = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-middle-enabled') {
                this.optionsEdgesArrows.middle.enabled = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-to-enabled') {
                this.optionsEdgesArrows.to.enabled = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-from-image-height-enabled') {
                this.optionsImageHeightEnabled.from = value;
                if (!value) {
                    delete this.optionsEdgesArrows.from.imageHeight;
                    delete this.localOptions.edges.arrows.from.imageHeight;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-middle-image-height-enabled') {
                this.optionsImageHeightEnabled.middle = value;
                if (!value) {
                    delete this.optionsEdgesArrows.middle.imageHeight;
                    delete this.localOptions.edges.arrows.middle.imageHeight;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-to-image-height-enabled') {
                this.optionsImageHeightEnabled.to = value;
                if (!value) {
                    delete this.optionsEdgesArrows.middle.imageHeight;
                    delete this.localOptions.edges.arrows.middle.imageHeight;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-from-image-height-value') {
                if (this.optionsImageHeightEnabled.from) {
                    this.optionsEdgesArrows.from.imageHeight = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-middle-image-height-value') {
                if (this.optionsImageHeightEnabled.middle) {
                    this.optionsEdgesArrows.middle.imageHeight = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-to-image-height-value') {
                if (this.optionsImageHeightEnabled.to) {
                    this.optionsEdgesArrows.to.imageHeight = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-from-image-width-enabled') {
                this.optionsImageWidthEnabled.from = value;
                if (!value) {
                    delete this.optionsEdgesArrows.from.imageWidth;
                    delete this.localOptions.edges.arrows.from.imageWidth;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-middle-image-width-enabled') {
                this.optionsImageWidthEnabled.middle = value;
                if (!value) {
                    delete this.optionsEdgesArrows.middle.imageWidth;
                    delete this.localOptions.edges.arrows.middle.imageWidth;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-to-image-width-enabled') {
                this.optionsImageWidthEnabled.to = value;
                if (!value) {
                    delete this.optionsEdgesArrows.to.imageWidth;
                    delete this.localOptions.edges.arrows.to.imageWidth;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-arrows-from-image-width-value') {
                if (this.optionsImageWidthEnabled.from) {
                    this.optionsEdgesArrows.from.imageWidth = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-middle-image-width-value') {
                if (this.optionsImageWidthEnabled.middle) {
                    this.optionsEdgesArrows.middle.imageWidth = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-to-image-width-value') {
                if (this.optionsImageWidthEnabled.to) {
                    this.optionsEdgesArrows.to.imageWidth = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-from-scale-factor') {
                this.optionsEdgesArrows.from.scaleFactor = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-middle-scale-factor') {
                this.optionsEdgesArrows.middle.scaleFactor = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-to-scale-factor') {
                this.optionsEdgesArrows.to.scaleFactor = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-from-type') {
                this.optionsEdgesArrows.from.type = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-middle-type') {
                this.optionsEdgesArrows.middle.type = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-to-type') {
                this.optionsEdgesArrows.to.type = value;
                this.localOptions.edges.arrows = this.optionsEdgesArrows;
            }
            if (message == 'options-edges-arrows-from-src') {
                if (this.optionsEdgesArrows.from.type == 'image') {
                    this.optionsEdgesArrows.from.src = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-middle-src') {
                if (this.optionsEdgesArrows.middle.type == 'image') {
                    this.optionsEdgesArrows.middle.src = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-arrows-to-src') {
                if (this.optionsEdgesArrows.to.type == 'image') {
                    this.optionsEdgesArrows.to.src = value;
                    this.localOptions.edges.arrows = this.optionsEdgesArrows;
                }
            }
            if (message == 'options-edges-endpointoffset-from') this.localOptions.edges.endPointOffset.from = value;
            if (message == 'options-edges-endpointoffset-to') this.localOptions.edges.endPointOffset.to = value;
            if (message == 'options-edges-chosen-edge-function') {
                if (typeof this.localOptions.edges.chosen == "boolean") {
                    this.localOptions.edges.chosen = { edge: true };
                }
            }
            if (message == 'options-edges-chosen-edge-function-value') {
                if (!Object.hasOwn(typeof this.localOptions.edges, 'chosen')) {
                    this.localOptions.edges.chosen = {};
                    this.localOptions.edges.chosen.edge = value;
                    this.$emit("canvas-key-change", true);
                } else {
                    this.localOptions.edges.chosen.edge = value;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-chosen-label-function') {
                if (typeof this.localOptions.edges.chosen == "boolean") {
                    this.localOptions.edges.chosen = { label: true };
                }
            }
            if (message == 'options-edges-chosen-label-function-value') {
                if (!Object.hasOwn(typeof this.localOptions.edges, 'chosen')) {
                    this.localOptions.edges.chosen = {};
                    this.localOptions.edges.chosen.label = value;
                    this.$emit("canvas-key-change", true);
                } else {
                    this.localOptions.edges.chosen.label = value;
                    this.$emit("canvas-key-change", true);
                }
            }
            if (message == 'options-edges-color-string') this.localOptions.edges.color = value;
            if (message == 'options-edges-color-color') {
                if (typeof this.localOptions.edges.color === 'string' || this.localOptions.edges.color instanceof String) {
                    this.localOptions.edges.color = {};
                }
                this.localOptions.edges.color.color = value;
            }
            if (message == 'options-edges-color-highlight') {
                if (typeof this.localOptions.edges.color === 'string' || this.localOptions.edges.color instanceof String) {
                    this.localOptions.edges.color = {};
                }
                this.localOptions.edges.color.highlight = value;
            }
            if (message == 'options-edges-color-hover') {
                if (typeof this.localOptions.edges.color === 'string' || this.localOptions.edges.color instanceof String) {
                    this.localOptions.edges.color = {};
                }
                this.localOptions.edges.color.hover = value;
            }
            if (message == 'options-edges-color-inherit') {
                if (typeof this.localOptions.edges.color === 'string' || this.localOptions.edges.color instanceof String) {
                    this.localOptions.edges.color = {};
                }
                if (value != false) {
                    this.localOptions.edges.color = {};
                    this.localOptions.edges.color.inherit = value;
                }
            }
            if (message == 'options-edges-color-opacity') {
                if (typeof this.localOptions.edges.color === 'string' || this.localOptions.edges.color instanceof String) {
                    this.localOptions.edges.color = {};
                }
                this.localOptions.edges.color.opacity = value;
            }
            if (message == 'options-edges-font-string-value') this.localOptions.edges.font = value;
            if (message == 'options-edges-font-object-sending') this.localOptions.edges.font = {};
            if (message == 'options-edges-font-color') this.localOptions.edges.font.color = value;
            if (message == 'options-edges-font-size') this.localOptions.edges.font.size = parseInt(value);
            if (message == 'options-edges-font-face') this.localOptions.edges.font.face = value;
            if (message == 'options-edges-font-background-enabled') if (!value) delete this.localOptions.edges.font.background;
            if (message == 'options-edges-font-background-color') this.localOptions.edges.font.background = value;
            if (message == "options-edges-font-strokeWidth") this.localOptions.edges.font.strokeWidth = parseFloat(value);
            if (message == "options-edges-font-strokeColor") this.localOptions.edges.font.strokeColor = value;
            if (message == 'options-edges-font-align') this.localOptions.edges.font.align = value;
            if (message == 'options-edges-font-vadjust') this.localOptions.edges.font.vadjust = parseFloat(value);
            if (message == 'options-edges-font-multi-enabled') this.localOptions.edges.font.multi = value;
            if (message == 'options-edges-font-multi') this.localOptions.edges.font.multi = value;
            if (message == 'update-checkbox-accordion-bold') {if (!value) this.localOptions.edges.font.bold = "";}
            if (message == 'options-edges-font-object-sending-bold') this.localOptions.edges.font.bold = value;
            if (message == 'options-edges-font-object-sending-ital') this.localOptions.edges.font.ital = value;
            if (message == 'options-edges-font-object-sending-boldital') this.localOptions.edges.font.boldital = value;
            if (message == 'options-edges-font-object-sending-mono') this.localOptions.edges.font.mono = value;
            if (message == 'options-edges-font-string-bold') this.localOptions.edges.font.bold = value;
            if (message == 'options-edges-font-string-ital') this.localOptions.edges.font.ital = value;
            if (message == 'options-edges-font-string-boldital') this.localOptions.edges.font.boldital = value;
            if (message == 'options-edges-font-string-mono') this.localOptions.edges.font.mono = value;
            if (message == 'options-edges-font-color-bold') this.localOptions.edges.font.bold.color = value;
            if (message == 'options-edges-font-color-ital') this.localOptions.edges.font.ital.color = value;
            if (message == 'options-edges-font-color-boldital') this.localOptions.edges.font.boldital.color = value;
            if (message == 'options-edges-font-color-mono') this.localOptions.edges.font.mono.color = value;
            if (message == 'options-edges-font-size-bold') this.localOptions.edges.font.bold.size = parseFloat(value);
            if (message == 'options-edges-font-size-ital') this.localOptions.edges.font.ital.size = parseFloat(value);
            if (message == 'options-edges-font-size-boldital') this.localOptions.edges.font.boldital.size = parseFloat(value);
            if (message == 'options-edges-font-size-mono') this.localOptions.edges.font.mono.size = parseFloat(value);
            if (message == 'options-edges-font-face-bold') this.localOptions.edges.font.bold.face = value;
            if (message == 'options-edges-font-face-ital') this.localOptions.edges.font.ital.face = value;
            if (message == 'options-edges-font-face-boldital') this.localOptions.edges.font.boldital.face = value;
            if (message == 'options-edges-font-face-mono') this.localOptions.edges.font.mono.face = value;
            if (message == 'options-edges-font-mod-bold') this.localOptions.edges.font.bold.mod = value;
            if (message == 'options-edges-font-mod-ital') this.localOptions.edges.font.ital.mod = value;
            if (message == 'options-edges-font-mod-boldital') this.localOptions.edges.font.boldital.mod = value;
            if (message == 'options-edges-font-mod-mono') this.localOptions.edges.font.mono.mod = value;
            if (message == 'options-edges-font-vadjust-bold') this.localOptions.edges.font.bold.vadjust = parseFloat(value);
            if (message == 'options-edges-font-vadjust-ital') this.localOptions.edges.font.ital.vadjust = parseFloat(value);
            if (message == 'options-edges-font-vadjust-boldital') this.localOptions.edges.font.boldital.vadjust = parseFloat(value);
            if (message == 'options-edges-font-vadjust-mono') this.localOptions.edges.font.mono.vadjust = parseFloat(value);
            if (message == 'options-edges-scaling-min' && !(this.awatingResponse.length > 0)) this.localOptions.edges.scaling.min = parseInt(value);
            if (message == 'update-checkbox-accordion-scalingLabel') {this.localOptions.edges.scaling.label = { enabled: true, min: 14, max: 30, maxVisible: 30,  drawThreshold: 5 }; this.$emit('canvas-key-change', true) };
            if (message == 'options-edges-scaling-object-sending-scalingLabel') this.localOptions.edges.scaling.label = { enabled: true };
            if (message == 'options-edges-scaling-object-min-scalingLabel') this.localOptions.edges.scaling.label.min = parseInt(value);
            if (message == 'options-edges-scaling-object-max-scalingLabel') this.localOptions.edges.scaling.label.max = parseInt(value);
            if (message == 'options-edges-scaling-object-maxVisible-scalingLabel') this.localOptions.edges.scaling.label.maxVisible = parseInt(value);
        },
        openBsModal: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    watch: {
        localOptions: {
            handler: function (newValue, oldValue) {
                this.$emit("options-has-changed", newValue);
            },
            deep: true
        },
        optionsEdgesChosenSwitchChecked: function (newValue, oldValue) {
            this.firstAccordionItems[2].isChecked = newValue;
        },
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null || this.awatingResponse.length == 0) return;
            if (this.awatingResponse.includes("repaint_canvas_edges_chosen_unselecting", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_edges_chosen_unselecting"
                });
                if (newValue) {
                    this.optionsEdgesChosenSwitchChecked = !newValue;
                    this.localOptions.edges.chosen = this.optionsEdgesChosenSwitchChecked;
                    this.$emit("canvas-key-change", true);
                } else {
                    this.optionsEdgesChosenSwitchChecked = true;
                }
            }
            if (this.awatingResponse.includes("repaint_canvas_edges_chosen_selecting", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_edges_chosen_selecting"
                });
                if (newValue) {
                    this.optionsEdgesChosenSwitchChecked = true;
                    this.localOptions.edges.chosen = this.optionsEdgesChosenSwitchChecked;
                    this.$emit("canvas-key-change", true);
                } else {
                    this.optionsEdgesChosenSwitchChecked = false;
                }
            }
            if (this.awatingResponse.includes("repaint_canvas_edges_scaling_selecting", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_edges_scaling_selecting"
                });
                this.optionsEdgesScalingSwitchValue = newValue;
                this.firstAccordionItems[5].isChecked = this.optionsEdgesScalingSwitchValue;
                if (newValue) {
                    let i = 0;
                    this.localEdges.forEach(function(element){
                        element.value = i++;
                    });
                    this.$emit('edges-has-changed', this.localEdges)
                    this.localOptions.edges.scaling = {};
                    this.$emit('canvas-key-change', true);
                }
            }
            if (this.awatingResponse.includes("repaint_canvas_edges_scaling_unselecting", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_edges_scaling_unselecting"
                });
                this.optionsEdgesScalingSwitchValue = !newValue;
                this.firstAccordionItems[5].isChecked = this.optionsEdgesScalingSwitchValue;
                if (newValue) {
                    this.localEdges.forEach(function(element){
                        element.value = undefined;
                    });
                    console.log(this.localEdges);
                    this.$emit('edges-has-changed', this.localEdges)
                    this.localOptions.edges.scaling = {};
                    this.$emit('canvas-key-change', true);
                }
            }
        }

    },
    emits: ["options-has-changed", "send-toast", "canvas-key-change", "open-bs-modal", "edges-has-changed"]
}
</script>