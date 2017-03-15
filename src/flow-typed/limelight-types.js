// @flow

/* limelight api raw responses */

export type ActionResultType = {
	responseCode: number,
	responseCodeDesc: string
}

export interface ResponseType {
	apiActionResults: ActionResultType[],
	body: Object
}

export type FindActiveCampaignsResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		campaign_id: string,
		campaign_name: string,
	}
}

export type GetCampaignResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: CampaignType
}

export type GetOrderResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: OrderType
}

export type GetOrdersResponseSingleOrderType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: OrderType
}

export type GetOrdersResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		total_orders: string,
		order_ids: string,
		data: {[id: string]: OrderType}
	}
}

export type FindCustomersResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		total_customers: string,
		customer_ids: string
	}
}

export type FindOrdersResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		total_orders: string,
		order_ids: string
	}
}

export type GetCustomerResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		first_name: string,
		last_name: string,
		email: string,
		phone: string,
		date_created: string,
		order_count: string,
		order_list: string
	}
}

export type GetProductsResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: ProductType
}

export type ShippingMethodResponseType = {
	apiActionResults: {responseCode: number, responseCodeDesc: string}[],
	body: {
		response_code: string,
		total_shipping_methods: string,
		shipping_ids: string,
		data: {
			[id: string]: ShippingMethodType
		}
	}
}

/* limelight api response types */

export type OrderProductType = {
	product_id: string,
	sku: string,
	price: string,
	product_qty: string,
	name: string,
	on_hold: string,
	is_recurring: string,
	recurring_date: string,
	subscription_id: string,
	next_subscription_product: string,
	next_subscription_product_id: string
}

export type ProductType = {
	response_code: string,
	product_description: string,
	product_category_name: string,
	product_is_shippable: string
	// product_name: string,
	// product_sku: string,
	// product_price: string,
	// product_is_trial: string,
	// product_rebill_product: string,
	// product_rebill_days: string,
	// product_max_quantity: string,
	// preserve_recurring_quantity: string,
	// subscription_type: string,
	// subscription_week: string,
	// subscription_day: string,
	// cost_of_goods_sold: string
}

export type OrderType = {
	response_code: string,
	acquisition_date: string,
	ancestor_id: string,
	affiliate: string,
	afid: string,
	sid: string,
	affid: string,
	c1: string,
	c2: string,
	c3: string,
	aid: string,
	opt: string,
	amount_refunded_to_date: string,
	auth_id: string,
	billing_city: string,
	billing_country: string,
	billing_cycle: string,
	billing_first_name: string,
	billing_last_name: string,
	billing_postcode: string,
	billing_state: string,
	billing_state_id: string,
	billing_street_address: string,
	billing_street_address2: string,
	campaign_id: string,
	cc_expires: string,
	cc_first_6: string,
	cc_last_4: string,
	cc_number: string,
	credit_card_number: string,
	cc_type: string,
	chargeback_date: string,
	check_account_last_4: string,
	check_routing_last_4: string,
	check_ssn_last_4: string,
	check_transitnum: string,
	child_id: string,
	click_id: string,
	created_by_user_name: string,
	created_by_employee_name: string,
	coupon_discount_amount: string,
	customer_id: string,
	customers_telephone: string,
	decline_salvage_discount_percent: string,
	decline_reason: string,
	email_address: string,
	first_name: string,
	gateway_id: string,
	gateway_descriptor: string,
	hold_date: string,
	ip_address: string,
	is_blacklisted: string,
	is_chargeback: string,
	is_fraud: string,
	is_recurring: string,
	is_refund: string,
	is_rma: string,
	is_test_cc: string,
	is_void: string,
	last_name: string,
	main_product_id: string,
	main_product_quantity: string,
	next_subscription_product: string,
	next_subscription_product_id: string,
	on_hold: string,
	on_hold_by: string,
	order_confirmed: string,
	order_confirmed_date: string,
	order_sales_tax: string,
	order_sales_tax_amount: string,
	order_status: string,
	order_total: string,
	parent_id: string,
	prepaid_match: string,
	preserve_gateway: string,
	processor_id: string,
	rebill_discount_percent: string,
	recurring_date: string,
	refund_amount: string,
	refund_date: string,
	retry_date: string,
	rma_number: string,
	rma_reason: string,
	shipping_city: string,
	shipping_country: string,
	shipping_date: string,
	shipping_first_name: string,
	shipping_id: string,
	shipping_last_name: string,
	shipping_method_name: string,
	shipping_postcode: string,
	shipping_state: string,
	shipping_state_id: string,
	shipping_street_address: string,
	shipping_street_address2: string,
	sub_affiliate: string,
	time_stamp: string,
	tracking_number: string,
	transaction_id: string,
	upsell_product_id: string,
	upsell_product_quantity: string,
	void_amount: string,
	void_date: string,
	shippable: string,
	products: OrderProductType[]
}

export type CampaignType = {
	response_code: string,
	campaign_name: string,
	campaign_description: string,
	campaign_type: string,
	gateway_id: string,
	is_load_balanced: string,
	load_balance_profile: string,
	product_id: string,
	product_name: string,
	is_upsell: string,
	shipping_id: string,
	shipping_name: string,
	shipping_description: string,
	shipping_recurring_price: string,
	shipping_initial_price: string,
	countries: string,
	payment_name: string,
	success_url_1: string,
	success_url_2: string
}

export type CustomerType = {
	first_name: string,
	last_name: string,
	email: string,
	phone: string,
	date_created: string,
	order_count: string,
	order_list: string
}

export type ShippingMethodType = {
	response_code: string,
	name: string,
	description: string,
	group_name: string,
	code: string,
	initial_amount: string,
	subscription_amount: string
}
