<template>
    <h5 class="mt-1">Resolvedores (Solvers) </h5>
    <div class="accordion accordion-flush mt-1" id="accordionFlushExample">
        <div class="accordion-item">
            <div class="accordion-header d-flex align-items-center" id="flush-headingOne">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switchEnabledBarnesHut"
                        :checked="this.solvers.barnesHut" :disabled="this.solvers.barnesHut"
                        v-model="this.solvers.barnesHut">
                </div>
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne"
                    id="accordionBarnesHut" @click.prevent="this.clickEnable('barnesHut')">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            BarnesHut
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" title="BarnesHut é um modelo gravitacional baseado em quadtree. 
                                Este é o resolvedor mais rápido, padrão e recomendado para layouts não hierárquicos.">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <solver-parameters :ariaControls="'flush-collapseOne'" :ariaLabelledBy="'flush-headingOne'"
                :options="this.encapsulateOptions" :localNetwork="this.encapsulateLocalNetwork" :solver="'barnesHut'"
                :solverEnabled="this.barnesHutEnabled"
                @options-has-changed="this.optionsHasChanged"></solver-parameters>
        </div>
        <div class="accordion-item">
            <div class="accordion-header d-flex align-items-center" id="flush-headingTwo">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switchEnabledForceAtlas2Based"
                        :checked="this.solvers.forceAtlas2Based" :disabled="this.solvers.forceAtlas2Based"
                        v-model="this.solvers.forceAtlas2Based">
                </div>
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo"
                    id="accordionForceAtlas2Based" @click.prevent="this.clickEnable('forceAtlas2Based')">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            ForceAtlas2Based
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            title="Force Atlas 2 foi desenvolvido por Jacomi et al (2014) para uso com Gephi. 
                                    O resolvedor forceAtlas2Based faz uso de algumas das equações fornecidas por eles e da implementação barnesHut no Vis. 
                                    As principais diferenças são o modelo de gravidade central, que aqui é independente da distância, e a repulsão sendo linear em vez de quadrática. 
                                    Finalmente, todas as massas dos vértices possuem um multiplicador baseado na quantidade de arestas conectadas mais um.">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <solver-parameters :ariaControls="'flush-collapseTwo'" :ariaLabelledBy="'flush-headingTwo'"
                :options="this.encapsulateOptions" :localNetwork="this.encapsulateLocalNetwork"
                :solver="'forceAtlas2Based'" :solverEnabled="this.forceAtlas2BasedEnabled"
                @options-has-changed="this.optionsHasChanged"></solver-parameters>
        </div>
        <div class="accordion-item">
            <div class="accordion-header d-flex align-items-center" id="flush-headingThree">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switchEnabledRepulsion"
                        :checked="this.solvers.repulsion" v-model="this.solvers.repulsion"
                        :disabled="this.solvers.repulsion">
                </div>
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree"
                    id="accordionRepulsion" @click.prevent="this.clickEnable('repulsion')">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            Repulsion
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            title="O modelo de repulsão assume que os vértices possuem um campo de repulsão simplificado ao seu redor. 
                                    Sua força diminui linearmente de 1 (em 0,5 * distancia_vertice e menores) a 0 (em 2 * distancia_vertice).">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <solver-parameters :ariaControls="'flush-collapseThree'" :ariaLabelledBy="'flush-headingThree'"
                :options="this.encapsulateOptions" :localNetwork="this.encapsulateLocalNetwork" :solver="'repulsion'"
                :solverEnabled="this.repulsionEnabled"
                @options-has-changed="this.optionsHasChanged"></solver-parameters>
        </div>
        <div class="accordion-item">
            <div class="accordion-header d-flex align-items-center" id="flush-headingFour">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch"
                        id="switchEnabledHierarchicalRepulsion" :checked="this.solvers.hierarchicalRepulsion"
                        :disabled="this.solvers.hierarchicalRepulsion" v-model="this.solvers.hierarchicalRepulsion">
                </div>
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour"
                    id="accordionHierarchicalRepulsion" @click.prevent="this.clickEnable('hierarchicalRepulsion')">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            HierarchicalRepulsion
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            title="Este modelo é baseado no solucionador de repulsão, mas os níveis são levados em consideração e as forças são normalizadas.">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <solver-parameters :ariaControls="'flush-collapseFour'" :ariaLabelledBy="'flush-headingFour'"
                :options="this.encapsulateOptions" :localNetwork="this.encapsulateLocalNetwork"
                :solver="'hierarchicalRepulsion'" :solverEnabled="this.hierarchicalRepulsionEnabled"
                @options-has-changed="this.optionsHasChanged"></solver-parameters>
        </div>
    </div>
    <div class="input-group input-group-sm mb-1 mt-1">
        <span class="input-group-text" id="addon-maxVelocity-label" data-bs-toggle="tooltip"
            title="O módulo de física limita a velocidade máxima dos vértices para aumentar o tempo de estabilização. Este é o valor máximo.">Velocidade
            Máx. (Max. V.):</span>
        <input type="number" min="0" step="1" class="form-control" placeholder="maxVelocity" aria-label="maxVelocity"
            aria-describedby="addon-maxVelocity-label" id="physics-maxVelocity" v-model="this.maxVelocity">
    </div>
    <div class="input-group input-group-sm mb-1 mt-1">
        <span class="input-group-text" id="addon-minVelocity-label" data-bs-toggle="tooltip"
            title="Uma vez atingida a velocidade mínima para todos os vérticies, assumimos que a rede foi estabilizada e a simulação para.">Velocidade
            Mín. (Min. V.):</span>
        <input type="number" min="0" step="1" class="form-control" placeholder="minVelocity" aria-label="minVelocity"
            aria-describedby="addon-minVelocity-label" id="physics-minVelocity" v-model="this.minVelocity">
    </div>
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="switchPhysicsAdaptativoTimestep" :checked="this.adaptiveTimestep" v-model="this.adaptiveTimestep">
        <label class="form-check-label" for="switchPhysicsAdaptativoTimestep" data-bs-toggle="tooltip" title="Se estiver habilitado, o timestep será adaptado de forma inteligente (somente durante o estágio de estabilização se a estabilização estiver habilitada!) para diminuir bastante os tempos de estabilização. 
                O timestep configurado acima é considerado o timestep mínimo. 
                Isso pode ser melhorado ainda mais usando o algoritmo ImprovedLayout.">Passo de tempo
            adaptativo (Adaptive Timestep)</label>
    </div>
    <div class="input-group input-group-sm mb-1 mt-1">
        <span class="input-group-text" id="addon-timestep-label" data-bs-toggle="tooltip" title="A simulação física é discreta. 
                    Isso significa que damos um passo no tempo, calculamos as forças, movemos os vértices e damos outro passo. 
                    Se você aumentar esse número, as etapas serão muito grandes e a rede poderá ficar instável. 
                    Se você observar muitos movimentos nervosos na rede, poderá reduzir um pouco esse valor.">Passo do
            tempo
            (Timestep):</span>
        <input type="number" min="0" step="0.5" class="form-control" placeholder="timestep" aria-label="timestep"
            aria-describedby="addon-timestep-label" id="physics-timestep" v-model="timestep">
    </div>
    <physics-stabilization
        :options="this.encapsulateOptions"
        :localNetwork="this.encapsulateLocalNetwork"
    ></physics-stabilization>
    <wind
        :options="this.encapsulateOptions"
        :localNetwork="this.encapsulateLocalNetwork"
    ></wind>
