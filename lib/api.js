'use strict';

var config = require('config');
var request = require('request');
var _ = require('underscore');
var logger = require('@adexchangedevops/aeg-logger');
var $ = require('stringformat');
var qs = require('querystring');

$.extendString();

/*jshint camelcase: false */

var conf = config.get('LimelightApi');

var Api = function (apiConfig) {

	_.extend(this, apiConfig);

	this.membershipResponseCodes = {
		'100': 'Success',
		'200': 'Invalid login credentials',
		'320': 'Invalid Product Id',
		'321': 'Existing Product Category Id Not Found',
		'322': 'Invalid Category Id',
		'323': 'Digital Delivery and Digital URL must be paired together and digital URL must be a valid URL',
		'324': 'Invalid rebill_product or rebill_days value',
		'325': 'Length Does Not Meet Minimum',
		'326': 'URL is invalid',
		'327': 'Payment Type Invalid',
		'328': 'Expiration Date Invalid (Must be in the format of MMYY with no special characters)',
		'329': 'Credit card must be either 15 or 16 digits numeric only',
		'330': 'No Status Passed',
		'331': 'Invalid Criteria',
		'332': 'Start and end date are required',
		'333': 'No Orders Found',
		'334': 'Invalid Start Date format',
		'335': 'Invalid End Date format',
		'336': 'Wild Card Unsupported for this search criteria',
		'337': 'Last 4 or First 4 must be 4 characters exactly',
		'338': 'Timestamp invalid',
		'339': 'Total Amount must be numeric and non-negative',
		'340': 'Invalid country code',
		'341': 'Invalid state code',
		'342': 'Invalid Email Address',
		'343': 'Data Element Has Same Value As Value Passed No Update done (Information ONLY, but still a success)',
		'344': 'Invalid Number Format',
		'345': 'Must be a 1 or 0.  "1" being "On" or true. "0" being "Off" or false.',
		'346': 'Invalid date format. Use mm/dd/yyyy',
		'347': 'Invalid RMA reason',
		'348': 'Order is already flagged as RMA',
		'349': 'Order is not flagged as RMA',
		'350': 'Invalid order Id supplied',
		'351': 'Invalid status or action supplied',
		'352': 'Uneven Order/Status/Action Pairing',
		'353': 'Cannot stop recurring',
		'354': 'Cannot reset recurring',
		'355': 'Cannot start recurring',
		'356': 'Credit card has expired',
		'357': 'Exceeded number of batch orders to view',
		'360': 'Cannot stop upsell recurring',
		'370': 'Invalid amount supplied',
		'371': 'Invalid keep recurring flag supplied',
		'372': 'Refund amount exceeds current order total',
		'373': 'Cannot void a fully refunded order',
		'374': 'Cannot reprocess non-declined orders',
		'375': 'Cannot blacklist test payment method',
		'376': 'Invalid tracking number',
		'377': 'Cannot ship pending orders',
		'378': 'Order already shipped',
		'379': 'Order is fully refunded/voided',
		'380': 'Order is not valid for force bill',
		'381': 'Customer is blacklisted',
		'382': 'Invalid US state',
		'383': 'All military states must have a city of either "APO", "FPO". or "DPO"',
		'384': 'Invalid date mode',
		'385': 'Invalid billing cycle filter',
		'386': 'Order has already been returned',
		'387': 'Invalid return reason',
		'388': 'Rebill discount exceeds maximum for product',
		'389': 'Refund amount must be greater than 0',
		'390': 'Invalid number of days supplied',
		'400': 'Invalid campaign Id supplied',
		'401': 'Invalid subscription type',
		'402': 'Subscription type 3 requires subscription week and subscription day values',
		'403': 'Invalid subscription week value',
		'404': 'Invalid subscription day value',
		'405': 'Subscription type 3 required for subscription week and subscription day values',
		'406': 'Rebill days must be a value between 1 and 31 for subscription type 2',
		'407': 'Rebill days must be greater than 0 if subscription type is 1 or 2',
		'408': 'Rebill days is invalid unless type is 1 or 2',
		'409': 'Subscription type 0, other subscription fields invalid',
		'410': 'API user: (api_username) has reached the limit of requests per minute: (limit) for method: (method_name)',
		'411': 'Invalid subscription field',
		'412': 'Missing subscription field',
		'413': 'Product is not subscription based',
		'415': 'Invalid subscription value',
		'420': 'Campaign does not have fulfillment provider attached',
		'421': 'This order was placed on hold',
		'422': 'This order has not been sent to fulfillment yet',
		'423': 'Invalid SKU',
		'424': 'Fulfillment Error, provider did not specify',
		'425': 'This order has been sent to fulfillment but has not been shipped',
		'426': 'This order not eligible for offline payment  approval (incorrect status & payment type)',
		'430': 'Coupon Error: Invalid Promo Code',
		'431': 'Coupon Error: This promo code has expired',
		'432': 'Coupon Error: Product does not meet minimum purchase amount',
		'433': 'Coupon Error: Maximum use count has exceeded',
		'434': 'Coupon Error: Customer use count has exceeded its limit',
		'435': 'Invalid attribute found on product',
		'436': 'Invalid option found on attribute',
		'437': 'Invalid attribute combination; no variants matched for product',
		'438': 'Invalid attribute(s). Product does not have variants',
		'439': 'Product has variants; product attributes must be provided.',
		'500': 'Invalid customer Id supplied',
		'600': 'Invalid product Id supplied',
		'601': 'Invalid prospect Id supplied',
		'602': 'No prospects found',
		'603': 'Invalid customer Id supplied',
		'604': 'No customers found',
		'666': 'User does not have permission to use this method',
		'667': 'This user account is currently disabled',
		'700': 'Invalid method supplied',
		'701': 'Action not permitted by gateway',
		'702': 'Invalid gateway Id',
		'800': 'Transaction was declined',
		'901': 'Invalid return URL',
		'902': 'Invalid cancel URL',
		'903': 'Error retrieving alternative provider data',
		'904': 'Campaign does not support an alternative payment provider',
		'905': 'Product quantity/dynamic price does not match',
		'906': 'Invalid quantity',
		'907': 'Invalid shipping Id',
		'908': 'Payment was already approved',
		'1000': 'SSL is required'
	};
};

