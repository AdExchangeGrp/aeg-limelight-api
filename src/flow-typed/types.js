// @flow

export type LimelightApiOptionsType = {

	timeout?: number,
	errorCodeOverrides?: string[]

}

export type LimelightApiResponseType = {

	responseCode: number,
	responseCodeDesc: string,
	body: ?Object

}
