import should from 'should';
import Api from '../../src/api.js';

describe('api domain dvd-crm', async () => {

	const api = new Api('Snowball', '8KX2DjfxnXWtYp', 'www.dvd-crm.com')
		.on('error', (err) => {

			console.log(err);

		});

	describe('#validateCredentials()', async () => {

		it('should return without error', async () => {

			const result = await api.validateCredentials();
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(34);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

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
			(result.apiActionResults[0].responseCode === 333 || result.apiActionResults[0].responseCode === 100).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === 'Success' || result.apiActionResults[0].responseCodeDesc === 'No Orders Found').should.be.ok;

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(10000);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([10000, 10018]);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

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
			(result.apiActionResults[0].responseCode === 604 || result.apiActionResults[0].responseCode === 100).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === 'Success' || result.apiActionResults[0].responseCodeDesc === 'No customers found').should.be.ok;

		});

	});

	describe('#getCustomer()', async () => {

		it('should return without error', async () => {

			try {

				const result = await api.getCustomer(1);
				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(603);
				ex.apiResponse.apiActionResults[0].responseCodeDesc.should.be.equal('Invalid customer Id supplied');

			}

		});

	});

	describe('#getProducts()', async () => {

		it('should return without error', async () => {

			const result = await api.getProducts([26]);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods({campaign_id: 'all', return_type: 'shipping_method_view'});
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

});

describe('api domain mhioffers', async () => {

	const api = new Api('Ad Exchange Group', '4rTKYUWmbPhpW', 'www.globalvoffers.com');

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(77);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#findOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findOrders({
				campaign_id: 77,
				criteria: 'all',
				start_date: '04/22/2015',
				end_date: '04/26/2015',
				customer_id: 63571
			});

			// noinspection JSValidateTypes
			(result.apiActionResults[0].responseCode === 333 || result.apiActionResults[0].responseCode === 100).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === 'Success' || result.apiActionResults[0].responseCodeDesc === 'No Orders Found').should.be.ok;

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(580395);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

	describe('#updateOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.updateOrders({
				orderIds: '580383,580395',
				actions: 'tracking_number,tracking_number',
				values: '123457TEST,1234567TEST'
			});

			// response code is 343 if the value is the same
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[1].responseCode.should.be.equal(343);
			// this is undefined from the API with mutiple order updates
			// result.responseCodeDesc.should.be.equal('Success');

		});

		it('should return without error', async () => {

			const result = await api.updateOrders({
				orderIds: '580383,580395',
				actions: 'tracking_number,tracking_number',
				values: '123457TEST2,1234567TEST'
			});

			// response code is 343 if the value is the same
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[1].responseCode.should.be.equal(343);
			// this is undefined from the API with mutiple order updates
			// result.responseCodeDesc.should.be.equal('Success');

		});

		it('should error', async () => {

			try {

				const result = await api.updateOrders({
					orderIds: '580383, -1',
					actions: 'tracking_number,tracking_number',
					values: '123457TEST2,1234567TEST'
				});

				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(343);
				ex.apiResponse.apiActionResults[1].responseCode.should.be.equal(350);

			}

		});

	});

	describe('#findUpdatedOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findUpdatedOrders({
				campaign_id: 14,
				group_keys: 'refund',
				start_date: '04/22/2015',
				end_date: '04/23/2015'
			});

			// noinspection JSValidateTypes
			(result.apiActionResults[0].responseCode === 333 || result.apiActionResults[0].responseCode === 100).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === 'Success' || result.apiActionResults[0].responseCodeDesc === 'No Orders Found').should.be.ok;

		});

		it('should return without error', async () => {

			const result = await api.getOrder(246059);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal('Success');

		});

	});

});

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