// Campaigns
Api.prototype.findActiveCampaigns = function (callback) {
	this.apiRequest('membership', 'campaign_find_active', {}, callback);
};

Api.prototype.getCampaign = function (campaignId, callback) {

	if (!campaignId) {
		return callback({responseCode: 500, responseCodeDesc: 'getCampaign must have a campaign id'});
	}

	this.apiRequest('membership', 'campaign_view', {'campaign_id': campaignId}, callback);
};

// Orders
Api.prototype.getOrder = function (orderId, callback) {

	if (!orderId) {
		return callback({responseCode: 500, responseCodeDesc: 'getOrder must have an order id'});
	}

	this.apiRequest('membership', 'order_view', {'order_id': orderId}, callback);
};

Api.prototype.getOrders = function (orderIds, callback) {

	if (!orderIds || orderIds.length === 0) {
		return callback({responseCode: 500, responseCodeDesc: 'getOrders must have order ids'});
	}

	if (_.isArray(orderIds) && orderIds.length > 200) {
		return callback({responseCode: 500, responseCodeDesc: 'getOrders cannot fetch greater than 200 orders'});
	}

	if (!_.isString(orderIds)) {
		orderIds = orderIds.join(',');
	}

	this.apiRequest('membership', 'order_view', {'order_id': orderIds}, callback);
};

Api.prototype.findOrders = function (params, callback) {

	if (!params || !params.campaign_id || !params.criteria || !params.start_date || !params.end_date) {
		return callback({
			responseCode: 500,
			responseCodeDesc: 'findOrders requires params: campaign_id, criteria, start_date, end_date'
		});
	}

	if (params.product_ids && !_.isString(params.product_ids)) {
		params.product_ids = params.product_ids.join(',');
	}

	this.apiRequest('membership', 'order_find', params, function (err, result) {
		if (err && err.responseCode === 333) {
			return callback(null, result);
		}

		callback(err, result);
	});
};

Api.prototype.findUpdatedOrders = function (params, callback) {

	if (!params || !params.campaign_id || !params.group_keys || !params.start_date || !params.end_date) {
		return callback({
			responseCode: 500,
			responseCodeDesc: 'findUpdatedOrders requires params: campaign_id, group_keys, start_date, end_date'
		});
	}

	if (!_.isString(params.group_keys)) {
		params.group_keys = params.group_keys.join(',');
	}

	this.apiRequest('membership', 'order_find_updated', params, function (err, result) {
		if (err && err.responseCode === 333) {
			return callback(null, result);
		}

		callback(err, result);
	});
};

