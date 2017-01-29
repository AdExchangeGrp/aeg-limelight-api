import should from 'should';
import Api from '../../src/api.js';

describe('api domain dvd-crm', async () => {

	const api = new Api('Snowball', '8KX2DjfxnXWtYp', 'www.dvd-crm.com')
		.on('error', (err) => {

			console.log(err);

		});

	const badApi = new Api('Snowball', '1', 'www.dvd-crm.com')
		.on('error', (err) => {

			console.log(err);

		});

	describe('#validateCredentials()', async () => {

		it('should return without error', async () => {

			const result = await api.validateCredentials();
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

		it('should error', async () => {

			try {

				const result = await badApi.validateCredentials();
				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(200);
				ex.apiResponse.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(200));

			}

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

	});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(34);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

		it('should error', async () => {

			try {

				const result = await api.getCampaign(-1);
				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(400);
				ex.apiResponse.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(400));

			}

		});

	});

	describe('#findOrders()', async () => {

		it('should not find orders', async () => {

			const result = await api.findOrders({
				campaign_id: 42,
				criteria: 'all',
				product_ids: [26],
				start_date: '01/01/2013',
				end_date: '02/01/2015'
			});

			// noinspection JSValidateTypes
			(result.apiActionResults[0].responseCode === 333).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(333)).should.be.ok;

		});

		it('should find orders', async () => {

			const result = await api.findOrders({
				campaign_id: 'all',
				criteria: 'all',
				product_ids: [26],
				start_date: '01/01/2016',
				end_date: '12/01/2016'
			});

			// noinspection JSValidateTypes
			(result.apiActionResults[0].responseCode === 100).should.be.ok;
			(result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(100)).should.be.ok;

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(10000);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

		it('should error', async () => {

			try {

				const result = await api.getOrder(-1);
				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(350);
				ex.apiResponse.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(350));

			}

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([10000, 10018]);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

		it('should return without error with a bad id', async () => {

			// the response may contain a 350 for a bad id, but it still passes
			// client responsibility
			const result = await api.getOrders([10000, -1]);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

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
			(result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(604) || result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(100)).should.be.ok;

		});

	});

	describe('#getCustomer()', async () => {

		it('should return without error', async () => {

			try {

				const result = await api.getCustomer(1);
				should.not.exist(result);

			} catch (ex) {

				ex.apiResponse.apiActionResults[0].responseCode.should.be.equal(603);
				ex.apiResponse.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(603));

			}

		});

	});

	describe('#getProducts()', async () => {

		it('should return without error', async () => {

			const result = await api.getProducts([26]);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

	});

	describe('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods({campaign_id: 'all', return_type: 'shipping_method_view'});
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

	});

});

describe('api domain mhioffers', async () => {

	const api = new Api('Ad Exchange Group', '4rTKYUWmbPhpW', 'www.globalvoffers.com')
		.on('error', (err) => {

			console.log(err);

		});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(77);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

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
			(result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(333) || result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(100)).should.be.ok;

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(580395);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

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
			(result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(333) || result.apiActionResults[0].responseCodeDesc === api.membershipResponseCodeDesc(100)).should.be.ok;

		});

		it('should return without error', async () => {

			const result = await api.getOrder(246059);
			result.apiActionResults[0].responseCode.should.be.equal(100);
			result.apiActionResults[0].responseCodeDesc.should.be.equal(api.membershipResponseCodeDesc(100));

		});

	});

});
