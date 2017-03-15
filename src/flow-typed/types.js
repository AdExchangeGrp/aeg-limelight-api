
/* aeg api response types */

export type LimelightApiOrderProductType = {
    id: string,
    sku: string,
    price: string,
    productQty: string,
    name: string,
    onHold: string,
    isRecurring: string,
    recurringDate: string,
    subscriptionId: string,
    nextSubscriptionProduct: string,
    nextSubscriptionProductId: string
}

export type LimelightApiProductType = {
    id: number,
    isShippable: string,
    description: string,
    categoryName: string
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

export type LimelightApiOrderType = {
    id: number,
    acquisitionDate: string,
    ancestorId: string,
    affiliate: string,
    afid: string,
    sid: string,
    affid: string,
    c1: string,
    c2: string,
    c3: string,
    aid: string,
    opt: string,
    amountRefundedToDate: string,
    authId: string,
    billingCity: string,
    billingCountry: string,
    billingCycle: string,
    billingFirstName: string,
    billingLastName: string,
    billingPostcode: string,
    billingState: string,
    billingStateId: string,
    billingStreetAddress: string,
    billingStreetAddress2: string,
    campaignId: string,
    ccExpires: string,
    ccFirst6: string,
    ccLast4: string,
    ccNumber: string,
    creditCardNumber: string,
    ccType: string,
    chargebackDate: string,
    checkAccountLast4: string,
    checkRoutingLast4: string,
    checkSSNLast4: string,
    checkTransitNum: string,
    childId: string,
    clickId: string,
    createdByUserName: string,
    createdByEmployeeName: string,
    couponDiscountAmount: string,
    customerId: string,
    customersTelephone: string,
    declineSalvageDiscountPercent: string,
    declineReason: string,
    emailAddress: string,
    firstName: string,
    gatewayId: string,
    gatewayDescriptor: string,
    holdDate: string,
    ipAddress: string,
    isBlacklisted: string,
    isChargeback: string,
    isFraud: string,
    isRecurring: string,
    isRefund: string,
    isRma: string,
    isTestCC: string,
    isVoid: string,
    lastName: string,
    mainProductId: string,
    mainProductQuantity: string,
    nextSubscriptionProduct: string,
    nextSubscriptionProductId: string,
    onHold: string,
    onHoldBy: string,
    orderConfirmed: string,
    orderConfirmedDate: string,
    orderSalesTax: string,
    orderSalesTaxAmount: string,
    orderStatus: string,
    orderTotal: string,
    parentId: string,
    prepaidMatch: string,
    preserveGateway: string,
    processorId: string,
    rebillDiscountPercent: string,
    recurringDate: string,
    refundAmount: string,
    refundDate: string,
    retryDate: string,
    rmaNumber: string,
    rmaReason: string,
    shippingCity: string,
    shippingCountry: string,
    shipping_Date: string,
    shippingFirstName: string,
    shippingId: string,
    shippingLastName: string,
    shippingMethodName: string,
    shippingPostcode: string,
    shippingState: string,
    shippingStateId: string,
    shippingStreetAddress: string,
    shippingStreetAddress2: string,
    subAffiliate: string,
    timestamp: string,
    trackingNumber: string,
    transactionId: string,
    upsellProductId: string,
    upsellProductQuantity: string,
    voidAmount: string,
    voidDate: string,
    shippable: string,
    products: LimelightApiOrderProductType[]
}

export type LimelightApiCampaignType = {
    id: number,
    campaignName: string,
    campaignDescription: string,
    campaignType: string,
    gatewayId: string,
    isLoadBalanced: string,
    loadBalanceProfile: string,
    productId: string,
    productName: string,
    isUpsell: string,
    shippingId: string,
    shippingName: string,
    shippingDescription: string,
    shippingRecurringPrice: string,
    shippingInitialPrice: string,
    countries: string,
    paymentName: string,
    successUrl1: string,
    successUrl2: string
}

export type LimelightApiCustomerType = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateCreated: string,
    orderCount: string,
    orderList: string
}

export type LimelightApiShippingMethodType = {
    id: number,
    name: string,
    description: string,
    groupName: string,
    code: string,
    initialAmount: string,
    subscriptionAmount: string
}

/* aeg api requests */

export type LimelightApiOptionsType = {
    retries?: number,
    retryDelay?: number,
    timeout?: number,
    errorCodeOverrides?: string[]
}

export type LimelightApiFindOrdersOptionsType = {
    productIds?: number[],
    customerId?: number,
    criteria?: string,
    startTime?: string,
    endTime?: string,
    searchType?: string,
    retries?: number,
    retryDelay?: number,
    timeout?: number,
    errorCodeOverrides?: string[]
}

export type LimelightApiOrderUpdateType = {
    orderId: string,
    action: string,
    value: string | number
}

export type LimelightApiUpdateOrdersRequestType = LimelightApiOrderUpdateType[];

/* aeg api responses */

export type LimelightApiFindActiveCampaignsResponseType = {id: string, name: string}[];

export type LimelightApiGetCampaignResponseType = ?LimelightApiCampaignType;

export type LimelightApiGetOrderResponseType = ?LimelightApiOrderType;

export type LimelightApiGetOrdersResponseType = LimelightApiOrderType[];

export type LimelightApiFindCustomersResponseType = number[];

export type LimelightApiFindOrdersResponseType = number[];

export type LimelightApiGetCustomerResponseType = ?LimelightApiCustomerType;

export type LimelightApiGetProductsResponseType = LimelightApiProductType[];

export type LimelightApiShippingMethodResponseType = LimelightApiShippingMethodType[];

export type LimelightApiFindUpdatedOrdersResponseType = number[];

export type LimelightApiUpdateOrdersResult = {
    orderId: number,
    statusCode: number
}

export type LimelightApiUpdateOrdersResponseType = Array<LimelightApiUpdateOrdersResult>;
