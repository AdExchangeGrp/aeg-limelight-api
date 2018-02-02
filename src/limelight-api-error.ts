import * as _ from 'lodash';
import { IActionResult, IResponse } from './types/limelight-types';

export interface ILimelightApiErrorOptions {
	innerError?: Error | undefined;
	apiRequest?: any;
}

export default class LimelightApiError extends Error {

	public static createWithOne (responseCode: number, responseCodeDesc: string, options: ILimelightApiErrorOptions = {}) {

		return new LimelightApiError({apiActionResults: [{responseCode, responseCodeDesc}], body: {}}, options);

	}

	public static createWithArray (apiActionResults: IActionResult[], options: ILimelightApiErrorOptions = {}) {

		return new LimelightApiError({apiActionResults, body: {}}, options);

	}

	private _apiRequest: any;

	private _apiResponse: IResponse;

	private _innerError: Error | undefined;

	get apiRequest (): any {

		return this._apiRequest;

	}

	get apiResponse (): IResponse {

		return this._apiResponse;

	}

	get innerError (): Error | undefined {

		return this._innerError;

	}

	constructor (apiResponse: IResponse, options: ILimelightApiErrorOptions = {}) {

		const message = _.reduce(apiResponse.apiActionResults, (memo, r) => {

			memo += ` ${r.responseCode} ${r.responseCodeDesc}`;
			return memo;

		}, 'limelight api error code');

		super(message);

		// Remove this when we target es2015+
		Object.setPrototypeOf(this, LimelightApiError.prototype);

		this._apiRequest = options.apiRequest;
		this._apiResponse = apiResponse;
		this._innerError = options.innerError;

	}

}
