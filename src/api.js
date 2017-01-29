// @flow

import type { LimelightApiOptionsType, LimelightApiResponseType } from './flow-typed/types';
import LimelightApiError from './limelight-api-error';
import config from 'config';
import request from 'request-promise';
import _ from 'lodash';
import qs from 'querystring';
import $ from 'stringformat';
import { Base } from '@adexchange/aeg-common';

type ComposeApiCallResponseType = {

	url: string,
	form: Object,
	timeout: number
}

/**
 * Limelight API wrapper
 */
class Api extends Base {

	_user: string;
	_password: string;
	_domain: string;
	_config: Object;
	_conf: Object;
	_membershipResponseCodes: Map<number, string>;

	/**
	 * Constructor
	 * @param {string} user
	 * @param {string} password
	 * @param {string} domain
	 */
	constructor (user: string, password: string, domain: string): void {

		super();

		this._user = user;
		this._password = password;
		this._domain = domain;
		this._conf = config.get('aeg-limelight-api');
		this._membershipResponseCodes = new Map([
			[100, 'Success'],
			[200, 'Invalid login credentials'],
			[320, 'Invalid Product Id'],
			[321, 'Existing Product Category Id Not Found'],
			[322, 'Invalid Category Id'],
			[323, 'Digital Delivery and Digital URL must be paired together and digital URL must be a valid URL'],
			[324, 'Invalid rebill_product or rebill_days value'],
			[325, 'Length Does Not Meet Minimum'],
			[326, 'URL is invalid'],
			[327, 'Payment Type Invalid'],
			[328, 'Expiration Date Invalid (Must be in the format of MMYY with no special characters)'],
			[329, 'Credit card must be either 15 or 16 digits numeric only'],
			[330, 'No Status Passed'],
			[331, 'Invalid Criteria'],
			[332, 'Start and end date are required'],
			[333, 'No Orders Found'],
			[334, 'Invalid Start Date format'],
			[335, 'Invalid End Date format'],
			[336, 'Wild Card Unsupported for this search criteria'],
			[337, 'Last 4 or First 4 must be 4 characters exactly'],
			[338, 'Timestamp invalid'],
			[339, 'Total Amount must be numeric and non-negative'],
			[340, 'Invalid country code'],
			[341, 'Invalid state code'],
			[342, 'Invalid Email Address'],
			[343, 'Data Element Has Same Value As Value Passed No Update done (Information ONLY, but still a success)'],
			[344, 'Invalid Number Format'],
			[345, 'Must be a 1 or 0.  "1" being "On" or true. "0" being "Off" or false.'],
			[346, 'Invalid date format. Use mm/dd/yyyy'],
			[347, 'Invalid RMA reason'],
			[348, 'Order is already flagged as RMA'],
			[349, 'Order is not flagged as RMA'],
			[350, 'Invalid order Id supplied'],
			[351, 'Invalid status or action supplied'],
			[352, 'Uneven Order/Status/Action Pairing'],
			[353, 'Cannot stop recurring'],
			[354, 'Cannot reset recurring'],
			[355, 'Cannot start recurring'],
			[356, 'Credit card has expired'],
			[357, 'Exceeded number of batch orders to view'],
			[360, 'Cannot stop upsell recurring'],
			[370, 'Invalid amount supplied'],
			[371, 'Invalid keep recurring flag supplied'],
			[372, 'Refund amount exceeds current order total'],
			[373, 'Cannot void a fully refunded order'],
			[374, 'Cannot reprocess non-declined orders'],
			[375, 'Cannot blacklist test payment method'],
			[376, 'Invalid tracking number'],
			[377, 'Cannot ship pending orders'],
			[378, 'Order already shipped'],
			[379, 'Order is fully refunded/voided'],
			[380, 'Order is not valid for force bill'],
			[381, 'Customer is blacklisted'],
			[382, 'Invalid US state'],
			[383, 'All military states must have a city of either "APO", "FPO". or "DPO"'],
			[384, 'Invalid date mode'],
			[385, 'Invalid billing cycle filter'],
			[386, 'Order has already been returned'],
			[387, 'Invalid return reason'],
			[388, 'Rebill discount exceeds maximum for product'],
			[389, 'Refund amount must be greater than 0'],
			[390, 'Invalid number of days supplied'],
			[400, 'Invalid campaign Id supplied'],
			[401, 'Invalid subscription type'],
			[402, 'Subscription type 3 requires subscription week and subscription day values'],
			[403, 'Invalid subscription week value'],
			[404, 'Invalid subscription day value'],
			[405, 'Subscription type 3 required for subscription week and subscription day values'],
			[406, 'Rebill days must be a value between 1 and 31 for subscription type 2'],
			[407, 'Rebill days must be greater than 0 if subscription type is 1 or 2'],
			[408, 'Rebill days is invalid unless type is 1 or 2'],
			[409, 'Subscription type 0, other subscription fields invalid'],
			[410, 'API user: (api_username) has reached the limit of requests per minute: (limit) for method: (method_name)'],
			[411, 'Invalid subscription field'],
			[412, 'Missing subscription field'],
			[413, 'Product is not subscription based'],
			[415, 'Invalid subscription value'],
			[420, 'Campaign does not have fulfillment provider attached'],
			[421, 'This order was placed on hold'],
			[422, 'This order has not been sent to fulfillment yet'],
			[423, 'Invalid SKU'],
			[424, 'Fulfillment Error, provider did not specify'],
			[425, 'This order has been sent to fulfillment but has not been shipped'],
			[426, 'This order not eligible for offline payment  approval (incorrect status & payment type)'],
			[430, 'Coupon Error: Invalid Promo Code'],
			[431, 'Coupon Error: This promo code has expired'],
			[432, 'Coupon Error: Product does not meet minimum purchase amount'],
			[433, 'Coupon Error: Maximum use count has exceeded'],
			[434, 'Coupon Error: Customer use count has exceeded its limit'],
			[435, 'Invalid attribute found on product'],
			[436, 'Invalid option found on attribute'],
			[437, 'Invalid attribute combination; no variants matched for product'],
			[438, 'Invalid attribute(s). Product does not have variants'],
			[439, 'Product has variants; product attributes must be provided.'],
			[500, 'Invalid customer Id supplied'],
			[600, 'Invalid product Id supplied'],
			[601, 'Invalid prospect Id supplied'],
			[602, 'No prospects found'],
			[603, 'Invalid customer Id supplied'],
			[604, 'No customers found'],
			[666, 'User does not have permission to use this method'],
			[667, 'This user account is currently disabled'],
			[700, 'Invalid method supplied'],
			[701, 'Action not permitted by gateway'],
			[702, 'Invalid gateway Id'],
			[800, 'Transaction was declined'],
			[901, 'Invalid return URL'],
			[902, 'Invalid cancel URL'],
			[903, 'Error retrieving alternative provider data'],
			[904, 'Campaign does not support an alternative payment provider'],
			[905, 'Product quantity/dynamic price does not match'],
			[906, 'Invalid quantity'],
			[907, 'Invalid shipping Id'],
			[908, 'Payment was already approved'],
			[1000, 'SSL is required']
		]);

	}

