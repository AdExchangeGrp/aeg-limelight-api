'use strict';

/*jshint camelcase: false */

require('should');
var Api = require('../lib/api.js').Api;

describe.skip('api domain mhioffers', function () {

	var api = new Api({user: 'Ad Exchange Group', pass: '4rTKYUWmbPhpW', domain: 'www.globalvoffers.com'});

	describe('#getCampaign()', function () {
		it('should return without error', function (done) {
			api.getCampaign(77, function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findOrders()', function () {
		it('should return without error', function (done) {
			api.findOrders({
				campaign_id: 77,
				criteria: 'all',
				start_date: '04/22/2015',
				end_date: '04/26/2015',
				customer_id: 63571
			}, function (err, result) {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#findUpdatedOrders()', function () {
		it('should return without error', function (done) {
			api.findUpdatedOrders({
				campaign_id: 14,
				group_keys: 'refund',
				start_date: '04/22/2015',
				end_date: '04/23/2015'
			}, function (err, result) {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});

		it('should return without error', function (done) {
			api.getOrder(246059, function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});
});

describe('api domain dvd-crm', function () {

	var api = new Api({user: 'Snowball', pass: '8KX2DjfxnXWtYp', domain: 'www.dvd-crm.com'});

	describe('#findActiveCampaigns()', function () {
		it('should return without error', function (done) {
			api.findActiveCampaigns(function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#getCampaign()', function () {
		it('should return without error', function (done) {
			api.getCampaign(34, function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findOrders()', function () {
		it('should return without error', function (done) {
			api.findOrders({
				campaign_id: 42,
				criteria: 'all',
				product_ids: [26],
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			}, function (err, result) {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#getOrder()', function () {
		it('should return without error', function (done) {
			api.getOrder(10000, function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#getOrders()', function () {
		it('should return without error', function (done) {
			api.getOrders([10000, 10018], function (err, result) {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findCustomers()', function () {
		it('should return without error', function (done) {
			api.findCustomers({
				campaign_id: 42,
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			}, function (err, result) {
				//noinspection JSValidateTypes
				(result.responseCode === 604 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No customers found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#getCustomer()', function () {
		it('should return without error', function (done) {
			api.getCustomer(1, function (err, result) {
				result.responseCode.should.be.equal(603);
				result.responseCodeDesc.should.be.equal('Invalid customer Id supplied');
				done();
			});
		});
	});

	describe('#getProducts()', function () {
		it('should return without error', function (done) {
			api.getProducts([26], function (err, result) {
				result.responseCode.should.be.equal(600);
				result.responseCodeDesc.should.be.equal('Invalid product Id supplied');
				done();
			});
		});
	});
});

/*jshint camelcase: true */