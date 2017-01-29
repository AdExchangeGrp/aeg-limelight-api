// @flow

export type LimelightApiOptionsType = {

	retries?: number,
	retryDelay?: number,
	timeout?: number,
	errorCodeOverrides?: string[]

}

export type LimelightApiActionResultType = {

	responseCode: number,
	responseCodeDesc: string

}

export type LimelightApiResponseType = {

	apiActionResults: LimelightApiActionResultType[],
	body?: ?Object

}

