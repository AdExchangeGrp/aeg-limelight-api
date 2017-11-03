import LimelightApiError from './limelight-api-error';
import * as config from 'config';
import * as request from 'request-promise';
import * as _ from 'lodash';
import * as qs from 'querystring';
import * as $ from 'stringformat';
import { Base, ControlFlow } from '@adexchange/aeg-common';
import * as EventEmitter from 'events';
import * as csv from 'fast-csv';
import {
	ILimelightApiCampaign,
	ILimelightApiCustomer,
	ILimelightApiFindOrdersOptions,
	ILimelightApiOptions,
	ILimelightApiOrder,
	ILimelightApiProduct,
	ILimelightApiShippingMethod,
	LimelightApiFindActiveCampaignsResponse,
	LimelightApiFindCustomersResponse,
	LimelightApiFindOrdersResponse,
	LimelightApiFindUpdatedOrdersResponse,
	LimelightApiGetCampaignResponse,
	LimelightApiGetCustomerResponse,
	LimelightApiGetOrderResponse,
	LimelightApiGetOrdersResponse,
	LimelightApiGetProductsResponse,
	LimelightApiShippingMethodResponse,
	LimelightApiUpdateOrdersRequest,
	LimelightApiUpdateOrdersResponse
} from './types/types';
import {
	ICampaign,
	ICustomer,
	IFindActiveCampaignsResponse,
	IFindCustomersResponse,
	IFindOrdersResponse,
	IGetCampaignResponse,
	IGetCustomerResponse,
	IGetOrderResponse,
	IGetOrdersResponseSingleOrder,
	IGetOrdersResponse,
	IGetProductsResponse,
	IOrder,
	IProduct,
	IResponse, IShippingMethodResponse, IShippingMethod
} from './types/limelight-types';

export interface IComposeApiCallResponseType {

	uri: string;
	form: any;
	timeout: number;
}

/**
 * Limelight API wrapper
 */
export default class Api extends Base {

	private _user: string;

	private _password: string;

	private _domain: string;

	private _conf: any;

	private _eventEmitter: EventEmitter;

	private _membershipResponseCodes: Map<number, string>;

	constructor (user: string, password: string, domain: string) {

		super();

		this._user = user;
		this._password = password;
		this._domain = domain;
		this._conf = config.get('aeg-limelight-api');
		this._eventEmitter = new EventEmitter();

		this._eventEmitter
			.on('warn', (data) => {

				this.emit('warn', '', data);

			});

		this._membershipResponseCodes = new Map([
			[100, 'Success'],
			[200, 'Unauthorized'],
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
	 * Get the description for a response code
	 */
	public membershipResponseCodeDesc (code: number): string {

		return this._membershipResponseCodes.get(code) || 'Unspecified';

	}

	/**
	 * Validate the credentials
	 */
	public async validateCredentials (options: ILimelightApiOptions = {}): Promise<boolean> {

		try {

			await this._apiRequest('membership', 'validate_credentials', {}, options);
			return true;

		} catch (ex) {

			if (ex instanceof LimelightApiError && ex.apiResponse.apiActionResults[0].responseCode === 200) {

				return false;

			} else {

				throw ex;

			}

		}

	}

	/**
	 * Find all active campaigns
	 */
	public async findActiveCampaigns (
		options: ILimelightApiOptions = {}): Promise<LimelightApiFindActiveCampaignsResponse> {

		const response: IFindActiveCampaignsResponse =
			await this._apiRequest(
				'membership',
				'campaign_find_active', {}, options);
		const campaignIds = response.body.campaign_id.split(',');
		const campaignNames = response.body.campaign_name.split(',');

		return _.map(campaignIds, (id, i) => {

			return {id, name: campaignNames[i]};

		});

	}

	/**
	 * Gets a campaign
	 */
	public async getCampaign (
		campaignId: number,
		options: ILimelightApiOptions = {}): Promise<LimelightApiGetCampaignResponse> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'getCampaign must have a campaign id');

		}

		try {

			const response: IGetCampaignResponse =
				await this._apiRequest(
					'membership',
					'campaign_view',
					{campaign_id: campaignId}, options);

			return this._cleanseCampaign(campaignId, response.body);

		} catch (ex) {

			if (ex.apiResponse.apiActionResults[0].responseCode !== 400) {

				throw ex;

			}

		}

		return;

	}

