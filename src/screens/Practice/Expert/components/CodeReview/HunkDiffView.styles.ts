import { StyleSheet } from 'react-native';

export const hunkDiffStyles = StyleSheet.create({
  // Container styles
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 8,
    overflow: 'hidden',
  },

  activeContainer: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  reviewedContainer: {
    opacity: 0.8,
    borderColor: '#9CA3AF',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerLeft: {
    flex: 1,
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  hunkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },

  hunkInfo: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6B7280',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Split view styles
  splitView: {
    flexDirection: 'row',
    minHeight: 200,
    maxHeight: 400,
  },

  leftPane: {
    flex: 1,
    backgroundColor: '#FEF2F2', // Light red background for original
  },

  rightPane: {
    flex: 1,
    backgroundColor: '#F0FDF4', // Light green background for modified
  },

  divider: {
    width: 2,
    backgroundColor: '#D1D5DB',
  },

  paneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    textAlign: 'center',
  },

  // Code display styles
  codeContainer: {
    flex: 1,
  },

  codeLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 24,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  lineNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#9CA3AF',
    width: 40,
    textAlign: 'right',
    marginRight: 8,
    paddingTop: 2,
  },

  codeContent: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#111827',
    lineHeight: 20,
  },

  emptyLine: {
    height: 24,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },

  // Line type styles
  contextLine: {
    backgroundColor: '#F9FAFB',
  },

  addedLine: {
    backgroundColor: '#DCFCE7', // Light green
  },

  deletedLine: {
    backgroundColor: '#FEE2E2', // Light red
  },

  modifiedLine: {
    backgroundColor: '#FEF3C7', // Light yellow
  },

  editingLine: {
    backgroundColor: '#DBEAFE', // Light blue for editing
  },

  // Editable code input
  editableCode: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#111827',
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minHeight: 24,
  },

  // Edit comment section
  editCommentSection: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  editCommentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },

  editCommentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // Action bar styles
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },

  acceptButton: {
    backgroundColor: '#10B981',
  },

  rejectButton: {
    backgroundColor: '#EF4444',
  },

  editButton: {
    backgroundColor: '#F59E0B',
  },

  saveButton: {
    backgroundColor: '#3B82F6',
  },

  cancelButton: {
    backgroundColor: '#6B7280',
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Decision display styles
  decisionDisplay: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  decisionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },

  decisionAction: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },

  decisionComment: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },

  decisionTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default hunkDiffStyles;