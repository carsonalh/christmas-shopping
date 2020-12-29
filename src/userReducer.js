const initialState = null;

export const SET_USER = 'SET_USER';

export default (state = initialState, action) => {
    switch (action.type) {
    case SET_USER:      return { ...action.payload };
    default:            return null;
    }
}

