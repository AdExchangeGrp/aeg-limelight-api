/* aeg api response types */

export interface ILimelightApiOrderProduct {
	id: string;
	sku: string;
	price: string;
	productQty: string;
	name: string;
	onHold: string;
	isRecurring: string;
	recurringDate: string;
	subscriptionId: string;
	nextSubscriptionProduct: string;
	nextSubscriptionProductId: string;
}

export interface ILimelightApiProduct {
	id: number;
	isShippable: string;
	description: string;
	categoryName: string;
	// name: string,
	// sku: string,
	// price: string,
	// isTrial: string,
	// rebillProduct: string,
	// rebillDays: string,
	// maxQuantity: string,
	// recurringQuantity: string,
	// subscriptionType: string,
	// subscriptionWeek: string,
	// subscriptionDay: string,
	// costOfGoodsSold: string
}

export interface ILimelightApiOrder {
	id: number;
	acquisitionDate: string;
	ancestorId: string;
	affiliate: string;
	afid: string;
	sid: string;
	affid: string;
	c1: string;
	c2: string;
	c3: string;
	aid: string;
	opt: string;
	amountRefundedToDate: string;
	authId: string;
	billingCity: string;
	billingCountry: string;
	billingCycle: string;
	billingFirstName: string;
	billingLastName: string;
	billingPostcode: string;
	billingState: string;
	billingStateId: string;
	billingStreetAddress: string;
	billingStreetAddress2: string;
	campaignId: string;
	ccExpires: string;
	ccFirst6: string;
	ccLast4: string;
	ccNumber: string;
	creditCardNumber: string;
	ccType: string;
	chargebackDate: string;
	checkAccountLast4: string;
	checkRoutingLast4: string;
	checkSSNLast4: string;
	checkTransitNum: string;
	childId: string;
	clickId: string;
	createdByUserName: string;
	createdByEmployeeName: string;
	couponDiscountAmount: string;
	customerId: string;
	customersTelephone: string;
	declineSalvageDiscountPercent: string;
	declineReason: string;
	emailAddress: string;
	firstName: string;
	gatewayId: string;
	gatewayDescriptor: string;
	holdDate: string;
	ipAddress: string;
	isBlacklisted: string;
	isChargeback: string;
	isFraud: string;
	isRecurring: string;
	isRefund: string;
	isRma: string;
	isTestCC: string;
	isVoid: string;
	lastName: string;
	mainProductId: string;
	mainProductQuantity: string;
	nextSubscriptionProduct: string;
	nextSubscriptionProductId: string;
	onHold: string;
	onHoldBy: string;
	orderConfirmed: string;
	orderConfirmedDate: string;
	orderSalesTax: string;
	orderSalesTaxAmount: string;
	orderStatus: string;
	orderTotal: string;
	parentId: string;
	prepaidMatch: string;
	preserveGateway: string;
	processorId: string;
	rebillDiscountPercent: string;
	recurringDate: string;
	refundAmount: string;
	refundDate: string;
	retryDate: string;
	rmaNumber: string;
	rmaReason: string;
	shippingCity: string;
	shippingCountry: string;
	shipping_Date: string;
	shippingFirstName: string;
	shippingId: string;
	shippingLastName: string;
	shippingMethodName: string;
	shippingPostcode: string;
	shippingState: string;
	shippingStateId: string;
	shippingStreetAddress: string;
	shippingStreetAddress2: string;
	subAffiliate: string;
	timestamp: string;
	trackingNumber: string;
	transactionId: string;
	upsellProductId: string;
	upsellProductQuantity: string;
	voidAmount: string;
	voidDate: string;
	shippable: string;
	products: ILimelightApiOrderProduct[];
}

export interface ILimelightApiCampaign {
	id: number;
	campaignName: string;
	campaignDescription: string;
	campaignType: string;
	gatewayId: string;
	isLoadBalanced: string;
	loadBalanceProfile: string;
	productId: string;
	productName: string;
	isUpsell: string;
	shippingId: string;
	shippingName: string;
	shippingDescription: string;
	shippingRecurringPrice: string;
	shippingInitialPrice: string;
	countries: string;
	paymentName: string;
	successUrl1: string;
	successUrl2: string;
}

export interface ILimelightApiCustomer {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateCreated: string;
	orderCount: string;
	orderList: string;
}

export interface ILimelightApiShippingMethod {
	id: number;
	name: string;
	description: string;
	groupName: string;
	code: string;
	initialAmount: string;
	subscriptionAmount: string;
}

/* aeg api requests */

export interface ILimelightApiOptions {
	retries?: number;
	retryDelay?: number;
	timeout?: number;
	errorCodeOverrides?: number[];
}

export interface ILimelightApiFindOrdersOptions extends ILimelightApiOptions{
	productIds?: number[];
	customerId?: number;
	criteria?: string;
	startTime?: string;
	endTime?: string;
	searchType?: string;
}

export interface ILimelightApiOrderUpdate {
	orderId: string;
	action: string;
	value: string | number;
}

export type LimelightApiUpdateOrdersRequest = ILimelightApiOrderUpdate[];

/* aeg api responses */

export type LimelightApiFindActiveCampaignsResponse = Array<{ id: string, name: string }>;

export type LimelightApiGetCampaignResponse = ILimelightApiCampaign | undefined;

export type LimelightApiGetOrderResponse = ILimelightApiOrder | undefined;

export type LimelightApiGetOrdersResponse = ILimelightApiOrder[];

export type LimelightApiFindCustomersResponse = number[];

export type LimelightApiFindOrdersResponse = number[];

export type LimelightApiGetCustomerResponse = ILimelightApiCustomer | undefined;

export type LimelightApiGetProductsResponse = ILimelightApiProduct[];

export type LimelightApiShippingMethodResponse = ILimelightApiShippingMethod[];

export type LimelightApiFindUpdatedOrdersResponse = number[];

export interface ILimelightApiUpdateOrdersResult {
	orderId: number;
	statusCode: number;
}

export type LimelightApiUpdateOrdersResponse = ILimelightApiUpdateOrdersResult[];
