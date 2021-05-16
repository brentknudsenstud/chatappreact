function actionCreator (type) {
    return (payload) => {
        return {
            type, payload
        }
    }
}

const exampleReducer = {
    toggleModal: (state, payload) => {
        return {
            ...state,
            modalVisible: !state.modalVisible
        }
    }
}


function createStore({name, reducer, initialState}) {
    const actionTypes = {}
    const actions = {}
    Object.entries(reducer).forEach(([key, func])=> {
        
        actionTypes[key] = key;
        actions[key] = actionCreator(key)
    })
return {
    actionTypes,
    actions,
    initialState,
     reducer: (state, action) => {
         return reducer[action.type](stae, action.payload);
     }
}
}