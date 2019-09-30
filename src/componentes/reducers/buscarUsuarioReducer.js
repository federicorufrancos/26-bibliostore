import { BUSCAR_USUARIO } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
    console.log('operacion ', action.type);
    switch(action.type) {
        case BUSCAR_USUARIO:
            console.log('operacion  BUSCAR_USUARIO');
            return {
                ...state,
                nombre: action.usuario.nombre,
                apellido: action.usuario.apellido,
                codigo: action.usuario.codigo,
                carrera: action.usuario.carrera
            }
        default:
            return state;
    }
}

//finally here the user is saved into the custom state