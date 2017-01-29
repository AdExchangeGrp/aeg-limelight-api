// @flow

export type LimelightApiOptionsType = {

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

