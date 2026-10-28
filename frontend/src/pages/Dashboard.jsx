import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import StatusChart from '../components/StatusChart';
import StatusBadge from '../components/StatusBadge';
import JobModal from '../components/JobModal';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import {
  Briefcase,
  Clock,
  Video,
  Award,
  XCircle,
  Plus,
  ArrowRight,
  Calendar,
  ExternalLink,
} from 'lucide-react';

/**
 * Dashboard Page
 * High-level overview of metrics, status distribution, and recent applications.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch dashboard stats from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Unable to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle saving a new job application from dashboard quick-add
  const handleSaveJob = async (jobData) => {
    await api.post('/jobs', jobData);
    await fetchDashboardData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCompanyInitial = (name) => {
    return name ? name.trim().charAt(0).toUpperCase() : 'C';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '0.95rem', color: '#71717a' }}>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const interviews = stats?.interviews || 0;
  const offers = stats?.offers || 0;
  const rejections = stats?.rejections || 0;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Hello, {user?.name || 'there'} 👋
          </h1>
          <p className="page-subtitle">
            Here is your current job hunt pipeline overview
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Application</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Metrics Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Applications"
          value={total}
          icon={<Briefcase size={20} />}
          color="#2563eb"
          bg="#eff6ff"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon={<Clock size={20} />}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          title="Interviews"
          value={interviews}
          icon={<Video size={20} />}
          color="#7c3aed"
          bg="#f5f3ff"
        />
        <StatCard
          title="Offers"
          value={offers}
          icon={<Award size={20} />}
          color="#059669"
          bg="#ecfdf5"
        />
        <StatCard
          title="Rejections"
          value={rejections}
          icon={<XCircle size={20} />}
          color="#dc2626"
          bg="#fef2f2"
        />
      </div>

      {/* Visual Status Breakdown Chart */}
      <StatusChart
        distribution={stats?.statusDistribution || {}}
        total={total}
      />

      {/* Recent Applications Section */}
      <div className="recent-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Activity</h2>
            <p style={{ fontSize: '0.82rem', color: '#71717a', marginTop: 2 }}>
              Your latest submitted applications and their current status
            </p>
          </div>
          {total > 0 && (
            <Link to="/applications" className="view-all-link">
              <span>View all ({total})</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {total === 0 ? (
          <EmptyState
            title="No applications tracked yet"
            description="Start tracking your interviews, offers, and applied jobs in one place."
            actionLabel="+ Add Your First Job"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="recent-list">
            {stats?.recentApplications?.map((job) => (
              <div key={job._id} className="recent-item-row">
                <div className="recent-company-group">
                  <div className="company-avatar">
                    {getCompanyInitial(job.company)}
                  </div>
                  <div>
                    <div className="recent-company-name">{job.company}</div>
                    <div className="recent-role-title">
                      {job.jobTitle} &bull; <span className="type-tag-inline">{job.jobType}</span>
                    </div>
                  </div>
                </div>

                <div className="recent-meta-group">
                  <span className="recent-date">
                    <Calendar size={13} style={{ marginRight: 4 }} />
                    {formatDate(job.applicationDate)}
                  </span>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
      />
    </div>
  );
};

export default Dashboard;
