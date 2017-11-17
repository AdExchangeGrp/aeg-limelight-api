import * as should from 'should';
import * as _ from 'lodash';
import Api from '../../src/api';

describe('api domain globalvoffers.limelightcrm.com', async () => {

	const api = new Api('Pushinnovation', 'nnu3HRCVTawf2e', 'globalvoffers.limelightcrm.com')
		.on('warn', (data) => {

			console.log(data);

		})
		.on('error', (err) => {

			console.log(err);

		});

	const badApi = new Api('Pushinnovation', '1', 'globalvoffers.limelightcrm.com')
		.on('warn', (data) => {

			console.log(data);

		})
		.on('error', (err) => {

			console.log(err);

		});

	describe('#validateCredentials()', async () => {

		it('should return true', async () => {

			const result = await api.validateCredentials({retries: 3});
			should(result).be.ok;

		});

		it('should return false', async () => {

			const result = await badApi.validateCredentials();
			should(result).not.be.ok;

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			should(result).be.an.Array;

			_.each(result, (r) => {

				should(r).have.properties('id', 'name');

			});

		});

	});

	describe('#getCampaign()', async () => {

		it('should return without error', async () => {

			const result = await api.getCampaign(285);
			should.exist(result);

		});

		it('should error', async () => {

			const result = await api.getCampaign(-1);
			should.not.exist(result);

		});

	});

	describe('#findOrders()', async () => {

		it('should not find orders', async () => {

			const result = await api.findOrders(285, '01/01/2013', '02/01/2017', {productIds: [26]});
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

		it('should find orders', async () => {

			const result = await api.findOrders('all', '01/01/2013', '02/01/2017');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(10617);
			should.exist(result);
			should(result!.id).be.equal(10617);

		});

		it('should error', async () => {

			const result = await api.getOrder(-1);
			should.not.exist(result);

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([10617, 10615]);
			should(result).be.an.Array;
			should(result.length).be.equal(2);
			should(result[0].products).be.an.Array;

		});

		it('should return without error', async () => {

			const result = await api.getOrders([10617]);
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

			const result = await api.getOrders([10617, -1]);
			should(result).be.an.Array;
			should(result.length).be.equal(1);
			should.exist(result[0]);

		});

	});

	describe('#findCustomers()', async () => {

		it('should return without error', async () => {

			const result = await api.findCustomers(79, '01/01/2013', '02/01/2017');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.findCustomers(79, '01/01/2013', '02/01/2013');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.equal(0);

		});

	});

	describe('#getCustomer()', async () => {

		it('should return without error', async () => {

			const result = await api.getCustomer(63545);
			should.exist(result);

		});

		it('should return without error', async () => {

			const result = await api.getCustomer(999999);
			should.not.exist(result);

		});

	});

	describe('#getProducts()', async () => {

		it('should return without error', async () => {

			const result = await api.getProducts([377]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([377, 27]);
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

			const result = await api.getProducts([377, -1, 27]);
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods('all');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

	describe('#updateOrders()', async () => {

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

	describe('#findUpdatedOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findUpdatedOrders(261, ['chargeback'], '07/01/2015', '01/01/2018');
			should.exist(result);
			should(result).be.an.Array;
			should(result.length).be.greaterThan(0);

		});

	});

});

describe('api domain globalvoffers.limelightcrm.com', async () => {

	const apiCrmOrderCenter = new Api('Push Innovation', 'XMDQNhSN8eEGbh', 'crm-ordercenter.limelightcrm.com')
		.on('warn', (data) => {

			console.log(data);

		})
		.on('error', (err) => {

			console.log(err);

		});

	describe('#updateOrders()', async () => {

		it('should return voided or refunded with override codes', async () => {

			const params = [
				{
					orderId: '9288200',
					action: 'tracking_number',
					value: '9400111699000069577086'
				}
			];

			const result = await apiCrmOrderCenter.updateOrders(params, {errorCodeOverrides: [378]});
			should(result).be.an.Array;
			should(result.length).be.equal(1);
			should(result[0].orderId).be.equal(9288200);
			should(result[0].statusCode).be.equal(379);

		});

	});

});
