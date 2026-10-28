const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.user.name).toBe(testUser.name);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail when email is already registered', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(testUser);

      // Duplicate registration attempt
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'onlyemail@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create user before login tests
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login an existing user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should reject login for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should retrieve current user profile when authenticated with Bearer token', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const token = registerRes.body.data.token;

      const profileRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.statusCode).toBe(200);
      expect(profileRes.body.success).toBe(true);
      expect(profileRes.body.data.email).toBe(testUser.email);
    });

    it('should reject profile request without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