	/**
	 * Gets an order
	 */
	public async getOrder (
		orderId: number,
		options: ILimelightApiOptions = {}): Promise<LimelightApiGetOrderResponse> {

		if (!orderId) {

			throw LimelightApiError.createWithOne(500, 'getOrder must have an order id');

		}

		const response: IGetOrderResponse =
			await this._apiRequest(
				'membership',
				'order_view',
				{order_id: orderId}, _.extend({errorCodeOverrides: [350]}, options));

		if (response.body.response_code === '100') {

			return this._cleanseOrder(orderId, response.body);

		}

		return;

	}

	/**
	 * Gets a set of orders
	 */
	public async getOrders (
		orderIds: number[],
		options: ILimelightApiOptions = {}): Promise<LimelightApiGetOrdersResponse> {

		if (!orderIds || !orderIds.length) {

			throw LimelightApiError.createWithOne(500, 'getOrders must have order ids');

		}

		if (orderIds.length > 200) {

			throw LimelightApiError.createWithOne(500, 'getOrders cannot fetch greater than 200 orders');

		}

		if (orderIds.length === 1) {

			const result: IGetOrdersResponseSingleOrder =
				await this._apiRequest(
					'membership',
					'order_view',
					{order_id: orderIds.join(',')}, _.extend({errorCodeOverrides: [350]}, options));

			if (result.body) {

				if (result.body.response_code !== '350') {

					return [this._cleanseOrder(Number(orderIds[0]), result.body)];

				} else {

					return [];

				}

			}

		} else {

			const result: IGetOrdersResponse =
				await this._apiRequest(
					'membership',
					'order_view',
					{order_id: orderIds.join(',')}, _.extend({errorCodeOverrides: [350]}, options));

			if (result.body && result.body.data) {

				const map = _.map(Object.keys(result.body.data), (key) => {

					if (result.body.data[key].response_code !== '350') {

						return this._cleanseOrder(Number(key), result.body.data[key]);

					}

					return;

				});

				return _.filter(map, (m) => {

					return !!m;

				}) as LimelightApiGetOrdersResponse;

			}

		}

		return [];

	}

