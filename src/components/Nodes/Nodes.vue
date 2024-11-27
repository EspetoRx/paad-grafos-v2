<template>
    <div>
        <SwitchWithInfo :switchId="'nodes-hidden'" :switchDisabled="false" :switchInitialValue="this.hidden"
            :switchTooltipEnabled="true"
            :switchTooltip="'Quando verdadeiro, os vértices não serão mostrados. Ainda farão parte da simulação de física, no entanto!'"
            :switchLabelEnabled="true" :switchLabelValue="'Esconder vértices'" @checkbox-status-changed="toggleHidden">
        </SwitchWithInfo>
        <InputRange :inputId="'nodes-borderWidth-range'" :isLabelEnabled="true" :min="0" :max="25" :step="1"
            :initialValue="this.borderWidth" :labelValue="'Grossura da Borda'"
            :tooltip="'Options.Nodes.BorderWidth - A grossura da borda do vértice. Padrão 1'"
            @update-value-from-range-input="emitBorderWidth"></InputRange>
        <InputRange
        :inputId="'nodes-borderWidthSelected-range'"
        :isLabelEnabled="true"
        :min="0"
        :max="50"
        :step="1"
        :initialValue="this.borderWidthSelected"
        :labelValue="'Grossura da borda do selecionado'"
        :tooltip="'Options.Nodes.BorderWidthSelected Toggle to disable default. - A largura da borda do nó quando ele é selecionado. Quando indefinido, o borderWidth * 2 é usado. Alterne para desabilitar o padrão.'"
        :disabled="this.borderWidthSelectedDisabled"
        :labelHasSwitch="true" :labelSwitchId="'nodes-borderWidthSelectedRange-default'" :labelSwitchInitialValue="this.borderWidthSelectedDisabled"
        @checkbox-status-changed="onBorderWidthSelectedChange"
        @update-value-from-range-input="updateValueBorderWidhtSelected"
        ></InputRange>
        <div class="form-group">
            <div class="d-flex justify-content-between">
                <div class="d-flex w-100 justify-content-between">
                    <div data-bs-toggle="tooltip" title="Options.Nodes.BrokenImage - Quando a forma está configurada para 'imagem' ou 'imagem circular', 
                    essa opção pode ser uma URL para uma imagem backup no caso da URL fornecida na opção de 
                    imagem não possa ser resolvida.">
                        <label id="brokenImageInputPrepend" for="brokenImageInput">Url de Imagem Quebrada:</label>
                    </div>
                    <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" title="Options.Nodes.BrokenImage - Quando a forma está configurada para 'imagem' ou 'imagem circular',                     essa opção pode ser uma URL para uma imagem backup no caso da URL fornecida na opção de 
                    imagem não possa ser resolvida.">
                        <i class="fa-solid fa-info text-right"></i>
                    </div>
                </div>
            </div>
            <input type="text" class="form-control" placeholder="http://www.google.com" aria-label="brokenImageInput"
                aria-describedby="brokenImageInputPrepend" id="brokenImageInput" v-model="this.brokenImage">
        </div>
        <InputRange :inputId="'opacity-range'" :isLabelEnabled="true" :min="0" :max="1" :step="0.01" :initialValue="1"
            :labelValue="'Opacidade'"
            :tooltip="'Opacity - Opacidade geral de um nó (substitui qualquer opacidade na borda, plano de fundo, imagem e sombra).'"
            @update-value-from-range-input="emitOpacity"></InputRange>
        <AccordionFlush :id="'first-accordion'" :accordionItems="firstAccordionItems"
            :accordionItemsComponents="firstAccordionItemsComponents" class="mt-2"
            @toggle-switch-event="toggleSwitchEvent" @message="message">
        </AccordionFlush>
    </div>
</template>
<script>

