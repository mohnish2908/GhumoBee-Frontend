import React, { useEffect, useState } from "react";
import { MapPin, Loader2, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getVolunteerApplication } from "../services/operations/applicationApi";
import { toast } from "react-hot-toast";

interface Opportunity {
  title: string;
  location: string;
  host: {
    name?: string;
  };
  startDate?: string;
  endDate?: string;
}

interface Application {
  _id: string;
  opportunity: Opportunity;
  status: "pending" | "shortlisted" | "volunteering" | "completed" | "rejected" | "withdrawn";
  submittedAt: string;
}

const VolunteerApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch data from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getVolunteerApplication({ page, status: statusFilter });
      if (response?.data?.success) {
        setApplications(response.data.data.applications);
        setPagination(response.data.data.pagination);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-blue-100 text-blue-700";
      case "volunteering":
        return "bg-indigo-100 text-indigo-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "withdrawn":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-5xl mx-auto transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-charcoal dark:text-white">
          My Applications
        </h2>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-honey focus:outline-none"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="volunteering">Volunteering</option>
            <option value="completed">Completed</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-honey" />
          <p className="ml-3 text-gray-500 dark:text-gray-300">Loading Applications...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && applications.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          You haven’t applied for any opportunities yet.
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:scale-[1.01] transition-transform bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {app.opportunity?.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  app.status
                )}`}
              >
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {app.opportunity?.location} •{" "}
              {app.opportunity?.host?.name || "Unknown Host"}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Applied on {formatDate(app.submittedAt)}
            </p>

            {app.opportunity?.startDate && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatDate(app.opportunity.startDate)} -{" "}
                {formatDate(app.opportunity.endDate || app.opportunity.startDate)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={!pagination.hasPrevPage}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              pagination.hasPrevPage
                ? "bg-honey text-white hover:bg-yellow-500"
                : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              pagination.hasNextPage
                ? "bg-honey text-white hover:bg-yellow-500"
                : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VolunteerApplications;