	/**
	 * Validate the credentials
	 *  @returns {Promise.<LimelightApiResponseType>}
	 */
	async validateCredentials (): Promise<LimelightApiResponseType> {

		return this._apiRequest('membership', 'validate_credentials', {}, {});

	}

	/**
	 * Find all active campaigns
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async findActiveCampaigns (options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		return this._apiRequest('membership', 'campaign_find_active', {}, options);

	}

	/**
	 * Gets a campaign
	 * @param {number} campaignId
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async getCampaign (campaignId: number, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'getCampaign must have a campaign id');

		}

		return this._apiRequest('membership', 'campaign_view', {'campaign_id': campaignId}, options);

	}

	/**
	 * Gets an order
	 * @param {number} orderId
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async getOrder (orderId: number, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!orderId) {

			throw LimelightApiError.createWithOne(500, 'getOrder must have an order id');

		}

		return this._apiRequest('membership', 'order_view', {'order_id': orderId}, options);

	}

	/**
	 * Gets a set of orders
	 * @param {number[]} orderIds
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async getOrders (orderIds: number[], options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!orderIds || !orderIds.length) {

			throw LimelightApiError.createWithOne(500, 'getOrders must have order ids');

		}

		if (orderIds.length > 200) {

			throw LimelightApiError.createWithOne(500, 'getOrders cannot fetch greater than 200 orders');

		}

		return this._apiRequest('membership', 'order_view', {'order_id': orderIds.join(',')}, options);

	}

	/**
	 * Find orders
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async findOrders (params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!params || !params.campaign_id || !params.criteria || !params.start_date || !params.end_date) {

			throw LimelightApiError.createWithOne(500, 'findOrders requires params: campaign_id, criteria, start_date, end_date');

		}

		if (params.product_ids && !_.isString(params.product_ids)) {

			params.product_ids = params.product_ids.join(',');

		}

		return this._apiRequest('membership', 'order_find', params, _.extend({errorCodeOverrides: [333]}, options));

	}

	/**
	 * Find updated orders
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async findUpdatedOrders (params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!params || !params.campaign_id || !params.group_keys || !params.start_date || !params.end_date) {

			throw LimelightApiError.createWithOne(500, 'findUpdatedOrders requires params: campaign_id, group_keys, start_date, end_date');

		}

		if (!_.isString(params.group_keys)) {

			params.group_keys = params.group_keys.join(',');

		}

		return this._apiRequest('membership', 'order_find_updated', params, _.extend({errorCodeOverrides: [333]}, options));

	}

	/**
	 * Update orders
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async updateOrders (params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!params || !params.orderIds || !params.actions || !params.values) {

			throw LimelightApiError.createWithOne(500, 'updateOrders requires params: order_ids, tracking_number');

		}

		if (!_.isString(params.orderIds)) {

			params.orderIds = params.orderIds.join(',');

		}

		if (!_.isString(params.actions)) {

			params.actions = params.actions.join(',');

		}

		if (!_.isString(params.values)) {

			params.values = params.values.join(',');

		}

		return this._apiRequest(
			'membership',
			'order_update',
			{
				order_ids: params.orderIds,
				sync_all: 0,
				actions: params.actions,
				values: params.values
			},
			_.extend({errorCodeOverrides: [343]}, options));

	}

	/**
	 * Get a customer
	 * @param {number} customerId
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async getCustomer (customerId: number, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!customerId) {

			throw LimelightApiError.createWithOne(500, 'getCustomer must have a customer id');

		}

		return this._apiRequest('membership', 'customer_view', {'customer_id': customerId}, options);

	}

	/**
	 * Find customers
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 */
	async findCustomers (params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!params || !params.campaign_id || !params.start_date || !params.end_date) {

			throw LimelightApiError.createWithOne(500, 'findCustomer requires params: campaign_id, start_date, end_date');

		}

