<template>
    <div :id="ariaControls" class="accordion-collapse collapse" :aria-labelledby="ariaLabelledBy"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body">
            <div class="row">
                <div class="input-group input-group-sm mb-1" v-if="this.isFieldEnabled('theta')">
                    <span class="input-group-text" :id="'addon-theta-' + this.solver + '-label'"
                        data-bs-toggle="tooltip"
                        title="Este parâmetro determina o limite entre as forças consolidadas de longo alcance e as forças individuais de curto alcance. Para simplificar demais, valores mais altos são mais rápidos, mas geram mais erros, valores mais baixos são mais lentos, mas com menos erros.">Teta
                        (Theta):</span>
                    <input type="number" min="0" step="0.5" class="form-control" placeholder="Teta" aria-label="Teta"
                        :aria-describedby="'addon-theta-' + this.solver + '-label'" :id="'theta-' + this.solver"
                        v-model="this.theta">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('gravitationalConstant')">
                    <span class="input-group-text" :id="'addon-gc-' + this.solver + '-label'" data-bs-toggle="tooltip"
                        title="A gravidade atrai. Gostamos de repulsão. Portanto o valor é negativo. Se quiser que a repulsão seja mais forte, diminua o valor (coloque -10000, -50000).">Const.
                        Gravitacional (G. C.):</span>
                    <input type="text" class="form-control" min="0" step="0.1" placeholder="Constante Gravitacional"
                        aria-label="Constante Gravitacional" :aria-describedby="'addon-gc-' + this.solver + '-label'"
                        :id="'gc-' + this.solver" v-model="this.gravitationalConstant">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('centralGravity')">
                    <span class="input-group-text" :id="'addon-centralGravity-' + this.solver + '-label'"
                        data-bs-toggle="tooltip"
                        title="Existe um atrator gravitacional central para puxar toda o grafo de volta ao centro.">Gravidade
                        Central (C. G.):</span>
                    <input type="number" min="0" step="0.1" class="form-control" placeholder="CentralGravity"
                        aria-label="CentralGravity" :aria-describedby="'addon-centralGravity-' + this.solver + '-label'"
                        :id="'centralGravity' + this.solver" v-model="this.centralGravity">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('springLength')">
                    <span class="input-group-text" :id="'addon-springLength-' + this.solver + '-label'"
                        data-bs-toggle="tooltip"
                        title="As arestas são modeladas como molas. O comprimento da mola aqui é o comprimento restante das mola.">Tamanho
                        da Mola (S. L.):</span>
                    <input type="number" min="0" step="1" class="form-control" placeholder="springLength"
                        aria-label="springLength" :aria-describedby="'addon-springLength-' + this.solver + '-label'"
                        :id="'springLength-' + this.solver" v-model="this.springLength">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('springConstant')">
                    <span class="input-group-text" :id="'addon-springConstant-' + this.solver + '-label'"
                        data-bs-toggle="tooltip"
                        title="É assim que as molas ficam 'resistentes'. Valores mais altos significam molas mais fortes.">Constante
                        da Mola (S. C.):</span>
                    <input type="number" min="0" step="0.01" class="form-control" placeholder="springConstant"
                        aria-label="springConstant" :aria-describedby="'addon-springConstant-' + this.solver + '-label'"
                        :id="'springConstant-' + this.solver" v-model="this.springConstant">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('damping')">
                    <span class="input-group-text" :id="'addon-damping-' + this.solver + '-label'"
                        data-bs-toggle="tooltip"
                        title="Intervalo aceito: [0 .. 1]. 
                                        O fator de amortecimento é quanto da velocidade da iteração de simulação física anterior é transferida para a próxima iteração.">Amort.
                        da Mola (Damping):</span>
                    <input type="number" min="0" step="0.01" max="1" class="form-control" placeholder="damping"
                        aria-label="damping" :aria-describedby="'addon-damping-' + this.solver + '-label'"
                        :id="'damping-' + this.solver" v-model="this.damping">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('avoidOverlap')">
                    <span class="input-group-text" :id="'addon-avoidOverlap-' + this.solver + '-label'"
                        data-bs-toggle="tooltip" title="Intervalo aceito: [0 .. 1]. Quando maior que 0, o tamanho do vértice é levado em consideração. 
                                        A distância será calculada a partir do raio do círculo envolvente do vértice para ambos os modelos gravitacionais. 
                                        O valor 1 é a evitação máxima de sobreposição.">Evitar
                        Sobreposição (A. O.):</span>
                    <input type="number" min="0" step="0.01" max="1" class="form-control" placeholder="avoidOverlap"
                        aria-label="avoidOverlap" :aria-describedby="'addon-avoidOverlap-' + this.solver + '-label'"
                        :id="'avoidOverlap-' + this.solver" v-model="this.avoidOverlap">
                </div>
                <div class="input-group input-group-sm mb-1" v-if="isFieldEnabled('nodeDistance')">
                    <span class="input-group-text" :id="'addon-nodeDistance-' + this.solver + '-label'"
                        data-bs-toggle="tooltip" title="Esta é a faixa de influência para a repulsão.">Dist. Vértices
                        (N. D.):</span>
                    <input type="number" min="0" step="1" class="form-control" placeholder="nodeDistance"
                        aria-label="nodeDistance" :aria-describedby="'addon-nodeDistance-' + this.solver + '-label'"
                        :id="'nodeDistance-' + this.solver" v-model="this.nodeDistance">
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import * as Vue from 'vue';

