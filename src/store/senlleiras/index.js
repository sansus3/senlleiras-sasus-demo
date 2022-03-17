//Objecto
const SENLLEIRA = {
    idSpecie: '',
    id: '',
    nombreComun: '',
    nombreReferencia: '',
    genus: '',
    specie: '',
    altura: '', //String por si meten medidas como "20-30 cm"
    diametro: '', //String por si meten medidas
    edadEstimada: 0, //Edad estimada de la senlleira
    provincia: 'A Coruña',
    lugar: '',
    concello: '',
    location: { latitude: '', longitude: '' },
    destacaAntiguedad: false,
    destacaTamano: false,
    destacaSituacion: false,
    destacaContexto: false, //Destaca por su contexto historico
    nombrePila: '',
    apellidos: '',
    comentarios: '',
    email: 'store/senlleira@prueba.com',
    usosCuriosidades: '',
    confirmado: false
}

const state = {
    senlleiras: [],
    senlleirasFiltradas: [],
    senlleira: { ...SENLLEIRA },
}

const mutations = {
    listSenlleiras(state, payload) {
        payload = payload.filter(el => el.confirmado === true);
        state.senlleiras = state.senlleirasFiltradas = payload;
    },
    senlleiraFilter(state, payload) {
        state.senlleirasFiltradas = payload;
    },
    addSenlleira(state, payload) {
        state.senlleira = state.senlleiras.find(element => element.id === payload);
    },
    setSenlleira(state,payload){
        state.senlleira = payload;
    },
    insertSenlleira(state, payload) {
        state.senlleira = {...SENLLEIRA};
        state.senlleira.location.latitude='';
        state.senlleira.location.longitude='';
        state.senlleiras.push(payload);
    },
}

const actions = {
    async listSenlleiras(context) {
        const response = await fetch(`${context.rootState.realtimeDatabase}senlleiras.json`,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            });
        const data = await response.json();
        if (data) {
            context.commit('listSenlleiras', Object.values(data));
        }
    },
    async getSenlleira({commit, rootState},codSenlleiras){
        const response = await fetch(`${rootState.realtimeDatabase}senlleiras/${codSenlleiras}.json`,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            });
        const data = await response.json();
        
        if (data) {
            commit('setSenlleira', data);
        }
    },
    async insertSenlleira({ commit, rootState }, obj) {
        await fetch(
            `${rootState.realtimeDatabase}senlleiras/${obj.id}.json`,
            {
                method: 'PUT', // Editar datos
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        );
        commit('insertSenlleira', obj);
    },

    senlleiraSearch({ commit, state }, data) {
        //Pasamos todo a minúsculas pues includes es sensible a mayúsculas y minúsculas
        const min = data.toLowerCase();
        //Array temporal donde almacenamos los resultados
        const tmp = state.senlleiras.filter(senlleira => senlleira.genus.toLowerCase().includes(min) || senlleira.specie.toLowerCase().includes(min) || senlleira.nombreReferencia.toLowerCase().includes(min) || senlleira.concello.toLowerCase().includes(min) || senlleira.lugar.toLowerCase().includes(min) || senlleira.nombreComun.toLowerCase().includes(min));
        //Almacenams en el state los datos filtrados
        commit('senlleiraFilter', tmp);
    },
    senlleiraSort({ state }, { field, sort }) {
        if (sort)
            state.senlleirasFiltradas.sort((a, z) => a[field].localeCompare(z[field]));
        else
            state.senlleirasFiltradas.sort((z, a) => a[field].localeCompare(z[field]));
    },
    addSenlleira({ commit }, id) {
        commit('addSenlleira', id);
    },
    resetSenlleira({state}){
        state.senlleira = {...SENLLEIRA};
        state.senlleira.location.latitude='';
        state.senlleira.location.longitude='';
    }
}

const getters = {
    getSenlleirasLength(state){
        return state.senlleirasFiltradas.length;
    },
    getSenlleirasFiltradas(state){
        return state.senlleirasFiltradas;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}