import isUrl from 'is-url';
import AccordionFlush from '../Common/AccordionFlush.vue';
import InputRange from '../Common/InputRange.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Nodes",
    props: [
        'options',
        'network',
        'isNodesEnabled'
    ],
    data() {
        return {
            encapsulateOptions: null,
            encapsulateNetwork: null,
            borderWidth: 1,
            borderWidthSelected: 2,
            borderWidthSelectedDisabled: true,
            brokenImage: "",
            firstAccordionItems: [],
            firstAccordionItemsComponents: [],
            fixedSwitchEnabled: true,
            fontSwitchEnabled: true,
            fontToggled: false,
            fontObjectOrString: true,
            heightConstraintSwitchEnabled: true,
            heightConstraintSwitchValue: false,
            heightConstraintObjectEnabled: false,
            heightConstraintIntegerValue: 0,
            heightConstraintObjectValue: {},
            hidden: false,
            shape: 'ellipse'
        }
    },
    watch: {
        brokenImage: function (newBrokenImage, oldBrokenImage) {
            if (isUrl(newBrokenImage)) {
                this.encapsulateOptions.nodes.brokenImage = newBrokenImage;
                this.$emit('options-has-changed', this.encapsulateOptions);
            }
        }
    },
    mounted() {
        console.log("Nodes Component Mounted");
        this.encapsulateNetwork = this.network;
        this.encapsulateOptions = this.options;
        this.borderWidth = this.encapsulateOptions.nodes.borderWidth;
        this.borderWidthSelected = this.encapsulateOptions.nodes.borderWidthSelected;
        this.brokenImage = this.encapsulateOptions.nodes.brokenImage;
        this.firstAccordionItems.push(
            {
                item: 'chosen',
                title: 'Selecionado',
                switch: true,
                isChecked: (typeof this.encapsulateOptions.nodes.chosen == "boolean") ? this.encapsulateOptions.nodes.chosen : this.encapsulateOptions.nodes.chosen != null,
                isCheckedEnabled: (typeof this.encapsulateOptions.nodes.chosen == "boolean"),
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
                isChecked: false,
                isCheckedEnabled: this.fixedSwitchEnabled,
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
    },
    components: {
        AccordionFlush,
        InputRange,
        SwitchWithInfo
    },
    methods: {
        toggleSwitchEvent: function (switchId, value) {
            switch (switchId) {
                case "chosen": {
                    this.encapsulateOptions.nodes.chosen = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case "fixed": {
                    this.encapsulateOptions.nodes.fixed = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case "font": {
                    if (!this.fontToggled && value == true) {
                        this.encapsulateOptions.nodes.font = {};
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    }
                    this.fontToggled = value;
                    break;
                }
                case 'heightConstraint': {
                    this.encapsulateOptions.nodes.heightConstraint = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    this.heightConstraintSwitchValue = value;
                }
            }
        },
        isFontObject: function () {
            return typeof this.encapsulateOptions.nodes.font == "object";
        },
        message: function (message, value) {
            switch (message) {
                case 'update-chosen-node': {
                    this.encapsulateOptions.nodes.chosen = { node: value, label: value };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                // Not working
                case 'update-chosen-node-background-color': {
                    this.encapsulateOptions.nodes.chosen = { node: null, label: true };
                    this.encapsulateOptions.nodes.chosen.node = (values, id, selected, hovering) => {

                    }
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-color-background': {
                    this.encapsulateOptions.nodes.color = {
                        background: value
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-color-border': {
                    this.encapsulateOptions.nodes.color = {
                        border: value
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-highlight-border-color': {
                    this.encapsulateOptions.nodes.color = {
                        highlight: {
                            border: value
                        }
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-highlight-background-color': {
                    this.encapsulateOptions.nodes.color = {
                        highlight: {
                            background: value
                        }
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-hover-border-color': {
                    this.encapsulateOptions.nodes.color = {
                        hover: {
                            border: value
                        }
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'update-node-hover-background-color': {
                    this.encapsulateOptions.nodes.color = {
                        hover: {
                            background: value
                        }
                    };
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'enable-fixed-node-object-sending': {
                    this.fixedSwitchEnabled = false;
                    break;
                }
                case 'fix-nodes-x-coordinate': {
                    if (typeof this.encapsulateOptions.nodes.fixed != "object") {
                        this.encapsulateOptions.nodes.fixed = { x: false, y: false }
                    }
                    this.encapsulateOptions.nodes.fixed.x = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'fix-nodes-y-coordinate': {
                    if (typeof this.encapsulateOptions.nodes.fixed != "object") {
                        this.encapsulateOptions.nodes.fixed = { x: false, y: false }
                    }
                    this.encapsulateOptions.nodes.fixed.y = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'node-font-object-enabled': {
                    if (this.fontToggled) {
                        if (!value) {
                            this.encapsulateOptions.nodes.font = "15px arial black";
                            this.$emit('options-has-changed', this.encapsulateOptions);
                        } else {
                            this.encapsulateOptions.nodes.font = {};
                            this.$emit('options-has-changed', this.encapsulateOptions);
                        }
                        this.fontObjectOrString = value;
                    }
                    break;
                }
                case 'node-font-string': {
                    if (!this.fontObjectOrString) {
                        this.encapsulateOptions.nodes.font = value;
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    }
                }
                case 'node-font-color': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.color = value;
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-size': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.size = parseInt(value);
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-face': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.face = value;
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'enable-font-background': {
                    if (this.fontToggled && this.isFontObject()) {
                        if (value) {
                            this.encapsulateOptions.nodes.font.background = "#ffffff";
                            this.$emit('options-has-changed', this.encapsulateOptions);
                        } else {
                            this.encapsulateOptions.nodes.font.background = undefined;
                            this.$emit('options-has-changed', this.encapsulateOptions);
                        }

                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-font-background': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.background = value;
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-stroke-width': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.strokeWidth = parseInt(value);
                        this.$emit('options-has-changed', this.encapsulateOptions);
                    } else {
                        this.encapsulateOptions.nodes.font = "";
                    }
                    break;
                }
                case 'node-stroke-color': {
                    if (this.fontToggled && this.isFontObject()) {
                        this.encapsulateOptions.nodes.font.strokeColor = value;
                        this.$emit('options-has-changed', this.encapsulateOptions);
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
                            this.$emit('options-has-changed', this.encapsulateOptions);
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
                            this.$emit('options-has-changed', this.encapsulateOptions);
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
                            this.$emit('options-has-changed', this.encapsulateOptions);
                        }
                    } else {
                        this.encapsulateOptions.nodes.heightConstraint = false;
                    }
                    break;
                }
                case 'update-node-shape': {
                    this.shape = value;
                    this.encapsulateOptions.nodes.shape = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'init-icons': {
                    this.encapsulateOptions.nodes.icon = {size: 50, weight: 300};
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'update-icon-font-face': {
                    this.encapsulateOptions.nodes.icon.face = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'update-icon-code': {
                    this.encapsulateOptions.nodes.icon.code = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'update-icon-weight': {
                    this.encapsulateOptions.nodes.icon.weight = parseInt(value);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'update-icon-color': {
                    this.encapsulateOptions.nodes.icon.color = value;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }

                case 'update-icon-size': {
                    this.encapsulateOptions.nodes.icon.size = parseInt(value);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        emitOpacity: function (value) {
            this.encapsulateOptions.nodes.opacity = parseFloat(value);
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
        emitBorderWidth: function (value) {
            this.borderWidth = value;
            this.encapsulateOptions.nodes.borderWidth = parseInt(value);
            this.$emit('options-has-changed', this.encapsulateOptions);
            if (this.borderWidthSelectedDisabled) {
                this.borderWidthSelected = 2 * this.encapsulateOptions.nodes.borderWidth;
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
                this.$emit('options-has-changed', this.encapsulateOptions);
            }
        },
        onBorderWidthSelectedChange: function(value) {
            if (value) {
                this.borderWidthSelected = 2 * this.encapsulateOptions.nodes.borderWidth;
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
                this.$emit('options-has-changed', this.encapsulateOptions);
            }
            this.borderWidthSelectedDisabled = value;
        },
        updateValueBorderWidhtSelected: function (value) {
            if (!this.borderWidthSelectedDisabled) {
                this.borderWidthSelected = parseInt(value);
                this.encapsulateOptions.nodes.borderWidthSelected = this.borderWidthSelected;
                this.$emit('options-has-changed', this.encapsulateOptions);
            }
        },
        toggleHidden: function (value) {
            this.hidden = value;
            this.encapsulateOptions.nodes.hidden = value;
            this.$emit('options-has-changed', this.encapsulateOptions);
        }
    },
    emits: ['options-has-changed']
}
</script>