Api.prototype.updateOrders = function (params, callback) {
	if (!params || !params.orderIds || !params.actions || !params.values) {
		return callback({
			responseCode: 500,
			responseCodeDesc: 'updateOrders requires params: order_ids, tracking_number'
		});
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

	this.apiRequest(
		'membership',
		'order_update',
		{
			order_ids: params.orderIds,
			sync_all: 0,
			actions: params.actions,
			values: params.values
		}, callback);
};

//Customers
Api.prototype.getCustomer = function (customerId, callback) {

	if (!customerId) {
		return callback({responseCode: 500, responseCodeDesc: 'getCustomer must have a customer id'});
	}

	this.apiRequest('membership', 'customer_view', {'customer_id': customerId}, callback);
};

Api.prototype.findCustomers = function (params, callback) {

	if (!params || !params.campaign_id || !params.start_date || !params.end_date) {
		return callback({
			responseCode: 500,
			responseCodeDesc: 'findCustomer requires params: campaign_id, start_date, end_date'
		});
	}

	this.apiRequest('membership', 'customer_find', params, function (err, result) {
		if (err && err.responseCode === 604) {
			return callback(null, result);
		}

		callback(err, result);
	});
};

//Products
Api.prototype.getProducts = function (productIds, callback) {

	if (!productIds || productIds.length === 0) {
		return callback({responseCode: 500, responseCodeDesc: 'getProducts must product ids'});
	}

	if (!_.isString(productIds)) {
		productIds = productIds.join(',');
	}

	this.apiRequest('membership', 'product_index', {product_id: productIds}, callback);
};

//Shipping
Api.prototype.findShippingMethods = function (params, callback) {

	if (!params || !params.campaign_id) {
		return callback({
			responseCode: 500,
			responseCodeDesc: 'findShippingMethods requires params: campaign_id'
		});
	}

	this.apiRequest('membership', 'shipping_method_find', params, function (err, result) {
		callback(err, result);
	});
};
//Request

//Setup the form for the api call
Api.prototype.composeApiCall = function (apiType, method, params) {

	var form = {
		username: this.user,
		password: this.pass,
		method: method
	};

	if (params !== null) {
		_.extend(form, params);
	}

	return {
		url: apiType === 'membership' ? conf.membershipApiUrl.format(this.domain) : conf.transactionApiUrl.format(this.domain),
		form: form
	};
};

//send an api call
Api.prototype.apiRequest = function (apiType, method, params, callback) {

	var requestParams = this.composeApiCall(apiType, method, params);

	var self = this;

	request.post(
		requestParams,
		function (err, response, body) {

			if (err) {
				return callback(err);
			}

			body = qs.parse(body);

			//so it appears LL really sucks, because it uses different response codes for different api calls

			var result = {};

			if (body.response_code) {
				result.responseCode = parseInt(body.response_code);
				result.responseCodeDesc = self.membershipResponseCodes[body.response_code];
			}
			else if (body.response) {
				result.responseCode = parseInt(body.response);
				result.responseCodeDesc = self.membershipResponseCodes[body.response];
			} else {
				logger.error(body);
				result.responseCode = 500;
				result.responseCodeDesc = 'Something has gone terribly wrong';
			}

			if (result.responseCode === 100) {
				result.body = body;
			}

			if (result.body && result.body.data) {
				try {
					//so it appears LL really sucks, because it has all these weird unicode characters in the comment fields
					//that break JSON parse
					result.body.data = result.body.data.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
					result.body.data = JSON.parse(result.body.data);
				} catch (ex) {
					try {
						//try removing the system notes
						result.body.data = result.body.data.replace(/"systemNotes.*"(?:,)/g, '');
						result.body.data = JSON.parse(result.body.data);
					} catch (exInner) {
						logger.error('Failed to parse result.body.data', exInner);
						return callback(exInner);
					}
				}
			}

			callback(result.body ? null : result, result);
		}).on('error', function (err) {
			logger.error('API request error', {apiType: apiType, method: method, err: err});
		});
};

module.exports.Api = Api;

/*jshint camelcase: true */

