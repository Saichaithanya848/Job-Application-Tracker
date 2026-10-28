import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';
import JobModal from '../components/JobModal';
import DeleteModal from '../components/DeleteModal';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { Plus } from 'lucide-react';

/**
 * Applications Page
 * Full job application management: list, search, filter, sort, add, edit, delete.
 */
const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobsRaw, setAllJobsRaw] = useState([]); // Used for tab counts
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null); // { type, message }

  // View mode: 'table' or 'grid' (default to 'table' for authentic ATS feel, with toggle)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('trackr_view_mode') || 'table';
  });

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modal states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Keep track of view mode preference
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('trackr_view_mode', mode);
  };

  // Fetch all raw jobs once or when mutations occur to keep tab counts accurate
  const fetchAllForCounts = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.data.success) {
        setAllJobsRaw(res.data.data);
      }
    } catch (err) {
      // Ignore count fetch errors silently
    }
  };

  // Compute status counts for quick tabs
  const statusCounts = useMemo(() => {
    const counts = {
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };
    allJobsRaw.forEach((j) => {
      if (counts[j.status] !== undefined) {
        counts[j.status]++;
      }
    });
    return counts;
  }, [allJobsRaw]);

  // Fetch jobs with current filters
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.jobType = typeFilter;
      if (sortOrder) params.sort = sortOrder;

      const res = await api.get('/jobs', { params });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to fetch job applications. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, sortOrder]);

  // Debounced fetch when search changes or filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchJobs]);

  // Initial load
  useEffect(() => {
    fetchAllForCounts();
  }, []);

  // Quick inline status change directly from card or table row
  const handleQuickStatusChange = async (jobId, newStatus) => {
    try {
      const res = await api.put(`/jobs/${jobId}`, { status: newStatus });
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
        setAllJobsRaw((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
        setAlert({
          type: 'success',
          message: `Moved ${res.data.data.company} to ${newStatus}.`,
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Could not update status. Please try again.',
      });
    }
  };

  // Handle Save (Create or Update)
  const handleSaveJob = async (formData, jobId) => {
    if (jobId) {
      const res = await api.put(`/jobs/${jobId}`, formData);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? res.data.data : j)));
      setAllJobsRaw((prev) => prev.map((j) => (j._id === jobId ? res.data.data : j)));
      setAlert({
        type: 'success',
        message: `Updated application for ${res.data.data.company} successfully!`,
      });
    } else {
      const res = await api.post('/jobs', formData);
      setJobs((prev) => [res.data.data, ...prev]);
      setAllJobsRaw((prev) => [res.data.data, ...prev]);
      setAlert({
        type: 'success',
        message: `Added new application for ${res.data.data.company}!`,
      });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (job) => {
    setJobToEdit(job);
    setIsJobModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setJobToEdit(null);
    setIsJobModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/jobs/${jobToDelete._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setAllJobsRaw((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setAlert({
        type: 'success',
        message: `Application for ${jobToDelete.company} has been deleted.`,
      });
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Could not delete application. Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSortOrder('newest');
  };

  const isFiltering =
    search.trim() !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    sortOrder !== 'newest';

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Applications</h1>
          <p className="page-subtitle">
            Manage your opportunities, stages, and upcoming interview pipelines
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>New Application</span>
        </button>
      </div>

      {/* Alert Banner */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* FilterBar with Status Tabs & View Toggle */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onReset={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        statusCounts={statusCounts}
        totalCount={allJobsRaw.length}
      />

      {/* Results Header Count */}
      <div className="results-count-bar">
        <span>
          Showing <strong>{jobs.length}</strong> {jobs.length === 1 ? 'application' : 'applications'}
        </span>
        {isFiltering && (
          <span style={{ color: '#2563eb', fontSize: '0.82rem', fontWeight: 500 }}>
            Filtered from {allJobsRaw.length} total
          </span>
        )}
      </div>

      {/* Jobs View: Table or Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#71717a' }}>
          Loading applications...
        </div>
      ) : jobs.length === 0 ? (
        isFiltering ? (
          <EmptyState
            iconType="search"
            title="No matching applications"
            description="No applications found matching your search and active filters."
            actionLabel="Clear Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <EmptyState
            iconType="briefcase"
            title="No applications tracked yet"
            description="Add your first job application above to start organizing your career search."
            actionLabel="+ Add Application"
            onAction={handleOpenAdd}
          />
        )
      ) : viewMode === 'table' ? (
        <JobTable
          jobs={jobs}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onStatusChange={handleQuickStatusChange}
        />
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={handleQuickStatusChange}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Job Modal */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleSaveJob}
        jobToEdit={jobToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        job={jobToDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default Applications;
