<template>
    <LabelWithTooltip :forId="'node-shape-select'" :hasSwitch="false" :labelValue="'Selecione a forma desejada'"
        :switchDisabled="false"
        :tooltip="'Options.Nodes.Shape - Os tipos com o rótulo dentro são: elipse, círculo, banco de dados, caixa, texto. Aqueles com o rótulo fora são: imagem, circularImage, diamante, ponto, estrela, triângulo, triângulo para baixo, hexágono, quadrado e ícone. Se nenhuma dessas formas for suficiente, você pode usar a forma personalizada que permitirá criar sua própria forma renderizada por meio da opção ctxRenderer.'">
    </LabelWithTooltip>
    <InputSelect :selectId="'node-shape-select'" :options="this.options" :disabled="false"
        @update-selection="updateNodeShape"></InputSelect>
    <LabelWithTooltip v-if="this.iconSelected" :forId="'node-font-face'" :hasSwitch="false"
        :labelValue="'Selecione a fonte dos Ícones'" :switchDisabled="false"
        :tooltip="'Options.Nodes.Icon.Face - Escolha a fonte do ícones que irá utilizar.'">
    </LabelWithTooltip>
    <InputSelect v-if="this.iconSelected" :selectId="'node-font-face'" :options="[
        { value: 'fontAwesome', label: 'FontAwesome', selected: true },
        { value: 'ionIcons', label: 'IonIcons', selected: false },
    ]" :disabled="false" @update-selection="updateNodeFontFace"></InputSelect>
    <LabelWithTooltip v-if="this.iconSelected" :forId="'icon-multiselect-option'" :hasSwitch="false"
        :labelValue="'Selecione o ícone desejado'" :switchDisabled="false"
        :tooltip="'Options.Nodes.Icon.Code - Escolha o ícone que quer usar nos vértices.'">
    </LabelWithTooltip>
    <InputSelectSearch v-if="this.iconSelected" :placeholder="'Escolha um ícone'" @option-chosen="iconsOptionSelected"
        :options="this.iconsOptions" :selectId="'icon-multiselect-option'" :isDisabled="false"
        :selected="this.iconSelectedOption"></InputSelectSearch>
    <InputRange v-if="this.iconSelected" :disabled="false" :max="900" :min="this.minWeight" :step="100"
        :initialValue="this.iconWeight" :inputId="'input-icon-weight'" :isLabelEnabled="true" :labelHasSwitch="false"
        :labelValue="'Grossura da fonte do ícone'"
        :tooltip="'Options.Nodes.Icon.Weight - Altere a grossura da fonte. Alguns ícone não tem grossura mais fina.'"
        @update-value-from-range-input="updateIconWeight"></InputRange>
    <LabelWithTooltip
        v-if="this.iconSelected"
        :forId="'node-icon-color-picker'"
        :hasSwitch="false"
        :labelValue="'Cor do ícone'"
        :tooltip="'Options.Nodes.Icon.Color - Altere a cor do ícone do vértice.'"
    ></LabelWithTooltip>
    <InputColorPicker
        v-if="this.iconSelected"
        :disabled="false"
        :colorPickerDefaultColor="this.iconColor"
        :colorPickerId="'node-icon-color-picker'"
        :tooltip="'Options.Nodes.Icon.Color - Altere a cor do ícone do vértice'"
        @update-color="updateIconColor"
    ></InputColorPicker>
    <InputRange v-if="this.iconSelected" :disabled="false" :max="100" :min="1" :step="1"
        :initialValue="''+this.iconSize" :inputId="'input-icon-size'" :isLabelEnabled="true" :labelHasSwitch="false"
        :labelValue="'Tamanho do ícone'"
        :tooltip="'Options.Nodes.Icon.Size - Altere o tamanho do ícone sendo utilizado.'"
        @update-value-from-range-input="updateIconSize"></InputRange>
    <SwitchWithInfo
        v-if="imageSelected || circularImageSelected"
        :switchDisabled="false"
        :switchId="'enable-image-object-sending'"
        :switchInitialValue="imageObjectSendingEnabled"
        :switchLabelEnabled="true"
        :switchLabelValue="'Ativar envio de objeto'"
        :switchTooltipEnabled="true"
        :switchTooltip="'Object.Nodes.Image (Enable Object Sending) - Clique aqui para habilitar o envio de objeto para o campo.'"
        @checkbox-status-changed="enableImageObjectSending"
    ></SwitchWithInfo>
    <InputUrl
        v-if="imageSelected || circularImageSelected"
        :idInput="'nodes-shapes-image'"
        :labelValue="'URL da Imagem:'"
        placeholder="'http://www.google.com'"
        :tooltip="'Entre com a URL da imagem a ser utilizada como vértice.'"
        :urlInitalValue="imageUrl"
        @url-value-update="updateImageUrl"
    ></InputUrl>
