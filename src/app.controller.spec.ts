import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAuthService = {
    login: jest.fn((user) => ({
      access_token: 'mock-token-123',
    })),
    validateUser: jest.fn(),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = { email: 'test@test.com', id: 1 };
      const mockRequest = { user: mockUser };
      const result = await appController.login(mockRequest);

      expect(result).toHaveProperty('access_token');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
