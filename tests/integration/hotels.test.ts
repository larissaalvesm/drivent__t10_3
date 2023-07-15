import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createDefinedTicketType, createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken();
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
      
          it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });

          it('should respond with status 402 when payment is required', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
          });

          it('should respond with status 402 when event is remote and not include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createDefinedTicketType(true, false);
            await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
          });

          it('should respond with status 404 when there are no hotels created', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createDefinedTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, 'PAID');
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });

    });
  });