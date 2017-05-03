import should from 'should';
import _ from 'lodash';
import Api from '../../src/api.js';

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
			result.should.be.ok;

		});

		it('should return false', async () => {

			const result = await badApi.validateCredentials();
			result.should.not.be.ok;

		});

	});

	describe('#findActiveCampaigns()', async () => {

		it('should return without error', async () => {

			const result = await api.findActiveCampaigns();
			result.should.be.an.Array;

			_.each(result, (r) => {

				r.should.have.properties('id', 'name');

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
			result.should.be.an.Array;
			result.length.should.be.equal(0);

		});

		it('should find orders', async () => {

			const result = await api.findOrders('all', '01/01/2013', '02/01/2017');
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

	});

	describe('#getOrder()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrder(10617);
			should.exist(result);
			result.id.should.be.equal(10617);

		});

		it('should error', async () => {

			const result = await api.getOrder(-1);
			should.not.exist(result);

		});

	});

	describe('#getOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.getOrders([10617, 10615]);
			result.should.be.an.Array;
			result.length.should.be.equal(2);

		});

		it('should return without error', async () => {

			const result = await api.getOrders([10617]);
			result.should.be.an.Array;
			result.length.should.be.equal(1);

		});

		it('should return without error with a bad id', async () => {

			const result = await api.getOrders([-1]);
			result.should.be.an.Array;
			result.length.should.be.equal(0);

		});

		it('should return without error with a bad id', async () => {

			const result = await api.getOrders([10617, -1]);
			result.should.be.an.Array;
			result.length.should.be.equal(1);
			should.exist(result[0]);

		});

	});

	describe('#findCustomers()', async () => {

		it('should return without error', async () => {

			const result = await api.findCustomers(79, '01/01/2013', '02/01/2017');
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.findCustomers(79, '01/01/2013', '02/01/2013');
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.equal(0);

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
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([377, 27]);
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([-1]);
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.equal(0);

		});

		it('should return without error', async () => {

			const result = await api.getProducts([377, -1, 27]);
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

	});

	describe('#findShippingMethods()', async () => {

		it('should return without error', async () => {

			const result = await api.findShippingMethods('all');
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

	});

	describe('#updateOrders()', async () => {

		it('should return without error', async () => {

			const params = [
				{
					orderId: 10617,
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: 99999999999,
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			const result = await api.updateOrders(params);
			result.should.be.an.Array;
			result.length.should.be.equal(2);
			result[0].orderId.should.be.equal(10617);
			result[0].statusCode.should.be.equal(343);

		});

		it('should return without error', async () => {

			const params = [
				{
					orderId: 10617,
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: 99999999999,
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			await api.updateOrders(params);

		});

		it('should error', async () => {

			const params = [
				{
					orderId: 10617,
					action: 'tracking_number',
					value: '9400111899561218198203'
				}, {
					orderId: -1,
					action: 'tracking_number',
					value: '1234567TEST'
				}
			];

			const result = await api.updateOrders(params);
			result.should.be.an.Array;
			result.length.should.be.equal(2);
			result[0].orderId.should.be.equal(10617);
			result[0].statusCode.should.be.equal(343);
			result[1].orderId.should.be.equal(-1);
			result[1].statusCode.should.be.equal(350);

		});

	});

	describe('#findUpdatedOrders()', async () => {

		it('should return without error', async () => {

			const result = await api.findUpdatedOrders(261, ['chargeback'], '07/01/2015', '01/01/2018');
			should.exist(result);
			result.should.be.an.Array;
			result.length.should.be.greaterThan(0);

		});

	});

});
