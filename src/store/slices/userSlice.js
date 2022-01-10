import {createSlice} from "@reduxjs/toolkit";
import axios from '../../axios';
import {browserHistory} from "../../index";


const refreshTime = 5/60 // minutes

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
    localStorage.setItem('refresh', data.refresh);
    dispatch(startSession({accessToken: data.access, refreshToken: data.refresh}))
    dispatch(startRefreshSession())
}

export const checkSession = () => async (dispatch) => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
        dispatch(clearSession())
        throw Error;
    }
    const {data} = await axios.post('/api/token/refresh',
        {
            "refresh": refreshToken
        })
    dispatch(startSession({accessToken: data.access, refreshToken}))
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
            browserHistory.push('/login');
        })
}

export const logout = () => async(dispatch) => {
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