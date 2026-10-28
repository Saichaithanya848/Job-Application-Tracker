const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Job Applications API Endpoints', () => {
  let userAToken;
  let userBToken;
  let userAId;

  beforeEach(async () => {
    // Register User A
    const resA = await request(app).post('/api/auth/register').send({
      name: 'User A',
      email: 'usera@example.com',
      password: 'password123',
    });
    userAToken = resA.body.data.token;
    userAId = resA.body.data.user._id;

    // Register User B
    const resB = await request(app).post('/api/auth/register').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123',
    });
    userBToken = resB.body.data.token;
  });

  describe('POST /api/jobs', () => {
    it('should create a new job application for authenticated user', async () => {
      const jobData = {
        company: 'Google',
        jobTitle: 'Software Engineer',
        jobType: 'Full-time',
        location: 'Remote',
        status: 'Applied',
        jobDescription: 'Great opportunity',
        jobUrl: 'https://careers.google.com',
        notes: 'Applied with referral',
      };

      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send(jobData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.company).toBe('Google');
      expect(res.body.data.jobTitle).toBe('Software Engineer');
      expect(res.body.data.user).toBe(userAId);
    });

    it('should fail if company or jobTitle is missing', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Only Company' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({ company: 'Google', jobTitle: 'Engineer' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/jobs and Data Isolation', () => {
    beforeEach(async () => {
      // Create 2 jobs for User A
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Stripe', jobTitle: 'Backend Dev', status: 'Offer', jobType: 'Full-time' });

      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Spotify', jobTitle: 'Frontend Dev', status: 'Interview', jobType: 'Internship' });

      // Create 1 job for User B
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ company: 'Netflix', jobTitle: 'SRE', status: 'Applied', jobType: 'Contract' });
    });

    it('should only return applications belonging to the authenticated user', async () => {
      const resA = await request(app)
        .get('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(resA.statusCode).toBe(200);
      expect(resA.body.count).toBe(2);
      expect(resA.body.data.map((j) => j.company)).toEqual(
        expect.arrayContaining(['Stripe', 'Spotify'])
      );

      const resB = await request(app)
        .get('/api/jobs')
        .set('Authorization', `Bearer ${userBToken}`);

      expect(resB.statusCode).toBe(200);
      expect(resB.body.count).toBe(1);
      expect(resB.body.data[0].company).toBe('Netflix');
    });

    it('should filter jobs by status', async () => {
      const res = await request(app)
        .get('/api/jobs?status=Offer')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].company).toBe('Stripe');
    });

    it('should search jobs by company name', async () => {
      const res = await request(app)
        .get('/api/jobs?search=spot')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].company).toBe('Spotify');
    });
  });

  describe('PUT and DELETE /api/jobs/:id', () => {
    let userAJobId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Microsoft', jobTitle: 'Cloud Engineer', status: 'Applied' });

      userAJobId = res.body.data._id;
    });

    it('should update an existing job application by owner', async () => {
      const res = await request(app)
        .put(`/api/jobs/${userAJobId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'Interview', notes: 'Scheduled round 1' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('Interview');
      expect(res.body.data.notes).toBe('Scheduled round 1');
    });

    it('should prevent User B from modifying User A job application', async () => {
      const res = await request(app)
        .put(`/api/jobs/${userAJobId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ status: 'Rejected' });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should delete a job application by owner', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${userAJobId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is gone
      const checkRes = await request(app)
        .get(`/api/jobs/${userAJobId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(checkRes.statusCode).toBe(404);
    });

    it('should prevent User B from deleting User A job application', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${userAJobId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/jobs/stats', () => {
    it('should return aggregated dashboard statistics for user', async () => {
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Co 1', jobTitle: 'Dev', status: 'Applied' });

      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Co 2', jobTitle: 'Dev', status: 'Interview' });

      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ company: 'Co 3', jobTitle: 'Dev', status: 'Offer' });

      const res = await request(app)
        .get('/api/jobs/stats')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(3);
      expect(res.body.data.applied).toBe(1);
      expect(res.body.data.interviews).toBe(1);
      expect(res.body.data.offers).toBe(1);
      expect(res.body.data.rejections).toBe(0);
      expect(res.body.data.pending).toBe(1);
    });
  });
});