</template>
<script>
import InputSelect from '../Common/Inputs/InputSelect.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputSelectSearch from '../Common/Inputs/InputSelectSearch.vue';
import FontAwesomeJsonIcons from '../../assets/FontAwesomeIcons.json';
import IonIcons from '../../assets/IonIcons.json';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import InputUrl from '../Common/Inputs/InputUrl.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
export default {
    name: "Shape Node Accordion",
    props: ['checkboxValue'],
    data() {
        return {
            shape: 'ellipse',
            options: [
                { value: 'ellipse', label: 'Elípse', selected: true, group: 'Rótulo Dentro' },
                { value: 'circle', label: 'Círculo', selected: false, group: 'Rótulo Dentro' },
                { value: 'database', label: 'Base de dados?', selected: false, group: 'Rótulo Dentro' },
                { value: 'box', label: 'Caixa', selected: false, group: 'Rótulo Dentro' },
                { value: 'text', label: 'Texto', selected: false, group: 'Rótulo Dentro' },
                { value: 'image', label: 'Imagem', selected: false, group: 'Rótulo Fora' },
                { value: 'circularImage', label: 'Imagem Circular', selected: false, group: 'Rótulo Fora' },
                { value: 'diamond', label: 'Diamante', selected: false, group: 'Rótulo Fora' },
                { value: 'star', label: 'Estrela', selected: false, group: 'Rótulo Fora' },
                { value: 'triangle', label: 'Triângulo', selected: false, group: 'Rótulo Fora' },
                { value: 'triangleDown', label: 'Triângulo Invertido', selected: false, group: 'Rótulo Fora' },
                { value: 'hexagon', label: 'Exágono', selected: false, group: 'Rótulo Fora' },
                { value: 'square', label: 'Quadrado', selected: false, group: 'Rótulo Fora' },
                { value: 'icon', label: 'Ícone', selected: false, group: 'Rótulo Fora' },
                { value: 'custom', label: 'Customizado CTX Render', selected: false, group: 'Customizado' },
            ],
            imageSelected: false,
            alreadyTransmitedImage: false,
            circularImageSelected: false,
            iconSelected: false,
            customSelected: false,
            iconsNodeFontFace: '',
            iconsOptions: [],
            iconSelectedOption: { id: "f111", code: "<i class=\"fa-solid fa-circle me-2\"></i>", label: "Circle", style: "solid" },
            iconWeight: 200,
            minWeight: 200,
            iconColor: '#2B7CE9',
            iconSize: 50,

            ///////////////////// Imagens
            imageObjectSendingEnabled: false,
            imageUrl: new URL(`/public/images/paad_logo.png`, import.meta.url).href,
        }
    },
    components: {
        InputSelect,
        LabelWithTooltip,
        InputSelectSearch,
        InputRange,
        InputColorPicker,
        InputUrl,
        SwitchWithInfo
    },
    mounted() {
        
    },
    methods: {
        updateNodeShape: function (value) {
            console.log("Updated selection: " + value);
            this.shape = value;
            if (value == 'image') {
                this.imageSelected = true;
                this.circularImageSelected = false;
                this.iconSelected = false;
                this.customSelected = false;
                this.$emit("message", "update-node-shape", value);
            } else if (value == 'circularImage') {
                this.circularImageSelected = true;
                this.imageSelected = false;
                this.iconSelected = false;
                this.customSelected = false;
                this.$emit("message", "update-node-shape", value);
            } else if (value == 'icon') {
                this.$emit("message", "init-icons", null);
                this.$emit("message", "update-icon-font-face", '\'Font Awesome 6 Free\'');
                this.$emit("message", "update-icon-code", String.fromCharCode(parseInt(this.iconSelectedOption.id, 16)));
                this.iconSelected = true;
                this.imageSelected = false;
                this.circularImageSelected = false;
                this.customSelected = false;
                this.iconsNodeFontFace = 'fontAwesome';
                this.$emit("message", "update-node-shape", value);
            } else if (value == 'custom') {
                this.customSelected = true;
                this.iconSelected = false;
                this.imageSelected = false;
                this.circularImageSelected = false;
            } else {
                this.$emit("message", "update-node-shape", value);
            }
        },
        iconsOptionSelected: function (newValue) {
            this.iconSelectedOption = newValue;
            if (Object.hasOwn(newValue, 'style')) {
                if (newValue.style == "brands") {
                    if (this.iconsNodeFontFace == 'fontAwesome') {
                        this.iconWeight = '200';
                        this.minWeight = '200';
                        this.$emit("message", "update-icon-weight", 200);
                        this.$emit("message", "update-icon-font-face", '"Font Awesome 6 Brands"');
                    }
                } else {
                    if (this.iconsNodeFontFace == 'fontAwesome') {
                        this.iconWeight = '600';
                        this.minWeight = '600';
                        this.$emit("message", "update-icon-weight", 600);
                        this.$emit("message", "update-icon-font-face", '"Font Awesome 6 Free"');
                    }
                }
            } else {
                if (this.iconsNodeFontFace == 'ionIcons') {
                    this.iconWeight = '100';
                    this.minWeight = '100';
                    this.$emit("message", "update-icon-weight", 100);
                    this.$emit("message", "update-icon-font-face", '\'IonIcons\'');
                }
            }
            this.$emit("message", "update-icon-code", String.fromCharCode(parseInt(this.iconSelectedOption.id, 16)));
            this.$emit("message", 'update-icon-color', this.iconColor);
        },
        updateIconWeight: function (value) {
            this.$emit("message", "update-icon-weight", value);
        },
        updateNodeFontFace: function (value) {
            this.iconSelected = value;
            if (value == 'fontAwesome') {
                let options = []
                for (var prop in FontAwesomeJsonIcons) {
                    if (Object.prototype.hasOwnProperty.call(FontAwesomeJsonIcons, prop)) {
                        options.push({
                            id: FontAwesomeJsonIcons[prop].unicode,
                            code: '<i class="fa-' + FontAwesomeJsonIcons[prop].styles[0] + ' fa-' + prop + ' me-2"></i>',
                            label: FontAwesomeJsonIcons[prop].label,
                            style: FontAwesomeJsonIcons[prop].styles[0]
                        });
                    }
                }
                this.iconsOptions = options;
                this.$emit("message", "init-icons", null);
                this.$emit("message", "update-icon-font-face", '\'Font Awesome 6 Free\'');
                this.$emit("message", "update-icon-code", String.fromCharCode(parseInt(this.iconSelectedOption.id, 16)));
                this.iconSelected = true;
                this.iconsNodeFontFace = 'fontAwesome';
                this.iconSelectedOption = { id: "f111", code: "<i class=\"fa-solid fa-circle me-2\"></i>", label: "Circle", style: "solid" };
            } else if (value == 'ionIcons') {
                let options = [];
                for (var icons in IonIcons) {
                    options.push({
                        id: IonIcons[icons].value,
                        code: '<i class="icon '+IonIcons[icons].id+' me-2"></i>',
                        label: IonIcons[icons].id
                    })
                }
                this.iconsOptions = options
                this.$emit("message", "init-icons", null);
                this.$emit("message", "update-icon-font-face", '"IonIcons"');
                this.$emit("message", "update-icon-code", String.fromCharCode(parseInt("f2d2", 16)));
                this.iconSelected = true;
                this.iconsNodeFontFace = 'ionIcons';
                this.iconSelectedOption = { id: "f3a0", code: "<i class=\"icon ion-android-person me-2\"></i>", label: "ion-android-person"};
            }
            this.$emit("message", 'update-icon-color', this.iconColor);
        },
        updateIconColor: function(newValue) {
            this.iconColor = newValue;
            this.$emit("message", 'update-icon-color', newValue);
        },
        updateIconSize: function(value) {
            this.iconSize = parseInt(value);
            this.$emit("message", 'update-icon-size', value);
        },
        updateImageUrl: function(value) {
            this.imageUrl = value;
            this.$emit("message", "update-image-url", value);
            if (this.alreadyTransmitedImage) {
                this.$emit("message", "update-canvas-key-change", true);
            }
            this.alreadyTransmitedImage = true;
        },
        enableImageObjectSending: function(value) {
            this.imageObjectSendingEnabled = value;
        }
    },
    emits: ["message"]
}
</script>