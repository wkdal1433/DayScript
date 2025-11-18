import { StyleSheet } from 'react-native';

export const progressStyles = StyleSheet.create({
  // Container styles
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  overallPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Progress levels styles
  levelsContainer: {
    marginBottom: 16,
  },

  progressLevel: {
    marginBottom: 12,
  },

  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  levelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  levelStats: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },

  levelDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Progress bar styles
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Current status styles
  currentStatus: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  statusLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  statusValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },

  // Milestones styles
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },

  milestone: {
    alignItems: 'center',
  },

  milestoneIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },

  milestoneCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },

  milestoneText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Time estimate styles
  timeEstimate: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  timeEstimateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default progressStyles;