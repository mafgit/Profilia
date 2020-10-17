import { createContext } from 'react'

export const AuthContext = createContext()
export const initState = {
	authenticated: false,
	user: {
		image:
			'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png',
		_id: '',
		fullName: '',
		email: '',
	},
}
export const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			localStorage.setItem('authenticated', true)
			return {
				authenticated: true,
				user: { ...action.payload },
			}
		case 'LOGOUT':
			localStorage.setItem('authenticated', false)
			return {
				authenticated: false,
				user: initState.user,
			}
		default:
			return state
	}
}
