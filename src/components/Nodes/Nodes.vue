<template>
    <div>
        <SwitchWithInfo :switchId="'nodes-hidden'" :switchDisabled="false" :switchInitialValue="this.hidden"
            :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.Hiden - Quando verdadeiro, os vértices não serão mostrados. Ainda farão parte da simulação de física, no entanto!'"
            :switchLabelEnabled="true" :switchLabelValue="'Esconder vértices'" @checkbox-status-changed="toggleHidden">
        </SwitchWithInfo>
        <SwitchWithInfo :switchId="'nodes-physics'" :switchDisabled="false" :switchInitialValue="physics"
            :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.Physics - Quando falso, o vértice não faz parte da simulação física. Ele não se moverá, exceto quando arrastado manualmente.'"
            :switchLabelEnabled="true" :switchLabelValue="'Física Habilitada'" @checkbox-status-changed="togglePhysics">
        </SwitchWithInfo>
        <SwitchWithInfo :switchId="'nodes-labelHighlightBold'" :switchDisabled="false"
            :switchInitialValue="labelHighlightBold" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.LabelHighlightBold - Determina se o rótulo fica ou não em negrito quando o vértice é selecionado.'"
            :switchLabelEnabled="true" :switchLabelValue="'Destaque negrito selecionado'"
            @checkbox-status-changed="toggleLabelHighlightBold"></SwitchWithInfo>
        <InputRange :inputId="'nodes-borderWidth-range'" :isLabelEnabled="true" :min="0" :max="25" :step="1"
            :initialValue="this.borderWidth" :labelValue="'Grossura da Borda'"
            :tooltip="'Options.Nodes.BorderWidth - A grossura da borda do vértice. Padrão 1'"
            @update-value-from-range-input="emitBorderWidth"></InputRange>
        <InputRange :inputId="'nodes-borderWidthSelected-range'" :isLabelEnabled="true" :min="0" :max="50" :step="1"
            :initialValue="this.borderWidthSelected" :labelValue="'Grossura da borda do selecionado'"
            :tooltip="'Options.Nodes.BorderWidthSelected Toggle to disable default. - A largura da borda do nó quando ele é selecionado. Quando indefinido, o borderWidth * 2 é usado. Alterne para desabilitar o padrão.'"
            :disabled="this.borderWidthSelectedDisabled" :labelHasSwitch="true"
            :labelSwitchId="'nodes-borderWidthSelectedRange-default'"
            :labelSwitchInitialValue="this.borderWidthSelectedDisabled"
            @checkbox-status-changed="onBorderWidthSelectedChange"
            @update-value-from-range-input="updateValueBorderWidhtSelected"></InputRange>
        <InputUrl :idInput="'nodes-brokenImage-url-input'" labelValue="Url de Imagem Quebrada"
            :placeholder="'https://www.google.com'"
            :tooltip="'Options.Nodes.BrokenImage - Quando a forma está configurada para \'imagem\' ou \'imagem circular\', essa opção pode ser uma URL para uma imagem backup no caso da URL fornecida na opção de imagem não possa ser resolvida.'"
            :urlInitalValue="brokenImage" @url-value-update="updateBrokenImageValue"></InputUrl>
        <InputRange :inputId="'opacity-range'" :isLabelEnabled="true" :min="0" :max="1" :step="0.01" :initialValue="1"
            :labelValue="'Opacidade'"
            :tooltip="'Opacity - Opacidade geral de um nó (substitui qualquer opacidade na borda, plano de fundo, imagem e sombra).'"
            @update-value-from-range-input="emitOpacity"></InputRange>
        <AccordionFlush :id="'first-accordion'" :accordionItems="firstAccordionItems"
            :accordionItemsComponents="firstAccordionItemsComponents" class="mt-2"
            @toggle-switch-event="toggleSwitchEvent" @message="message" @open-bs-modal="openBsModal" :bsModalReturnValue="bsModalReturnValue">
        </AccordionFlush>
    </div>
</template>
<script>

import AccordionFlush from '../Common/AccordionFlush.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputUrl from '../Common/Inputs/InputUrl.vue';

