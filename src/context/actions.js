import API from "../utils/API";


export async function loginUser(dispatch, loginPayload) {
    console.log(loginPayload);
    let ok = false;
    dispatch({ type: 'REQUEST_LOGIN' });
    await API.post("/auth", loginPayload).then((response) => {
        let data = response.data;
        console.log(data);
        if (data.username) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            console.log(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
            ok = true;
            return;
        }
        dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
        console.log(data);
        ok = false;
    },
        (error) => {
            const response = error.response
            dispatch({ type: 'LOGIN_ERROR', error: response.data });
            console.log(response)
            ok = false;
        });
    return ok;
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}

export function checkAuth(dispatch) {
    API.put('/auth/check', '').then(() => {
        console.log("auth ok!");
    }).catch((error) => {
        console.log("auth error!");
        dispatch({type: 'LOGOUT'});
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    });
}

export function changeUsername(dispatch, payload) {
    dispatch({ type: 'LOGIN_SUCCESS', payload: payload });
    localStorage.setItem('currentUser', JSON.stringify(payload));
}