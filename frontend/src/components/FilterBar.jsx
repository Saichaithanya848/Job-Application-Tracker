import React from 'react';
import { Search, RotateCcw, LayoutGrid, TableProperties } from 'lucide-react';

/**
 * FilterBar Component
 * Includes GitHub-style status filter tabs, search, type dropdown, sort, and Grid/Table toggle.
 */
const FilterBar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortOrder,
  onSortChange,
  onReset,
  viewMode,
  onViewModeChange,
  statusCounts = {},
  totalCount = 0,
}) => {
  const tabs = [
    { key: 'all', label: 'All Applications', count: totalCount },
    { key: 'Applied', label: 'Applied', count: statusCounts.Applied || 0 },
    { key: 'Assessment', label: 'Assessments', count: statusCounts.Assessment || 0 },
    { key: 'Interview', label: 'Interviews', count: statusCounts.Interview || 0 },
    { key: 'Offer', label: 'Offers', count: statusCounts.Offer || 0 },
    { key: 'Rejected', label: 'Rejections', count: statusCounts.Rejected || 0 },
  ];

  const isFiltered =
    search.trim() !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    sortOrder !== 'newest';

  return (
    <div className="filter-wrapper">
      {/* Quick Status Tabs with clear labels and separated count badges */}
      <div className="status-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`status-tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
            onClick={() => onStatusChange(tab.key)}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Main Filter Controls */}
      <div className="filter-card">
        <div className="filter-grid">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search companies, job titles, or keywords..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Job Type Dropdown */}
          <select
            className="select-filter"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Filter by Job Type"
          >
            <option value="all">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            className="select-filter"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort by"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="company-asc">Company: A to Z</option>
            <option value="company-desc">Company: Z to A</option>
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Cards Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table Dense View"
              aria-label="Table View"
            >
              <TableProperties size={16} />
            </button>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              className="btn-clear"
              onClick={onReset}
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