		return this._apiRequest('membership', 'customer_find', params, _.extend({errorCodeOverrides: [604]}, options));

	}

	/**
	 * Gets a set of products
	 * @param {number[]} productIds
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 * @returns {*}
	 */
	async getProducts (productIds: number[], options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!productIds || !productIds.length) {

			throw LimelightApiError.createWithOne(500, 'getProducts must product ids');

		}

		return this._apiRequest('membership', 'product_index', {product_id: productIds.join(',')}, options);

	}

	/**
	 * Gets the shipping methods
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} [options]
	 * @returns {Promise.<LimelightApiResponseType>}
	 * @returns {*}
	 */
	async findShippingMethods (params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		if (!params || !params.campaign_id) {

			throw LimelightApiError.createWithOne(500, 'findShippingMethods requires params: campaign_id');

		}

		return this._apiRequest('membership', 'shipping_method_find', params, options);

	}

	/**
	 * Compose an API request
	 * @param {string} apiType
	 * @param {string} method
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} options
	 * @returns {{url: {string}, form: {username: (string|*), password: (string|*), method: *}, timeout: number}}
	 * @private
	 */
	_composeApiCall (apiType: string, method: string, params: Object, options: LimelightApiOptionsType = {}): ComposeApiCallResponseType {

		const form: Object = {
			username: this._user,
			password: this._password,
			method: method
		};

		if (params !== null) {

			_.extend(form, params);

		}

		return {
			url: apiType === 'membership' ? $(this._conf.membershipApiUrl, this._domain) : $(this._conf.transactionApiUrl, this._domain),
			form: form,
			timeout: options.timeout || this._conf.timeout || 30000
		};

	}

	/**
	 * Submit an API request
	 * @param {string} apiType
	 * @param {string} method
	 * @param {Object} params
	 * @param {LimelightApiOptionsType} options
	 * @returns {Promise.<LimelightApiResponseType>}
	 * @private
	 */
	async _apiRequest (apiType: string, method: string, params: Object, options: LimelightApiOptionsType = {}): Promise<LimelightApiResponseType> {

		const self: Api = this;

		const requestParams: ComposeApiCallResponseType = self._composeApiCall(apiType, method, params, options);
		const body: Object = await request.post(requestParams);

		return _responseHandler(body);

		/**
		 * Process the response
		 * @param {Object} body
		 * @returns {Promise.<LimelightApiResponseType>}
		 * @private
		 */
		async function _responseHandler (body: Object) {

			// filtering characters that potentially break JSON parsing since LL uses URL encoded strings
			body = body.replace(/%22|%00|%01|%02|%03|%04|%05|%06|%07|%08|%09|%0A|%0B|%0C|%0D|%0E|%0F|%10|%11|%12|%13|%14|%15|%16|%17|%18|%19|%1A|%1B|%1C|%1D|%1E|%1F/g, '');

			body = qs.parse(body);

			// so it appears LL really sucks, because it uses different response codes for different api calls

			const results: LimelightApiResponseType = {apiActionResults: [], body};

			if (body.response_code) {

				const codes: string[] = body.response_code.split(',');

				if (codes.length === 1) {

					results.apiActionResults.push({
						responseCode: parseInt(body.response_code),
						responseCodeDesc: self._membershipResponseCodes.get(Number(body.response_code)) || 'Unspecified'
					});

				} else {

					results.apiActionResults.push(...(_.map(codes, (code) => {

						return {
							responseCode: parseInt(code),
							responseCodeDesc: self._membershipResponseCodes.get(Number(code)) || 'Unspecified'
						};

					})));

				}

			} else if (body.response) {

				results.apiActionResults.push({
					responseCode: parseInt(body.response),
					responseCodeDesc: self._membershipResponseCodes.get(Number(body.response)) || 'Unspecified'
				});

			} else if (Object.keys(body).length > 0 && Object.keys(body)[0] === '100') {

				results.apiActionResults.push({
					responseCode: 100,
					responseCodeDesc: 'Success'
				});

			} else if (Object.keys(body).length > 0 && Object.keys(body)[0] === '200') {

				results.apiActionResults.push({
					responseCode: 200,
					responseCodeDesc: 'Unauthorized'
				});

			} else {

				self.emit('error', '_apiRequest', {message: 'Something has gone terribly wrong', data: {body}});

				results.apiActionResults.push({
					responseCode: 500,
					responseCodeDesc: 'Something has gone terribly wrong'
				});

			}

			if (results.body && results.body.data) {

				try {

					// $FlowFixMe
					results.body.data = JSON.parse(results.body.data);

				} catch (ex) {

					self.emit('error', '_apiRequest', {
						message: 'Failed to parse result.body.data',
						data: {
							requestParams,
							body: results.body.data
						},
						err: ex
					});

					LimelightApiError.createWithOne(500, 'failed to parse result.body.data', ex);

				}

			}

			// not all codes are errors on all calls
			if (_.filter(results.apiActionResults,
					(r) => {

						if (options && options.errorCodeOverrides) {

							return !_.includes(options.errorCodeOverrides, r.responseCode) && r.responseCode !== 100;

						} else {

							return r.responseCode !== 100;

						}

					}).length) {

				throw LimelightApiError.createWithArray(results.apiActionResults);

			}

			return results;

		}

	}

}

export default Api;

