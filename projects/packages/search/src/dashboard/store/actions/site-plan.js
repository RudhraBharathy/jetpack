import { fetchSearchPlanInfo } from '../controls';

export const SET_SEARCH_PLAN_INFO = 'SET_SEARCH_PLAN_INFO';

/**
 * Action to set plan info
 *
 * @param {*} options - plan info.
 * @return {object} - an action object.
 */
export function setSearchPlanInfo( options ) {
	return {
		type: 'SET_SEARCH_PLAN_INFO',
		options,
	};
}

export default { setSearchPlanInfo, fetchSearchPlanInfo };
