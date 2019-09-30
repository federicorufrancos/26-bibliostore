import { BUSCAR_USUARIO } from './types';

//saving the searched user into the store
 export const buscarUsuario = usuario => {
     console.log('usuario buscado: ', usuario);
     return {
         type: BUSCAR_USUARIO, 
         usuario
     }
 }