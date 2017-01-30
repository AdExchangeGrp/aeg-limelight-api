// @flow

import type { LimelightApiResponseType, LimelightApiActionResultType } from './flow-typed/types';
import _ from 'lodash';

export default class LimelightApiError extends Error {

	_apiResponse: LimelightApiResponseType;

	_innerError: ?Error;

	/**
	 * Gets the raw api call response
	 * @returns {?Object|*}
	 */
	get apiResponse (): LimelightApiResponseType {

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
	 * @param {LimelightApiResponseType} apiResponse
	 * @param {Error} [innerError]
	 */
	constructor (apiResponse: LimelightApiResponseType, innerError: ?Error) {

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

		return new LimelightApiError({apiActionResults: [{responseCode, responseCodeDesc}]});

	}

	/**
	 * Create an error from a single action result
	 * @param {LimelightApiActionResultType[]} apiActionResults
	 * @returns {LimelightApiError}
	 */
	static createWithArray (apiActionResults: LimelightApiActionResultType[]) {

		return new LimelightApiError({apiActionResults: apiActionResults});

	}

}