export default {
    name: "Nodes",
    props: [
        'options',
        'network',
        'isNodesEnabled',
        'nodes',
        'bsModalReturnValue',
    ],
    data() {
        return {
            encapsulateNodes: null,
            encapsulateOptions: null,
            encapsulateNetwork: null,
            borderWidth: 1,
            borderWidthSelected: 2,
            borderWidthSelectedDisabled: true,
            brokenImage: "/paad-grafos-v2/src/assets/images/paad_logo.png",
            firstAccordionItems: [],
            firstAccordionItemsComponents: [],
            fixedSwitchValue: false,
            fontSwitchEnabled: true,
            fontToggled: false,
            fontObjectOrString: true,
            chosenSwitchValue: true,
            heightConstraintSwitchEnabled: true,
            heightConstraintSwitchValue: false,
            heightConstraintObjectEnabled: false,
            heightConstraintIntegerValue: 0,
            heightConstraintObjectValue: {},
            hidden: false,
            shape: 'ellipse',
            labelHighlightBold: true,
            physics: true,
            scalingValue: null,
            scalingAccordionDisabled: false,
            scalingCheckboxEnabled: true,
            scalingCheckboxValue: false,
            shadowCheckboxValue: false,
            shadowCheckboxEnabled: true,
            awaitingResponse: []
        }
    },
    watch: {
        brokenImage: function (newBrokenImage, oldBrokenImage) {
            this.encapsulateOptions.nodes.brokenImage = newBrokenImage;
        },
        encapsulateOptions: {
            handler: function (newValue, oldValue) {
                this.$emit('options-has-changed', newValue);
            },
            deep: true
        },
        chosenSwitchValue: function(newValue, oldValue) {
            this.firstAccordionItems[0].isChecked = newValue;
        },
        fixedSwitchValue: function (newValue, oldValue) {
            this.firstAccordionItems[2].isChecked = newValue;
        },
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null || this.awaitingResponse.length == 0) return;
            if (this.awaitingResponse.includes("repaint_canvas_nodes_chosen_unselecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_chosen_unselecting"
                });
                if (newValue) {
                    this.chosenSwitchValue = !newValue;
                    this.encapsulateOptions.nodes.chosen = this.chosenSwitchValue;
                    this.$emit("options-has-changed", this.encapsulateOptions);
                    this.$emit("component-key-change", true);
                } else {
                    this.chosenSwitchValue = true;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_chosen_selecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_chosen_selecting"
                });
                if (newValue) {
                    this.chosenSwitchValue = newValue;
                    this.encapsulateOptions.nodes.chosen = this.chosenSwitchValue;
                    this.$emit("options-has-changed", this.encapsulateOptions);
                    this.$emit("component-key-change", true);
                } else {
                    this.chosenSwitchValue = false;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_unselecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_unselecting"
                });
                if (newValue) {
                    this.fixedSwitchValue = !newValue;
                    this.encapsulateOptions.nodes.fixed = this.fixedSwitchValue;
                    this.$emit("options-has-changed", this.encapsulateOptions);
                    this.$emit("component-key-change", true);
                } else {
                    this.fixedSwitchValue = true;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_selecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_selecting"
                });
                if (newValue) {
                    this.fixedSwitchValue = newValue;
                    this.encapsulateOptions.nodes.fixed = this.fixedSwitchValue;
                    this.$emit("options-has-changed", this.encapsulateOptions);
                    this.$emit("component-key-change", true);
                } else {
                    this.fixedSwitchValue = false;
                }
            }
        }
    },
    mounted() {
        console.log("Nodes Component Mounted");
        this.encapsulateNetwork = this.network;
        this.encapsulateOptions = this.options;
        this.encapsulateNodes = this.nodes;
        this.borderWidth = this.encapsulateOptions.nodes.borderWidth;
        this.borderWidthSelected = this.encapsulateOptions.nodes.borderWidthSelected;
        this.brokenImage = this.encapsulateOptions.nodes.brokenImage;

        this.shape = "ellipse";
        this.encapsulateOptions.nodes.shape = "ellipse";
        this.checkObjectScale(this.shape);

        this.firstAccordionItems.push(
            {
                item: 'chosen',
                title: 'Selecionado',
                switch: true,
                isChecked: this.chosenSwitchValue,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Quando verdadeiro, selecionar ou sobrepor um vértice mudará a si e seu rótulo de acordo com o padrão. ' +
                    'Quando falso, nenhuma alteração no vértice ou em seu rótulo ocorrerá quando o mesmo é escolhido. ' +
                    'Se um objeto é fornecido, o ajuste mais refinado das características do vértice está disponível quando um vértice é escolhido.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'chosen', component: 'nodes.chosen' });
        this.firstAccordionItems.push(
            {
                item: 'color',
                title: 'Cores',
                switch: false,
                isChecked: false,
                isCheckedEnabled: false,
                hasTooltip: true,
                tooltip: 'O objeto color contêm as informações de cores do vértice em todas as situações. ' +
                    'Quando o vértice necessita somente de apenas uma cor, um valor de cor como "rgba(120,32,14,1)", "#ffffff" ou "red" pode ser passado ao invés do objeto.'
            }
        );
        this.firstAccordionItemsComponents.push({
            item: 'color', component: 'nodes.color', variables: {
                background: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? this.encapsulateOptions.nodes.color.background ?? '#D2E5FF' : '#D2E5FF',
                border: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? this.encapsulateOptions.nodes.color.border ?? '#2B7CE9' : '#2B7CE9',
                highlight: {
                    border: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? (this.encapsulateOptions.nodes.color.highlight) ? this.encapsulateOptions.nodes.color.highlight.border ?? '#D2E5FF' : '#D2E5FF' : '#D2E5FF',
                    background: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? (this.encapsulateOptions.nodes.color.highlight) ? this.encapsulateOptions.nodes.color.highlight.background ?? '#2B7CE9' : '#2B7CE9' : '#2B7CE9',
                },
                hover: {
                    border: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? (this.encapsulateOptions.nodes.color.hover) ? this.encapsulateOptions.nodes.color.hover.border ?? '#D2E5FF' : '#D2E5FF' : '#D2E5FF',
                    background: (this.encapsulateOptions.node && this.encapsulateOptions.node.color) ? (this.encapsulateOptions.nodes.color.hover) ? this.encapsulateOptions.nodes.color.hover.background ?? '#2B7CE9' : '#2B7CE9' : '#2B7CE9'
                }
            }
        });
        this.firstAccordionItems.push(
            {
                item: 'fixed',
                title: 'Fixado',
                switch: true,
                isChecked: this.fixedSwitchValue,
                isCheckedEnabled: true,
                hasTooltip: true,
                tooltip: 'Options.Nodes.Fixed - Quando verdadeiro, os vértices não se moverão mas AINDA farão parte da simulação física. ' +
                    'Quando definidio com um objeto, movimento em ambas as direções X ou Y podem ser desabilitados.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'fixed', component: 'nodes.fixed' });
        this.firstAccordionItems.push(
            {
                item: 'font',
                title: 'Fonte',
                switch: true,
                isChecked: false,
                isCheckedEnabled: this.fontSwitchEnabled,
                hasTooltip: true,
                tooltip: 'Options.Nodes.Font - Este objeto define os detalhes do ródutlo. Ative verdadeiro para funcionar.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'font', component: 'nodes.font' });
        this.firstAccordionItems.push(
            {
                item: 'heightConstraint',
                title: 'Constante de altura',
                switch: true,
                isChecked: this.heightConstraintSwitchValue,
                isCheckedEnabled: this.heightConstraintSwitchEnabled,
                hasTooltip: true,
                tooltip: 'Options.Nodes.HeightConstraint - Se falso, nada de constante de altura é aplicado. Se um número é especificado, o valor é usado como altura mínima de um vértice. A altura do vértice será configurado como o mínimo se é menor que o valor.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'heightConstraint', component: 'nodes.heightConstraint' });
        this.firstAccordionItems.push(
            {
                item: 'shape',
                title: 'Forma',
                switch: false,
                hasTooltip: true,
                tooltip: 'Options.Nodes.Shape - A forma define a aparência do vértice. Existem três tipos de vértices. Um tipo tem o rótulo dentro dele e o outro tipo tem o rótulo abaixo dele. O terceiro tipo é uma forma personalizada onde você pode desenhar o que quiser para representar o vértice.'
            }
        );
        this.firstAccordionItemsComponents.push({ item: 'shape', component: 'nodes.shape' });
        this.firstAccordionItems.push(
            {
                item: 'scaling',
                title: 'Escala',
                switch: true,
                isChecked: this.scalingCheckboxValue,
                isCheckedEnabled: this.scalingCheckboxEnabled,
                accordionDisabled: this.scalingAccordionDisabled,
                hasTooltip: true,
                tooltip: 'Options.Nodes.Scaling - Se a opção de valor for especificada, o tamanho dos nós será dimensionado de acordo com as propriedades deste objeto. Todas as formas de nós podem ser dimensionadas, mas algumas apenas quando o dimensionamento do rótulo está ativado, pois seu tamanho é baseado no tamanho do rótulo. Escaláveis apenas quando o dimensionamento do rótulo está ativado são elipse, círculo, banco de dados, caixa, texto. Sempre escaláveis são: imagem, circularImage, diamante, ponto, estrela, triângulo, triângulo para baixo, hexágono, quadrado e ícone. Lembre-se de que ao usar o dimensionamento, a opção de tamanho é negligenciada.'
            }
        )
        this.firstAccordionItemsComponents.push({ item: 'scaling', component: 'nodes.scaling' });
        this.firstAccordionItems.push(
            {
                item: 'shadow',
                title: 'Sombra',
                switch: true,
                isChecked: this.shadowCheckboxValue,
                isCheckedEnabled: this.shadowCheckboxEnabled,
                hasTooltip: true,
                tooltip: 'Options.Nodes.Shadow - Quando verdadeiro, o vértice invoca uma sombra usando as configurações padrão. Isso pode ser refinado posteriormente ofertando um objeto.'
            }
        )
        this.firstAccordionItemsComponents.push({ item: 'shadow', component: 'nodes.shadow' });
    },
    components: {
        AccordionFlush,
        InputRange,
        SwitchWithInfo,
        InputUrl
    },
    methods: {
        togglePhysics: function (value) {
            this.encapsulateOptions.nodes.physics = value;
            this.$emit("options-has-changed", this.encapsulateOptions);
        },
        toggleLabelHighlightBold: function (value) {
            this.encapsulateOptions.nodes.labelHighlightBold = value;
            this.$emit("options-has-changed", this.encapsulateOptions);
        },
        toggleSwitchEvent: function (switchId, value) {
            console.log("Valor chegou: " + value + " FixedSwichValue: " + this.fixedSwitchValue);
            switch (switchId) {
                case "chosen": {
                    if (!value && this.chosenSwitchValue) {
                        this.awaitingResponse.push("repaint_canvas_nodes_chosen_unselecting");
                        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                        this.chosenSwitchValue = value;
                    } else if (value && !this.chosenSwitchValue) {
                        this.awaitingResponse.push("repaint_canvas_nodes_chosen_selecting");
                        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                        this.chosenSwitchValue = value;
                    }
                    break;
                }
                case "fixed": {
                    if (!value && this.fixedSwitchValue) {
                        this.awaitingResponse.push("repaint_canvas_nodes_fixed_unselecting");
                        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                        this.fixedSwitchValue = value;
                    } else if (value && !this.fixedSwitchValue) {
                        this.awaitingResponse.push("repaint_canvas_nodes_fixed_selecting");
                        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                        this.fixedSwitchValue = value;
                    }
                    break;
                }
                case "font": {
                    if (!this.fontToggled && value == true) {
                        this.encapsulateOptions.nodes.font = {};
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    this.fontToggled = value;
                    break;
                }

                case 'heightConstraint': {
                    this.encapsulateOptions.nodes.heightConstraint = value;
                    this.heightConstraintSwitchValue = value;
                    break;
                }

                case 'scaling': {
                    this.scalingCheckboxValue = value;
                    if (value) {
                        this.scalingValue = {};
                        this.encapsulateOptions.nodes.scaling = this.scalingValue;
                        this.encapsulateOptions.nodes.value = 1;
                    } else {
                        this.scalingValue = null;
                        if (Object.hasOwn(this.encapsulateOptions.nodes, "scaling")) delete this.encapsulateOptions.nodes.scaling;
                        this.encapsulateOptions.nodes.value = undefined;
                    }
                }
            }
        },
        checkObjectScale: function (value) {
            if (Object.hasOwn(this.encapsulateOptions.nodes, "shape")) {
                if (value == 'ellipse' ||
                    value == 'circle' ||
                    value == 'box' ||
                    value == 'text' ||
                    value == 'image' ||
                    value == 'circularImage' ||
                    value == 'diamond' ||
                    value == 'dot' ||
                    value == 'star' ||
                    value == 'triangle' ||
                    value == 'triangleDown' ||
                    value == 'hexagon' ||
                    value == 'square' ||
                    value == 'icon'
                ) {
                    this.scalingAccordionDisabled = false;
                    this.scalingCheckboxEnabled = true;
                    this.scalingCheckboxValue = false;
                    if (typeof this.firstAccordionItems[6] !== 'undefined') {
                        this.firstAccordionItems[6].accordionDisabled = false;
                        this.firstAccordionItems[6].isCheckedEnabled = true;
                        this.firstAccordionItems[6].isChecked = false;
                    }
                } else {
                    this.scalingAccordionDisabled = true;
                    this.scalingCheckboxEnabled = false;
                    this.scalingCheckboxValue = false;
                    if (typeof this.firstAccordionItems[6] !== 'undefined') {
                        this.firstAccordionItems[6].accordionDisabled = true;
                        this.firstAccordionItems[6].isCheckedEnabled = false;
                        this.firstAccordionItems[6].isChecked = false;
                    }
                }
            } else {
                this.encapsulateOptions.nodes.shape = "ellipse";
            }
        },
        isFontObject: function () {
            return typeof this.encapsulateOptions.nodes.font == "object";
        },
        message: function (message, value) {
            console.log("Message: " + message + " Value: " + value);
            switch (message) {
                case 'send-toast': {this.$emit("send-toast", value); break;}
                case 'repaint-component': {this.$emit("component-key-change", true); break}
                case 'options-nodes-chosen-object-enabled': {this.encapsulateOptions.nodes.chosen = {}; break;}
                case 'options-nodes-chosen-node-boolean': {this.encapsulateOptions.nodes.chosen.node = value; break;}
                case 'options-nodes-chosen-node-function-value': {this.encapsulateOptions.nodes.chosen.node = value; break;}
                case 'options-nodes-chosen-label-boolean': {this.encapsulateOptions.nodes.chosen.label = value; break;}
                case 'options-nodes-chosen-label-function-value': {this.encapsulateOptions.nodes.chosen.label = value; break;}
                // Not working
                case 'update-chosen-node-background-color': {
                    this.encapsulateOptions.nodes.chosen = { node: null, label: true };
                    break;
                }
                case 'update-node-color-background': {
                    this.encapsulateOptions.nodes.color = {
                        background: value
                    };
                    break;
                }
                case 'update-node-color-border': {
                    this.encapsulateOptions.nodes.color = {
                        border: value
                    };
                    break;
                }
                case 'update-node-highlight-border-color': {
                    this.encapsulateOptions.nodes.color = {
                        highlight: {
                            border: value
                        }
                    };
                    break;
                }
                case 'update-node-highlight-background-color': {
                    this.encapsulateOptions.nodes.color = {
                        highlight: {
                            background: value
                        }
                    };
                    break;
                }
                case 'update-node-hover-border-color': {
                    this.encapsulateOptions.nodes.color = {
                        hover: {
                            border: value
                        }
                    };
                    break;
                }
                case 'update-node-hover-background-color': {
                    this.encapsulateOptions.nodes.color = {
                        hover: {
                            background: value
                        }
                    };
                    break;
                }
                case 'options-nodes-fixed-object-sending' : {
                    if (value) this.encapsulateOptions.nodes.fixed = { x: this.fixedSwitchValue, y: this.fixedSwitchValue };
                    else this.encapsulateOptions.nodes.fixed = this.fixedSwitchValue;
                    break;
                }
                case 'fix-nodes-x-coordinate': {
                    if (typeof this.encapsulateOptions.nodes.fixed != "object") {
                        this.encapsulateOptions.nodes.fixed = { x: false, y: false }
                    }
                    this.encapsulateOptions.nodes.fixed.x = value;
                    break;
                }
                case 'fix-nodes-y-coordinate': {
                    if (typeof this.encapsulateOptions.nodes.fixed != "object") {
                        this.encapsulateOptions.nodes.fixed = { x: false, y: false }
                    }
                    this.encapsulateOptions.nodes.fixed.y = value;
                    break;
                }
                case 'node-font-object-enabled': {
                    if (this.fontToggled) {
                        if (!value) {
                            this.encapsulateOptions.nodes.font = "15px arial black";
                        } else {
                            this.encapsulateOptions.nodes.font = {};
                        }
                        this.fontObjectOrString = value;
                    }
                    break;
                }
                case 'node-font-string': {
                    if (!this.fontObjectOrString) {
                        this.encapsulateOptions.nodes.font = value;
                    }
                }
                case 'node-font-color': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.color = value;
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-size': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.size = parseInt(value);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-face': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.face = value;
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'enable-font-background': {
                    if (this.fontToggled && this.isFontObject()) {
                        if (value) {
                            this.encapsulateOptions.nodes.font.background = "#ffffff";
                        } else {
                            this.encapsulateOptions.nodes.font.background = undefined;
                        }

                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-background': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.background = value;
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-stroke-width': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.strokeWidth = parseInt(value);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-stroke-color': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.strokeColor = value;
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'height-constraint-object-enabled': {
                    if (this.heightConstraintSwitchValue) {
                        this.heightConstraintObjectEnabled = value;
                    } else {
                        this.encapsulateOptions.nodes.heightConstraint = false;
                    }
                    break;
                }
                case 'height-constraint-value': {
                    if (this.heightConstraintSwitchValue) {
                        if (!this.heightConstraintObjectEnabled) {
                            this.heightConstraintIntegerValue = value;
                            this.encapsulateOptions.nodes.heightConstraint = parseInt(value);
                        }
                    } else {
                        this.encapsulateOptions.nodes.heightConstraint = false;
                    }
                    break;
                }
                case 'height-constraint-object-minimum': {
                    if (this.heightConstraintSwitchValue) {
                        if (this.heightConstraintObjectEnabled) {
                            this.heightConstraintObjectValue.minimum = parseInt(value);
                            this.encapsulateOptions.nodes.heightConstraint = this.heightConstraintObjectValue;
                        }
                    } else {
                        this.encapsulateOptions.nodes.heightConstraint = false;
                    }
                    break;
                }
                case 'height-constraint-object-valign': {
                    if (this.heightConstraintSwitchValue) {
                        if (this.heightConstraintObjectEnabled) {
                            this.heightConstraintObjectValue.valign = value;
                            this.encapsulateOptions.nodes.heightConstraint = this.heightConstraintObjectValue;
                        }
                    } else {
                        this.encapsulateOptions.nodes.heightConstraint = false;
                    }
                    break;
                }
                case 'update-node-shape': {
                    this.shape = value;
                    this.encapsulateOptions.nodes.shape = value;
                    this.checkObjectScale(value);
                    break;
                }
                case 'init-icons': {
                    this.encapsulateOptions.nodes.icon = { size: 50, weight: 300 };
                    break;
                }
                case 'update-icon-font-face': {
                    this.encapsulateOptions.nodes.icon.face = value;
                    break;
                }
                case 'update-icon-code': {
                    this.encapsulateOptions.nodes.icon.code = value;
                    break;
                }
                case 'update-icon-weight': {
                    this.encapsulateOptions.nodes.icon.weight = parseInt(value);
                    break;
                }
                case 'update-icon-color': {
                    this.encapsulateOptions.nodes.icon.color = value;
                    break;
                }
                case 'update-icon-size': {
                    this.encapsulateOptions.nodes.icon.size = parseInt(value);
                    break;
                }
                case 'update-image-url': {
                    this.encapsulateOptions.nodes.image = value;
                    break;
                }
                case 'update-canvas-key-change': {
                    this.$emit('component-key-change', value);
                    break;
                }
                case 'update-image-url-selected': {
                    if (value[0]) {
                        this.encapsulateOptions.nodes.image = {
                            unselected: value[1],
                            selected: value[2]
                        }
                    } else {
                        this.encapsulateOptions.nodes.image = {
                            unselected: value[1],
                            selected: value[1]
                        };
                    }

                    this.$emit('component-key-change', value);
                    break;
                }
                case 'custom-render-node-update': {
                    this.encapsulateOptions.nodes.ctxRenderer = value;
                    break;
                }
                case 'send-toast': {
                    this.$emit('send-toast', value);
                    break;
                }
                case 'update-image-padding-top': {
                    if (!Object.hasOwn(this.encapsulateNodes, "imagePadding")) this.encapsulateOptions.nodes.imagePadding = {};
                    this.encapsulateOptions.nodes.imagePadding.top = value;
                    break;
                }
                case 'update-image-padding-bottom': {
                    if (!Object.hasOwn(this.encapsulateNodes, "imagePadding")) this.encapsulateOptions.nodes.imagePadding = {};
                    this.encapsulateOptions.nodes.imagePadding.bottom = value;
                    break;
                }
                case 'update-image-padding-left': {
                    if (!Object.hasOwn(this.encapsulateNodes, "imagePadding")) this.encapsulateOptions.nodes.imagePadding = {};
                    this.encapsulateOptions.nodes.imagePadding.left = value;
                    break;
                }
                case 'update-image-padding-right': {
                    if (!Object.hasOwn(this.encapsulateNodes, "imagePadding")) this.encapsulateOptions.nodes.imagePadding = {};
                    this.encapsulateOptions.nodes.imagePadding.right = value;
                    break;
                }
                case 'update-label-marging-top': {
                    if (!Object.hasOwn(this.encapsulateNodes, "margin")) this.encapsulateOptions.nodes.margin = {};
                    this.encapsulateOptions.nodes.margin.top = value;
                    break;
                }
                case 'update-label-marging-bottom': {
                    if (!Object.hasOwn(this.encapsulateNodes, "margin")) this.encapsulateOptions.nodes.margin = {};
                    this.encapsulateOptions.nodes.margin.bottom = value;
                    break;
                }
                case 'update-label-marging-left': {
                    if (!Object.hasOwn(this.encapsulateNodes, "margin")) this.encapsulateOptions.nodes.margin = {};
                    this.encapsulateOptions.nodes.margin.left = value;
                    break;
                }
                case 'update-label-marging-right': {
                    if (!Object.hasOwn(this.encapsulateNodes, "margin")) this.encapsulateOptions.nodes.margin = {};
                    this.encapsulateOptions.nodes.margin.right = value;
                    break;
                }
                case 'options-nodes-scaling-min': {
                    if (this.scalingCheckboxValue) this.encapsulateOptions.nodes.scaling.min = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-max': {
                    if (this.scalingCheckboxValue) this.encapsulateOptions.nodes.scaling.max = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-label': {
                    if (this.scalingCheckboxValue) this.encapsulateOptions.nodes.scaling.label = value;
                    break;
                }
                case 'options-nodes-scaling-object': {
                    if (this.scalingCheckboxValue)
                        if (value) this.encapsulateOptions.nodes.scaling.label = { enabled: value };
                        else this.encapsulateOptions.nodes.scaling.label = value;
                    break;
                }
                case 'options-nodes-scaling-object-enabled': {
                    if (this.scalingCheckboxValue)
                        this.encapsulateOptions.nodes.scaling.label.enabled = value;
                    break;
                }
                case 'options-nodes-scaling-object-min': {
                    if (this.scalingCheckboxValue)
                        this.encapsulateOptions.nodes.scaling.label.min = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-object-max': {
                    if (this.scalingCheckboxValue)
                        this.encapsulateOptions.nodes.scaling.label.max = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-object-max-visibility': {
                    if (this.scalingCheckboxValue)
                        this.encapsulateOptions.nodes.scaling.label.maxVisible = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-object-draw-threshold': {
                    if (this.scalingCheckboxValue)
                        this.encapsulateOptions.nodes.scaling.label.drawThreshold = parseInt(value);
                    break;
                }
                case 'options-nodes-scaling-customScalingFunction': {
                    if (this.scalingCheckboxValue) {
                        this.encapsulateOptions.nodes.scaling.customScalingFunction = value;
                    }
                    break;
                }
                case 'option-nodes-shadow': {
                    this.shadowCheckboxValue = value;
                    this.encapsulateOptions.nodes.shadow = value;
                    break;
                }
                case 'option-nodes-shadow-object': {
                    if (value) {
                        if (this.shadowCheckboxEnabled) {
                            this.encapsulateOptions.nodes.shadow = { enabled: value };
                        }
                    } else {
                        if (Object.hasOwn(this.encapsulateOptions.nodes.shadow, 'color')) delete this.encapsulateOptions.nodes.shadow.color;
                        if (Object.hasOwn(this.encapsulateOptions.nodes.shadow, 'size')) delete this.encapsulateOptions.nodes.shadow.size;
                        if (Object.hasOwn(this.encapsulateOptions.nodes.shadow, 'x')) delete this.encapsulateOptions.nodes.shadow.x;
                        if (Object.hasOwn(this.encapsulateOptions.nodes.shadow, 'y')) delete this.encapsulateOptions.nodes.shadow.y;
                        this.encapsulateOptions.nodes.shadow = true;
                    }
                    break;
                }
                case 'option-nodes-shadow-object-color': {
                    if (this.shadowCheckboxEnabled) {
                        this.encapsulateOptions.nodes.shadow.color = value;
                    }
                    break;
                }
                case 'option-nodes-shadow-object-size': {
                    if (this.shadowCheckboxEnabled) {
                        this.encapsulateOptions.nodes.shadow.size = value;
                    }
                    break;
                }
                case 'option-nodes-shadow-object-x': {
                    if (this.shadowCheckboxEnabled) {
                        this.encapsulateOptions.nodes.shadow.x = value;
                    }
                    break;
                }
                case 'option-nodes-shadow-object-y': {
                    if (this.shadowCheckboxEnabled) {
                        this.encapsulateOptions.nodes.shadow.y = value;
                    }
                    break;
                }
            }
        },
        emitOpacity: function (value) {
            this.encapsulateOptions.nodes.opacity = parseFloat(value);
        },
        emitBorderWidth: function (value) {
            this.borderWidth = value;
            this.encapsulateOptions.nodes.borderWidth = parseInt(value);
            if (this.borderWidthSelectedDisabled) {
                this.borderWidthSelected = 2 * this.encapsulateOptions.nodes.borderWidth;
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
            }
        },
        onBorderWidthSelectedChange: function (value) {
            if (value) {
                this.borderWidthSelected = 2 * this.encapsulateOptions.nodes.borderWidth;
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
            }
            this.borderWidthSelectedDisabled = value;
        },
        updateValueBorderWidhtSelected: function (value) {
            if (!this.borderWidthSelectedDisabled) {
                this.borderWidthSelected = parseInt(value);
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
            }
        },
        updateBrokenImageValue: function (value) {
            this.brokenImage = value;
            this.encapsulateOptions.nodes.brokenImage = value;
        },
        toggleHidden: function (value) {
            this.hidden = value;
            this.encapsulateOptions.nodes.hidden = value;
        },
        openBsModal: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    emits: ['options-has-changed', 'nodes-has-changed', 'component-key-change', 'send-toast', 'open-bs-modal']
}
</script>