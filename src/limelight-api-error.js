// @flow

import type { ActionResultType, ResponseType } from './flow-typed/types';
import _ from 'lodash';

export default class LimelightApiError extends Error {

	_apiResponse: ResponseType;

	_innerError: ?Error;

	/**
	 * Gets the raw api call response
	 * @returns {?Object|*}
	 */
	get apiResponse (): ResponseType {

		return this._apiResponse;

	}

	/**
	 * Gets the inner error
	 * @returns {string}
	 */
	get innerError (): ?Error {

		return this._innerError;

	}

	/**
	 * Constructor
	 * @param {ResponseType} apiResponse
	 * @param {Error} [innerError]
	 */
	constructor (apiResponse: ResponseType, innerError: ?Error) {

		const message = _.reduce(apiResponse.apiActionResults, (memo, r) => {

			memo += ` ${r.responseCode} ${r.responseCodeDesc}`;
			return memo;

		}, 'limelight api error code');

		super(message);

		this._apiResponse = apiResponse;
		this._innerError = innerError;

	}

	/**
	 * Create an error from a single action result
	 * @param {string} responseCode
	 * @param {string} responseCodeDesc
	 * @returns {LimelightApiError}
	 */
	static createWithOne (responseCode: number, responseCodeDesc: string) {

		return new LimelightApiError({apiActionResults: [{responseCode, responseCodeDesc}], body: {}});

	}

	/**
	 * Create an error from a single action result
	 * @param {ActionResultType[]} apiActionResults
	 * @returns {LimelightApiError}
	 */
	static createWithArray (apiActionResults: ActionResultType[]) {

		return new LimelightApiError({apiActionResults: apiActionResults, body: {}});

	}

}
