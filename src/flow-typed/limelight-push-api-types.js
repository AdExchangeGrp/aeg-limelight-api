// @flow

export type PushAPIOrderProductType = {
    id: number,
    sku: ?string,
    price: ?number,
    name: ?string,
    onHold: ?boolean,
    isRecurring: ?boolean,
    recurringDate: ?string,
    qty: ?number,
    subscriptionId: ?string,
    subscriptionType: ?string,
    subscriptionDescription: ?string
}

export type PushAPICustomerType = {
    id: number,
    firstName: ?string,
    lastName: ?string,
    telephone: ?string,
    email: ?string,
    ip: ?string,
    isBlacklisted: ?boolean
}

export type PushAPIShippingType = {
    date: ?string,
    trackingNumber: ?string,
    firstName: ?string,
    lastName: ?string,
    address: ?string,
    address2: ?string,
    city: ?string,
    state: ?string,
    postalCode: ?string,
    country: ?string
}

export type PushAPIBillingType = {
    firstName: ?string,
    lastName: ?string,
    address: ?string,
    address2: ?string,
    city: ?string,
    state: ?string,
    postalCode: ?string,
    country: ?string
}

export type PushAPIPaymentType = {
    processorId: ?string,
    transactionId: ?string,
    gatewayId: ?number,
    preserveGateway: ?boolean,
    gatewayDescriptor: ?string,
    authId: ?string,
    creditCardType: ?string,
    creditCardNumber: ?string,
    creditCardNumberFirst6: ?string,
    creditCardNumberLast4: ?string,
    creditCardExpires: ?string,
    prepaidMath: ?boolean,
    checkAccountLast4: ?string,
    checkRoutingLast4: ?string,
    checkSSNLast4: ?string,
    isChargeback: ?boolean,
    declineReason: ?string,
    declineSalvageDiscountPercent: ?number,
    isTest: ?boolean
};

export type PushAPIMetaType = {
    afid: ?string,
    affid: ?string,
    aid: ?string,
    sid: ?string,
    c1: ?string,
    c2: ?string,
    c3: ?string,
    opt: ?string
};

export type PushAPIOrderType = {
    created: string,
    statusChangeCode: string,
    domain: string,
    campaignId: number,
    affiliate: ?string,
    subAffiliate: ?string,
    id: number,
    clickId: ?string,
    ancestorId: ?number,
    parentId: ?number,
    childIds: ?Array<number>,
    timestamp: string,
    status: number,
    billingCycle: ?number,
    isRecurring: ?boolean,
    recurringDate: ?string,
    retryDate: ?string,
    mainProductId: ?number,
    mainProductQuantity: ?number,
    upsellProductIds: ?Array<number>,
    shippingId: ?number,
    shippingTypeName: ?string,
    total: ?number,
    onHold: ?boolean,
    onHoldBy: ?string,
    holdDate: ?string,
    confirmed: ?boolean,
    confirmedDate: ?string,
    amountRefundedToDate: ?number,
    salesTax: ?number,
    salesTaxAmount: ?number,
    couponDiscountAmount: ?number,
    rebillDiscountPercent: ?number,
    isFraud: ?boolean,
    isRma: ?boolean,
    rmaNumber: ?string,
    rmaReason: ?string,
    createdByUsername: ?string,
    createdByEmployeeName: ?string,
    products: ?Array<PushAPIOrderProductType>,
    customer: PushAPICustomerType,
    payment: PushAPIPaymentType,
    shipping: PushAPIShippingType,
    billing: PushAPIBillingType,
    meta: ?PushAPIMetaType
};

export type PushAPIOrderRequestType = {
    body: PushAPIOrderType
};
