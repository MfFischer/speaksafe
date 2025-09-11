import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Activity,
  Calendar,
  Users
} from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportSummary {
  id: string;
  title: string;
  status: 'pending' | 'under_review' | 'escalated' | 'resolved';
  submittedAt: string;
  category: string;
}

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  tokensEarned: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    tokensEarned: 0
  });

  const [recentReports, setRecentReports] = useState<ReportSummary[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock data for charts
  const activityData = [
    { name: 'Jan', reports: 4, resolved: 2 },
    { name: 'Feb', reports: 7, resolved: 5 },
    { name: 'Mar', reports: 12, resolved: 8 },
    { name: 'Apr', reports: 8, resolved: 6 },
    { name: 'May', reports: 15, resolved: 12 },
    { name: 'Jun', reports: 10, resolved: 8 }
  ];

  const categoryData = [
    { name: 'Corruption', value: 35, color: '#EF4444' },
    { name: 'Misconduct', value: 25, color: '#F59E0B' },
    { name: 'Environmental', value: 20, color: '#10B981' },
    { name: 'Fraud', value: 20, color: '#3B82F6' }
  ];

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalReports: 12,
        pendingReports: 3,
        resolvedReports: 8,
        tokensEarned: 450
      });

      setRecentReports([
        {
          id: '1',
          title: 'Government Contract Irregularities',
          status: 'under_review',
          submittedAt: '2024-01-15',
          category: 'Corruption'
        },
        {
          id: '2',
          title: 'Police Misconduct Report',
          status: 'escalated',
          submittedAt: '2024-01-12',
          category: 'Law Enforcement'
        },
        {
          id: '3',
          title: 'Environmental Violation',
          status: 'resolved',
          submittedAt: '2024-01-10',
          category: 'Environment'
        }
      ]);

      setIsLoaded(true);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'under_review': return 'text-blue-400 bg-blue-400/20';
      case 'escalated': return 'text-orange-400 bg-orange-400/20';
      case 'resolved': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'escalated': return 'Escalated';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  if (!isLoaded) {
    return (
      <Card className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-text-secondary">Loading dashboard...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <FileText className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.totalReports}</div>
            <div className="text-text-secondary text-sm">Total Reports</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
            <div className="text-3xl font-bold text-warning mb-1">{stats.pendingReports}</div>
            <div className="text-text-secondary text-sm">Pending</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
            <div className="text-3xl font-bold text-success mb-1">{stats.resolvedReports}</div>
            <div className="text-text-secondary text-sm">Resolved</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <Award className="w-8 h-8 text-accent-tertiary mx-auto mb-3" />
            <div className="text-3xl font-bold text-accent-tertiary mb-1">{stats.tokensEarned}</div>
            <div className="text-text-secondary text-sm">Tokens Earned</div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-6 h-6 text-accent-primary" />
              <h3 className="text-xl font-semibold text-white">Report Activity</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#B8BCC8" />
                  <YAxis stroke="#B8BCC8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="reports" stroke="#7877C6" strokeWidth={3} />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-accent-primary" />
              <h3 className="text-xl font-semibold text-white">Report Categories</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-accent-primary" />
              <h3 className="text-xl font-semibold text-white">Recent Reports</h3>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <div className="text-text-secondary mb-4">No reports submitted yet</div>
              <Button>Submit Your First Report</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{report.title}</h4>
                    <Badge variant={
                      report.status === 'resolved' ? 'success' :
                      report.status === 'escalated' ? 'error' :
                      report.status === 'under_review' ? 'info' : 'warning'
                    }>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-text-secondary">
                    <span>Category: {report.category}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-accent-primary" />
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              className="p-6 h-auto flex-col items-start text-left"
            >
              <FileText className="w-8 h-8 mb-3" />
              <div className="font-semibold mb-1">New Report</div>
              <div className="text-sm opacity-80">Submit a new anonymous report</div>
            </Button>

            <Button
              variant="secondary"
              className="p-6 h-auto flex-col items-start text-left"
            >
              <Users className="w-8 h-8 mb-3" />
              <div className="font-semibold mb-1">Vote on Proposals</div>
              <div className="text-sm opacity-80">Participate in DAO governance</div>
            </Button>

            <Button
              variant="secondary"
              className="p-6 h-auto flex-col items-start text-left"
            >
              <Activity className="w-8 h-8 mb-3" />
              <div className="font-semibold mb-1">Settings</div>
              <div className="text-sm opacity-80">Manage privacy and security</div>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
