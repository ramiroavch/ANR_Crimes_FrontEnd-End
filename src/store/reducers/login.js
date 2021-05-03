import * as actionsType from '../action';

const initialState = {
    userName:''
}

const login = (state = initialState, {type,val}) => {
    if(type === actionsType.LOGIN){
        return {
            ...state,
            userName: val
        }
    }
    return state;
}

export default login;