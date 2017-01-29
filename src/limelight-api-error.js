// @flow

import type { LimelightApiResponseType } from './flow-typed/types';

export default class LimelightApiError extends Error {

	_responseCode: number;

	_responseCodeDesc: string;

	_innerError: ?Error;

	_apiResponse: ?LimelightApiResponseType;

	/**
	 * Gets the response code
	 * @returns {number}
	 */
	get responseCode (): number {

		return this._responseCode;

	}

	/**
	 * Gets ther response desc
	 * @returns {string}
	 */
	get responseCodeDesc (): string {

		return this._responseCodeDesc;

	}

	/**
	 * Gets the raw api call response
	 * @returns {?Object|*}
	 */
	get apiResponse (): ?LimelightApiResponseType {

		return this._apiResponse;

	}

	/**
	 * Constructor
	 * @param {number} responseCode
	 * @param {string} responseCodeDesc
	 * @param {Error} [innerError]
	 * @param {LimelightApiResponseType} [apiResponse]
	 */
	constructor (responseCode: number, responseCodeDesc: string, innerError: ?Error, apiResponse: ?LimelightApiResponseType) {

		super(`limelight api error code ${responseCode} ${responseCodeDesc}`);

		this._responseCode = responseCode;
		this._responseCodeDesc = responseCodeDesc;
		this._innerError = innerError;
		this._apiResponse = apiResponse;

	}

}
