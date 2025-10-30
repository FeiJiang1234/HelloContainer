import { UserConstants } from '../actions';
import { authService } from 'services';

const user = authService.getCurrentUser();
export function userReducer (state = user, action) {
    switch (action.type) {
        case UserConstants.LOGIN:
            return action.payload.user;
        default:
            return state;
    }
}
