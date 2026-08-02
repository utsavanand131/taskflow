"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  FolderKanban,
  CheckSquare,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import PriorityChart from "@/components/charts/PriorityChart";
import ProjectProgressChart from "@/components/charts/ProjectProgressChart";

const DASHBOARD_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      projects {
        total
        active
        completed
        archived
      }

      tasks {
        total
        completed
        overdue
        completionRate
      }

      analytics {
        priorityDistribution {
          LOW
          MEDIUM
          HIGH
          URGENT
        }

        projectProgress {
          id
          name
          completionRate
        }
      }

      recentActivity {
        id
        type
        message
        createdAt
      }
    }
  }
`;
interface DashboardResponse {
  dashboardStats: {
    projects: {
      total: number;
      active: number;
      completed: number;
      archived: number;
    };

    tasks: {
      total: number;
      completed: number;
      overdue: number;
      completionRate: number;
    };

    recentActivity: {
      id: string;
      type: string;
      message: string;
      createdAt: string;
    }[];

    analytics: {
      priorityDistribution: {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
        URGENT: number;
      };

      projectProgress: {
        id: string;
        name: string;
        completionRate: number;
      }[];
    };
  };
}

export default function DashboardPage() {
  const { data, loading, error } = useQuery<DashboardResponse>(DASHBOARD_QUERY);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const stats = data?.dashboardStats;

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-500">Overview of your workspace</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Projects"
          value={stats.projects.total}
          icon={FolderKanban}
          description={`${stats.projects.active} active`}
        />

        <StatsCard
          title="Tasks"
          value={stats.tasks.total}
          icon={CheckSquare}
          description={`${stats.tasks.completed} completed`}
        />

        <StatsCard
          title="Completion Rate"
          value={`${stats.tasks.completionRate}%`}
          icon={CircleCheck}
        />

        <StatsCard
          title="Overdue"
          value={stats.tasks.overdue}
          icon={AlertTriangle}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PriorityChart data={stats.analytics.priorityDistribution} />

        <ProjectProgressChart data={stats.analytics.projectProgress} />
      </div>

      <ActivityFeed activities={stats.recentActivity} />
    </div>
  );
}
