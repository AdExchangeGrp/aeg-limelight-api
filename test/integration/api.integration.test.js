'use strict';

require('should');
import {Api} from '../../src/api.js';

describe.skip('api domain mhioffers', () => {

	let api = new Api({user: 'Ad Exchange Group', pass: '4rTKYUWmbPhpW', domain: 'www.globalvoffers.com'});

	describe('#getCampaign()', () => {
		it('should return without error', (done) => {
			api.getCampaign(77, (err, result) => {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findOrders()', () => {
		it('should return without error', (done) => {
			api.findOrders({
				campaign_id: 77,
				criteria: 'all',
				start_date: '04/22/2015',
				end_date: '04/26/2015',
				customer_id: 63571
			}, (err, result)=> {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#getOrder()', ()=> {
		it('should return without error', (done) => {
			api.getOrder(580395, (err, result)=> {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe.skip('#updateOrders()', () => {
		it('should return without error', (done) => {
			api.updateOrders({
				orderIds: '580383,580395',
				actions: 'tracking_number,tracking_number',
				values: '123457TEST,1234567TEST'
			}, (err, result)=> {
				if (!err) {
					//response code is 343 if the value is the same
					result.responseCode.should.be.equal('100,100');
					//this is undefined from the API with mutiple order updates
					//result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findUpdatedOrders()', () => {
		it('should return without error', (done)=> {
			api.findUpdatedOrders({
				campaign_id: 14,
				group_keys: 'refund',
				start_date: '04/22/2015',
				end_date: '04/23/2015'
			}, (err, result)=> {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});

		it('should return without error', (done)=> {
			api.getOrder(246059, (err, result)=> {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});
});

describe.skip('api domain dvd-crm', ()=> {

	let api = new Api({user: 'Snowball', pass: '8KX2DjfxnXWtYp', domain: 'www.dvd-crm.com'});

	describe('#findActiveCampaigns()', ()=> {
		it('should return without error', (done)=> {
			api.findActiveCampaigns((err, result)=> {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#getCampaign()', () => {
		it('should return without error', (done)=> {
			api.getCampaign(34, (err, result)=> {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findOrders()', ()=> {
		it('should return without error', (done) => {
			api.findOrders({
				campaign_id: 42,
				criteria: 'all',
				product_ids: [26],
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			}, (err, result) => {
				//noinspection JSValidateTypes
				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#getOrder()', () => {
		it('should return without error', (done)=> {
			api.getOrder(10000, (err, result)=> {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#getOrders()', () => {
		it('should return without error', (done) => {
			api.getOrders([10000, 10018], (err, result) => {
				if (!err) {
					result.responseCode.should.be.equal(100);
					result.responseCodeDesc.should.be.equal('Success');
				}
				done(err);
			});
		});
	});

	describe('#findCustomers()', () => {
		it('should return without error', (done)=> {
			api.findCustomers({
				campaign_id: 42,
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			}, (err, result)=> {
				//noinspection JSValidateTypes
				(result.responseCode === 604 || result.responseCode === 100).should.be.ok;
				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No customers found').should.be.ok;
				done(err);
			});
		});
	});

	describe('#getCustomer()', ()=> {
		it('should return without error', (done) => {
			api.getCustomer(1, (err, result) => {
				result.responseCode.should.be.equal(603);
				result.responseCodeDesc.should.be.equal('Invalid customer Id supplied');
				done();
			});
		});
	});

	describe('#getProducts()', () => {
		it('should return without error', (done)=> {
			api.getProducts([26], (err, result)=> {
				result.responseCode.should.be.equal(100);
				result.responseCodeDesc.should.be.equal('Success');
				done();
			});
		});
	});

	describe('#findShippingMethods()', () => {
		it('should return without error', (done) => {
			api.findShippingMethods({campaign_id: 'all', return_type: 'shipping_method_view'}, (err, result)=> {
				result.responseCode.should.be.equal(100);
				result.responseCodeDesc.should.be.equal('Success');
				done();
			});
		});
	});
});

describe('api domain dvd-crm', ()=> {

	let api = new Api({user: 'ad.exchange', pass: '7Jnb5ppn86PRnn', domain: 'www.mytrackingcenter.com'});

	it('should return without error', (done) => {
		api.getOrder(725547, (err, result)=> {
			if (!err) {
				console.log(result);
				result.responseCode.should.be.equal(100);
				result.responseCodeDesc.should.be.equal('Success');
			}
			done(err);
		});
	});

});