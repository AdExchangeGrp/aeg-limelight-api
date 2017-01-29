require('should');
import Api from '../../src/api.js';

describe('api domain dvd-crm', async () => {

	const api = new Api('Snowball', '8KX2DjfxnXWtYp', 'www.dvd-crm.com')
		.on('error', (err) => {

			console.log(err);

		});

	describe('#validateCredentials()', async () => {

		it('should return without error', async () => {

			const result = await api.validateCredentials();

			console.log(result);

			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(34);
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findOrders({
				campaign_id: 42,
				criteria: 'all',
				product_ids: [26],
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			});

			// noinspection JSValidateTypes
			(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
			(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(10000);
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([10000, 10018]);
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findCustomers()', async () => {

		it('should return without error', async () => {

			const result = await api.findCustomers({
				campaign_id: 42,
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			});

			// noinspection JSValidateTypes
			(result.responseCode === 604 || result.responseCode === 100).should.be.ok;
			(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No customers found').should.be.ok;

		});

	});

	describe('#getCustomer()', async () => {

		it('should return without error', async () => {

			const result = await api.getCustomer(1);
			result.responseCode.should.be.equal(603);
			result.responseCodeDesc.should.be.equal('Invalid customer Id supplied');

		});

	});

	describe('#getProducts()', async () => {

		it('should return without error', async () => {

			const result = await api.getProducts([26]);
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods({campaign_id: 'all', return_type: 'shipping_method_view'});
			result.responseCode.should.be.equal(100);
			result.responseCodeDesc.should.be.equal('Success');

		});

	});

});

// describe.skip('api domain mhioffers', () => {
//
// 	let api = new Api('Ad Exchange Group', '4rTKYUWmbPhpW', 'www.globalvoffers.com');
//
// 	describe('#getCampaign()', () => {
//
// 		it('should return without error', (done) => {
//
// 			api.getCampaign(77, (err, result) => {
//
// 				if (!err) {
//
// 					result.responseCode.should.be.equal(100);
// 					result.responseCodeDesc.should.be.equal('Success');
//
// 				}
// 				done(err);
//
// 			});
//
// 		});
//
// 	});
//
// 	describe('#findOrders()', () => {
//
// 		it('should return without error', (done) => {
//
// 			api.findOrders({
// 				campaign_id: 77,
// 				criteria: 'all',
// 				start_date: '04/22/2015',
// 				end_date: '04/26/2015',
// 				customer_id: 63571
// 			}, (err, result) => {
//
// 				// noinspection JSValidateTypes
// 				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
// 				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
// 				done(err);
//
// 			});
//
// 		});
//
// 	});
//
// 	describe('#getOrder()', () => {
//
// 		it('should return without error', (done) => {
//
// 			api.getOrder(580395, (err, result) => {
//
// 				if (!err) {
//
// 					result.responseCode.should.be.equal(100);
// 					result.responseCodeDesc.should.be.equal('Success');
//
// 				}
// 				done(err);
//
// 			});
//
// 		});
//
// 	});
//
// 	describe.skip('#updateOrders()', () => {
//
// 		it('should return without error', (done) => {
//
// 			api.updateOrders({
// 				orderIds: '580383,580395',
// 				actions: 'tracking_number,tracking_number',
// 				values: '123457TEST,1234567TEST'
// 			}, (err, result) => {
//
// 				if (!err) {
//
// 					// response code is 343 if the value is the same
// 					result.responseCode.should.be.equal('100,100');
// 					// this is undefined from the API with mutiple order updates
// 					// result.responseCodeDesc.should.be.equal('Success');
//
// 				}
// 				done(err);
//
// 			});
//
// 		});
//
// 	});
//
// 	describe('#findUpdatedOrders()', () => {
//
// 		it('should return without error', (done) => {
//
// 			api.findUpdatedOrders({
// 				campaign_id: 14,
// 				group_keys: 'refund',
// 				start_date: '04/22/2015',
// 				end_date: '04/23/2015'
// 			}, (err, result) => {
//
// 				// noinspection JSValidateTypes
// 				(result.responseCode === 333 || result.responseCode === 100).should.be.ok;
// 				(result.responseCodeDesc === 'Success' || result.responseCodeDesc === 'No Orders Found').should.be.ok;
// 				done(err);
//
// 			});
//
// 		});
//
// 		it('should return without error', (done) => {
//
// 			api.getOrder(246059, (err, result) => {
//
// 				if (!err) {
//
// 					result.responseCode.should.be.equal(100);
// 					result.responseCodeDesc.should.be.equal('Success');
//
// 				}
// 				done(err);
//
// 			});
//
// 		});
//
// 	});
//
// });
//
// describe.skip('api domain www.mytrackingcenter.com', () => {
//
// 	let api = new Api('ad.exchange', '7Jnb5ppn86PRnn', 'www.mytrackingcenter.com');
//
// 	it('should return without error', (done) => {
//
// 		api.getOrder(725547, (err, result) => {
//
// 			if (!err) {
//
// 				result.responseCode.should.be.equal(100);
// 				result.responseCodeDesc.should.be.equal('Success');
//
// 			}
// 			done(err);
//
// 		});
//
// 	});
//
// });
//
// describe.skip('api www.mytrackingcenter.com multiple operations', () => {
//
// 	let api = new Api('Push Innovation', 'd9qCrYAJTKVXhR', 'www.mytrackingcenter.com');
//
// 	it('should return without error', (done) => {
//
// 		api.updateOrders({
// 			orderIds: '1373334,1373335',
// 			actions: 'tracking_number,tracking_number',
// 			values: '12345,12345'
// 		}, (err, result) => {
//
// 			console.log(err);
// 			console.log(result);
// 			done(err);
//
// 		});
//
// 	});
//
// });
