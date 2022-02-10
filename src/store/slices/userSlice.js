import {createSlice} from "@reduxjs/toolkit";
import axios from '../../axios';
import {browserHistory} from "../../index";
import jwtDecode from "jwt-decode";


const refreshTime = 5 // minutes

const addToken = (token) => {
    axios.defaults.headers.Authorization = `Bearer ${token}`
}

const removeToken = () => {
    axios.defaults.headers.Authorization = undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null,
        refreshTimeout: null
    },
    reducers: {
        startSession: (state, {payload}) => {
            state.accessToken = payload.accessToken
            state.refreshToken = payload.refreshToken
            if (payload.user) {
                const user = {
                    id: payload.user.id,
                    username: payload.user.username,
                    email: payload.user.email,
                    firstName: payload.user.first_name,
                    lastName: payload.user.last_name,
                    isAdmin: payload.user.is_superuser
                }
                state.user = user
            }
            addToken(payload.accessToken)
        },
        setRefreshTimeout: (state, {payload}) => {
            state.refreshTimeout = payload.refreshTimeout
        },
        clearSession(state) {
            state.accessToken = null
            state.refreshToken = null
            removeToken()
            clearTimeout(state.refreshTimeout)
            localStorage.removeItem('refresh')
            localStorage.removeItem('userData')
        }
    }
})

export const {startSession, setRefreshTimeout, clearSession} = userSlice.actions

const startRefreshSession = () => (dispatch) => {
    dispatch(setRefreshTimeout(
        setTimeout(() => dispatch(refreshSession()), 1000 * 60 * refreshTime)
    ))
}

export const login = (username, password) => async (dispatch) => {
    const {data} = await axios.post('/api/token',
        {
            "username": username,
            "password": password
        }
    )
    const decoded = (jwtDecode(data.access));
    let response = await axios.get('/api/user/' + decoded.user_id + '/find/',
        {
            headers: {Authorization: `Bearer ${data.access}`}
        }
    )
    const userData = response.data.data;
    if (!userData.is_active) {
        return Promise.reject({response: {data: {detail: "This user is inactive"}}})
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('refresh', data.refresh);
    dispatch(startSession({user: userData, accessToken: data.access, refreshToken: data.refresh}))
    dispatch(startRefreshSession())
}

export const checkSession = () => async (dispatch) => {
    const refreshToken = localStorage.getItem('refresh');
    const userData = localStorage.getItem('userData');
    if (!refreshToken) {
        dispatch(clearSession())
        throw Error;
    }
    const {data} = await axios.post('/api/token/refresh',
        {
            "refresh": refreshToken
        })
    dispatch(startSession({user: JSON.parse(userData), accessToken: data.access, refreshToken}))
    dispatch(startRefreshSession())
}

export const refreshSession = () => (dispatch, getState) => {
    const refreshToken = getState.user?.refresh ?? localStorage.getItem('refresh');
    if (!refreshToken) {
        dispatch(clearSession())
        return
    }
    axios.post('/api/token/refresh', {refresh: refreshToken})
        .then(({data}) => {
            dispatch(startSession({accessToken: data.access, refreshToken}))
            dispatch(startRefreshSession())
        })
        .catch(() => {
            dispatch(clearSession());
            browserHistory.push('/public/login');
        })
}

export const logout = () => async (dispatch) => {
    //  Call logout endpoint
    // axios.post('/api/token/refresh')
    //     .then(({data}) => {
    //         dispatch(startSession({accessToken: data.access, refreshToken}))
    //         dispatch(setRefreshTimeout(
    //             setTimeout(() => dispatch(refreshSession()), 1000 * 10)
    //         ))
    //     })
    dispatch(clearSession())
}

export const selectIsLogged = state => Boolean(state.user.accessToken && state.user.refreshToken)

export default userSlice.reducer;