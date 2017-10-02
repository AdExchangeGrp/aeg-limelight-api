import * as _ from 'lodash';
import { IActionResultType, IResponseType } from './types/limelight-types';

export default class LimelightApiError extends Error {

	public static createWithOne (responseCode: number, responseCodeDesc: string) {

		return new LimelightApiError({apiActionResults: [{responseCode, responseCodeDesc}], body: {}});

	}

	public static createWithArray (apiActionResults: IActionResultType[]) {

		return new LimelightApiError({apiActionResults, body: {}});

	}

	private _apiResponse: IResponseType;

	private _innerError: Error | undefined;

	get apiResponse (): IResponseType {

		return this._apiResponse;

	}

	get innerError (): Error | undefined {

		return this._innerError;

	}

	constructor (apiResponse: IResponseType, innerError?: Error | undefined) {

		const message = _.reduce(apiResponse.apiActionResults, (memo, r) => {

			memo += ` ${r.responseCode} ${r.responseCodeDesc}`;
			return memo;

		}, 'limelight api error code');

		super(message);

		// Remove this when we target es2015+
		Object.setPrototypeOf(this, LimelightApiError.prototype);

		this._apiResponse = apiResponse;
		this._innerError = innerError;

	}

}