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
    <LabelWithTooltip v-if="this.iconSelected" :forId="'node-icon-color-picker'" :hasSwitch="false"
        :labelValue="'Cor do ícone'" :tooltip="'Options.Nodes.Icon.Color - Altere a cor do ícone do vértice.'">
    </LabelWithTooltip>
    <InputColorPicker v-if="this.iconSelected" :disabled="false" :colorPickerDefaultColor="this.iconColor"
        :colorPickerId="'node-icon-color-picker'"
        :tooltip="'Options.Nodes.Icon.Color - Altere a cor do ícone do vértice'" @update-color="updateIconColor">
    </InputColorPicker>
    <InputRange v-if="this.iconSelected" :disabled="false" :max="100" :min="1" :step="1"
        :initialValue="'' + this.iconSize" :inputId="'input-icon-size'" :isLabelEnabled="true" :labelHasSwitch="false"
        :labelValue="'Tamanho do ícone'"
        :tooltip="'Options.Nodes.Icon.Size - Altere o tamanho do ícone sendo utilizado.'"
        @update-value-from-range-input="updateIconSize"></InputRange>
    <SwitchWithInfo v-if="imageSelected || circularImageSelected" :switchDisabled="false"
        :switchId="'enable-image-object-sending'" :switchInitialValue="imageObjectSendingEnabled"
        :switchLabelEnabled="true" :switchLabelValue="'Ativar envio de objeto'" :switchTooltipEnabled="true"
        :switchTooltip="'Object.Nodes.Image (Enable Object Sending) - Clique aqui para habilitar o envio de objeto para o campo.'"
        @checkbox-status-changed="enableImageObjectSending"></SwitchWithInfo>
    <InputUrl v-if="imageSelected || circularImageSelected" :idInput="'nodes-shapes-image'"
        :labelValue="(!imageObjectSendingEnabled ? 'URL da Imagem:' : 'URL da Imagem vértice não selecionado')"
        :tooltip="`Entre com a URL da imagem a ser utilizada como vértice ${imageObjectSendingEnabled ?? `não selecionado`}.`"
        :urlInitalValue="imageUrlUnselected" @url-value-update="updateImageUrl" :placeholder="'http://www.google.com'">
    </InputUrl>
    <InputUrl v-if="(imageSelected || circularImageSelected) && imageObjectSendingEnabled"
        :idInput="'nodes-shapes-image-selected'" :labelValue="'URL da Imagem vértice selecionado:'"
        placeholder="'http://www.google.com'"
        :tooltip="'Entre com a URL da imagem a ser utilizada como vértice selecionado.'"
        :urlInitalValue="imageUrlSelected" @url-value-update="imageUrlObjectSelected"></InputUrl>
    <div class="input-group mb-1 mt-1" v-if="(imageSelected || circularImageSelected)">
        <span class="input-group-text m-0 p-0 ps-1" id="padding-image-top-label">
            <LabelWithTooltip :labelValue="'Padding da imagem - top'"
                :tooltip="'Options.nodes.imagePadding.top - Altere o valor do padding da imagem em sua componente top'"
                :forId="'padding-image-top'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.imagePading.top"
            aria-describedby="padding-image-top-label" id="padding-image-top" v-model="imagePaddingTop">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(imageSelected || circularImageSelected)">
        <span class="input-group-text m-0 p-0 ps-1" id="padding-image-bottom-label">
            <LabelWithTooltip :labelValue="'Padding da imagem - bottom'"
                :tooltip="'Options.nodes.imagePadding.bottom - Altere o valor do padding da imagem em sua componente bottom'"
                :forId="'padding-image-bottom'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.imagePading.bottom"
            aria-describedby="padding-image-bottom-label" id="padding-image-bottom" v-model="imagePaddingBottom">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(imageSelected || circularImageSelected)">
        <span class="input-group-text m-0 p-0 ps-1" id="padding-image-left-label">
            <LabelWithTooltip :labelValue="'Padding da imagem - left'"
                :tooltip="'Options.nodes.imagePadding.left - Altere o valor do padding da imagem em sua componente left'"
                :forId="'padding-image-left'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.imagePading.left"
            aria-describedby="padding-image-left-label" id="padding-image-left" v-model="imagePaddingLeft">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(imageSelected || circularImageSelected)">
        <span class="input-group-text m-0 p-0 ps-1" id="padding-image-right-label">
            <LabelWithTooltip :labelValue="'Padding da imagem - right'"
                :tooltip="'Options.nodes.imagePadding.right - Altere o valor do padding da imagem em sua componente right'"
                :forId="'padding-image-right'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.imagePading.right"
            aria-describedby="padding-image-right-label" id="padding-image-right" v-model="imagePaddingRight">
    </div>

    <div class="input-group mb-1 mt-1" v-if="(marginLabelEnabled)">
        <span class="input-group-text m-0 p-0 ps-1" id="margin-label-top-label">
            <LabelWithTooltip :labelValue="'Margem do rótulo - top'"
                :tooltip="'Options.nodes.margin.top - Altere o valor do margin do róduto do vértice em sua componente top'"
                :forId="'margin-label-top'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.margin.top"
            aria-describedby="margin-label-top-label" id="margin-label-top" v-model="marginLabelTop">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(marginLabelEnabled)">
        <span class="input-group-text m-0 p-0 ps-1" id="margin-label-bottom-label">
            <LabelWithTooltip :labelValue="'Margem do rótulo - bottom'"
                :tooltip="'Options.nodes.margin.bottom - Altere o valor do margin do róduto do vértice em sua componente bottom'"
                :forId="'margin-label-bottom'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.margin.bottom"
            aria-describedby="margin-label-bottom-label" id="margin-label-bottom" v-model="marginLabelBottom">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(marginLabelEnabled)">
        <span class="input-group-text m-0 p-0 ps-1" id="margin-label-left-label">
            <LabelWithTooltip :labelValue="'Margem do rótulo - left'"
                :tooltip="'Options.nodes.margin.left - Altere o valor do margin do róduto do vértice em sua componente left'"
                :forId="'margin-label-left'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.margin.left"
            aria-describedby="margin-label-left-label" id="margin-label-left" v-model="marginLabelLeft">
    </div>
    <div class="input-group mb-1 mt-1" v-if="(marginLabelEnabled)">
        <span class="input-group-text m-0 p-0 ps-1" id="margin-label-right-label">
            <LabelWithTooltip :labelValue="'Margem do rótulo - right'"
                :tooltip="'Options.nodes.margin.right - Altere o valor do margin do róduto do vértice em sua componente right'"
                :forId="'margin-label-right'" :hasSwitch="false"></LabelWithTooltip>
        </span>
        <input type="number" class="form-control" placeholder="0" aria-label="Options.nodes.margin.right"
            aria-describedby="margin-label-right-label" id="margin-label-right" v-model="marginLabelRight">
    </div>

    <InputTextArea v-if="customSelected" :inputId="'options-nodes-shape-custom'" :inputEnabled="isCustomInputEnabled"
        :inputInitialValue="customValue" :inputPlaceholder="'//Input the javascript function'" :inputRows="15"
        :isLabelEnabled="true" :labelValue="'Editar customização do CTX Renderer'"
        :tooltip="'Options.Nodes.ctxRenderer - Edite a função de crição de formas personalizadas com o CTX Renderer'"
        :hasSwitch="true" :switchId="'options-nodes-shape-custom-enable-code'"
        :switchTooltip="'Options.Nodes.ctxRenderer Enable code editing - Ative a edição de código'"
        :switchInitialValue="isCustomInputEnabled" :switchLabelEnabled="false"
        @checkbox-value-change="enableCtxRendererEditing" @input-value-change="updateCustomValue"></InputTextArea>
    <!-- //Insert modal component with some examples. -->
    <button @click.prevent="updateNodeCustomShape" v-if="isCustomInputEnabled"
        class="btn btn-primary form-control mt-1">Atualizar função de desenho do vértice</button>

    <div class="m-1 p-1 border" v-if="this.shape == 'image' || this.shape == 'circularImage'">
        <SwitchWithInfo v-if="this.shape == 'image'" :switchId="'options-nodes-shapesProperties-useBorderWithImage'"
            :switchDisabled="false" :switchInitialValue="useBorderWithImage" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.ShapeProperties.UseBorderWithImage - Esta propriedade se aplica apenas ao formato da imagem. Quando verdadeiro, o objeto colorido é usado. Um retângulo com a cor de fundo é desenhado atrás dele e possui uma borda. Isto significa que todas as opções de fronteira são levadas em consideração.'"
            :switchLabelEnabled="true" :switchLabelValue="'Usar borda na imagem'"
            @checkbox-status-changed="changeUseBorderWithImage"></SwitchWithInfo>
        <SwitchWithInfo :switchId="'options-nodes-shapesProperties-interpolation'" :switchDisabled="false"
            :switchInitialValue="imageInterpolation" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.ShapeProperties.Interpolation - Esta propriedade se aplica apenas às formas image e circularImage. Quando verdadeiro, a imagem é reamostrada quando reduzida, resultando em uma imagem melhor ao custo do tempo computacional.'"
            :switchLabelEnabled="true" :switchLabelValue="'Interpolação de Imagem'"
            @checkbox-status-changed="changeImageInterpolation"></SwitchWithInfo>
        <SwitchWithInfo :switchId="'options-nodes-shapesProperties-useImageSize'" :switchDisabled="false"
            :switchInitialValue="useImageSize" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.ShapeProperties.UseImageSize - Esta propriedade se aplica apenas às formas image e circularImage. Quando falso, é utilizada a opção tamanho, quando verdadeiro, é utilizado o tamanho da imagem. Importante: se estiver definido como verdadeiro, a imagem não poderá ser dimensionada com a opção de valor!'"
            :switchLabelEnabled="true" :switchLabelValue="'Tamanho original da Imagem'"
            @checkbox-status-changed="changeUseImageSize"></SwitchWithInfo>
        <LabelWithTooltip :labelValue="'Coordenada de origem:'"
            :tooltip="'Options.Nodes.ShapeProperties.CoordinateOrigin - Esta propriedade se aplica apenas às formas image e circularImage. Decide se (x, y) do nó será o centro da imagem ou o canto superior esquerdo.'"
            :forId="'options-nodes-shapeProperties-coordinateOrigin'" :hasSwitch="false"></LabelWithTooltip>
        <InputSelect :selectId="'options-nodes-shapeProperties-coordinateOrigin'" :options="[
            { value: 'center', label: 'Centro', selected: true },
            { value: 'top-left', label: 'Topo Esquerdo', selected: false },
        ]" :disabled="false" @update-selection="changeCoordinateOrigin"></InputSelect>
    </div>
    <div class="m-1 p-1 border"
        v-if="(this.shape != 'text' && this.shape != 'image' && this.shape != 'icon' && this.shape != 'custom') || (shape == 'image' && useBorderWithImage)">
        <SwitchWithInfo :switchId="'options-nodes-shapeProperties-borderDashes'" :switchDisabled="false"
            :switchInitialValue="borderDashesEnabled" :switchTooltipEnabled="true"
            :switchTooltip="'Options.Nodes.ShapeProperties.BorderDashes - Esta propriedade se aplica a todas as formas que possuem bordas. Você define os travessões fornecendo um Array. Formato da matriz: [comprimento do traço, comprimento do intervalo]. Você também pode usar um booleano, false é desabilitado e true é o padrão [5,15].'"
            :switchLabelEnabled="true" :switchLabelValue="'Traços na borda'"
            @checkbox-status-changed="changeBorderDashesEnabled"></SwitchWithInfo>
        <InputRange v-if="borderDashesEnabled" :inputId="'options-nodes-shapeProperties-borderDashes-dashSize'"
            :isLabelEnabled="true" :min="1" :max="100" :step="1" :initialValue="borderDashesDashSize"
            :labelValue="'Tamanho do traço:'"
            :tooltip="'Options.Nodes.ShapeProperties.BorderDashes.DashSize - Tamanho do traço.'" :disabled="false"
            @update-value-from-range-input="changeBorderDashesDashSize"></InputRange>
        <InputRange v-if="borderDashesEnabled" :inputId="'options-nodes-shapeProperties-borderDashes-emptySize'"
            :isLabelEnabled="true" :min="1" :max="100" :step="1" :initialValue="borderDashesEmptySize"
            :labelValue="'Tamanho do espaço:'"
            :tooltip="'Options.Nodes.ShapeProperties.BorderDashes.EmptySize - Tamanho do espaço.'" :disabled="false"
            @update-value-from-range-input="changeBorderDashesEmptySize"></InputRange>
    </div>
    <div class="m-1 p-1 border" v-if="this.shape == 'box'">
        <InputRange :inputId="'options-nodes-shapeProperties-borderRadius'" :isLabelEnabled="true" :min="1" :max="100"
            :step="1" :initialValue="boxBorderRadius" :labelValue="'Raio da borda:'"
            :tooltip="'Options.Nodes.ShapeProperties.BorderRadius - Esta propriedade é usada apenas para o formato de caixa. Permite determinar a redondeza dos cantos da forma.'"
            :disabled="false" @update-value-from-range-input="changeBoxBorderRadius"></InputRange>
    </div>
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
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
export default {
    name: "Shape Node Accordion",
    props: ['checkboxValue', 'bsModalReturnValue', 'openBsModal'],
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
            imageUrlUnselected: new URL(`/public/images/paad_logo.png`, import.meta.url).href,
            imageUrlSelected: new URL(`/public/images/paad_logo_frio_e_dramático.png`, import.meta.url).href,

            //Custom selected
            customValue: "",
            isCustomInputEnabled: false,
            customFunction: null,

            //Image relative variables
            imagePaddingTop: 0,
            imagePaddingBottom: 0,
            imagePaddingLeft: 0,
            imagePaddingRight: 0,

            //Margin Label for box, circle, database, icon or text
            marginLabelEnabled: false,
            marginLabelTop: 5,
            marginLabelBottom: 5,
            marginLabelRight: 5,
            marginLabelLeft: 5,

            // ShapeProperties
            borderDashesEnabled: false,
            borderDashesDashSize: "5",
            borderDashesEmptySize: "15",

            boxBorderRadius: 6,

            imageInterpolation: true,
            useImageSize: false,
            useBorderWithImage: false,
            coordinateOrigin: "center",
        }
    },
    components: {
        InputSelect,
        LabelWithTooltip,
        InputSelectSearch,
        InputRange,
        InputColorPicker,
        InputUrl,
        SwitchWithInfo,
        InputTextArea
    },
    mounted() {

    },
    methods: {
        updateCustomValue: function (value) {
            this.customValue = value
        },
        updateNodeCustomShape: function () {
            try {
                this.customFunction = eval(this.customValue);
                this.$emit("message", "custom-render-node-update", this.customFunction);
            } catch (ex) {
                this.$emit("message", "send-toast", {
                    toastTitle: "Erro!",
                    toastIcon: "fa-circle-exclamation",
                    toastBody: "Não foi possível utilizar sua função função para rendereização. Atualize sua página.",
                    toastClasses: " bg-danger text-black"
                });
            }
        },
        updateNodeShape: function (value) {
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

                import('./scripts/ctxBaseRenderer.js?raw')
                    .then(res => res.default)
                    .then((t) => {
                        //const s = document.querySelector('#app');
                        this.customValue = t;
                        this.customFunction = eval(t);

                        if (this.customFunction != null) {
                            this.$emit("message", "custom-render-node-update", this.customFunction);
                            this.$emit("message", "update-node-shape", value);
                            this.$emit("message", "send-toast", {
                                toastTitle: "Cuidado",
                                toastIcon: "fa-circle-exclamation",
                                toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela! Você pode aprender a desenhar no canvas usando <a class='text-white' href='https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes'>este link</a>.",
                                toastClasses: " bg-danger text-black"
                            });
                        }
                    });

            } else {
                this.customSelected = false;
                this.iconSelected = false;
                this.imageSelected = false;
                this.circularImageSelected = false;
                this.marginLabelEnabled = false;
                this.$emit("message", "update-node-shape", value);
            }

            if (value == 'box' || value == 'circle' || value == 'database' || value == 'icon' || value == 'text') {
                this.marginLabelEnabled = true;
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
                        code: '<i class="icon ' + IonIcons[icons].id + ' me-2"></i>',
                        label: IonIcons[icons].id
                    })
                }
                this.iconsOptions = options
                this.$emit("message", "init-icons", null);
                this.$emit("message", "update-icon-font-face", '"IonIcons"');
                this.$emit("message", "update-icon-code", String.fromCharCode(parseInt("f2d2", 16)));
                this.iconSelected = true;
                this.iconsNodeFontFace = 'ionIcons';
                this.iconSelectedOption = { id: "f3a0", code: "<i class=\"icon ion-android-person me-2\"></i>", label: "ion-android-person" };
            }
            this.$emit("message", 'update-icon-color', this.iconColor);
        },
        updateIconColor: function (newValue) {
            this.iconColor = newValue;
            this.$emit("message", 'update-icon-color', newValue);
        },
        updateIconSize: function (value) {
            this.iconSize = parseInt(value);
            this.$emit("message", 'update-icon-size', value);
        },
        updateImageUrl: function (value) {
            this.imageUrlUnselected = value;
            this.$emit("message", "update-image-url", value);
            if (this.alreadyTransmitedImage) {
                this.$emit("message", "update-canvas-key-change", true);
            }
            this.alreadyTransmitedImage = true;
        },
        imageUrlObjectSelected: function (value) {
            this.imageUrlSelected = value;
            this.$emit("message", "update-image-url-selected", [value, this.imageUrlUnselected, this.imageUrlSelected]);
        },
        enableImageObjectSending: function (value) {
            this.imageObjectSendingEnabled = value;
        },
        enableCtxRendererEditing: function (value) {
            this.isCustomInputEnabled = value;
        },
        changeBorderDashesEnabled: function (value) {
            this.borderDashesEnabled = value;
            this.$emit('message', 'options.nodes.shapeProperties.borderDashes', value);
        },
        changeBorderDashesDashSize: function (value) {
            this.borderDashesDashSize = value;
            this.$emit('message', 'options.nodes.shapeProperties.borderDashes.dashSize', value);
        },
        changeBorderDashesEmptySize: function (value) {
            this.borderDashesEmptySize = value;
            this.$emit('message', 'options.nodes.shapeProperties.borderDashes.emptySize', value);
        },
        changeBoxBorderRadius: function (value) {
            this.boxBorderRadius = value;
            this.$emit('message', 'options.nodes.shapeProperties.borderRadius', value);
        },
        changeImageInterpolation: function (value) {
            this.imageInterpolation = value;
            this.$emit("message", "options.nodes.shapeProperties.interpolation", value);
        },
        changeUseImageSize: function (value) {
            this.useImageSize = value;
            this.$emit("message", "options.nodes.shapeProperties.useImageSize", value);
        },
        changeUseBorderWithImage: function (value) {
            this.useBorderWithImage = value;
            this.$emit("message", "options.nodes.shapeProperties.useBorderWithImage", value);
        },
        changeCoordinateOrigin: function(value) {
            this.coordinateOrigin = value;
            this.$emit("message", "options.nodes.shapeProperties.coordinateOrigin", value);
        }
    },
    watch: {
        imageObjectSendingEnabled: function (newValue, oldValue) {
            if (!newValue && oldValue) {
                this.imageUrlSelected = this.imageUrlUnselected;
                this.$emit("message", "update-image-url-selected", [false, this.imageUrlUnselected, this.imageUrlUnselected]);
            }
        },
        imagePaddingTop: function (newValue, oldValue) {
            this.$emit("message", "update-image-padding-top", newValue);
        },
        imagePaddingBottom: function (newValue, oldValue) {
            this.$emit("message", "update-image-padding-bottom", newValue);
        },
        imagePaddingLeft: function (newValue, oldValue) {
            this.$emit("message", "update-image-padding-left", newValue);
        },
        imagePaddingRight: function (newValue, oldValue) {
            this.$emit("message", "update-image-padding-right", newValue);
        },
        marginLabelTop: function (newValue, oldValue) {
            this.$emit("message", "update-label-marging-top", newValue);
        },
        marginLabelBottom: function (newValue, oldValue) {
            this.$emit("message", "update-label-marging-bottom", newValue);
        },
        marginLabelLeft: function (newValue, oldValue) {
            this.$emit("message", "update-label-marging-left", newValue);
        },
        marginLabelRight: function (newValue, oldValue) {
            this.$emit("message", "update-label-marging-right", newValue);
        },
    },
    emits: ["message", "open-bs-modal"]
}
</script>