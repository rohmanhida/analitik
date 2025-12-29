import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should return access token for valid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'pentol@pentol.id', password: 'pentolkanji' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        token = res.body?.access_token;
        expect(token).toBeDefined();
      });
  });

  it('/auth/login (POST) - should return 401 invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@mail.com', password: 'wrongpassword' })
      .expect(401);
  });

  it('/profile (GET) - should return 401 without token', () => {
    return request(app.getHttpServer()).get('/profile').expect(401);
  });

  it('/profile (GET) - should return 200 with provided token', () => {
    return request(app.getHttpServer())
      .get('/profile')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});
