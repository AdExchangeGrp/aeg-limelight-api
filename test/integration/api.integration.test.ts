import * as dotenv from 'dotenv';
import * as should from 'should';
import * as _ from 'lodash';
import Api from '../../src/api';

dotenv.config();

const api = new Api(process.env.USERNAME, process.env.PASSWORD, process.env.CLIENT)
.on('info', (data) => {

	console.log(data);

})
.on('warn', (data) => {

	console.log(data);

})
.on('error', (err) => {

	console.log(err);

});

const badApi = new Api(process.env.USERNAME, '1', process.env.CLIENT)
.on('info', (data) => {

	console.log(data);

})
.on('warn', (data) => {

	console.log(data);

})
.on('error', (err) => {

	console.log(err);

});

describe('api', async () => {
	
	describe('#validateCredentials()', async () => {

		it('should return true', async () => {

			const result = await api.validateCredentials({retries: 3});
			should(result).be.equal(true);

		});

		it('should return false', async () => {

			const result = await badApi.validateCredentials();
			should(result).be.equal(false);

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			should(result).be.an.Array;

			_.each(result, (r) => {

				should(r).have.properties('id', 'campaignName');

			});

		});

	});

	describe('#findActiveCampaignsExpanded()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaignsExpanded({limit: 3});
			should(result).be.an.Array;

			_.each(result, (r) => {

				should(r).have.properties('id', 'campaignName');

			});

			// console.log(require('util').inspect(result, { depth: null, showHidden: false}));

		});

	});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(1);
			should.exist(result);

		});

		it('should error', async () => {

			const result = await api.getCampaign(-1);
			should.not.exist(result);

		});

	});

	describe('#getProducts()', async () => {

		it('should return without error', async () => {

			const result = await api.getProducts([4]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([4, 5]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([-1]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([4, -1, 5]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe('#findOrders()', async () => {

		it('should not find orders', async () => {

			const result = await api.findOrders(1, '01/01/2013', '02/01/2017', {productIds: [123456789]});
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

		it('should find orders', async () => {

			const result = await api.findOrders('all', '01/01/2013', '02/01/2017', {productIds: [1]});
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(119228);
			should.exist(result);
			should(result!.id).be.equal(119228);
			should(result!.products).be.an.Array;

		});

		it('should error', async () => {

			const result = await api.getOrder(-1);
			should.not.exist(result);

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([119228, 1527786,]);
			should(result).be.an.Array;
			should(result.length).be.equal(2);
			should(result[0].products).be.an.Array;

		});

		it('should return without error', async () => {

			const result = await api.getOrders([119228]);
			should(result).be.an.Array;
			should(result.length).be.equal(1);
			should(result[0].products).be.an.Array;

		});

		it('should return without error with a bad id', async () => {

			const result = await api.getOrders([-1]);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

		it('should return without error with a bad id', async () => {

			const result = await api.getOrders([119228, -1]);
			should(result).be.an.Array;
			should(result.length).be.equal(1);
			should.exist(result[0]);

		});

	});

	describe('#findCustomers()', async () => {

		it('should return without error', async () => {

			const result = await api.findCustomers(1, '01/01/2013', '02/01/2017');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);
			
		});

		it('should return without error', async () => {

			const result = await api.findCustomers(1, '01/01/2010', '02/01/2010');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

	});

	describe('#getCustomer()', async () => {

		it('should return without error', async () => {

			const result = await api.getCustomer(6395);
			should.exist(result);

		});

		it('should return without error', async () => {

			const result = await api.getCustomer(999999);
			should.not.exist(result);

		});

	});

	describe.skip('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods('all');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe.skip('#updateOrders()', async () => {

		it('should return without error', async () => {

			const params = [
				{
					orderId: '10617',
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: '99999999999',
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			const result = await api.updateOrders(params);
			should(result).be.an.Array;
			should(result.length).be.equal(2);
			should(result[0].orderId).be.equal(10617);
			should(result[0].statusCode).be.equal(343);

		});

		it('should return without error', async () => {

			const params = [
				{
					orderId: '10617',
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: '99999999999',
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			await api.updateOrders(params);

		});

		it('should error', async () => {

			const params = [
				{
					orderId: '10617',
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: '-1',
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			const result = await api.updateOrders(params);
			should(result).be.an.Array;
			should(result.length).be.equal(2);
			should(result[0].orderId).be.equal(10617);
			should(result[0].statusCode).be.equal(343);
			should(result[1].orderId).be.equal(-1);
			should(result[1].statusCode).be.equal(350);

		});

	});

	describe.skip('#findUpdatedOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findUpdatedOrders(261, ['chargeback'], '07/01/2015', '01/01/2018');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

});