</template>
<script>

import * as Vue from 'vue';
import solverParameters from './SolverParameters.vue';
import stabilization from './Stabilization.vue';
import wind from './Wind.vue';

export default {
    name: 'Physics',
    props: [
        'localNetwork',
        'options',
    ],
    components: {
        'solver-parameters': solverParameters,
        'physics-stabilization': stabilization,
        'wind': wind
    },
    data() {
        return {
            encapsulateLocalNetwork: null,
            encapsulateOptions: null,
            barnesHutEnabled: false,
            forceAtlas2BasedEnabled: false,
            repulsionEnabled: false,
            hierarchicalRepulsionEnabled: false,
            maxVelocity: 0,
            minVelocity: 0,
            adaptiveTimestep: false,
            timestep: 0,
            solvers: {
                barnesHut: true,
                forceAtlas2Based: false,
                repulsion: false,
                hierarchicalRepulsion: false
            },
        }
    },
    methods: {

        setSolver(solver) {
            this.encapsulateOptions.physics.solver = solver;
            this.$emit('options-has-changed', this.options);
        },

        optionsHasChanged(options) {
            this.encapsulateOptions = options;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        clickEnable(field) {
            console.log("Field: " + field);
            if (field == 'barnesHut') {
                console.log("Entrei no barnesHut");
                this.barnesHutEnabled = (this.barnesHutEnabled) ? false : true;
                this.forceAtlas2BasedEnabled = false;
                this.repulsionEnabled = false;
                this.hierarchicalRepulsionEnabled = false;
            } else if (field == 'forceAtlas2Based') {
                console.log("Entrei no forceAtlas2Based");
                this.barnesHutEnabled = false;
                this.forceAtlas2BasedEnabled = (this.forceAtlas2BasedEnabled) ? false : true;
                this.repulsionEnabled = false;
                this.hierarchicalRepulsionEnabled = false;
            } else if (field == 'repulsion') {
                console.log("Entrei no repulsion");
                this.barnesHutEnabled = false;
                this.forceAtlas2BasedEnabled = false;
                this.repulsionEnabled = (this.repulsionEnabled) ? false : true;
                this.hierarchicalRepulsionEnabled = false;
            } else if (field == 'hierarchicalRepulsion') {
                console.log("Entrei no hierarchicalRepulsion");
                this.barnesHutEnabled = false;
                this.forceAtlas2BasedEnabled = false;
                this.repulsionEnabled = false;
                this.hierarchicalRepulsionEnabled = (this.hierarchicalRepulsionEnabled) ? false : true;
            }
        }

    },
    watch: {
        'solvers.barnesHut': function (newSolverBarnesHut, oldSovlersBarnesHut) {
            if (newSolverBarnesHut) {
                this.solvers.forceAtlas2Based = false;
                this.solvers.repulsion = false;
                this.solvers.hierarchicalRepulsion = false;
                this.setSolver('barnesHut');
            }
        },
        'solvers.forceAtlas2Based': function (newSolversForceAtlas2Based, oldSolversForceAtlas2Based) {
            if (newSolversForceAtlas2Based) {
                this.solvers.barnesHut = false;
                this.solvers.repulsion = false;
                this.solvers.hierarchicalRepulsion = false;
                this.setSolver('forceAtlas2Based');
            }
        },
        'solvers.repulsion': function (newSolversRepulsion, oldSolversRepulsion) {
            if (newSolversRepulsion) {
                this.solvers.barnesHut = false;
                this.solvers.forceAtlas2Based = false;
                this.solvers.hierarchicalRepulsion = false;
                this.setSolver('repulsion');
            }
        },
        'solvers.hierarchicalRepulsion': function (newSolversHierarchicalRepulsion, oldSolversHierarchicalRepulsion) {
            if (newSolversHierarchicalRepulsion) {
                this.solvers.barnesHut = false;
                this.solvers.forceAtlas2Based = false;
                this.solvers.repulsion = false;
                this.setSolver('hierarchicalRepulsion');
            }
        },
        maxVelocity: function (newMaxVelocity, oldMaxVelocity) {
            this.encapsulateOptions.physics.maxVelocity = newMaxVelocity;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
        minVelocity: function (newMinVelocity, oldMinVelocity) {
            this.encapsulateOptions.physics.minVelocity = newMinVelocity;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
        adaptiveTimestep: function(newAdaptiveTimestep, oldAdaptiveTimestep) {
            this.encapsulateOptions.physics.adaptiveTimestep = newAdaptiveTimestep;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
        timestep: function(newTimestep, oldTimestep) {
            this.encapsulateOptions.physics.timestep = newTimestep;
            this.$emit('options-has-changed', this.encapsulateOptions);
        }
    },
    mounted() {
        console.log("Physics Component Mounted");
        this.encapsulateOptions = this.options;
        this.encapsulateLocalNetwork = Vue.toRaw(this.localNetwork);
        if (this.options.physics.solver == 'barnesHut') {
            this.solvers.barnesHut = true;
        } else if (this.options.physics.solver == 'forceAtlas2Based') {
            this.solvers.forceAtlas2Based = true;
        } else if (this.options.physics.solver == 'repulsion') {
            this.solvers.repulsion = true;
        } else if (this.options.physics.solver == 'hierarchicalRepulsion') {
            this.solvers.hierarchicalRepulsion = true;
        }
        this.maxVelocity = this.encapsulateOptions.physics.maxVelocity;
        this.minVelocity = this.encapsulateOptions.physics.minVelocity;
        this.adaptiveTimestep = this.encapsulateOptions.physics.adaptiveTimestep;
        this.timestep = this.encapsulateOptions.physics.timestep;
    },
    emits: [
        'options-has-changed'
    ]
}
</script>