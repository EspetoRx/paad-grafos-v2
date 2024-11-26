<template>
    <div class="accordion accordion-flush mt-1" id="accordionFlushStabilization">
        <div class="accordion-item">
            <div class="accordion-header" id="flush-stabilization">
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseStabilization" aria-expanded="false"
                    aria-controls="flush-collapseStabilization" id="collapseStabilization"
                    @click.prevent="this.stabilizationEnabled = !this.stabilizationEnabled">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            Estabilização
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            title="Quando verdadeiro, o grafo é estabilizado no carregamento usando as configurações padrão.
                                    Se falso, a estabilização é desabilitada. Para customizar isso no futuro, pode-se fornecer um objeto.">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <div id="flush-collapseStabilization" class="accordion-collapse collapse"
                aria-labelledby="flush-stabilization" data-bs-parent="#accordionFlushStabilization">
                <div class="accordion-body">
                    <div class="row">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                                id="switchPhysicsEnableStabilization" :checked="this.enablePhysicsStabilization"
                                v-model="this.enablePhysicsStabilization">
                            <label class="form-check-label" for="switchPhysicsEnableStabilization"
                                data-bs-toggle="tooltip"
                                title="Alterne a estabilização. Esta é uma propriedade opcional. Se indefinido, será automaticamente definido como verdadeiro quando qualquer uma das propriedades deste objeto for definida.">Habilitado
                                (Enabled)</label>
                        </div>
                        <div class="input-group input-group-sm p-0 mb-1">
                            <span class="input-group-text" id="addon-physics-stabilization-iterations-label"
                                data-bs-toggle="tooltip"
                                title="O módulo de física tenta estabilizar o grafo durante a carga até um número máximo de iterações definido aqui. Se o grafo se estabilizou com menos, você terminou antes do número máximo.">Iterações
                                (I):</span>
                            <input type="number" min="0" step="1" class="form-control"
                                placeholder="stabilizationIterations" aria-label="stabilizationIterations"
                                aria-describedby="addon-physics-stabilization-iterations-label"
                                id="physics-stabilization-iterations" v-model="this.stabilizationIterations">
                        </div>
                        <div class="input-group input-group-sm p-0 mb-1">
                            <span class="input-group-text" id="addon-physics-stabilization-updateInterval-label"
                                data-bs-toggle="tooltip"
                                title="Ao estabilizar, o DOM pode congelar. Você pode dividir a estabilização em pedaços para mostrar uma barra de carregamento, por exemplo. O intervalo determina após quantas iterações o evento stabilizationProgress é acionado.">Intervalo
                                de Atualização (U. I.):</span>
                            <input type="number" min="0" step="1" class="form-control"
                                placeholder="stabilizationUpdateInterval" aria-label="stabilizationUpdateInterval"
                                aria-describedby="addon-physics-stabilization-updateInterval-label"
                                id="physics-stabilization-updateInterval" v-model="this.stabilizationUpdateInterval">
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="physicsOnlyDinamycEdges" :checked="this.onlyDynamicEdges" v-model="this.onlyDynamicEdges">
                            <label class="form-check-label" for="physicsOnlyDinamycEdges" data-bs-toggle="tooltip"
                                title="Se você predefiniu a posição de todos os vértices e deseja estabilizar apenas as arestas suaves dinâmicas, defina isso como verdadeiro. Ele congela todos os vértices, exceto os vértices de suporte de curva suave dinâmica invisível. Se você deseja que os vértices visíveis se movam e se estabilizem, não use isto.">Somente
                                Arestas Dinâmcias
                                (O. D. E.)</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="physicsStabilizationFit" :checked="this.fit" v-model="this.fit">
                            <label class="form-check-label" for="physicsStabilizationFit" data-bs-toggle="tooltip"
                                title="Alterne se deseja ou não que a visualização seja ampliada para caber em todos os nós quando a estabilização for concluída.">Ajsute
                                (Fit)</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import * as Vue from 'vue';

export default {
    name: "Stabilization",
    props: [
        'options',
        'localNetwork'
    ],
    data() {
        return {
            encapsulateOptions: null,
            encapsulateLocalNetwork: null,
            stabilizationEnabled: false,
            enablePhysicsStabilization: false,
            stabilizationIterations: 0,
            stabilizationUpdateInterval: 0,
            onlyDynamicEdges: false,
            fit: false,
        }
    },
    watch: {

        stabilizationEnabled: function (newStabilizationEnabled, oldStabilizationEnabled) {
            this.encapsulateOptions = this.options;
            this.encapsulateLocalNetwork = Vue.toRaw(this.localNetwork);
            this.enablePhysicsStabilization = this.encapsulateOptions.physics.stabilization.enabled;
            this.stabilizationIterations = this.encapsulateOptions.physics.stabilization.iterations;
            this.stabilizationUpdateInterval = this.encapsulateOptions.physics.stabilization.updateInterval;
            this.onlyDynamicEdges = this.encapsulateOptions.physics.stabilization.onlyDynamicEdges;
            this.fit = this.encapsulateOptions.physics.stabilization.fit;
        },

        enablePhysicsStabilization: function (newEnablePhysicsStabilization, oldEnablePhysicsStabilization) {
            this.encapsulateOptions.physics.stabilization.enabled = newEnablePhysicsStabilization;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        stabilizationIterations: function(newStabilizationIterations, oldStabilizationIterations) {
            this.encapsulateOptions.physics.stabilization.iterations = newStabilizationIterations;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        stabilizationUpdateInterval: function(newStabilizationUpdateInterval, oldStabilizationUpdateInterval) {
            this.encapsulateOptions.physics.stabilization.updateInterval = newStabilizationUpdateInterval;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        onlyDynamicEdges: function(newonlyDynamicEdges, oldonlyDynamicEdges) {
            this.encapsulateOptions.physics.stabilization.onlyDynamicEdges = newonlyDynamicEdges;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        fit: function(newFit, oldFit) {
            this.encapsulateOptions.physics.stabilization.fit = newFit;
            this.$emit('options-has-changed', this.encapsulateOptions);
        }
    },
    emits: ['options-has-changed']
}
</script>