export default {
    name: "Solver Parameters",
    props: [
        'solverEnabled',
        'options',
        'localNetwork',
        'ariaControls',
        'ariaLabelledBy',
        'solver'
    ],
    data() {
        return {
            encapsulateOptions: null,
            encapsulateLocalNetwork: null,
            theta: 0,
            centralGravity: 0,
            gravitationalConstant: 0,
            springLength: 0,
            springConstant: 0,
            damping: 0,
            avoidOverlap: 0,
            nodeDistance: 0,
        }
    },
    computed: {
    },
    watch: {
        'solverEnabled': function (newEnabled, oldEnabled) {
            if (newEnabled) {
                this.encapsulateOptions = this.options;
                this.encapsulateLocalNetwork = this.localNetwork

                if (this.solver == "barnesHut") {
                    this.theta = this.encapsulateOptions.physics.barnesHut.theta;
                    this.centralGravity = this.encapsulateOptions.physics.barnesHut.centralGravity;
                    this.gravitationalConstant = this.encapsulateOptions.physics.barnesHut.gravitationalConstant;
                    this.springLength = this.encapsulateOptions.physics.barnesHut.springLength;
                    this.springConstant = this.encapsulateOptions.physics.barnesHut.springConstant;
                    this.damping = this.encapsulateOptions.physics.barnesHut.damping;
                    this.avoidOverlap = this.encapsulateOptions.physics.barnesHut.avoidOverlap;
                } else if (this.solver == "forceAtlas2Based") {
                    this.theta = this.encapsulateOptions.physics.forceAtlas2Based.theta;
                    this.centralGravity = this.encapsulateOptions.physics.forceAtlas2Based.centralGravity;
                    this.gravitationalConstant = this.encapsulateOptions.physics.forceAtlas2Based.gravitationalConstant;
                    this.springLength = this.encapsulateOptions.physics.forceAtlas2Based.springLength;
                    this.springConstant = this.encapsulateOptions.physics.forceAtlas2Based.springConstant;
                    this.damping = this.encapsulateOptions.physics.forceAtlas2Based.damping;
                    this.avoidOverlap = this.encapsulateOptions.physics.forceAtlas2Based.avoidOverlap;
                } else if (this.solver == "repulsion") {
                    this.centralGravity = this.encapsulateOptions.physics.repulsion.centralGravity;
                    this.springLength = this.encapsulateOptions.physics.repulsion.springLength;
                    this.springConstant = this.encapsulateOptions.physics.repulsion.springConstant;
                    this.damping = this.encapsulateOptions.physics.repulsion.damping;
                    this.nodeDistance = this.encapsulateOptions.physics.repulsion.nodeDistance;
                } else if (this.solver == "hierarchicalRepulsion") {
                    this.centralGravity = this.encapsulateOptions.physics.hierarchicalRepulsion.centralGravity;
                    this.centralGravity = this.encapsulateOptions.physics.hierarchicalRepulsion.centralGravity;
                    this.springLength = this.encapsulateOptions.physics.hierarchicalRepulsion.springLength;
                    this.springConstant = this.encapsulateOptions.physics.hierarchicalRepulsion.springConstant;
                    this.damping = this.encapsulateOptions.physics.hierarchicalRepulsion.damping;
                    this.nodeDistance = this.encapsulateOptions.physics.hierarchicalRepulsion.nodeDistance;
                    this.avoidOverlap = this.encapsulateOptions.physics.hierarchicalRepulsion.avoidOverlap;

                }

            }
        },
        theta: function (newTheta, oldTheta) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.theta = parseFloat(newTheta);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.theta = parseFloat(newTheta);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        centralGravity: function (newCentralGravity, oldCentralGravity) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.centralGravity = parseFloat(newCentralGravity);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.centralGravity = parseFloat(newCentralGravity);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'repulsion': {
                    this.encapsulateOptions.physics.repulsion.centralGravity = parseFloat(newCentralGravity);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.centralGravity = parseFloat(newCentralGravity);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        gravitationalConstant: function (newGravitationalConstant, oldGravitationalConstant) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.gravitationalConstant = parseFloat(newGravitationalConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.gravitationalConstant = parseFloat(newGravitationalConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        springLength: function (newSpringLength, oldSpringLength) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.springLength = parseFloat(newSpringLength);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.springLength = parseFloat(newSpringLength);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'repulsion': {
                    this.encapsulateOptions.physics.repulsion.springLength = parseFloat(newSpringLength);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.springLength = parseFloat(newSpringLength);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        springConstant: function (newSpringConstant, oldSpringConstant) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.springConstant = parseFloat(newSpringConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.springConstant = parseFloat(newSpringConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'repulsion': {
                    this.encapsulateOptions.physics.repulsion.springConstant = parseFloat(newSpringConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.springConstant = parseFloat(newSpringConstant);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        damping: function (newDamping, oldDamping) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.damping = parseFloat(newDamping);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.damping = parseFloat(newDamping);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'repulsion': {
                    this.encapsulateOptions.physics.repulsion.damping = parseFloat(newDamping);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.damping = parseFloat(newDamping);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        avoidOverlap: function (newAvoidOverlap, oldAvoidOverlap) {
            switch (this.solver) {
                case 'barnesHut': {
                    this.encapsulateOptions.physics.barnesHut.avoidOverlap = parseFloat(newAvoidOverlap);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'forceAtlas2Based': {
                    this.encapsulateOptions.physics.forceAtlas2Based.avoidOverlap = parseFloat(newAvoidOverlap);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.avoidOverlap = parseFloat(newAvoidOverlap);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        },
        nodeDistance: function(newNodeDistance, oldNodeDistance) {
            switch (this.solver) {
                case 'repulsion': {
                    this.encapsulateOptions.physics.repulsion.nodeDistance = parseFloat(newNodeDistance);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
                case 'hierarchicalRepulsion': {
                    this.encapsulateOptions.physics.hierarchicalRepulsion.nodeDistance = parseFloat(newNodeDistance);
                    this.$emit('options-has-changed', this.encapsulateOptions);
                    break;
                }
            }
        }

    },
    methods: {
        isFieldEnabled: function (field) {
            switch (this.solver) {
                case 'barnesHut': {
                    switch (field) {
                        case 'theta': return true;
                        case 'centralGravity': return true;
                        case 'gravitationalConstant': return true;
                        case 'springLength': return true;
                        case 'springConstant': return true;
                        case 'damping': return true;
                        case 'avoidOverlap': return true;
                        default: return false;
                    }
                }
                case 'forceAtlas2Based': {
                    switch (field) {
                        case 'theta': return true;
                        case 'centralGravity': return true;
                        case 'gravitationalConstant': return true;
                        case 'springLength': return true;
                        case 'springConstant': return true;
                        case 'damping': return true;
                        case 'avoidOverlap': return true;
                        default: return false;
                    }
                }
                case 'repulsion': {
                    switch (field) {
                        case 'centralGravity': return true;
                        case 'springLength': return true;
                        case 'springConstant': return true;
                        case 'damping': return true;
                        case 'nodeDistance': return true;
                        default: return false;
                    }
                }
                case 'hierarchicalRepulsion': {
                    switch (field) {
                        case 'centralGravity': return true;
                        case 'springLength': return true;
                        case 'springConstant': return true;
                        case 'damping': return true;
                        case 'nodeDistance': return true;
                        case 'avoidOverlap': return true;
                        default: return false;
                    }
                }
            }
        }
    },
    emits: [
        'options-has-changed'
    ]
}
</script>