	/**
	 * Find orders
	 */
	public async findOrders (
		campaignId: string | number,
		startDate: string,
		endDate: string,
		options: ILimelightApiFindOrdersOptions = {}): Promise<LimelightApiFindOrdersResponse> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'findOrders must have a campaign id');

		}

		if (!startDate) {

			throw LimelightApiError.createWithOne(500, 'findOrders must have a startDate');

		}

		if (!endDate) {

			throw LimelightApiError.createWithOne(500, 'findOrders must have an endDate');

		}

		const params: {
			campaign_id: string | number,
			start_date: string,
			end_date: string,
			start_time?: string,
			end_time?: string,
			product_ids?: number[],
			customer_id?: number,
			search_type?: string,
			criteria?: string
		} = {
			campaign_id: campaignId,
			start_date: startDate,
			end_date: endDate
		};

		if (options.criteria) {

			params.criteria = options.criteria;

		} else {

			params.criteria = 'all';

		}

		if (options.startTime) {

			params.start_time = options.startTime;

		}

		if (options.endTime) {

			params.end_time = options.endTime;

		}

		if (options.searchType) {

			params.search_type = options.searchType;

		}

		if (options.productIds) {

			params.product_ids = options.productIds;

		}

		if (options.customerId) {

			params.customer_id = options.customerId;

		}

		const response: IFindOrdersResponse =
			await this._apiRequest(
				'membership',
				'order_find', params, _.extend({errorCodeOverrides: [333]}, options));

		if (response.apiActionResults[0].responseCode === 333) {

			return [];

		}

		return _.map(response.body.order_ids.split(','), (o) => {

			return Number(o);

		});

	}

	/**
	 * Find updated orders
	 */
	public async findUpdatedOrders (
		campaignId: string | number,
		groupKeys: string[],
		startDate: string,
		endDate: string,
		options: ILimelightApiOptions = {}): Promise<LimelightApiFindUpdatedOrdersResponse> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'findUpdatedOrders must have a campaign id');

		}

		if (!groupKeys || !groupKeys.length) {

			throw LimelightApiError.createWithOne(500, 'findUpdatedOrders must have groupKeys');

		}

		if (!startDate) {

			throw LimelightApiError.createWithOne(500, 'findUpdatedOrders must have a startDate');

		}

		if (!endDate) {

			throw LimelightApiError.createWithOne(500, 'findUpdatedOrders must have an endDate');

		}

		const params = {
			campaign_id: campaignId,
			group_keys: groupKeys.join(','),
			start_date: startDate,
			end_date: endDate
		};

		const response =
			await this._apiRequest(
				'membership',
				'order_find_updated', params, _.extend({errorCodeOverrides: [333]}, options));

		if (response.apiActionResults[0].responseCode === 333) {

			return [];

		}

		if (response.body && response.body.data) {

			return _.map(Object.keys(response.body.data), (m) => {

				return Number(m);

			});

		}

		return [];

	}

	/**
	 * Update orders
	 */
	public async updateOrders (
		orderUpdates: LimelightApiUpdateOrdersRequest,
		options: ILimelightApiOptions = {}): Promise<LimelightApiUpdateOrdersResponse> {

		if (!orderUpdates || !orderUpdates.length) {

			return [];

		}

		const params = {
			order_ids: _.map(orderUpdates, 'orderId').join(','),
			sync_all: 0,
			actions: _.map(orderUpdates, 'action').join(','),
			values: _.map(orderUpdates, 'value').join(',')
		};

		// some feedback on 350 missing id might be helpful
		const result = await this._apiRequest(
			'membership',
			'order_update',
			params,
			_.extend({errorCodeOverrides: [343, 350, 379]}, options));

		return _.filter(_.map(result.apiActionResults, (innerResult, i) => {

			return {
				orderId: Number(orderUpdates[i].orderId),
				statusCode: Number(innerResult.responseCode)
			};

		}), (f) => {

			return f.statusCode !== 100;

		});

	}

	/**
	 * Get a customer
	 */
	public async getCustomer (
		customerId: number,
		options: ILimelightApiOptions = {}): Promise<LimelightApiGetCustomerResponse> {

		if (!customerId) {

			throw LimelightApiError.createWithOne(500, 'getCustomer must have a customer id');

		}

		const response: IGetCustomerResponse =
			await this._apiRequest(
				'membership',
				'customer_view',
				{customer_id: customerId}, _.extend({errorCodeOverrides: [603]}, options));

		if (response.body.response_code === '100') {

			return this._cleanseCustomer(customerId, response.body);

		}

		return;

	}

	/**
	 * Find customers
	 */
	public async findCustomers (
		campaignId: number | string,
		startDate: string,
		endDate: string,
		options: ILimelightApiOptions = {}): Promise<LimelightApiFindCustomersResponse> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'findCustomers must have a campaign id');

		}

		if (!startDate) {

			throw LimelightApiError.createWithOne(500, 'findCustomers must have a start date');

		}

		if (!endDate) {

			throw LimelightApiError.createWithOne(500, 'findCustomers must have a end date');

		}

		const params = {
			campaign_id: campaignId,
			start_date: startDate,
			end_date: endDate
		};

		const response: IFindCustomersResponse =
			await this._apiRequest(
				'membership',
				'customer_find',
				params, _.extend({errorCodeOverrides: [604]}, options));

		if (response.apiActionResults[0].responseCode === 604) {

			return [];

		}

		return _.map(response.body.customer_ids.split(','), (c) => {

			return Number(c);

		});

	}

	/**
	 * Gets a set of products
	 */
	public async getProducts (
		productIds: number[],
		options: ILimelightApiOptions = {}): Promise<LimelightApiGetProductsResponse> {

		if (!productIds || !productIds.length) {

			throw LimelightApiError.createWithOne(500, 'getProducts requires product ids');

		}

		const response: IGetProductsResponse =
			await this._apiRequest(
				'membership',
				'product_index',
				{product_id: productIds.join(',')}, _.extend({errorCodeOverrides: [600]}, options));

		if (response.body) {

			return this._cleanseProducts(productIds, response.body);

		}

		return [];

	}

	/**
	 * Gets the shipping methods
	 */
	public async findShippingMethods (
		campaignId: string | number,
		options: ILimelightApiOptions = {}): Promise<LimelightApiShippingMethodResponse> {

		if (!campaignId) {

			throw LimelightApiError.createWithOne(500, 'findShippingMethods must have a campaign id');

		}

		const params = {
			campaign_id: campaignId,
			return_type: 'shipping_method_view'
		};

		const response: IShippingMethodResponse =
			await this._apiRequest('membership', 'shipping_method_find', params, options);

		return _.map(Object.keys(response.body.data), (key) => {

			return this._cleanseShippingInfo(Number(key), response.body.data[key]);

		});

	}

	/**
	 * Compose an API request
	 */
	private _composeApiCall (
		apiType: string,
		method: string,
		params: any,
		options: ILimelightApiOptions = {}): IComposeApiCallResponseType {

		const form = {
			username: this._user,
			password: this._password,
			method
		};

		if (params !== null) {

			_.extend(form, params);

		}

		return {
			uri: apiType === 'membership'
				? $(this._conf.membershipApiUrl, this._domain)
				: $(this._conf.transactionApiUrl, this._domain),
			form,
			timeout: options.timeout || this._conf.timeout || 30000
		};

	}

	/**
	 * Submit an API request
	 */
	private async _apiRequest (
		apiType: string,
		method: string,
		params: any,
		options: ILimelightApiOptions = {}): Promise<IResponse> {

		const self: Api = this;

		const requestParams: IComposeApiCallResponseType = self._composeApiCall(apiType, method, params, options);

		const retries: number = options.retries || 1;
		const retryDelay: number = options.retryDelay || 0;

		let body: any = await ControlFlow.retryWhilst<any>(retries, retryDelay, async (attempts) => {

			if (attempts > 1) {

				self.emit('warn', `_apiRequest: ${method}`, {message: 'retry failed', data: {attempt: attempts - 1}});

			}

			return await request.post(requestParams);

		}, self._eventEmitter);

		return _responseHandler();

		/**
		 * Process the response
		 */
		function _responseHandler (): IResponse {

			// filtering characters that potentially break JSON parsing since LL uses URL encoded strings
			body = body.replace(/%22|%00|%01|%02|%03|%04|%05|%06|%07|%08|%09|%0A|%0B|%0C|%0D|%0E|%0F|%10|%11|%12|%13|%14|%15|%16|%17|%18|%19|%1A|%1B|%1C|%1D|%1E|%1F/g, '');

			body = qs.parse(body);

			// so it appears LL really sucks, because it uses different response codes for different api calls

			const results: IResponse = {apiActionResults: [], body};

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

					throw LimelightApiError.createWithOne(500, 'failed to parse result.body.data');

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

	/**
	 * Cleans up the order response
	 */
	private _cleanseOrder (orderId: number, order: IOrder): ILimelightApiOrder {

		return {
			id: orderId,
			acquisitionDate: order.acquisition_date,
			ancestorId: order.ancestor_id,
			affiliate: order.affiliate,
			afid: order.afid,
			sid: order.sid,
			affid: order.affid,
			c1: order.c1,
			c2: order.c2,
			c3: order.c3,
			aid: order.aid,
			opt: order.opt,
			amountRefundedToDate: order.amount_refunded_to_date,
			authId: order.auth_id,
			billingCity: order.billing_city,
			billingCountry: order.billing_country,
			billingCycle: order.billing_cycle,
			billingFirstName: order.billing_first_name,
			billingLastName: order.billing_last_name,
			billingPostcode: order.billing_postcode,
			billingState: order.billing_state,
			billingStateId: order.billing_state_id,
			billingStreetAddress: order.billing_street_address,
			billingStreetAddress2: order.billing_street_address2,
			campaignId: order.campaign_id,
			ccExpires: order.cc_expires,
			ccFirst6: order.cc_first_6,
			ccLast4: order.cc_last_4,
			ccNumber: order.cc_number,
			creditCardNumber: order.credit_card_number,
			ccType: order.cc_type,
			chargebackDate: order.chargeback_date,
			checkAccountLast4: order.check_account_last_4,
			checkRoutingLast4: order.check_routing_last_4,
			checkSSNLast4: order.check_ssn_last_4,
			checkTransitNum: order.check_transitnum,
			childId: order.child_id,
			clickId: order.click_id,
			createdByUserName: order.created_by_user_name,
			createdByEmployeeName: order.created_by_employee_name,
			couponDiscountAmount: order.coupon_discount_amount,
			customerId: order.customer_id,
			customersTelephone: order.customers_telephone,
			declineSalvageDiscountPercent: order.decline_salvage_discount_percent,
			declineReason: order.decline_reason,
			emailAddress: order.email_address,
			firstName: order.first_name,
			gatewayId: order.gateway_id,
			gatewayDescriptor: order.gateway_descriptor,
			holdDate: order.hold_date,
			ipAddress: order.ip_address,
			isBlacklisted: order.is_blacklisted,
			isChargeback: order.is_chargeback,
			isFraud: order.is_fraud,
			isRecurring: order.is_recurring,
			isRefund: order.is_refund,
			isRma: order.is_rma,
			isTestCC: order.is_test_cc,
			isVoid: order.is_void,
			lastName: order.last_name,
			mainProductId: order.main_product_id,
			mainProductQuantity: order.main_product_quantity,
			nextSubscriptionProduct: order.next_subscription_product,
			nextSubscriptionProductId: order.next_subscription_product_id,
			onHold: order.on_hold,
			onHoldBy: order.on_hold_by,
			orderConfirmed: order.order_confirmed,
			orderConfirmedDate: order.order_confirmed_date,
			orderSalesTax: order.order_sales_tax,
			orderSalesTaxAmount: order.order_sales_tax_amount,
			orderStatus: order.order_status,
			orderTotal: order.order_total,
			parentId: order.parent_id,
			prepaidMatch: order.prepaid_match,
			preserveGateway: order.preserve_gateway,
			processorId: order.processor_id,
			rebillDiscountPercent: order.rebill_discount_percent,
			recurringDate: order.recurring_date,
			refundAmount: order.refund_amount,
			refundDate: order.refund_date,
			retryDate: order.retry_date,
			rmaNumber: order.rma_number,
			rmaReason: order.rma_reason,
			shippingCity: order.shipping_city,
			shippingCountry: order.shipping_country,
			shipping_Date: order.shipping_date,
			shippingFirstName: order.shipping_first_name,
			shippingId: order.shipping_id,
			shippingLastName: order.shipping_last_name,
			shippingMethodName: order.shipping_method_name,
			shippingPostcode: order.shipping_postcode,
			shippingState: order.shipping_state,
			shippingStateId: order.shipping_state_id,
			shippingStreetAddress: order.shipping_street_address,
			shippingStreetAddress2: order.shipping_street_address2,
			subAffiliate: order.sub_affiliate,
			timestamp: order.time_stamp,
			trackingNumber: order.tracking_number,
			transactionId: order.transaction_id,
			upsellProductId: order.upsell_product_id,
			upsellProductQuantity: order.upsell_product_quantity,
			voidAmount: order.void_amount,
			voidDate: order.void_date,
			shippable: order.shippable,
			products: _.map(order.products, (p) => {

				return {
					id: p.product_id,
					sku: p.sku,
					price: p.price,
					productQty: p.product_qty,
					name: p.name,
					onHold: p.on_hold,
					isRecurring: p.is_recurring,
					recurringDate: p.recurring_date,
					subscriptionId: p.subscription_id,
					nextSubscriptionProduct: p.next_subscription_product,
					nextSubscriptionProductId: p.next_subscription_product_id
				};

			})
		};

	}

	/**
	 * Cleans up the campaign response
	 */
	private _cleanseCampaign (id: number, campaign: ICampaign): ILimelightApiCampaign {

		return {
			id,
			campaignName: campaign.campaign_name,
			campaignDescription: campaign.campaign_description,
			campaignType: campaign.campaign_type,
			gatewayId: campaign.gateway_id,
			isLoadBalanced: campaign.is_load_balanced,
			loadBalanceProfile: campaign.load_balance_profile,
			productId: campaign.product_id,
			productName: campaign.product_name,
			isUpsell: campaign.is_upsell,
			shippingId: campaign.shipping_id,
			shippingName: campaign.shipping_name,
			shippingDescription: campaign.shipping_description,
			shippingRecurringPrice: campaign.shipping_recurring_price,
			shippingInitialPrice: campaign.shipping_initial_price,
			countries: campaign.countries,
			paymentName: campaign.payment_name,
			successUrl1: campaign.success_url_1,
			successUrl2: campaign.success_url_2
		};

	}

	/**
	 * Cleans up the customer response
	 */
	private _cleanseCustomer (id: number, customer: ICustomer): ILimelightApiCustomer {

		return {
			id,
			firstName: customer.first_name,
			lastName: customer.last_name,
			email: customer.email,
			phone: customer.phone,
			dateCreated: customer.date_created,
			orderCount: customer.order_count,
			orderList: customer.order_list
		};

	}

	/**
	 * Cleans up the shipping method response
	 */
	private _cleanseShippingInfo (id: number, shippingMethod: IShippingMethod): ILimelightApiShippingMethod {

		return {
			id,
			name: shippingMethod.name,
			description: shippingMethod.description,
			groupName: shippingMethod.group_name,
			code: shippingMethod.code,
			initialAmount: shippingMethod.initial_amount,
			subscriptionAmount: shippingMethod.subscription_amount
		};

	}

	/**
	 * Cleans up the product response
	 */
	private async _cleanseProducts (productIds: number[], product: IProduct): Promise<ILimelightApiProduct[]> {

		// const name = await this._parseCsv(product.product_name);
		// const sku = await this._parseCsv(product.product_sku);
		// const price = await this._parseCsv(product.product_price);
		// const isTrial = await this._parseCsv(product.product_is_trial);
		// const rebillProduct = await this._parseCsv(product.product_rebill_product);
		// const rebillDays = await this._parseCsv(product.product_rebill_days);
		// const maxQuantity = await this._parseCsv(product.product_max_quantity);
		// const preserveRecurringQuantity = await this._parseCsv(product.preserve_recurring_quantity);
		// const subscriptionType = await this._parseCsv(product.subscription_type);
		// const subscriptionWeek = await this._parseCsv(product.subscription_week);
		// const subscriptionDay = await this._parseCsv(product.subscription_day);
		// const costOfGoodsSold = await this._parseCsv(product.cost_of_goods_sold);

		const responseCodes = await this._parseCsv(product.response_code);
		const isShippable = await this._parseCsv(product.product_is_shippable);
		const categoryName = await this._parseCsv(product.product_category_name);
		const description = await this._parseCsv(product.product_description);

		const map = _.map<string, ILimelightApiProduct | undefined>(responseCodes, (code, i) => {

			if (code === '100') {

				return {
					id: productIds[i],
					categoryName: categoryName[i],
					isShippable: isShippable[i],
					description: description[i]
					// name: name[i],
					// sku: sku[i],
					// price: price[i],
					// isTrial: isTrial[i],
					// rebillProduct: rebillProduct[i],
					// rebillDays: rebillDays[i],
					// maxQuantity: maxQuantity[i],
					// recurringQuantity: recurringQuantity[i],
					// subscriptionType: subscriptionType[i],
					// subscriptionWeek: subscriptionWeek[i],
					// subscriptionDay: subscriptionDay[i],
					// costOfGoodsSold: costOfGoodsSold[i]
				};

			}

			return;

		});

		return _.filter(map, (m) => {

			return !!m;

		}) as ILimelightApiProduct[];

	}

	/**
	 * Parse a csv string
	 */
	private async _parseCsv (csvString: string): Promise<string[]> {

		let result: string[] | undefined;

		return new Promise<string[]>((resolve, reject) => {

			csv
				.fromString(csvString, {ignoreEmpty: false})
				.on('error', (ex) => {

					reject(ex);

				})
				.on('data', (data: string[]) => {

					result = data;

				})
				.on('end', () => {

					resolve(result || []);

				});

		});

	}

}
