# Kode Sumber PPNP Internship Tracker

Dokumentasi ini hanya berisi kode di dalam folder `src/`. Path ditulis relatif dari root proyek.

## Daftar isi

- [`src/components/AppHeader.tsx`](#srccomponentsappheadertsx)
- [`src/components/ApplicationCard.tsx`](#srccomponentsapplicationcardtsx)
- [`src/components/CompanyCard.tsx`](#srccomponentscompanycardtsx)
- [`src/components/ConfirmDialog.tsx`](#srccomponentsconfirmdialogtsx)
- [`src/components/DailyLogCard.tsx`](#srccomponentsdailylogcardtsx)
- [`src/components/EmptyState.tsx`](#srccomponentsemptystatetsx)
- [`src/components/EvaluationCard.tsx`](#srccomponentsevaluationcardtsx)
- [`src/components/InternshipCard.tsx`](#srccomponentsinternshipcardtsx)
- [`src/components/LoadingView.tsx`](#srccomponentsloadingviewtsx)
- [`src/components/ProgressCard.tsx`](#srccomponentsprogresscardtsx)
- [`src/components/StatCard.tsx`](#srccomponentsstatcardtsx)
- [`src/components/StatusBadge.tsx`](#srccomponentsstatusbadgetsx)
- [`src/constants/theme.ts`](#srcconstantsthemets)
- [`src/contexts/AuthContext.tsx`](#srccontextsauthcontexttsx)
- [`src/hooks/useAuth.ts`](#srchooksuseauthts)
- [`src/hooks/useFirestoreData.ts`](#srchooksusefirestoredatats)
- [`src/navigation/AdminNavigator.tsx`](#srcnavigationadminnavigatortsx)
- [`src/navigation/RootNavigator.tsx`](#srcnavigationrootnavigatortsx)
- [`src/navigation/StudentNavigator.tsx`](#srcnavigationstudentnavigatortsx)
- [`src/navigation/SupervisorNavigator.tsx`](#srcnavigationsupervisornavigatortsx)
- [`src/navigation/types.ts`](#srcnavigationtypests)
- [`src/screens/admin/AdminDashboardScreen.tsx`](#srcscreensadminadmindashboardscreentsx)
- [`src/screens/admin/AdminReportScreen.tsx`](#srcscreensadminadminreportscreentsx)
- [`src/screens/admin/ApplicationManagementScreen.tsx`](#srcscreensadminapplicationmanagementscreentsx)
- [`src/screens/admin/ApplicationReviewScreen.tsx`](#srcscreensadminapplicationreviewscreentsx)
- [`src/screens/admin/CompanyFormScreen.tsx`](#srcscreensadmincompanyformscreentsx)
- [`src/screens/admin/CompanyManagementScreen.tsx`](#srcscreensadmincompanymanagementscreentsx)
- [`src/screens/admin/UserManagementScreen.tsx`](#srcscreensadminusermanagementscreentsx)
- [`src/screens/auth/ForgotPasswordScreen.tsx`](#srcscreensauthforgotpasswordscreentsx)
- [`src/screens/auth/LoginScreen.tsx`](#srcscreensauthloginscreentsx)
- [`src/screens/auth/RegisterScreen.tsx`](#srcscreensauthregisterscreentsx)
- [`src/screens/shared/DailyLogDetailScreen.tsx`](#srcscreensshareddailylogdetailscreentsx)
- [`src/screens/shared/InternshipDetailScreen.tsx`](#srcscreenssharedinternshipdetailscreentsx)
- [`src/screens/shared/ProfileScreen.tsx`](#srcscreenssharedprofilescreentsx)
- [`src/screens/shared/rofileScreen.tsx`](#srcscreenssharedrofilescreentsx)
- [`src/screens/student/CompanyListScreen.tsx`](#srcscreensstudentcompanylistscreentsx)
- [`src/screens/student/DailyLogFormScreen.tsx`](#srcscreensstudentdailylogformscreentsx)
- [`src/screens/student/DailyLogScreen.tsx`](#srcscreensstudentdailylogscreentsx)
- [`src/screens/student/InternshipApplicationScreen.tsx`](#srcscreensstudentinternshipapplicationscreentsx)
- [`src/screens/student/MyEvaluationScreen.tsx`](#srcscreensstudentmyevaluationscreentsx)
- [`src/screens/student/MyInternshipScreen.tsx`](#srcscreensstudentmyinternshipscreentsx)
- [`src/screens/student/StudentDashboardScreen.tsx`](#srcscreensstudentstudentdashboardscreentsx)
- [`src/screens/supervisor/EvaluationFormScreen.tsx`](#srcscreenssupervisorevaluationformscreentsx)
- [`src/screens/supervisor/LogReviewScreen.tsx`](#srcscreenssupervisorlogreviewscreentsx)
- [`src/screens/supervisor/SupervisedStudentsScreen.tsx`](#srcscreenssupervisorsupervisedstudentsscreentsx)
- [`src/screens/supervisor/SupervisorDashboardScreen.tsx`](#srcscreenssupervisorsupervisordashboardscreentsx)
- [`src/screens/supervisor/SupervisorReportScreen.tsx`](#srcscreenssupervisorsupervisorreportscreentsx)
- [`src/types/index.ts`](#srctypesindexts)
- [`src/utils/dateUtils.ts`](#srcutilsdateutilsts)
- [`src/utils/progressUtils.ts`](#srcutilsprogressutilsts)
- [`src/utils/scoreUtils.ts`](#srcutilsscoreutilsts)
- [`src/utils/validation.ts`](#srcutilsvalidationts)
- [`src/utils/workflowUtils.ts`](#srcutilsworkflowutilsts)

## File yang dikecualikan

- `src/firebase/**`
- `src/services/**` termasuk integrasi Cloudinary

## `src/components/AppHeader.tsx`

```tsx
// Header reusable dengan tombol back opsional
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

const AppHeader: React.FC<Props> = ({ title, subtitle, onBack, rightIcon, onRightPress }) => {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={COLORS.surface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      {rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name={rightIcon} size={22} color={COLORS.surface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  title: { color: COLORS.surface, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: 2 },
});

export default AppHeader;
```

## `src/components/ApplicationCard.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { InternshipApplication } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  application: InternshipApplication;
  studentName?: string;
  companyName?: string;
  onPress?: () => void;
}

const ApplicationCard: React.FC<Props> = ({
  application,
  studentName,
  companyName,
  onPress,
}) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.topic} numberOfLines={1}>{application.topic}</Text>
        <StatusBadge status={application.status} />
      </View>
      {studentName ? <Text style={styles.meta}>{studentName}</Text> : null}
      {companyName ? <Text style={styles.meta}>{companyName}</Text> : null}
      <View style={styles.periodRow}>
        <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.meta}>
          {toDateString(application.startDate)} â€” {toDateString(application.endDate)}
        </Text>
      </View>
      {application.decisionNotes ? (
        <View style={styles.notesBox}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.notesText} numberOfLines={2}>{application.decisionNotes}</Text>
        </View>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  topic: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  periodRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  notesBox: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.sm, paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  notesText: { flex: 1, fontSize: FONT_SIZE.xs, color: COLORS.primary, fontStyle: 'italic' },
});

export default ApplicationCard;
```

## `src/components/CompanyCard.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Company } from '../types';

interface Props {
  company: Company;
  onPress?: () => void;
  rightAction?: React.ReactNode;
}

const CompanyCard: React.FC<Props> = ({ company, onPress, rightAction }) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="business" size={20} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{company.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {company.industry} â€¢ {company.location}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {company.contactPerson} â€¢ {company.phone}
          </Text>
        </View>
        {rightAction}
      </View>
      {company.description ? (
        <Text style={styles.desc} numberOfLines={2}>{company.description}</Text>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center', alignItems: 'center',
  },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  desc: {
    fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});

export default CompanyCard;
```

## `src/components/ConfirmDialog.tsx`

```tsx
// Dialog konfirmasi (memakai Modal bawaan React Native)
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  visible,
  title,
  message,
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  confirmColor = COLORS.primary,
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: COLORS.border }]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={[styles.btnText, { color: COLORS.text }]}>{cancelLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: confirmColor, opacity: loading ? 0.6 : 1 }]}
            onPress={onConfirm}
            disabled={loading}
          >
            <Text style={[styles.btnText, { color: COLORS.surface }]}>
              {loading ? 'Memproses...' : confirmLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.lg, gap: SPACING.sm },
  btn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 90,
    alignItems: 'center',
  },
  btnText: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
});

export default ConfirmDialog;
```

## `src/components/DailyLogCard.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { DailyLog } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  log: DailyLog;
  studentName?: string;
  onPress?: () => void;
  showComment?: boolean;
}

const DailyLogCard: React.FC<Props> = ({ log, studentName, onPress, showComment = true }) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.date}>{toDateString(log.date)}</Text>
        <StatusBadge status={log.reviewStatus} />
      </View>
      {studentName ? (
        <Text style={styles.studentName} numberOfLines={1}>{studentName}</Text>
      ) : null}
      <View style={styles.typeRow}>
        <Ionicons name="pricetag-outline" size={12} color={COLORS.primary} />
        <Text style={styles.type}>{log.activityType}</Text>
      </View>
      <Text style={styles.desc} numberOfLines={2}>{log.description}</Text>
      {showComment && log.supervisorComment ? (
        <View style={styles.comment}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.commentText} numberOfLines={2}>
            {log.supervisorComment}
          </Text>
        </View>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  date: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  studentName: {
    fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600', marginTop: 4,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  type: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  comment: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.xs, paddingTop: SPACING.xs,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  commentText: {
    flex: 1, fontSize: FONT_SIZE.xs,
    color: COLORS.primary, fontStyle: 'italic',
  },
});

export default DailyLogCard;
```

## `src/components/EmptyState.tsx`

```tsx
// Tampilan empty state reusable
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

const EmptyState: React.FC<Props> = ({ icon = 'document-outline', title, message }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={56} color={COLORS.disabled} />
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: SPACING.xl },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.disabled,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default EmptyState;
```

## `src/components/EvaluationCard.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Evaluation } from '../types';

interface Props {
  evaluation: Evaluation;
  studentName?: string;
  onPress?: () => void;
  compact?: boolean;
}

const EvaluationCard: React.FC<Props> = ({ evaluation, studentName, onPress, compact = false }) => {
  const Container: any = onPress ? TouchableOpacity : View;

  if (compact) {
    return (
      <Container style={styles.compactCard} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName} numberOfLines={1}>
            {studentName ?? 'Mahasiswa'}
          </Text>
          <Text style={styles.meta}>
            {evaluation.isFinal ? 'Final' : 'Draf'}
          </Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{evaluation.finalScore.toFixed(1)}</Text>
        </View>
      </Container>
    );
  }

  const rows = [
    { label: 'Kedisiplinan', value: evaluation.discipline },
    { label: 'Tanggung Jawab', value: evaluation.responsibility },
    { label: 'Komunikasi', value: evaluation.communication },
    { label: 'Kerja Sama', value: evaluation.teamwork },
    { label: 'Kompetensi Teknis', value: evaluation.technicalSkill },
  ];

  return (
    <Container style={styles.card} onPress={onPress}>
      {studentName ? (
        <Text style={styles.headerName} numberOfLines={1}>{studentName}</Text>
      ) : null}
      <View style={styles.scoreRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.scoreLabel}>Nilai Akhir</Text>
          <Text style={styles.scoreValue}>{evaluation.finalScore.toFixed(2)}</Text>
        </View>
        <View style={[styles.statusPill, {
          backgroundColor: evaluation.isFinal ? `${COLORS.green}15` : `${COLORS.orange}15`,
        }]}>
          <Ionicons
            name={evaluation.isFinal ? 'checkmark-circle' : 'time-outline'}
            size={12}
            color={evaluation.isFinal ? COLORS.green : COLORS.orange}
          />
          <Text style={[styles.statusPillText, {
            color: evaluation.isFinal ? COLORS.green : COLORS.orange,
          }]}>
            {evaluation.isFinal ? 'Final' : 'Draf'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        {rows.map((r) => (
          <View key={r.label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{r.label}</Text>
            <Text style={styles.detailValue}>{r.value}</Text>
          </View>
        ))}
      </View>

      {evaluation.notes ? (
        <View style={styles.notesBox}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.notesText} numberOfLines={3}>{evaluation.notes}</Text>
        </View>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  headerName: {
    fontSize: FONT_SIZE.md, fontWeight: '700',
    color: COLORS.text, marginBottom: SPACING.xs,
  },
  studentName: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  scoreLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  scoreValue: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.primary },
  scoreBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  scoreBadgeText: { color: COLORS.surface, fontWeight: '800', fontSize: FONT_SIZE.md },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full,
  },
  statusPillText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  detailsBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border, paddingTop: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  detailValue: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.text },
  notesBox: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.sm, paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  notesText: {
    flex: 1, fontSize: FONT_SIZE.xs,
    color: COLORS.primary, fontStyle: 'italic',
  },
});

export default EvaluationCard;
```

## `src/components/InternshipCard.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Internship } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  internship: Internship;
  companyName?: string;
  supervisorName?: string;
  studentName?: string;
  progress?: number | null;
  onPress?: () => void;
}

const InternshipCard: React.FC<Props> = ({
  internship,
  companyName,
  supervisorName,
  studentName,
  progress,
  onPress,
}) => {
  const Container: any = onPress ? TouchableOpacity : View;
  const pct = progress === null || progress === undefined ? null : Math.min(100, Math.max(0, progress));
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {companyName ?? internship.topic}
        </Text>
        <StatusBadge status={internship.status} />
      </View>
      {studentName ? <Text style={styles.meta}>{studentName}</Text> : null}
      {supervisorName ? <Text style={styles.meta}>Pembimbing: {supervisorName}</Text> : null}
      <Text style={styles.meta}>
        {toDateString(internship.startDate)} â€” {toDateString(internship.endDate)}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>Topik: {internship.topic}</Text>

      <View style={styles.progressRow}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${pct ?? 0}%`,
                backgroundColor: pct === null
                  ? COLORS.disabled
                  : pct >= 100 ? COLORS.green : pct >= 50 ? COLORS.accent : COLORS.orange,
              },
            ]}
          />
        </View>
        <Text style={styles.pctText}>{pct === null ? 'â€”' : `${pct.toFixed(0)}%`}</Text>
      </View>
      <View style={styles.footerRow}>
        <Ionicons name="flag-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.meta}>Target {internship.targetDays} hari</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginTop: SPACING.sm,
  },
  barBg: {
    flex: 1, height: 6, backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  pctText: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.primary },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
});

export default InternshipCard;
```

## `src/components/LoadingView.tsx`

```tsx
// Loading state
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

interface Props {
  message?: string;
}

const LoadingView: React.FC<Props> = ({ message = 'Memuat data...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  text: { marginTop: SPACING.md, color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
});

export default LoadingView;
```

## `src/components/ProgressCard.tsx`

```tsx
// Kartu progress bar untuk menampilkan persentase
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  progress: number | null;
  detail?: string;
}

const ProgressCard: React.FC<Props> = ({ title, subtitle, progress, detail }) => {
  const pct = progress ?? 0;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.pct}>
          {progress === null ? 'â€”' : `${clamped.toFixed(1)}%`}
        </Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${clamped}%`,
              backgroundColor:
                clamped >= 100 ? COLORS.green : clamped >= 50 ? COLORS.accent : COLORS.orange,
            },
          ]}
        />
      </View>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  pct: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  barBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  detail: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
});

export default ProgressCard;
```

## `src/components/StatCard.tsx`

```tsx
// Kartu statistik berwarna untuk dashboard
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const StatCard: React.FC<Props> = ({ label, value, icon, color = COLORS.primary }) => (
  <View style={[styles.container, { backgroundColor: color }]}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={22} color={COLORS.surface} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label} numberOfLines={2}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  value: { color: COLORS.surface, fontSize: FONT_SIZE.xxl, fontWeight: '800' },
  label: { color: 'rgba(255,255,255,0.9)', fontSize: FONT_SIZE.sm, marginTop: 2 },
});

export default StatCard;
```

## `src/components/StatusBadge.tsx`

```tsx
// Badge status: pengajuan, review, magang
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  status: string;
  label?: string;
}

const colorFor = (status: string): string => {
  switch (status) {
    case 'pending':
    case 'pending_review':
      return COLORS.orange;
    case 'approved':
      return COLORS.green;
    case 'rejected':
    case 'needs_revision':
      return COLORS.red;
    case 'ongoing':
      return COLORS.accent;
    case 'completed':
      return COLORS.primary;
    default:
      return COLORS.textSecondary;
  }
};

const labelFor = (status: string): string => {
  switch (status) {
    case 'pending': return 'Menunggu';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    case 'pending_review': return 'Menunggu Review';
    case 'needs_revision': return 'Perlu Revisi';
    case 'ongoing': return 'Berlangsung';
    case 'completed': return 'Selesai';
    default: return status;
  }
};

const StatusBadge: React.FC<Props> = ({ status, label }) => {
  const color = colorFor(status);
  return (
    <View style={[styles.container, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label ?? labelFor(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
});

export default StatusBadge;
```

## `src/constants/theme.ts`

```tsx
// Konstanta tema: warna, spacing, tipografi, dan status
export const COLORS = {
  primary: '#1A237E',        // Biru tua
  primaryLight: '#3949AB',
  accent: '#00B0FF',         // Biru terang
  purple: '#7C4DFF',
  green: '#00C853',
  orange: '#FF6D00',
  red: '#D50000',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
} as const;
```

## `src/contexts/AuthContext.tsx`

```tsx
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  login as svcLogin,
  logout as svcLogout,
  resetPassword as svcResetPassword,
  observeAuthState,
  loadUserProfile,
} from '../services/authService';
import { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  initializing: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Retry dengan exponential backoff â€” menangani error transien dari Firestore
// (misal rules baru dipublikasikan, sesi auth token belum selesai disinkronkan).
const loadProfileWithRetry = async (
  uid: string,
  maxRetries = 3
): Promise<AppUser | null> => {
  let lastError: any = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadUserProfile(uid);
    } catch (e) {
      lastError = e;
      if (i < maxRetries - 1) {
        // 300ms, 600ms sebelum percobaan berikutnya
        await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
      }
    }
  }
  throw lastError;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthState = useCallback(async (user: FirebaseUser | null) => {
    setFirebaseUser(user);
    setAuthError(null);

    if (!user) {
      setAppUser(null);
      setInitializing(false);
      return;
    }

    // PERBAIKAN UTAMA: set initializing = true saat fetch profil.
    // Ini mencegah RootNavigator menampilkan BlockedScreen pada frame
    // di antara setFirebaseUser() dan setAppUser() selesai.
    setInitializing(true);

    try {
      const profile = await loadProfileWithRetry(user.uid);
      if (!profile) {
        setAuthError('Profil tidak ditemukan di Firestore.');
        setAppUser(null);
      } else if (profile.status !== 'active') {
        setAuthError('Akun tidak aktif. Hubungi admin.');
        setAppUser(null);
      } else {
        setAppUser(profile);
        setAuthError(null);
      }
    } catch (e: any) {
      setAuthError(e?.message ?? 'Gagal memuat profil');
      setAppUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = observeAuthState(handleAuthState);
    return () => unsub();
  }, [handleAuthState]);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    await svcLogin(email, password);
  };

  const logout = async () => {
    await svcLogout();
    setAppUser(null);
    setFirebaseUser(null);
    setAuthError(null);
  };

  const resetPassword = async (email: string) => {
    await svcResetPassword(email);
  };

  const refreshProfile = async () => {
    if (!firebaseUser) return;
    try {
      const profile = await loadUserProfile(firebaseUser.uid);
      setAppUser(profile);
    } catch {
      // diamkan
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        initializing,
        authError,
        login,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## `src/hooks/useAuth.ts`

```tsx
// Hook akses AuthContext
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};
```

## `src/hooks/useFirestoreData.ts`

```tsx
// Hook generik untuk fetch data Firestore (one-time)
import { useEffect, useState, useCallback } from 'react';

export interface FirestoreDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFirestoreData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): FirestoreDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message ?? 'Terjadi kesalahan');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, refresh };
}
```

## `src/navigation/AdminNavigator.tsx`

```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminStackParamList, AdminTabParamList } from './types';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import CompanyManagementScreen from '../screens/admin/CompanyManagementScreen';
import CompanyFormScreen from '../screens/admin/CompanyFormScreen';
import ApplicationManagementScreen from '../screens/admin/ApplicationManagementScreen';
import ApplicationReviewScreen from '../screens/admin/ApplicationReviewScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

const tabIcon = (
  focused: boolean,
  name: keyof typeof Ionicons.glyphMap,
  outlined: keyof typeof Ionicons.glyphMap
) => (
  <Ionicons
    name={focused ? name : outlined}
    size={22}
    color={focused ? COLORS.primary : COLORS.textSecondary}
  />
);

// Tab navigator untuk menu utama admin
const AdminTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'grid', 'grid-outline'),
      }}
    />
    <Tab.Screen
      name="UserManagement"
      component={UserManagementScreen}
      options={{
        title: 'Pengguna',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'people', 'people-outline'),
      }}
    />
    <Tab.Screen
      name="CompanyManagement"
      component={CompanyManagementScreen}
      options={{
        title: 'Perusahaan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'business', 'business-outline'),
      }}
    />
    <Tab.Screen
      name="ApplicationManagement"
      component={ApplicationManagementScreen}
      options={{
        title: 'Pengajuan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'document-text', 'document-text-outline'),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'person-circle', 'person-circle-outline'),
      }}
    />
  </Tab.Navigator>
);

// Stack navigator â€” membungkus tabs + screen tambahan (form, detail, review)
const AdminNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminTabs" component={AdminTabs} />
    <Stack.Screen name="CompanyForm" component={CompanyFormScreen} />
    <Stack.Screen name="ApplicationReview" component={ApplicationReviewScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default AdminNavigator;
```

## `src/navigation/RootNavigator.tsx`

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AdminNavigator from './AdminNavigator';
import StudentNavigator from './StudentNavigator';
import SupervisorNavigator from './SupervisorNavigator';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Splash screen: ditampilkan saat inisialisasi Auth ATAU saat fetch profil
const SplashScreen: React.FC = () => (
  <View style={styles.splash}>
    <View style={styles.logoCircle}>
      <Ionicons name="school" size={48} color={COLORS.surface} />
    </View>
    <Text style={styles.splashTitle}>PPNP Internship Tracker</Text>
    <ActivityIndicator color={COLORS.surface} style={{ marginTop: SPACING.lg }} />
  </View>
);

// Blocked screen: hanya muncul jika profil benar-benar tidak valid
const BlockedScreen: React.FC<{ message: string | null; onLogout: () => void }> = ({
  message,
  onLogout,
}) => (
  <View style={styles.blocked}>
    <Ionicons name="alert-circle" size={72} color={COLORS.red} />
    <Text style={styles.blockedTitle}>Akses Ditolak</Text>
    <Text style={styles.blockedMsg}>
      {message ?? 'Profil pengguna tidak ditemukan atau tidak aktif. Hubungi administrator.'}
    </Text>
    <TouchableOpacity style={styles.blockedBtn} onPress={onLogout}>
      <Ionicons name="log-out-outline" size={18} color={COLORS.surface} />
      <Text style={styles.blockedBtnText}>Keluar</Text>
    </TouchableOpacity>
  </View>
);

const RootNavigator: React.FC = () => {
  const { firebaseUser, appUser, initializing, authError, logout } = useAuth();

  // (1) Loading awal ATAU sedang fetch profil â†’ Splash
  if (initializing) {
    return <SplashScreen />;
  }

  // (2) Sudah login Firebase tapi profil belum siap
  if (firebaseUser && !appUser) {
    // Ada error eksplisit â†’ Blocked
    if (authError) {
      return <BlockedScreen message={authError} onLogout={logout} />;
    }
    // Belum ada error tapi profil belum ada â†’ masih memuat (jangan tampilkan Blocked)
    return <SplashScreen />;
  }

  // (3) Belum login â†’ Auth Stack (Login / Register / Forgot Password)
  if (!appUser) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  // (4) Login valid â†’ Role-based navigator
  switch (appUser.role) {
    case 'admin':
      return <AdminNavigator />;
    case 'student':
      return <StudentNavigator />;
    case 'supervisor':
      return <SupervisorNavigator />;
    default:
      return (
        <BlockedScreen
          message={`Role "${String(appUser.role)}" tidak dikenal.`}
          onLogout={logout}
        />
      );
  }
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  splashTitle: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginTop: SPACING.md,
  },
  blocked: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  blockedTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  blockedMsg: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  blockedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.lg,
  },
  blockedBtnText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});

export default RootNavigator;
```

## `src/navigation/StudentNavigator.tsx`

```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StudentStackParamList, StudentTabParamList } from './types';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import CompanyListScreen from '../screens/student/CompanyListScreen';
import MyInternshipScreen from '../screens/student/MyInternshipScreen';
import DailyLogScreen from '../screens/student/DailyLogScreen';
import MyEvaluationScreen from '../screens/student/MyEvaluationScreen';
import InternshipApplicationScreen from '../screens/student/InternshipApplicationScreen';
import DailyLogFormScreen from '../screens/student/DailyLogFormScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createNativeStackNavigator<StudentStackParamList>();

const tabIcon = (
  focused: boolean,
  name: keyof typeof Ionicons.glyphMap,
  outlined: keyof typeof Ionicons.glyphMap
) => (
  <Ionicons
    name={focused ? name : outlined}
    size={22}
    color={focused ? COLORS.primary : COLORS.textSecondary}
  />
);

// Tab navigator untuk menu utama mahasiswa
const StudentTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="StudentDashboard"
      component={StudentDashboardScreen}
      options={{
        title: 'Beranda',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'home', 'home-outline'),
      }}
    />
    <Tab.Screen
      name="CompanyList"
      component={CompanyListScreen}
      options={{
        title: 'Perusahaan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'business', 'business-outline'),
      }}
    />
    <Tab.Screen
      name="MyInternship"
      component={MyInternshipScreen}
      options={{
        title: 'Magang',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'briefcase', 'briefcase-outline'),
      }}
    />
    <Tab.Screen
      name="DailyLog"
      component={DailyLogScreen}
      options={{
        title: 'Jurnal',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'document-text', 'document-text-outline'),
      }}
    />
    <Tab.Screen
      name="MyEvaluation"
      component={MyEvaluationScreen}
      options={{
        title: 'Nilai',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'ribbon', 'ribbon-outline'),
      }}
    />
  </Tab.Navigator>
);

// Stack navigator â€” form & detail di atas tabs
const StudentNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentTabs" component={StudentTabs} />
    <Stack.Screen name="InternshipApplication" component={InternshipApplicationScreen} />
    <Stack.Screen name="DailyLogForm" component={DailyLogFormScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default StudentNavigator;
```

## `src/navigation/SupervisorNavigator.tsx`

```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SupervisorStackParamList, SupervisorTabParamList } from './types';
import SupervisorDashboardScreen from '../screens/supervisor/SupervisorDashboardScreen';
import SupervisedStudentsScreen from '../screens/supervisor/SupervisedStudentsScreen';
import LogReviewScreen from '../screens/supervisor/LogReviewScreen';
import EvaluationFormScreen from '../screens/supervisor/EvaluationFormScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<SupervisorTabParamList>();
const Stack = createNativeStackNavigator<SupervisorStackParamList>();

const tabIcon = (
  focused: boolean,
  name: keyof typeof Ionicons.glyphMap,
  outlined: keyof typeof Ionicons.glyphMap
) => (
  <Ionicons
    name={focused ? name : outlined}
    size={22}
    color={focused ? COLORS.primary : COLORS.textSecondary}
  />
);

// Tab navigator untuk menu utama pembimbing
const SupervisorTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="SupervisorDashboard"
      component={SupervisorDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'grid', 'grid-outline'),
      }}
    />
    <Tab.Screen
      name="SupervisedStudents"
      component={SupervisedStudentsScreen}
      options={{
        title: 'Mahasiswa',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'people', 'people-outline'),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'person-circle', 'person-circle-outline'),
      }}
    />
  </Tab.Navigator>
);

// Stack navigator â€” review & evaluasi di atas tabs
const SupervisorNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SupervisorTabs" component={SupervisorTabs} />
    <Stack.Screen name="LogReview" component={LogReviewScreen} />
    <Stack.Screen name="EvaluationForm" component={EvaluationFormScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default SupervisorNavigator;
```

## `src/navigation/types.ts`

```tsx
// ============================================================
// Tipe param list untuk seluruh navigator
// ============================================================

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  CompanyForm: { companyId?: string } | undefined;
  ApplicationReview: { applicationId: string };
  AdminReport: undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
  Profile: undefined;
};

export type StudentStackParamList = {
  StudentTabs: undefined;
  InternshipApplication: undefined;
  DailyLogForm: { logId?: string } | undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
};

export type SupervisorStackParamList = {
  SupervisorTabs: undefined;
  LogReview: { logId: string };
  EvaluationForm: { internshipId: string; studentId: string };
  SupervisorReport: undefined;
  InternshipDetail: { internshipId: string };
  DailyLogDetail: { logId: string };
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  CompanyManagement: undefined;
  ApplicationManagement: undefined;
  Profile: undefined;
};

export type StudentTabParamList = {
  StudentDashboard: undefined;
  CompanyList: undefined;
  MyInternship: undefined;
  DailyLog: undefined;
  MyEvaluation: undefined;
};

export type SupervisorTabParamList = {
  SupervisorDashboard: undefined;
  SupervisedStudents: undefined;
  Profile: undefined;
};
```

## `src/screens/admin/AdminDashboardScreen.tsx`

```tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAdminStats, AdminStats } from '../../services/dashboardService';
import { listAllApplications } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication } from '../../types';
import { toDateString } from '../../utils/dateUtils';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [s, apps] = await Promise.all([getAdminStats(), listAllApplications()]);
      setStats(s);
      setRecentApps(apps.slice(0, 5));
    } catch (e: any) {
      setError(e?.message ?? 'Gagal memuat dashboard');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Dashboard Admin" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard Admin" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser?.name?.split(' ')[0] ?? 'Admin'} ðŸ‘‹</Text>
          <Text style={styles.greetingSub}>Ringkasan monitoring magang PPNP</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {stats ? (
          <>
            <View style={styles.rowWrap}>
              <StatCard label="Mahasiswa" value={stats.totalStudents} icon="people" color={COLORS.primary} />
              <StatCard label="Perusahaan" value={stats.totalCompanies} icon="business" color={COLORS.purple} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Pengajuan Menunggu" value={stats.pendingApplications} icon="hourglass" color={COLORS.orange} />
              <StatCard label="Disetujui" value={stats.approvedApplications} icon="checkmark-done" color={COLORS.green} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Magang Aktif" value={stats.ongoingInternships} icon="briefcase" color={COLORS.accent} />
              <StatCard label="Magang Selesai" value={stats.completedInternships} icon="trophy" color={COLORS.primaryLight} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Total Jurnal" value={stats.totalLogs} icon="document-text" color={COLORS.primary} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistik Program Studi</Text>
              <View style={styles.card}>
                {Object.keys(stats.studyProgramStats).length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada data.</Text>
                ) : (
                  Object.entries(stats.studyProgramStats).map(([prog, count]) => (
                    <View key={prog} style={styles.statRow}>
                      <Text style={styles.statLabel}>{prog}</Text>
                      <Text style={styles.statValue}>{count}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Pengajuan Terbaru</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminTabs')}
              style={{ display: 'none' }}
            />
          </View>
          {recentApps.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Belum ada pengajuan.</Text>
            </View>
          ) : (
            recentApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ApplicationReview', { applicationId: app.id })
                }
              >
                <View style={styles.row}>
                  <Text style={styles.topic} numberOfLines={1}>
                    {app.topic}
                  </Text>
                  <StatusBadge status={app.status} />
                </View>
                <Text style={styles.meta}>
                  Periode: {toDateString(app.startDate)} â€” {toDateString(app.endDate)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  greeting: { marginBottom: SPACING.md },
  greetingTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  greetingSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  section: { marginTop: SPACING.md },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  topic: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomColor: COLORS.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  statValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.red}10`,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  errorText: { color: COLORS.red, fontSize: FONT_SIZE.xs, flex: 1 },
});

export default AdminDashboardScreen;
```

## `src/screens/admin/AdminReportScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import EvaluationCard from '../../components/EvaluationCard';
import { getAdminStats, AdminStats } from '../../services/dashboardService';
import { listAllApplications } from '../../services/applicationService';
import { listAllInternships } from '../../services/internshipService';
import {
  listAllEvaluations,
  EvaluationWithStudent,
} from '../../services/evaluationService';
import {
  applicationStatusLabel,
  internshipStatusLabel,
} from '../../utils/workflowUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

type PeriodFilter = 'all' | '3months' | '6months' | 'year';

const AdminReportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appStats, setAppStats] = useState<Record<string, number>>({});
  const [intStats, setIntStats] = useState<Record<string, number>>({});
  const [evaluations, setEvaluations] = useState<EvaluationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const load = useCallback(async () => {
    try {
      const [s, apps, ints, evals] = await Promise.all([
        getAdminStats(),
        listAllApplications(),
        listAllInternships(),
        listAllEvaluations(),
      ]);
      setStats(s);

      const appMap: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
      apps.forEach((a) => {
        appMap[a.status] = (appMap[a.status] ?? 0) + 1;
      });
      setAppStats(appMap);

      const intMap: Record<string, number> = { ongoing: 0, completed: 0 };
      ints.forEach((i) => {
        intMap[i.status] = (intMap[i.status] ?? 0) + 1;
      });
      setIntStats(intMap);

      setEvaluations(evals);
    } catch {
      // diamkan; tetap tampilkan layout kosong
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // Filter periode berdasarkan publishedAt / createdAt evaluasi
  const filteredEvaluations = useMemo(() => {
    if (period === 'all') return evaluations;
    const now = new Date();
    const monthsBack =
      period === '3months' ? 3 : period === '6months' ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    return evaluations.filter((e) => {
      const ts = e.publishedAt ?? e.createdAt;
      if (!ts) return false;
      return ts.toDate() >= cutoff;
    });
  }, [evaluations, period]);

  const finalEvaluations = useMemo(
    () => filteredEvaluations.filter((e) => e.isFinal),
    [filteredEvaluations]
  );

  const averageScore = useMemo(() => {
    if (finalEvaluations.length === 0) return null;
    const sum = finalEvaluations.reduce((acc, e) => acc + e.finalScore, 0);
    return Math.round((sum / finalEvaluations.length) * 100) / 100;
  }, [finalEvaluations]);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Laporan & Statistik" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  const periodBtn = (key: PeriodFilter, label: string) => (
    <TouchableOpacity
      key={key}
      onPress={() => setPeriod(key)}
      style={[styles.periodBtn, period === key && styles.periodBtnActive]}
    >
      <Text style={[styles.periodText, period === key && styles.periodTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Laporan & Statistik" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Filter Periode */}
        <Text style={styles.sectionLabel}>Filter Periode Penilaian</Text>
        <View style={styles.periodRow}>
          {periodBtn('all', 'Semua')}
          {periodBtn('3months', '3 Bulan')}
          {periodBtn('6months', '6 Bulan')}
          {periodBtn('year', '1 Tahun')}
        </View>

        {/* Ringkasan Global */}
        <Text style={styles.sectionLabel}>Ringkasan</Text>
        <View style={styles.rowWrap}>
          <StatCard
            label="Total Mahasiswa"
            value={stats?.totalStudents ?? 0}
            icon="people"
            color={COLORS.primary}
          />
          <StatCard
            label="Total Perusahaan"
            value={stats?.totalCompanies ?? 0}
            icon="business"
            color={COLORS.purple}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Magang Aktif"
            value={stats?.ongoingInternships ?? 0}
            icon="briefcase"
            color={COLORS.accent}
          />
          <StatCard
            label="Magang Selesai"
            value={stats?.completedInternships ?? 0}
            icon="trophy"
            color={COLORS.primaryLight}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Total Jurnal"
            value={stats?.totalLogs ?? 0}
            icon="document-text"
            color={COLORS.green}
          />
          <StatCard
            label="Nilai Rata-rata"
            value={averageScore === null ? 'â€”' : averageScore.toFixed(1)}
            icon="ribbon"
            color={COLORS.orange}
          />
        </View>

        {/* Statistik Program Studi */}
        <Text style={styles.sectionLabel}>Statistik Program Studi</Text>
        <View style={styles.card}>
          {!stats || Object.keys(stats.studyProgramStats).length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data.</Text>
          ) : (
            Object.entries(stats.studyProgramStats).map(([prog, count]) => (
              <View key={prog} style={styles.statRow}>
                <Text style={styles.statLabel}>{prog}</Text>
                <Text style={styles.statValue}>{count}</Text>
              </View>
            ))
          )}
        </View>

        {/* Statistik Status Pengajuan */}
        <Text style={styles.sectionLabel}>Statistik Status Pengajuan</Text>
        <View style={styles.card}>
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <View key={s} style={styles.statRow}>
              <Text style={styles.statLabel}>{applicationStatusLabel(s)}</Text>
              <Text style={styles.statValue}>{appStats[s] ?? 0}</Text>
            </View>
          ))}
        </View>

        {/* Statistik Status Magang */}
        <Text style={styles.sectionLabel}>Statistik Status Magang</Text>
        <View style={styles.card}>
          {(['ongoing', 'completed'] as const).map((s) => (
            <View key={s} style={styles.statRow}>
              <Text style={styles.statLabel}>{internshipStatusLabel(s)}</Text>
              <Text style={styles.statValue}>{intStats[s] ?? 0}</Text>
            </View>
          ))}
        </View>

        {/* Rekap Penilaian */}
        <Text style={styles.sectionLabel}>
          Rekap Penilaian Final ({finalEvaluations.length})
        </Text>
        {finalEvaluations.length === 0 ? (
          <EmptyState
            icon="ribbon-outline"
            title="Belum ada penilaian final"
            message="Penilaian yang difinalisasi akan muncul di sini."
          />
        ) : (
          finalEvaluations.map((e) => (
            <EvaluationCard
              key={e.id}
              evaluation={e}
              studentName={e.studentName}
              compact
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONT_SIZE.xs, color: COLORS.textSecondary,
    fontWeight: '700', textTransform: 'uppercase',
    marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  statValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center' },
  periodRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs,
  },
  periodBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
  },
  periodBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  periodTextActive: { color: COLORS.surface },
});

export default AdminReportScreen;
```

## `src/screens/admin/ApplicationManagementScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { listAllApplications } from '../../services/applicationService';
import { listAllUsers } from '../../services/userService';
import { listCompanies } from '../../services/companyService';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication, AppUser, Company } from '../../types';
import { toDateString } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';

type Nav = NativeStackNavigationProp<AdminStackParamList>;
type Filter = 'all' | 'pending' | 'approved' | 'rejected';

const ApplicationManagementScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { logout } = useAuth();

  const [apps, setApps] = useState<InternshipApplication[]>([]);
  const [students, setStudents] = useState<Record<string, AppUser>>({});
  const [companies, setCompanies] = useState<Record<string, Company>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const [applications, users, comps] = await Promise.all([
        listAllApplications(),
        listAllUsers(),
        listCompanies(),
      ]);
      setApps(applications);
      const sMap: Record<string, AppUser> = {};
      users.forEach((u) => {
        sMap[u.uid] = u;
      });
      setStudents(sMap);
      const cMap: Record<string, Company> = {};
      comps.forEach((c) => {
        cMap[c.id] = c;
      });
      setCompanies(cMap);
    } catch (e: any) {
      Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        const student = students[a.studentId];
        const company = companies[a.companyId];
        return (
          (student?.name ?? '').toLowerCase().includes(s) ||
          (company?.name ?? '').toLowerCase().includes(s) ||
          (a.topic ?? '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [apps, filter, search, students, companies]);

  const renderFilterBtn = (key: Filter, label: string) => (
    <TouchableOpacity
      onPress={() => setFilter(key)}
      style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
    >
      <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Pengajuan Magang" rightIcon="log-out-outline" onRightPress={logout} />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari mahasiswa / perusahaan / topik"
              placeholderTextColor={COLORS.disabled}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              {renderFilterBtn('all', 'Semua')}
              {renderFilterBtn('pending', 'Menunggu')}
              {renderFilterBtn('approved', 'Disetujui')}
              {renderFilterBtn('rejected', 'Ditolak')}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState icon="document-text-outline" title="Tidak ada pengajuan" />
          ) : (
            filtered.map((a) => {
              const student = students[a.studentId];
              const company = companies[a.companyId];
              return (
                <TouchableOpacity
                  key={a.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('ApplicationReview', { applicationId: a.id })
                  }
                >
                  <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{a.topic}</Text>
                    <StatusBadge status={a.status} />
                  </View>
                  <Text style={styles.meta}>{student?.name ?? a.studentId} ({student?.nim ?? '-'})</Text>
                  <Text style={styles.meta}>{company?.name ?? a.companyId}</Text>
                  <Text style={styles.meta}>
                    {toDateString(a.startDate)} â€” {toDateString(a.endDate)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  name: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
});

export default ApplicationManagementScreen;
```

## `src/screens/admin/ApplicationReviewScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingView from '../../components/LoadingView';
import { getApplication, reviewApplication } from '../../services/applicationService';
import { listUsersByRole, fetchAppUser } from '../../services/userService';
import { getCompany } from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication, AppUser, Company } from '../../types';
import { toDateString } from '../../utils/dateUtils';

type Props = NativeStackScreenProps<AdminStackParamList, 'ApplicationReview'>;

const ApplicationReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { applicationId } = route.params;
  const { appUser } = useAuth();

  const [application, setApplication] = useState<InternshipApplication | null>(null);
  const [student, setStudent] = useState<AppUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisors, setSupervisors] = useState<AppUser[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const app = await getApplication(applicationId);
        if (!app) {
          Alert.alert('Tidak ditemukan', 'Pengajuan tidak ditemukan.');
          navigation.goBack();
          return;
        }
        setApplication(app);
        if (app.supervisorId) setSelectedSupervisor(app.supervisorId);

        const [s, c, sups] = await Promise.all([
          fetchAppUser(app.studentId),
          getCompany(app.companyId),
          listUsersByRole('supervisor'),
        ]);
        setStudent(s);
        setCompany(c);
        setSupervisors(sups);
      } catch (e: any) {
        Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    })();
  }, [applicationId, navigation]);

  const triggerDecision = (d: 'approved' | 'rejected') => {
    if (!application || application.status !== 'pending') return;
    if (d === 'approved' && !selectedSupervisor) {
      Alert.alert('Validasi', 'Pilih pembimbing kampus terlebih dahulu.');
      return;
    }
    setDecision(d);
    setConfirming(true);
  };

  const submitDecision = async () => {
    if (!application || !decision || !appUser) return;
    setSubmitting(true);
    try {
      await reviewApplication(
        application.id,
        decision,
        appUser.uid,
        notes.trim(),
        decision === 'approved' ? selectedSupervisor ?? undefined : undefined
      );
      setConfirming(false);
      Alert.alert(
        'Berhasil',
        decision === 'approved' ? 'Pengajuan disetujui.' : 'Pengajuan ditolak.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Pengajuan" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!application) return null;

  const isPending = application.status === 'pending';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Pengajuan" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>{application.topic}</Text>
              <StatusBadge status={application.status} />
            </View>
            <Text style={styles.meta}>Diajukan: {toDateString(application.createdAt)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mahasiswa</Text>
            <Text style={styles.text}>{student?.name ?? '-'}</Text>
            <Text style={styles.meta}>NIM: {student?.nim ?? '-'} â€¢ {student?.studyProgram ?? '-'}</Text>
            <Text style={styles.meta}>Email: {student?.email ?? '-'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Perusahaan</Text>
            <Text style={styles.text}>{company?.name ?? '-'}</Text>
            <Text style={styles.meta}>{company?.industry} â€¢ {company?.location}</Text>
            <Text style={styles.meta}>Kontak: {company?.contactPerson} ({company?.phone})</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Periode</Text>
            <Text style={styles.text}>{toDateString(application.startDate)} â€” {toDateString(application.endDate)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Deskripsi Rencana</Text>
            <Text style={styles.text}>{application.description}</Text>
            {application.proposalUrl ? (
              <Text style={[styles.meta, { color: COLORS.accent }]} numberOfLines={2}>
                Proposal: {application.proposalUrl}
              </Text>
            ) : null}
          </View>

          {application.status !== 'pending' && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Keputusan</Text>
              <Text style={styles.text}>
                {application.status === 'approved' ? 'Disetujui' : 'Ditolak'}
              </Text>
              {application.decisionNotes ? (
                <Text style={styles.meta}>Catatan: {application.decisionNotes}</Text>
              ) : null}
              {application.decidedAt ? (
                <Text style={styles.meta}>Tanggal: {toDateString(application.decidedAt)}</Text>
              ) : null}
            </View>
          )}

          {isPending && (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Pembimbing Kampus</Text>
                {supervisors.length === 0 ? (
                  <Text style={styles.meta}>Belum ada pembimbing terdaftar.</Text>
                ) : (
                  supervisors.map((s) => {
                    const active = selectedSupervisor === s.uid;
                    return (
                      <TouchableOpacity
                        key={s.uid}
                        style={[styles.supervisorRow, active && styles.supervisorRowActive]}
                        onPress={() => setSelectedSupervisor(s.uid)}
                      >
                        <Ionicons
                          name={active ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={active ? COLORS.primary : COLORS.textSecondary}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.text}>{s.name}</Text>
                          <Text style={styles.meta}>{s.studyProgram ?? '-'} â€¢ {s.email}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Catatan Keputusan</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Catatan untuk mahasiswa (opsional)"
                  placeholderTextColor={COLORS.disabled}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  editable={!submitting}
                />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: COLORS.red }]}
                  onPress={() => triggerDecision('rejected')}
                  disabled={submitting}
                >
                  <Ionicons name="close-circle" size={18} color={COLORS.surface} />
                  <Text style={styles.btnText}>Tolak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: COLORS.green }]}
                  onPress={() => triggerDecision('approved')}
                  disabled={submitting}
                >
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.surface} />
                  <Text style={styles.btnText}>Setujui</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirming}
        title={decision === 'approved' ? 'Setujui Pengajuan?' : 'Tolak Pengajuan?'}
        message={
          decision === 'approved'
            ? 'Pengajuan akan disetujui dan data magang aktif akan dibuat.'
            : 'Pengajuan akan ditolak dan disimpan sebagai riwayat.'
        }
        confirmLabel={decision === 'approved' ? 'Setujui' : 'Tolak'}
        confirmColor={decision === 'approved' ? COLORS.green : COLORS.red}
        loading={submitting}
        onConfirm={submitDecision}
        onCancel={() => setConfirming(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  supervisorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  supervisorRowActive: { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}08` },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    minHeight: 80,
    textAlignVertical: 'top',
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
  },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  btnText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default ApplicationReviewScreen;
```

## `src/screens/admin/CompanyFormScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import { getCompany, createCompany, updateCompany, isCompanyNameTaken } from '../../services/companyService';
import { isValidEmail, isNonEmpty } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'CompanyForm'>;

const CompanyFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const companyId = route.params?.companyId;
  const isEdit = !!companyId;
  const goBackToCompanies = () => {
    // CompanyForm dapat dibuka dari nested tab navigator. Saat screen ini
    // menjadi root (mis. deep link/hot reload), goBack tidak punya target.
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AdminTabs');
    }
  };

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      try {
        const c = await getCompany(companyId);
        if (c) {
          setName(c.name);
          setIndustry(c.industry);
          setLocation(c.location);
          setAddress(c.address);
          setContactPerson(c.contactPerson);
          setPhone(c.phone);
          setEmail(c.email);
          setDescription(c.description ?? '');
        }
      } catch (e: any) {
        Alert.alert('Gagal', e?.message ?? 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const validate = (): string | null => {
    if (!isNonEmpty(name)) return 'Nama perusahaan wajib diisi.';
    if (!isNonEmpty(industry)) return 'Bidang industri wajib diisi.';
    if (!isNonEmpty(location)) return 'Lokasi wajib diisi.';
    if (!isNonEmpty(address)) return 'Alamat wajib diisi.';
    if (!isNonEmpty(contactPerson)) return 'Kontak pembimbing industri wajib diisi.';
    if (!isNonEmpty(phone)) return 'Nomor telepon wajib diisi.';
    if (!isValidEmail(email)) return 'Email perusahaan tidak valid.';
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validasi', err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const taken = await isCompanyNameTaken(name, companyId);
      if (taken) {
        Alert.alert('Duplikat', 'Nama perusahaan sudah terdaftar.');
        return;
      }
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        location: location.trim(),
        address: address.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        description: description.trim() || undefined,
      };
      if (isEdit && companyId) {
        await updateCompany(companyId, payload);
      } else {
        await createCompany(payload);
      }
      goBackToCompanies();
    } catch (e: any) {
      Alert.alert('Gagal menyimpan', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    opts: { placeholder?: string; keyboardType?: any; multiline?: boolean } = {}
  ) => (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, opts.multiline && { height: 90, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={opts.placeholder}
        placeholderTextColor={COLORS.disabled}
        keyboardType={opts.keyboardType ?? 'default'}
        multiline={opts.multiline}
        editable={!submitting}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title={isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'} onBack={goBackToCompanies} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {renderField('Nama Perusahaan *', name, setName, { placeholder: 'PT Teknologi Indonesia' })}
            {renderField('Bidang Industri *', industry, setIndustry, { placeholder: 'Teknologi Informasi' })}
            {renderField('Lokasi *', location, setLocation, { placeholder: 'Kota/Kabupaten' })}
            {renderField('Alamat *', address, setAddress, { placeholder: 'Alamat lengkap', multiline: true })}
            {renderField('Kontak Pembimbing Industri *', contactPerson, setContactPerson, { placeholder: 'Nama PIC' })}
            {renderField('Nomor Telepon *', phone, setPhone, { placeholder: '08xx', keyboardType: 'phone-pad' })}
            {renderField('Email Perusahaan *', email, setEmail, { placeholder: 'hrd@perusahaan.com', keyboardType: 'email-address' })}
            {renderField('Deskripsi (Opsional)', description, setDescription, { placeholder: 'Deskripsi singkat perusahaan', multiline: true })}

            <TouchableOpacity
              style={[styles.submit, submitting && { opacity: 0.6 }]}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color={COLORS.surface} />
                  <Text style={styles.submitText}>Simpan</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 44,
  },
  submit: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  submitText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default CompanyFormScreen;

```

## `src/screens/admin/CompanyManagementScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { listCompanies, deleteCompany } from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { Company } from '../../types';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

const CompanyManagementScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { logout } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const c = await listCompanies();
      setCompanies(c);
    } catch (e: any) {
      Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const industries = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.industry && s.add(c.industry));
    return Array.from(s);
  }, [companies]);

  const filtered = useMemo(
    () =>
      companies.filter((c) => {
        if (industry && c.industry !== industry) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          return (
            c.name.toLowerCase().includes(s) ||
            c.location.toLowerCase().includes(s) ||
            c.industry.toLowerCase().includes(s)
          );
        }
        return true;
      }),
    [companies, industry, search]
  );

  const doDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCompany(confirmDelete.id);
      setConfirmDelete(null);
      await load();
    } catch (e: any) {
      Alert.alert('Gagal menghapus', e?.message ?? 'Perusahaan masih digunakan');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader
        title="Perusahaan"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('CompanyForm')}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari perusahaan"
                placeholderTextColor={COLORS.disabled}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {industries.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
                <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                  <TouchableOpacity
                    onPress={() => setIndustry(null)}
                    style={[styles.filterBtn, !industry && styles.filterBtnActive]}
                  >
                    <Text style={[styles.filterText, !industry && styles.filterTextActive]}>Semua</Text>
                  </TouchableOpacity>
                  {industries.map((ind) => (
                    <TouchableOpacity
                      key={ind}
                      onPress={() => setIndustry(ind)}
                      style={[styles.filterBtn, industry === ind && styles.filterBtnActive]}
                    >
                      <Text style={[styles.filterText, industry === ind && styles.filterTextActive]}>{ind}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {filtered.length === 0 ? (
              <EmptyState icon="business-outline" title="Belum ada perusahaan" message="Tambahkan perusahaan pertama." />
            ) : (
              filtered.map((c) => (
                <View key={c.id} style={styles.card}>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{c.name}</Text>
                      <Text style={styles.meta}>{c.industry} â€¢ {c.location}</Text>
                      <Text style={styles.meta} numberOfLines={1}>{c.email} â€¢ {c.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => navigation.navigate('CompanyForm', { companyId: c.id })}
                    >
                      <Ionicons name="create-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setConfirmDelete(c)}
                    >
                      <Ionicons name="trash-outline" size={14} color={COLORS.red} />
                      <Text style={[styles.actionText, { color: COLORS.red }]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('CompanyForm')}
          >
            <Ionicons name="add" size={26} color={COLORS.surface} />
          </TouchableOpacity>
        </>
      )}

      <ConfirmDialog
        visible={!!confirmDelete}
        title="Hapus Perusahaan?"
        message={`Perusahaan "${confirmDelete?.name ?? ''}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        confirmColor={COLORS.red}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 100 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default CompanyManagementScreen;
```

## `src/screens/admin/UserManagementScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { listAllUsers, adminUpdateUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AppUser, UserRole } from '../../types';

type Filter = 'all' | UserRole;

const UserManagementScreen: React.FC = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const u = await listAllUsers();
      setUsers(u);
    } catch (e: any) {
      Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filter !== 'all' && u.role !== filter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return (
          (u.name ?? '').toLowerCase().includes(s) ||
          (u.email ?? '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [users, filter, search]);

  const changeRole = (user: AppUser) => {
    Alert.alert(
      'Ubah Role',
      `Ubah role ${user.name} menjadi:`,
      [
        { text: 'Mahasiswa', onPress: () => applyRole(user.uid, 'student') },
        { text: 'Pembimbing', onPress: () => applyRole(user.uid, 'supervisor') },
        { text: 'Admin', onPress: () => applyRole(user.uid, 'admin') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const applyRole = async (uid: string, role: UserRole) => {
    try {
      await adminUpdateUser(uid, { role });
      await load();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Perubahan ditolak');
    }
  };

  const toggleStatus = async (user: AppUser) => {
    const next = user.status === 'active' ? 'inactive' : 'active';
    try {
      await adminUpdateUser(user.uid, { status: next });
      await load();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Perubahan ditolak');
    }
  };

  const renderFilterBtn = (key: Filter, label: string) => {
    const active = filter === key;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => setFilter(key)}
        style={[styles.filterBtn, active && styles.filterBtnActive]}
      >
        <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const roleLabel = (r: UserRole) =>
    r === 'admin' ? 'Admin' : r === 'student' ? 'Mahasiswa' : 'Pembimbing';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Kelola Pengguna" rightIcon="log-out-outline" onRightPress={logout} />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama atau email"
              placeholderTextColor={COLORS.disabled}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              {renderFilterBtn('all', 'Semua')}
              {renderFilterBtn('student', 'Mahasiswa')}
              {renderFilterBtn('supervisor', 'Pembimbing')}
              {renderFilterBtn('admin', 'Admin')}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState icon="people-outline" title="Tidak ada pengguna" />
          ) : (
            filtered.map((u) => (
              <View key={u.uid} style={styles.card}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{u.name}</Text>
                    <Text style={styles.meta}>{u.email}</Text>
                    <Text style={styles.meta}>{roleLabel(u.role)} â€¢ {u.studyProgram ?? '-'}</Text>
                  </View>
                  <StatusBadge
                    status={u.status === 'active' ? 'approved' : 'rejected'}
                    label={u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  />
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => changeRole(u)}>
                    <Ionicons name="swap-horizontal-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Ubah Role</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => toggleStatus(u)}>
                    <Ionicons
                      name={u.status === 'active' ? 'close-circle-outline' : 'checkmark-circle-outline'}
                      size={14}
                      color={u.status === 'active' ? COLORS.red : COLORS.green}
                    />
                    <Text style={[styles.actionText, { color: u.status === 'active' ? COLORS.red : COLORS.green }]}>
                      {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600' },
});

export default UserManagementScreen;
```

## `src/screens/auth/ForgotPasswordScreen.tsx`

```tsx
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const submit = async () => {
    if (!isValidEmail(email)) return Alert.alert('Email tidak valid');
    try {
      await resetPassword(email);
      Alert.alert('Berhasil', 'Tautan reset password telah dikirim.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error: any) { Alert.alert('Gagal', error?.message ?? 'Tidak dapat mengirim email reset.'); }
  };
  return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
    <Text>Lupa Password</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder="nama@email.com" autoCapitalize="none" keyboardType="email-address" />
    <Button title="Kirim tautan reset" onPress={submit} />
  </View>;
};
export default ForgotPasswordScreen;

```

## `src/screens/auth/LoginScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Email tidak valid.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (e: any) {
      const code: string = e?.code ?? '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setError('Email atau password salah.');
      } else if (code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else if (code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else {
        setError(e?.message ?? 'Login gagal.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={40} color={COLORS.surface} />
          </View>
          <Text style={styles.appName}>PPNP Internship Tracker</Text>
          <Text style={styles.tagline}>Sistem Monitoring Kegiatan Magang</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              placeholderTextColor={COLORS.disabled}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!submitting}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
              placeholderTextColor={COLORS.disabled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              editable={!submitting}
            />
            <TouchableOpacity onPress={() => setShowPass((v) => !v)} hitSlop={8}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonText}>Masuk</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotWrap}
            disabled={submitting}
          >
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerBtn}
            disabled={submitting}
          >
            <Ionicons name="person-add-outline" size={18} color={COLORS.primary} />
            <Text style={styles.registerText}>Daftar Akun Baru</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Â© PPNP Internship Tracker</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.primary },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoWrap: { alignItems: 'center', marginBottom: SPACING.xl },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  appName: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 44,
    gap: SPACING.sm,
  },
  input: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.md },
  error: {
    color: COLORS.red,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  forgotWrap: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SPACING.md,
  },
  registerText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  footer: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: SPACING.xl,
    fontSize: FONT_SIZE.xs,
  },
});

export default LoginScreen;
```

## `src/screens/auth/RegisterScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registerUser } from '../../services/authService';
import { isValidEmail, isValidPassword, isNonEmpty } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Role = 'student' | 'supervisor';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [nim, setNim] = useState('');
  const [nidn, setNidn] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!isNonEmpty(name)) return 'Nama lengkap wajib diisi.';
    if (!isValidEmail(email)) return 'Email tidak valid.';
    if (!isValidPassword(password)) return 'Password minimal 6 karakter.';
    if (password !== confirmPassword) return 'Konfirmasi password tidak cocok.';
    if (!isNonEmpty(studyProgram)) return 'Program studi wajib diisi.';

    if (role === 'student') {
      if (!isNonEmpty(nim)) return 'NIM wajib diisi.';
      const sem = Number(semester);
      if (!sem || sem < 1 || sem > 14) return 'Semester harus antara 1â€“14.';
    } else {
      if (!isNonEmpty(nidn)) return 'NIDN wajib diisi.';
    }
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      await registerUser(email, password, {
        name,
        role,
        phone,
        studyProgram,
        ...(role === 'student'
          ? { nim, semester: Number(semester) }
          : { nidn }),
      });
      // RootNavigator otomatis berpindah ke dashboard role setelah
      // AuthContext menerima event onAuthStateChanged. Tidak perlu navigate manual.
      Alert.alert(
        'Registrasi Berhasil',
        'Akun Anda telah dibuat. Selamat menggunakan aplikasi.',
        [{ text: 'OK' }]
      );
    } catch (e: any) {
      const code: string = e?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan login atau reset password.');
      } else if (code === 'auth/weak-password') {
        setError('Password terlalu lemah (minimal 6 karakter).');
      } else if (code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else if (code === 'permission-denied') {
        setError('Registrasi ditolak oleh server. Hubungi administrator.');
      } else {
        setError(e?.message ?? 'Registrasi gagal. Coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    opts: {
      placeholder?: string;
      keyboardType?: any;
      secure?: boolean;
      rightBtn?: React.ReactNode;
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    } = {}
  ) => (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={opts.placeholder}
          placeholderTextColor={COLORS.disabled}
          keyboardType={opts.keyboardType ?? 'default'}
          secureTextEntry={opts.secure}
          autoCapitalize={opts.autoCapitalize ?? 'words'}
          editable={!submitting}
        />
        {opts.rightBtn}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.surface} />
          <Text style={styles.backText}>Kembali ke Login</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={36} color={COLORS.surface} />
          </View>
          <Text style={styles.appName}>Daftar Akun</Text>
          <Text style={styles.tagline}>PPNP Internship Tracker</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Daftar Sebagai *</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
              onPress={() => setRole('student')}
              disabled={submitting}
            >
              <Ionicons
                name="school"
                size={16}
                color={role === 'student' ? COLORS.surface : COLORS.primary}
              />
              <Text
                style={[styles.roleText, role === 'student' && styles.roleTextActive]}
              >
                Mahasiswa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'supervisor' && styles.roleBtnActive]}
              onPress={() => setRole('supervisor')}
              disabled={submitting}
            >
              <Ionicons
                name="briefcase"
                size={16}
                color={role === 'supervisor' ? COLORS.surface : COLORS.primary}
              />
              <Text
                style={[styles.roleText, role === 'supervisor' && styles.roleTextActive]}
              >
                Pembimbing
              </Text>
            </TouchableOpacity>
          </View>

          {renderInput('Nama Lengkap *', name, setName, {
            placeholder: 'Nama sesuai KTP',
          })}

          {renderInput('Email *', email, setEmail, {
            placeholder: 'nama@email.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}

          {renderInput('Password *', password, setPassword, {
            placeholder: 'Minimal 6 karakter',
            secure: !showPass,
            autoCapitalize: 'none',
            rightBtn: (
              <TouchableOpacity onPress={() => setShowPass((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            ),
          })}

          {renderInput('Konfirmasi Password *', confirmPassword, setConfirmPassword, {
            placeholder: 'Ulangi password',
            secure: !showPass,
            autoCapitalize: 'none',
          })}

          {renderInput('Program Studi *', studyProgram, setStudyProgram, {
            placeholder: 'Teknologi Rekayasa Komputer',
          })}

          {role === 'student' ? (
            <>
              {renderInput('NIM *', nim, setNim, {
                placeholder: '2024001',
                autoCapitalize: 'none',
              })}
              {renderInput('Semester *', semester, setSemester, {
                placeholder: '1 - 14',
                keyboardType: 'numeric',
                autoCapitalize: 'none',
              })}
            </>
          ) : (
            renderInput('NIDN *', nidn, setNidn, {
              placeholder: '0012345678',
              keyboardType: 'numeric',
              autoCapitalize: 'none',
            })
          )}

          {renderInput('Nomor Telepon (Opsional)', phone, setPhone, {
            placeholder: '08xxxxxxxxxx',
            keyboardType: 'phone-pad',
            autoCapitalize: 'none',
          })}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={submitting}>
              <Text style={styles.footerLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.primary },
  container: { flexGrow: 1, padding: SPACING.lg },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  backText: { color: COLORS.surface, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  logoWrap: { alignItems: 'center', marginBottom: SPACING.lg },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  appName: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginTop: SPACING.sm,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 44,
    gap: SPACING.sm,
  },
  input: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.md },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 42,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  roleBtnActive: { backgroundColor: COLORS.primary },
  roleText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  roleTextActive: { color: COLORS.surface },
  error: {
    color: COLORS.red,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});

export default RegisterScreen;
```

## `src/screens/shared/DailyLogDetailScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getDailyLog, deleteDailyLog } from '../../services/dailyLogService';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { DailyLog } from '../../types';

interface Props {
  route: { params: { logId: string } };
  navigation: any;
}

const DailyLogDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { logId } = route.params;
  const { appUser } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const l = await getDailyLog(logId);
      setLog(l);
    } catch {
      // diamkan
    }
  }, [logId]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const doDelete = async () => {
    if (!log) return;
    setDeleting(true);
    try {
      await deleteDailyLog(log.id);
      setConfirmDelete(false);
      Alert.alert('Berhasil', 'Jurnal dihapus.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Tidak dapat menghapus');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!log) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
        <EmptyState title="Jurnal tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const isOwner = appUser?.uid === log.studentId;
  const canEdit = isOwner && log.reviewStatus !== 'approved';
  const canDelete = canEdit;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.date}>{toDateString(log.date)}</Text>
            <StatusBadge status={log.reviewStatus} />
          </View>
          <Text style={styles.type}>{log.activityType}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.text}>{log.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hasil</Text>
          <Text style={styles.text}>{log.result}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kendala</Text>
          <Text style={styles.text}>{log.obstacles}</Text>
        </View>

        {log.photoUrl ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Foto Dokumentasi</Text>
            <Text style={[styles.text, { color: COLORS.accent }]}>{log.photoUrl}</Text>
          </View>
        ) : null}

        {log.supervisorComment ? (
          <View style={[styles.card, { backgroundColor: `${COLORS.primary}08` }]}>
            <Text style={styles.sectionTitle}>Komentar Pembimbing</Text>
            <Text style={styles.text}>{log.supervisorComment}</Text>
            {log.reviewedAt ? (
              <Text style={styles.meta}>Direview: {toDateString(log.reviewedAt)}</Text>
            ) : null}
          </View>
        ) : null}

        {canEdit && (
          <TouchableOpacity
            style={styles.cta}
            onPress={() => navigation.navigate('DailyLogForm', { logId: log.id })}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.surface} />
            <Text style={styles.ctaText}>Edit Jurnal</Text>
          </TouchableOpacity>
        )}

        {canDelete && (
          <TouchableOpacity
            style={styles.ctaDanger}
            onPress={() => setConfirmDelete(true)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.red} />
            <Text style={styles.ctaDangerText}>Hapus Jurnal</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        title="Hapus Jurnal?"
        message="Jurnal akan dihapus permanen."
        confirmLabel="Hapus"
        confirmColor={COLORS.red}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  date: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary },
  type: { fontSize: FONT_SIZE.sm, color: COLORS.text, marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  ctaDanger: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.red}10`,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  ctaDangerText: { color: COLORS.red, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default DailyLogDetailScreen;    
```

## `src/screens/shared/InternshipDetailScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import ProgressCard from '../../components/ProgressCard';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getInternship } from '../../services/internshipService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Internship, DailyLog, Company, AppUser } from '../../types';

interface Props {
  route: { params: { internshipId: string } };
  navigation: any;
}

const InternshipDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { internshipId } = route.params;
  const { appUser } = useAuth();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [student, setStudent] = useState<AppUser | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const int = await getInternship(internshipId);
      if (!int) return;
      setInternship(int);
      const [c, s, sup, l] = await Promise.all([
        getCompany(int.companyId),
        fetchAppUser(int.studentId),
        fetchAppUser(int.supervisorId),
        listLogsByInternship(int.id),
      ]);
      setCompany(c);
      setStudent(s);
      setSupervisor(sup);
      setLogs(l);
    } catch {
      // diamkan
    }
  }, [internshipId]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!internship) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
        <EmptyState title="Data magang tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const progress = calculateProgress(logs, internship.targetDays);
  const approved = logs.filter((l) => l.reviewStatus === 'approved').length;
  const pending = logs.filter((l) => l.reviewStatus === 'pending_review').length;
  const revision = logs.filter((l) => l.reviewStatus === 'needs_revision').length;
  const isSupervisor = appUser?.role === 'supervisor';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ProgressCard
          title="Progress"
          subtitle={`Target ${internship.targetDays} hari`}
          progress={progress}
          detail={`${approved} disetujui â€¢ ${pending} menunggu â€¢ ${revision} revisi`}
        />

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{company?.name ?? '-'}</Text>
            <StatusBadge status={internship.status} />
          </View>
          <Text style={styles.meta}>{company?.industry} â€¢ {company?.location}</Text>
          <Text style={styles.meta}>{company?.address}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mahasiswa</Text>
          <Text style={styles.text}>{student?.name ?? '-'}</Text>
          <Text style={styles.meta}>{student?.nim ?? '-'} â€¢ {student?.studyProgram ?? '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pembimbing</Text>
          <Text style={styles.text}>{supervisor?.name ?? '-'}</Text>
          <Text style={styles.meta}>{supervisor?.email ?? '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Periode</Text>
          <Text style={styles.text}>
            {toDateString(internship.startDate)} â€” {toDateString(internship.endDate)}
          </Text>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>Topik</Text>
          <Text style={styles.text}>{internship.topic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Jurnal Kegiatan</Text>
          {logs.length === 0 ? (
            <Text style={styles.meta}>Belum ada jurnal.</Text>
          ) : (
            logs.slice(0, 10).map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.logRow}
                onPress={() =>
                  isSupervisor
                    ? navigation.navigate('LogReview', { logId: log.id })
                    : navigation.navigate('DailyLogDetail', { logId: log.id })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.logDate}>{toDateString(log.date)}</Text>
                  <Text style={styles.meta} numberOfLines={1}>{log.activityType}</Text>
                </View>
                <StatusBadge status={log.reviewStatus} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {isSupervisor && appUser ? (
          <TouchableOpacity
            style={styles.cta}
            onPress={() =>
              navigation.navigate('EvaluationForm', {
                internshipId: internship.id,
                studentId: internship.studentId,
              })
            }
          >
            <Ionicons name="ribbon" size={20} color={COLORS.surface} />
            <Text style={styles.ctaText}>Beri / Lihat Penilaian</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  logDate: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.green,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default InternshipDetailScreen;
```

## `src/screens/shared/ProfileScreen.tsx`

```tsx
export { default } from './rofileScreen';

```

## `src/screens/shared/rofileScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import { updateOwnProfile } from '../../services/userService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

const ProfileScreen: React.FC = () => {
  const { appUser, logout, refreshProfile } = useAuth();

  const [name, setName] = useState(appUser?.name ?? '');
  const [phone, setPhone] = useState(appUser?.phone ?? '');
  const [photoUrl, setPhotoUrl] = useState(appUser?.photoUrl ?? '');
  const [studyProgram, setStudyProgram] = useState(appUser?.studyProgram ?? '');
  const [semester, setSemester] = useState(appUser?.semester?.toString() ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  if (!appUser) return null;

  const save = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateOwnProfile(appUser.uid, {
        name: name.trim(),
        phone: phone.trim(),
        photoUrl: photoUrl.trim() || undefined,
        studyProgram: studyProgram.trim() || undefined,
        semester: semester ? Number(semester) : undefined,
      });
      await refreshProfile();
      Alert.alert('Berhasil', 'Profil diperbarui.');
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel =
    appUser.role === 'admin' ? 'Admin' : appUser.role === 'student' ? 'Mahasiswa' : 'Pembimbing';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Profil" rightIcon="log-out-outline" onRightPress={() => setShowLogout(true)} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={COLORS.surface} />
            </View>
            <Text style={styles.name}>{appUser.name}</Text>
            <Text style={styles.role}>{roleLabel}</Text>
            <Text style={styles.meta}>{appUser.email}</Text>
          </View>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />

          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!submitting}
          />

          <Text style={styles.label}>URL Foto Profil (Opsional)</Text>
          <TextInput
            style={styles.input}
            value={photoUrl}
            onChangeText={setPhotoUrl}
            autoCapitalize="none"
            editable={!submitting}
          />

          <Text style={styles.label}>Program Studi</Text>
          <TextInput
            style={styles.input}
            value={studyProgram}
            onChangeText={setStudyProgram}
            editable={!submitting}
          />

          {appUser.role === 'student' && (
            <>
              <Text style={styles.label}>Semester</Text>
              <TextInput
                style={styles.input}
                value={semester}
                onChangeText={setSemester}
                keyboardType="numeric"
                editable={!submitting}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.6 }]}
            onPress={save}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={COLORS.surface} />
                <Text style={styles.btnText}>Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={showLogout}
        title="Keluar?"
        message="Anda akan keluar dari aplikasi."
        confirmLabel="Keluar"
        confirmColor={COLORS.red}
        onConfirm={async () => {
          setShowLogout(false);
          await logout();
        }}
        onCancel={() => setShowLogout(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  avatarWrap: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm },
  role: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 44,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  btnText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default ProfileScreen;
```

## `src/screens/student/CompanyListScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { listCompanies } from '../../services/companyService';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Company } from '../../types';

const CompanyListScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const c = await listCompanies();
      setCompanies(c);
    } catch {
      // diamkan
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const industries = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.industry && s.add(c.industry));
    return Array.from(s);
  }, [companies]);

  const filtered = useMemo(
    () =>
      companies.filter((c) => {
        if (industry && c.industry !== industry) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          return (
            c.name.toLowerCase().includes(s) ||
            c.location.toLowerCase().includes(s) ||
            c.industry.toLowerCase().includes(s)
          );
        }
        return true;
      }),
    [companies, industry, search]
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Daftar Perusahaan" />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari perusahaan"
              placeholderTextColor={COLORS.disabled}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {industries.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                <TouchableOpacity
                  onPress={() => setIndustry(null)}
                  style={[styles.filterBtn, !industry && styles.filterBtnActive]}
                >
                  <Text style={[styles.filterText, !industry && styles.filterTextActive]}>Semua</Text>
                </TouchableOpacity>
                {industries.map((ind) => (
                  <TouchableOpacity
                    key={ind}
                    onPress={() => setIndustry(ind)}
                    style={[styles.filterBtn, industry === ind && styles.filterBtnActive]}
                  >
                    <Text style={[styles.filterText, industry === ind && styles.filterTextActive]}>{ind}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {filtered.length === 0 ? (
            <EmptyState icon="business-outline" title="Belum ada perusahaan" />
          ) : (
            filtered.map((c) => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.meta}>{c.industry} â€¢ {c.location}</Text>
                <Text style={styles.meta} numberOfLines={1}>{c.address}</Text>
                <Text style={styles.meta}>Kontak: {c.contactPerson} â€¢ {c.phone}</Text>
                {c.description ? (
                  <Text style={styles.desc} numberOfLines={2}>{c.description}</Text>
                ) : null}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.text, marginTop: SPACING.xs, fontStyle: 'italic' },
});

export default CompanyListScreen;
```

## `src/screens/student/DailyLogFormScreen.tsx`

```tsx

import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';

import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';

import {
    createDailyLog,
    updateDailyLog,
    getDailyLog,
    resubmitDailyLog,
} from '../../services/dailyLogService';

import { toDateString } from '../../utils/dateUtils';
import { isNonEmpty } from '../../utils/validation';

import {
    COLORS,
    SPACING,
    FONT_SIZE,
    BORDER_RADIUS,
} from '../../constants/theme';

import { StudentStackParamList } from '../../navigation/types';
import { ActivityType, Internship, ReviewStatus } from '../../types';

type Props = NativeStackScreenProps<StudentStackParamList, 'DailyLogForm'>;

const ACTIVITY_TYPES: ActivityType[] = [
    'Pengembangan Aplikasi',
    'Analisis Sistem',
    'Instalasi dan Konfigurasi',
    'Administrasi',
    'Pengujian Sistem',
    'Kegiatan Lainnya',
];

const DailyLogFormScreen: React.FC<Props> = ({
    route,
    navigation,
}) => {
    const logId = route.params?.logId;
    const isEdit = !!logId;

    const { appUser } = useAuth();

    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // STATE FOTO DOKUMENTASI
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');

    const [date, setDate] = useState<Date>(new Date());

    const [activityType, setActivityType] =
        useState<ActivityType>('Pengembangan Aplikasi');

    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');
    const [obstacles, setObstacles] = useState('');

    const [existingStatus, setExistingStatus] =
        useState<ReviewStatus | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showActivityPicker, setShowActivityPicker] = useState(false);

    // ==========================================
    // LOAD DATA JURNAL
    // ==========================================

    useEffect(() => {
        (async () => {
            if (!appUser) return;

            try {
                if (isEdit && logId) {
                    const log = await getDailyLog(logId);

                    if (!log) {
                        Alert.alert(
                            'Tidak ditemukan',
                            'Jurnal tidak ditemukan'
                        );

                        navigation.goBack();
                        return;
                    }

                    if (log.studentId !== appUser.uid) {
                        Alert.alert(
                            'Ditolak',
                            'Anda tidak berhak mengubah jurnal ini'
                        );

                        navigation.goBack();
                        return;
                    }

                    if (log.reviewStatus === 'approved') {
                        Alert.alert(
                            'Tidak dapat diubah',
                            'Jurnal yang sudah disetujui terkunci.'
                        );

                        navigation.goBack();
                        return;
                    }

                    setExistingStatus(log.reviewStatus);
                    setDate(log.date.toDate());
                    setActivityType(log.activityType);
                    setDescription(log.description);
                    setResult(log.result);
                    setObstacles(log.obstacles);

                    // Memuat foto yang sudah tersimpan
                    const savedPhoto = log.photoUrl ?? '';
                    setPhotoUrl(savedPhoto);
                    setPhotoPreview(savedPhoto || null);

                } else {
                    const active = await getActiveInternshipByStudent(
                        appUser.uid
                    );

                    if (!active) {
                        Alert.alert(
                            'Info',
                            'Anda belum memiliki magang aktif.'
                        );

                        navigation.goBack();
                        return;
                    }

                    setInternship(active);
                }

            } catch (e: any) {
                Alert.alert(
                    'Gagal',
                    e?.message ?? 'Gagal memuat data jurnal.'
                );
            } finally {
                setLoading(false);
            }
        })();

    }, [appUser, isEdit, logId, navigation]);

    // ==========================================
    // UPLOAD FOTO DOKUMENTASI KE CLOUDINARY
    // ==========================================

    const pickAndUploadPhoto = async () => {
        try {
            // Minta izin akses galeri
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Izin ditolak',
                    'Akses galeri diperlukan untuk memilih foto.'
                );

                return;
            }

            // Membuka galeri
            const imageResult =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.7,
                    base64: true,
                    allowsEditing: true,
                    aspect: [4, 3],
                });

            if (
                imageResult.canceled ||
                imageResult.assets.length === 0
            ) {
                return;
            }

            const asset = imageResult.assets[0];

            // Menampilkan preview lokal
            setPhotoPreview(asset.uri);
            setUploadingPhoto(true);

            // Upload gambar ke Cloudinary
            const uploaded = await uploadImageToCloudinary(
                asset.uri,
                {
                    folder: 'ppnp-internship/daily-logs',
                    base64: asset.base64 ?? undefined,
                    mimeType: asset.mimeType ?? undefined,
                }
            );

            // Simpan URL hasil upload
            setPhotoUrl(uploaded.secure_url);

            Alert.alert(
                'Berhasil',
                'Foto berhasil diunggah ke Cloudinary.'
            );

        } catch (e: any) {
            Alert.alert(
                'Gagal upload',
                e?.message ?? 'Terjadi kesalahan saat mengunggah foto.'
            );

            setPhotoPreview(null);
            setPhotoUrl('');

        } finally {
            setUploadingPhoto(false);
        }
    };

    // ==========================================
    // VALIDASI FORM
    // ==========================================

    const validate = (): string | null => {
        if (!isNonEmpty(description)) {
            return 'Deskripsi kegiatan wajib diisi.';
        }

        if (!isNonEmpty(result)) {
            return 'Hasil kegiatan wajib diisi.';
        }

        if (!isNonEmpty(obstacles)) {
            return 'Kendala wajib diisi (isi "-" jika tidak ada).';
        }

        return null;
    };

    // ==========================================
    // SIMPAN JURNAL
    // ==========================================

    const onSubmit = async () => {
        if (!appUser) return;

        if (uploadingPhoto) {
            Alert.alert(
                'Upload berlangsung',
                'Tunggu sampai foto selesai diunggah.'
            );

            return;
        }

        const err = validate();

        if (err) {
            Alert.alert('Validasi', err);
            return;
        }

        if (submitting) return;

        setSubmitting(true);

        try {
            if (isEdit && logId) {
                await updateDailyLog(logId, {
                    activityType,
                    description: description.trim(),
                    result: result.trim(),
                    obstacles: obstacles.trim(),

                    // URL foto Cloudinary
                    photoUrl: photoUrl.trim() || undefined,

                    date: Timestamp.fromDate(date),
                });

                if (existingStatus === 'needs_revision') {
                    await resubmitDailyLog(logId);
                }

                Alert.alert(
                    'Berhasil',
                    'Jurnal diperbarui.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );

            } else {
                if (!internship) {
                    Alert.alert(
                        'Error',
                        'Data magang tidak tersedia'
                    );

                    return;
                }

                await createDailyLog({
                    internshipId: internship.id,
                    studentId: appUser.uid,
                    date: Timestamp.fromDate(date),
                    activityType,
                    description: description.trim(),
                    result: result.trim(),
                    obstacles: obstacles.trim(),

                    // URL foto Cloudinary
                    photoUrl: photoUrl.trim() || undefined,
                });

                Alert.alert(
                    'Berhasil',
                    'Jurnal ditambahkan.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }

        } catch (e: any) {
            Alert.alert(
                'Gagal',
                e?.message ?? 'Terjadi kesalahan'
            );

        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {
        return (
            <SafeAreaView
                style={styles.flex}
                edges={['bottom']}
            >
                <AppHeader
                    title={isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
                    onBack={() => navigation.goBack()}
                />

                <View style={styles.center}>
                    <ActivityIndicator
                        color={COLORS.primary}
                        size="large"
                    />
                </View>
            </SafeAreaView>
        );
    }

    // ==========================================
    // TAMPILAN FORM
    // ==========================================

    return (
        <SafeAreaView
            style={styles.flex}
            edges={['bottom']}
        >
            <AppHeader
                title={isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
                onBack={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* NOTIFIKASI REVISI */}

                    {existingStatus === 'needs_revision' ? (
                        <View style={styles.warnBox}>
                            <Ionicons
                                name="alert-circle"
                                size={16}
                                color={COLORS.orange}
                            />

                            <Text style={styles.warnText}>
                                Jurnal perlu revisi. Simpan perubahan
                                untuk mengirim ulang.
                            </Text>
                        </View>
                    ) : null}

                    {/* TANGGAL KEGIATAN */}

                    <Text style={styles.label}>
                        Tanggal Kegiatan *
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.selector,
                            isEdit && { opacity: 0.7 },
                        ]}
                        onPress={() =>
                            !isEdit && setShowDatePicker(true)
                        }
                        disabled={isEdit}
                    >
                        <Text style={styles.selectorText}>
                            {toDateString(Timestamp.fromDate(date))}
                        </Text>

                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>

                    {/* JENIS KEGIATAN */}

                    <Text style={styles.label}>
                        Jenis Kegiatan *
                    </Text>

                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setShowActivityPicker(true)}
                    >
                        <Text style={styles.selectorText}>
                            {activityType}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>

                    {/* DESKRIPSI */}

                    <Text style={styles.label}>
                        Deskripsi Kegiatan *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 90,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Ceritakan kegiatan hari ini..."
                        placeholderTextColor={COLORS.disabled}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!submitting}
                    />

                    {/* HASIL KEGIATAN */}

                    <Text style={styles.label}>
                        Hasil Kegiatan *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 70,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Hasil yang dicapai..."
                        placeholderTextColor={COLORS.disabled}
                        value={result}
                        onChangeText={setResult}
                        multiline
                        editable={!submitting}
                    />

                    {/* KENDALA */}

                    <Text style={styles.label}>
                        Kendala yang Dihadapi *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 70,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Tulis '-' jika tidak ada kendala"
                        placeholderTextColor={COLORS.disabled}
                        value={obstacles}
                        onChangeText={setObstacles}
                        multiline
                        editable={!submitting}
                    />

                    {/* FOTO DOKUMENTASI */}

                    <Text style={styles.label}>
                        Foto Dokumentasi (Opsional)
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.uploadBox,
                            uploadingPhoto && { opacity: 0.7 },
                        ]}
                        onPress={pickAndUploadPhoto}
                        disabled={uploadingPhoto || submitting}
                    >
                        {uploadingPhoto ? (
                            <>
                                <ActivityIndicator
                                    color={COLORS.primary}
                                />

                                <Text style={styles.uploadText}>
                                    Mengunggah foto...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons
                                    name="camera-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />

                                <Text style={styles.uploadText}>
                                    {photoUrl
                                        ? 'Ganti Foto'
                                        : 'Pilih dari Galeri'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* STATUS FOTO */}

                    {photoPreview ? (
                        <View style={styles.photoInfo}>
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color={COLORS.primary}
                            />

                            <Text
                                style={styles.meta}
                                numberOfLines={2}
                            >
                                {photoUrl
                                    ? 'Foto berhasil diunggah ke Cloudinary.'
                                    : 'Mengunggah foto...'}
                            </Text>
                        </View>
                    ) : null}

                    {/* SIMPAN JURNAL */}

                    <TouchableOpacity
                        style={[
                            styles.submit,
                            (submitting || uploadingPhoto) && {
                                opacity: 0.6,
                            },
                        ]}
                        onPress={onSubmit}
                        disabled={submitting || uploadingPhoto}
                    >
                        {submitting ? (
                            <ActivityIndicator
                                color={COLORS.surface}
                            />
                        ) : (
                            <>
                                <Ionicons
                                    name="save-outline"
                                    size={18}
                                    color={COLORS.surface}
                                />

                                <Text style={styles.submitText}>
                                    Simpan
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* DATE PICKER */}

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(_, d) => {
                        setShowDatePicker(false);

                        if (d) {
                            setDate(d);
                        }
                    }}
                />
            )}

            {/* ACTIVITY PICKER */}

            <Modal
                visible={showActivityPicker}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setShowActivityPicker(false)
                }
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            Pilih Jenis Kegiatan
                        </Text>

                        {ACTIVITY_TYPES.map((a) => (
                            <TouchableOpacity
                                key={a}
                                style={styles.activityRow}
                                onPress={() => {
                                    setActivityType(a);
                                    setShowActivityPicker(false);
                                }}
                            >
                                <Text style={styles.activityText}>
                                    {a}
                                </Text>

                                {activityType === a && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={COLORS.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

// ==========================================
// STYLING
// ==========================================

const styles = StyleSheet.create({

    flex: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },

    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xs,
    },

    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        height: 44,
    },

    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        height: 44,
    },

    selectorText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },

    // STYLE UPLOAD FOTO

    uploadBox: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.md,
        minHeight: 85,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.xs,
    },

    uploadText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
    },

    meta: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.xs,
        flex: 1,
    },

    photoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.xs,
    },

    // TOMBOL SIMPAN

    submit: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        height: 48,
        borderRadius: BORDER_RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },

    submitText: {
        color: COLORS.surface,
        fontWeight: '700',
        fontSize: FONT_SIZE.md,
    },

    // NOTIFIKASI REVISI

    warnBox: {
        flexDirection: 'row',
        gap: SPACING.xs,
        backgroundColor: `${COLORS.orange}15`,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.sm,
    },

    warnText: {
        flex: 1,
        color: COLORS.orange,
        fontSize: FONT_SIZE.xs,
    },

    // MODAL JENIS KEGIATAN

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },

    modalCard: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.lg,
        borderTopRightRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },

    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    activityRow: {
        paddingVertical: SPACING.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },

    activityText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },

});

export default DailyLogFormScreen;

```

## `src/screens/student/DailyLogScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { listLogsByStudent } from '../../services/dailyLogService';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { DailyLog, ReviewStatus, ActivityType } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;
type ReviewFilter = 'all' | ReviewStatus;
type ActivityFilter = 'all' | ActivityType;

const ACTIVITY_TYPES: ActivityType[] = [
  'Pengembangan Aplikasi',
  'Analisis Sistem',
  'Instalasi dan Konfigurasi',
  'Administrasi',
  'Pengujian Sistem',
  'Kegiatan Lainnya',
];

const DailyLogScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const l = await listLogsByStudent(appUser.uid);
      setLogs(l);
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        if (reviewFilter !== 'all' && l.reviewStatus !== reviewFilter) return false;
        if (activityFilter !== 'all' && l.activityType !== activityFilter) return false;
        return true;
      }),
    [logs, reviewFilter, activityFilter]
  );

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader
        title="Jurnal Harian"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('DailyLogForm')}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.filterLabel}>Status Review</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              <Chip active={reviewFilter === 'all'} label="Semua" onPress={() => setReviewFilter('all')} />
              <Chip active={reviewFilter === 'pending_review'} label="Menunggu" onPress={() => setReviewFilter('pending_review')} />
              <Chip active={reviewFilter === 'approved'} label="Disetujui" onPress={() => setReviewFilter('approved')} />
              <Chip active={reviewFilter === 'needs_revision'} label="Perlu Revisi" onPress={() => setReviewFilter('needs_revision')} />
            </View>
          </ScrollView>

          <Text style={styles.filterLabel}>Jenis Kegiatan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              <Chip active={activityFilter === 'all'} label="Semua" onPress={() => setActivityFilter('all')} />
              {ACTIVITY_TYPES.map((a) => (
                <Chip
                  key={a}
                  active={activityFilter === a}
                  label={a}
                  onPress={() => setActivityFilter(a)}
                />
              ))}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState
              icon="document-outline"
              title="Belum ada jurnal"
              message="Tekan tombol + untuk menambah jurnal."
            />
          ) : (
            filtered.map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.card}
                onPress={() => navigation.navigate('DailyLogDetail', { logId: log.id })}
              >
                <View style={styles.row}>
                  <Text style={styles.date}>{toDateString(log.date)}</Text>
                  <StatusBadge status={log.reviewStatus} />
                </View>
                <Text style={styles.type}>{log.activityType}</Text>
                <Text style={styles.desc} numberOfLines={2}>{log.description}</Text>
                {log.supervisorComment ? (
                  <View style={styles.comment}>
                    <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.commentText} numberOfLines={2}>{log.supervisorComment}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  filterLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  date: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  type: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: 4 },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  comment: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  commentText: { flex: 1, fontSize: FONT_SIZE.xs, color: COLORS.primary, fontStyle: 'italic' },
});

export default DailyLogScreen;
```

## `src/screens/student/InternshipApplicationScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';
import { listCompanies } from '../../services/companyService';
import { createApplication, listApplicationsByStudent } from '../../services/applicationService';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { isNonEmpty } from '../../utils/validation';
import { toDateString } from '../../utils/dateUtils';
import { Timestamp } from 'firebase/firestore';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Company, InternshipApplication } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const InternshipApplicationScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [existingApps, setExistingApps] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 3600 * 1000));
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [proposalUrl, setProposalUrl] = useState('');

  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!appUser) return;
      try {
        const [c, apps, active] = await Promise.all([
          listCompanies(),
          listApplicationsByStudent(appUser.uid),
          getActiveInternshipByStudent(appUser.uid),
        ]);
        if (active) {
          Alert.alert('Info', 'Anda sedang menjalani magang aktif.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        const pending = apps.find((a) => a.status === 'pending');
        if (pending) {
          Alert.alert('Info', 'Anda masih memiliki pengajuan yang menunggu keputusan.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        setCompanies(c);
        setExistingApps(apps);
      } finally {
        setLoading(false);
      }
    })();
  }, [appUser, navigation]);

  const validate = (): string | null => {
    if (!companyId) return 'Pilih perusahaan tujuan.';
    if (endDate < startDate) return 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    if (!isNonEmpty(topic)) return 'Judul/topik magang wajib diisi.';
    if (!isNonEmpty(description)) return 'Deskripsi rencana wajib diisi.';
    return null;
  };

  const onSubmit = async () => {
    if (!appUser) return;
    const err = validate();
    if (err) {
      Alert.alert('Validasi', err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await createApplication({
        studentId: appUser.uid,
        companyId: companyId!,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        topic: topic.trim(),
        description: description.trim(),
        ...(proposalUrl.trim() ? { proposalUrl: proposalUrl.trim() } : {}),
      });
      Alert.alert('Berhasil', 'Pengajuan magang telah dikirim.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCompany = companies.find((c) => c.id === companyId);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Ajukan Magang" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Ajukan Magang" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Perusahaan Tujuan *</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowCompanyPicker(true)}
          >
            <Text style={[styles.selectorText, !selectedCompany && { color: COLORS.disabled }]}>
              {selectedCompany?.name ?? 'Pilih perusahaan'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Tanggal Mulai *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.selectorText}>{toDateString(Timestamp.fromDate(startDate))}</Text>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Tanggal Selesai *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.selectorText}>{toDateString(Timestamp.fromDate(endDate))}</Text>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Judul / Topik Magang *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pengembangan Sistem Informasi..."
            placeholderTextColor={COLORS.disabled}
            value={topic}
            onChangeText={setTopic}
            editable={!submitting}
          />

          <Text style={styles.label}>Deskripsi Rencana Kegiatan *</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Uraikan rencana kegiatan..."
            placeholderTextColor={COLORS.disabled}
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!submitting}
          />

          <Text style={styles.label}>URL Proposal (Opsional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={COLORS.disabled}
            value={proposalUrl}
            onChangeText={setProposalUrl}
            autoCapitalize="none"
            editable={!submitting}
          />

          <TouchableOpacity
            style={[styles.submit, submitting && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <>
                <Ionicons name="send" size={18} color={COLORS.surface} />
                <Text style={styles.submitText}>Kirim Pengajuan</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showCompanyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pilih Perusahaan</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {companies.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.companyRow}
                  onPress={() => {
                    setCompanyId(c.id);
                    setShowCompanyPicker(false);
                  }}
                >
                  <Text style={styles.companyName}>{c.name}</Text>
                  <Text style={styles.companyMeta}>{c.industry} â€¢ {c.location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCompanyPicker(false)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowStartPicker(false);
            if (d) setStartDate(d);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowEndPicker(false);
            if (d) setEndDate(d);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 44,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 44,
  },
  selectorText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  submit: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  submitText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  companyRow: {
    padding: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  companyName: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  companyMeta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  modalClose: { alignItems: 'center', padding: SPACING.md },
  modalCloseText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default InternshipApplicationScreen;

```

## `src/screens/student/MyEvaluationScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { getEvaluationByInternship } from '../../services/evaluationService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Evaluation } from '../../types';

const MyEvaluationScreen: React.FC = () => {
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const active = await getActiveInternshipByStudent(appUser.uid);
      if (active) {
        const ev = await getEvaluationByInternship(active.id, 'studentId', appUser.uid);
        if (ev && ev.isFinal) setEvaluation(ev);
        else setEvaluation(null);
      } else {
        setEvaluation(null);
      }
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Penilaian" />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!evaluation) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Penilaian" />
        <EmptyState
          icon="ribbon-outline"
          title="Belum ada penilaian final"
          message="Penilaian akan muncul setelah dipublikasikan oleh pembimbing."
        />
      </SafeAreaView>
    );
  }

  const rows = [
    { label: 'Kedisiplinan (20%)', value: evaluation.discipline },
    { label: 'Tanggung Jawab (20%)', value: evaluation.responsibility },
    { label: 'Komunikasi (15%)', value: evaluation.communication },
    { label: 'Kerja Sama (15%)', value: evaluation.teamwork },
    { label: 'Kompetensi Teknis (30%)', value: evaluation.technicalSkill },
  ];

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Penilaian" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Nilai Akhir</Text>
          <Text style={styles.scoreValue}>{evaluation.finalScore.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rincian Nilai</Text>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          ))}
        </View>

        {evaluation.notes ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Catatan Pembimbing</Text>
            <Text style={styles.text}>{evaluation.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm },
  scoreValue: { color: COLORS.surface, fontSize: 56, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  value: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },
});

export default MyEvaluationScreen;

```

## `src/screens/student/MyInternshipScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import ProgressCard from '../../components/ProgressCard';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { listLogsByStudent } from '../../services/dailyLogService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Internship, DailyLog, Company, AppUser } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const MyInternshipScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const active = await getActiveInternshipByStudent(appUser.uid);
      setInternship(active);
      if (active) {
        const [c, s, l] = await Promise.all([
          getCompany(active.companyId),
          fetchAppUser(active.supervisorId),
          listLogsByStudent(appUser.uid),
        ]);
        setCompany(c);
        setSupervisor(s);
        setLogs(l);
      } else {
        setCompany(null);
        setSupervisor(null);
        setLogs([]);
      }
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Magang Saya" />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!internship) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Magang Saya" />
        <EmptyState
          icon="briefcase-outline"
          title="Belum ada magang aktif"
          message="Ajukan magang lalu tunggu persetujuan admin."
        />
      </SafeAreaView>
    );
  }

  const progress = calculateProgress(logs, internship.targetDays);

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Magang Saya" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ProgressCard
          title="Progress"
          subtitle={`Target ${internship.targetDays} hari`}
          progress={progress}
          detail={`${logs.filter((l) => l.reviewStatus === 'approved').length} dari ${internship.targetDays} hari disetujui`}
        />

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{company?.name ?? '-'}</Text>
            <StatusBadge status={internship.status} />
          </View>
          <Text style={styles.meta}>{company?.industry} â€¢ {company?.location}</Text>
          <Text style={styles.meta}>{company?.address}</Text>
          <Text style={styles.meta}>Kontak: {company?.contactPerson} ({company?.phone})</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Periode</Text>
          <Text style={styles.text}>{toDateString(internship.startDate)} â€” {toDateString(internship.endDate)}</Text>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>Topik</Text>
          <Text style={styles.text}>{internship.topic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pembimbing Kampus</Text>
          <Text style={styles.text}>{supervisor?.name ?? '-'}</Text>
          <Text style={styles.meta}>{supervisor?.studyProgram ?? '-'} â€¢ {supervisor?.email ?? '-'}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('InternshipDetail', { internshipId: internship.id })}
        >
          <Text style={styles.detailText}>Lihat Detail Lengkap</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  detailText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.sm },
});

export default MyInternshipScreen;
```

## `src/screens/student/StudentDashboardScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import ProgressCard from '../../components/ProgressCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { listLogsByStudent } from '../../services/dailyLogService';
import { listApplicationsByStudent } from '../../services/applicationService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Internship, DailyLog, InternshipApplication, Company, AppUser } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const StudentDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const [active, apps] = await Promise.all([
        getActiveInternshipByStudent(appUser.uid),
        listApplicationsByStudent(appUser.uid),
      ]);
      setApplications(apps);
      setInternship(active);
      if (active) {
        const [c, sup, l] = await Promise.all([
          getCompany(active.companyId),
          fetchAppUser(active.supervisorId),
          listLogsByStudent(appUser.uid),
        ]);
        setCompany(c);
        setSupervisor(sup);
        setLogs(l);
      } else {
        setCompany(null);
        setSupervisor(null);
        setLogs([]);
      }
    } catch {
      // diamkan, tetap tampilkan layout kosong
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading || !appUser) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Dashboard" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  const approved = logs.filter((l) => l.reviewStatus === 'approved').length;
  const pending = logs.filter((l) => l.reviewStatus === 'pending_review').length;
  const revision = logs.filter((l) => l.reviewStatus === 'needs_revision').length;
  const progress = internship ? calculateProgress(logs, internship.targetDays) : null;
  const latestApp = applications[0];

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard" subtitle={appUser.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser.name.split(' ')[0]} ðŸ‘‹</Text>
          <Text style={styles.greetingSub}>NIM {appUser.nim ?? '-'} â€¢ {appUser.studyProgram ?? '-'}</Text>
        </View>

        {internship ? (
          <>
            <ProgressCard
              title="Progress Magang"
              subtitle={`Target ${internship.targetDays} hari`}
              progress={progress}
              detail={`${approved} jurnal disetujui dari ${internship.targetDays} hari target`}
            />

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.cardTitle}>Magang Aktif</Text>
                <StatusBadge status={internship.status} />
              </View>
              <Text style={styles.text}>{company?.name ?? '-'}</Text>
              <Text style={styles.meta}>{company?.industry} â€¢ {company?.location}</Text>
              <Text style={styles.meta}>
                {toDateString(internship.startDate)} â€” {toDateString(internship.endDate)}
              </Text>
              <Text style={styles.meta}>Pembimbing: {supervisor?.name ?? '-'}</Text>
              <Text style={styles.meta}>Topik: {internship.topic}</Text>
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => navigation.navigate('InternshipDetail', { internshipId: internship.id })}
              >
                <Text style={styles.detailText}>Lihat Detail Magang</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrap}>
              <StatCard label="Jurnal" value={logs.length} icon="document-text" color={COLORS.primary} />
              <StatCard label="Disetujui" value={approved} icon="checkmark-done" color={COLORS.green} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Menunggu" value={pending} icon="hourglass" color={COLORS.orange} />
              <StatCard label="Perlu Revisi" value={revision} icon="refresh" color={COLORS.red} />
            </View>

            <TouchableOpacity
              style={styles.cta}
              onPress={() => navigation.navigate('DailyLogForm')}
            >
              <Ionicons name="add-circle" size={22} color={COLORS.surface} />
              <Text style={styles.ctaText}>Tambah Jurnal Kegiatan</Text>
            </TouchableOpacity>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Riwayat Jurnal Terbaru</Text>
              {logs.length === 0 ? (
                <EmptyState icon="document-outline" title="Belum ada jurnal" message="Tambahkan jurnal kegiatan pertama." />
              ) : (
                logs.slice(0, 3).map((log) => (
                  <TouchableOpacity
                    key={log.id}
                    style={styles.logCard}
                    onPress={() => navigation.navigate('DailyLogDetail', { logId: log.id })}
                  >
                    <View style={styles.row}>
                      <Text style={styles.logDate}>{toDateString(log.date)}</Text>
                      <StatusBadge status={log.reviewStatus} />
                    </View>
                    <Text style={styles.logType}>{log.activityType}</Text>
                    <Text style={styles.meta} numberOfLines={2}>{log.description}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Status Pengajuan</Text>
              {latestApp ? (
                <>
                  <View style={[styles.row, { marginTop: SPACING.xs }]}>
                    <Text style={styles.text} numberOfLines={1}>{latestApp.topic}</Text>
                    <StatusBadge status={latestApp.status} />
                  </View>
                  <Text style={styles.meta}>Diajukan: {toDateString(latestApp.createdAt)}</Text>
                  {latestApp.decisionNotes ? (
                    <Text style={styles.meta}>Catatan: {latestApp.decisionNotes}</Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.meta}>Anda belum mengajukan magang.</Text>
              )}
            </View>

            {!latestApp || latestApp.status === 'rejected' ? (
              <TouchableOpacity
                style={styles.cta}
                onPress={() => navigation.navigate('InternshipApplication')}
              >
                <Ionicons name="create-outline" size={22} color={COLORS.surface} />
                <Text style={styles.ctaText}>Ajukan Magang</Text>
              </TouchableOpacity>
            ) : latestApp.status === 'pending' ? (
              <View style={styles.infoBox}>
                <Ionicons name="hourglass-outline" size={18} color={COLORS.orange} />
                <Text style={styles.infoText}>Pengajuan Anda sedang menunggu keputusan admin.</Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  greeting: { marginBottom: SPACING.md },
  greetingTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  greetingSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text, marginTop: 4 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  section: { marginTop: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  logCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logDate: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  logType: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: 4 },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  detailText: { color: COLORS.primary, fontWeight: '600', fontSize: FONT_SIZE.sm },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.orange}10`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  infoText: { flex: 1, color: COLORS.orange, fontSize: FONT_SIZE.sm },
});

export default StudentDashboardScreen;
```

## `src/screens/supervisor/EvaluationFormScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import {
  getEvaluationByInternship,
  createEvaluation,
  updateEvaluation,
  finalizeEvaluation,
} from '../../services/evaluationService';
import { calculateFinalScore } from '../../utils/scoreUtils';
import { isValidScore } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { Evaluation } from '../../types';

type Props = NativeStackScreenProps<SupervisorStackParamList, 'EvaluationForm'>;

const FIELDS: { key: keyof Omit<Evaluation, 'id' | 'internshipId' | 'studentId' | 'supervisorId' | 'finalScore' | 'notes' | 'isFinal' | 'publishedAt' | 'createdAt'>; label: string; weight: string }[] = [
  { key: 'discipline', label: 'Kedisiplinan', weight: '20%' },
  { key: 'responsibility', label: 'Tanggung Jawab', weight: '20%' },
  { key: 'communication', label: 'Komunikasi', weight: '15%' },
  { key: 'teamwork', label: 'Kerja Sama', weight: '15%' },
  { key: 'technicalSkill', label: 'Kompetensi Teknis', weight: '30%' },
];

const EvaluationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { internshipId, studentId } = route.params;
  const { appUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<Evaluation | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({
    discipline: '',
    responsibility: '',
    communication: '',
    teamwork: '',
    technicalSkill: '',
  });
  const [notes, setNotes] = useState('');
  const [confirmFinal, setConfirmFinal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ev = appUser
          ? await getEvaluationByInternship(internshipId, 'supervisorId', appUser.uid)
          : null;
        if (ev) {
          setExisting(ev);
          setScores({
            discipline: String(ev.discipline),
            responsibility: String(ev.responsibility),
            communication: String(ev.communication),
            teamwork: String(ev.teamwork),
            technicalSkill: String(ev.technicalSkill),
          });
          setNotes(ev.notes ?? '');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [internshipId, appUser]);

  const parsed = (): Record<string, number> | null => {
    const result: Record<string, number> = {};
    for (const f of FIELDS) {
      const raw = scores[f.key as string];
      const num = Number(raw);
      if (!isValidScore(num)) {
        Alert.alert('Validasi', `${f.label} harus berupa angka 0â€“100.`);
        return null;
      }
      result[f.key] = num;
    }
    return result;
  };

  const previewScore = (): number => {
    const nums: number[] = FIELDS.map((f) => Number(scores[f.key] ?? 0));
    if (nums.some((n) => isNaN(n))) return 0;
    return calculateFinalScore(nums[0], nums[1], nums[2], nums[3], nums[4]);
  };

  const save = async (finalize: boolean) => {
    if (!appUser) return;
    const nums = parsed();
    if (!nums) return;
    setSubmitting(true);
    try {
      if (existing) {
        await updateEvaluation(existing.id, {
          discipline: nums.discipline,
          responsibility: nums.responsibility,
          communication: nums.communication,
          teamwork: nums.teamwork,
          technicalSkill: nums.technicalSkill,
          notes: notes.trim(),
        });
        if (finalize) {
          await finalizeEvaluation(existing.id);
        }
      } else {
        const newId = await createEvaluation({
          internshipId,
          studentId,
          supervisorId: appUser.uid,
          discipline: nums.discipline,
          responsibility: nums.responsibility,
          communication: nums.communication,
          teamwork: nums.teamwork,
          technicalSkill: nums.technicalSkill,
          notes: notes.trim(),
        });
        if (finalize) {
          await finalizeEvaluation(newId);
        }
      }
      setConfirmFinal(false);
      Alert.alert('Berhasil', finalize ? 'Penilaian difinalisasi.' : 'Penilaian disimpan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Penilaian" onBack={() => navigation.goBack()} />
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  const isFinal = existing?.isFinal === true;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title={isFinal ? 'Nilai Final' : 'Isi Penilaian'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {isFinal ? (
            <View style={styles.infoBox}>
              <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>Penilaian sudah final dan terkunci.</Text>
            </View>
          ) : null}

          {FIELDS.map((f) => (
            <View key={f.key as string} style={{ marginBottom: SPACING.sm }}>
              <Text style={styles.label}>{f.label} ({f.weight}) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0â€“100"
                placeholderTextColor={COLORS.disabled}
                value={scores[f.key as string]}
                onChangeText={(t) => setScores((s) => ({ ...s, [f.key]: t }))}
                keyboardType="numeric"
                editable={!submitting && !isFinal}
              />
            </View>
          ))}

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Nilai Akhir (Otomatis)</Text>
            <Text style={styles.previewValue}>{previewScore().toFixed(2)}</Text>
          </View>

          <Text style={styles.label}>Catatan</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Catatan penilaian (opsional)"
            placeholderTextColor={COLORS.disabled}
            value={notes}
            onChangeText={setNotes}
            multiline
            editable={!submitting && !isFinal}
          />

          {!isFinal && (
            <>
              <TouchableOpacity
                style={[styles.btnSecondary, submitting && { opacity: 0.6 }]}
                onPress={() => save(false)}
                disabled={submitting}
              >
                <Ionicons name="save-outline" size={18} color={COLORS.primary} />
                <Text style={styles.btnSecondaryText}>Simpan Draf</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, submitting && { opacity: 0.6 }]}
                onPress={() => setConfirmFinal(true)}
                disabled={submitting}
              >
                <Ionicons name="ribbon" size={18} color={COLORS.surface} />
                <Text style={styles.btnPrimaryText}>Finalisasi</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirmFinal}
        title="Finalisasi Penilaian?"
        message="Setelah final, penilaian tidak dapat diubah lagi."
        confirmLabel="Finalisasi"
        confirmColor={COLORS.green}
        loading={submitting}
        onConfirm={() => save(true)}
        onCancel={() => setConfirmFinal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 44,
  },
  previewBox: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  previewLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs },
  previewValue: { color: COLORS.surface, fontSize: 40, fontWeight: '800', marginTop: 4 },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  btnPrimaryText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  btnSecondary: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btnSecondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  infoBox: {
    flexDirection: 'row',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  infoText: { flex: 1, color: COLORS.primary, fontSize: FONT_SIZE.xs },
});

export default EvaluationFormScreen;

```

## `src/screens/supervisor/LogReviewScreen.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingView from '../../components/LoadingView';
import { getDailyLog, reviewDailyLog } from '../../services/dailyLogService';
import { useAuth } from '../../hooks/useAuth';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { DailyLog } from '../../types';

type Props = NativeStackScreenProps<SupervisorStackParamList, 'LogReview'>;

const LogReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { logId } = route.params;
  const { appUser } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState<false | 'approved' | 'needs_revision'>(false);

  useEffect(() => {
    (async () => {
      try {
        const l = await getDailyLog(logId);
        if (!l) {
          Alert.alert('Tidak ditemukan', 'Jurnal tidak ditemukan');
          navigation.goBack();
          return;
        }
        setLog(l);
        setComment(l.supervisorComment ?? '');
      } finally {
        setLoading(false);
      }
    })();
  }, [logId, navigation]);

  const submit = async () => {
    if (!log || !appUser || !confirming) return;
    setSubmitting(true);
    try {
      await reviewDailyLog(log.id, confirming, appUser.uid, comment.trim());
      setConfirming(false);
      Alert.alert('Berhasil', 'Review tersimpan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Review Jurnal" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!log) return null;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Review Jurnal" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.date}>{toDateString(log.date)}</Text>
              <StatusBadge status={log.reviewStatus} />
            </View>
            <Text style={styles.type}>{log.activityType}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.text}>{log.description}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hasil</Text>
            <Text style={styles.text}>{log.result}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Kendala</Text>
            <Text style={styles.text}>{log.obstacles}</Text>
          </View>

          {log.photoUrl ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Foto Dokumentasi</Text>
              <Text style={[styles.text, { color: COLORS.accent }]} numberOfLines={2}>{log.photoUrl}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Komentar Pembimbing</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Tulis komentar atau catatan revisi..."
              placeholderTextColor={COLORS.disabled}
              value={comment}
              onChangeText={setComment}
              multiline
              editable={!submitting}
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: COLORS.orange }]}
              onPress={() => setConfirming('needs_revision')}
              disabled={submitting || log.reviewStatus === 'approved'}
            >
              <Ionicons name="refresh" size={18} color={COLORS.surface} />
              <Text style={styles.btnText}>Perlu Revisi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: COLORS.green }]}
              onPress={() => setConfirming('approved')}
              disabled={submitting}
            >
              <Ionicons name="checkmark-circle" size={18} color={COLORS.surface} />
              <Text style={styles.btnText}>Setujui</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirming !== false}
        title={confirming === 'approved' ? 'Setujui Jurnal?' : 'Minta Revisi?'}
        message={
          confirming === 'approved'
            ? 'Jurnal akan dikunci dan dianggap final.'
            : 'Mahasiswa akan diminta memperbaiki jurnal.'
        }
        confirmLabel={confirming === 'approved' ? 'Setujui' : 'Minta Revisi'}
        confirmColor={confirming === 'approved' ? COLORS.green : COLORS.orange}
        loading={submitting}
        onConfirm={submit}
        onCancel={() => setConfirming(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  date: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary },
  type: { fontSize: FONT_SIZE.sm, color: COLORS.text, marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
  },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  btnText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default LogReviewScreen;
```

## `src/screens/supervisor/SupervisedStudentsScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { listInternshipsBySupervisor } from '../../services/internshipService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import { calculateProgress } from '../../utils/progressUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { AppUser, Internship } from '../../types';

type Nav = NativeStackNavigationProp<SupervisorStackParamList>;

interface Row {
  internship: Internship;
  student: AppUser | null;
  progress: number | null;
  pendingCount: number;
  revisionCount: number;
}

const SupervisedStudentsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const ints = await listInternshipsBySupervisor(appUser.uid);
      const result: Row[] = [];
      for (const i of ints) {
        const [student, logs] = await Promise.all([
          fetchAppUser(i.studentId),
          listLogsByInternship(i.id),
        ]);
        result.push({
          internship: i,
          student,
          progress: calculateProgress(logs, i.targetDays),
          pendingCount: logs.filter((l) => l.reviewStatus === 'pending_review').length,
          revisionCount: logs.filter((l) => l.reviewStatus === 'needs_revision').length,
        });
      }
      setRows(result);
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Mahasiswa Bimbingan" />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {rows.length === 0 ? (
            <EmptyState icon="people-outline" title="Belum ada mahasiswa" />
          ) : (
            rows.map((r) => (
              <TouchableOpacity
                key={r.internship.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('InternshipDetail', { internshipId: r.internship.id })
                }
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{r.student?.name ?? '-'}</Text>
                    <Text style={styles.meta}>{r.student?.nim ?? '-'} â€¢ {r.student?.studyProgram ?? '-'}</Text>
                    <Text style={styles.meta}>{r.internship.topic}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{r.progress === null ? 'â€”' : `${r.progress.toFixed(0)}%`}</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.orange }]}>{r.pendingCount}</Text>
                    <Text style={styles.statLabel}>Menunggu</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.red }]}>{r.revisionCount}</Text>
                    <Text style={styles.statLabel}>Revisi</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      navigation.navigate('InternshipDetail', { internshipId: r.internship.id })
                    }
                  >
                    <Ionicons name="document-text-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Review Jurnal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      navigation.navigate('EvaluationForm', {
                        internshipId: r.internship.id,
                        studentId: r.internship.studentId,
                      })
                    }
                  >
                    <Ionicons name="ribbon-outline" size={14} color={COLORS.green} />
                    <Text style={[styles.actionText, { color: COLORS.green }]}>Beri Nilai</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600' },
});

export default SupervisedStudentsScreen;
```

## `src/screens/supervisor/SupervisorDashboardScreen.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getSupervisorStats, SupervisorStats } from '../../services/dashboardService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<SupervisorStackParamList>;

const SupervisorDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<SupervisorStats | null>(null);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const s = await getSupervisorStats(appUser.uid);
      setStats(s);
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading || !appUser) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Dashboard Pembimbing" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard Pembimbing" subtitle={appUser.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser.name.split(' ')[0]} ðŸ‘‹</Text>
          <Text style={styles.greetingSub}>Monitoring mahasiswa bimbingan</Text>
        </View>

        <View style={styles.rowWrap}>
          <StatCard label="Mahasiswa Bimbingan" value={stats?.totalStudents ?? 0} icon="people" color={COLORS.primary} />
          <StatCard label="Menunggu Review" value={stats?.pendingReviews ?? 0} icon="hourglass" color={COLORS.orange} />
        </View>
        <View style={styles.rowWrap}>
          <StatCard label="Perlu Revisi" value={stats?.needsRevision ?? 0} icon="refresh" color={COLORS.red} />
          <StatCard label="Disetujui" value={stats?.approved ?? 0} icon="checkmark-done" color={COLORS.green} />
        </View>

        <Text style={styles.sectionTitle}>Mahasiswa Bimbingan</Text>
        {!stats || stats.students.length === 0 ? (
          <EmptyState icon="people-outline" title="Belum ada mahasiswa" message="Belum ada mahasiswa yang ditugaskan." />
        ) : (
          stats.students.map((s) => {
            const int = stats.internships.find((i) => i.studentId === s.uid);
            return (
              <TouchableOpacity
                key={s.uid}
                style={styles.card}
                onPress={() =>
                  int && navigation.navigate('InternshipDetail', { internshipId: int.id })
                }
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{s.name}</Text>
                    <Text style={styles.meta}>{s.nim ?? '-'} â€¢ {s.studyProgram ?? '-'}</Text>
                    <Text style={styles.meta}>{int?.topic ?? '-'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  greeting: { marginBottom: SPACING.md },
  greetingTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  greetingSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
});

export default SupervisorDashboardScreen;
```

## `src/screens/supervisor/SupervisorReportScreen.tsx`

```tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import EvaluationCard from '../../components/EvaluationCard';
import { useAuth } from '../../hooks/useAuth';
import { listInternshipsBySupervisor } from '../../services/internshipService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import {
  listEvaluationsBySupervisor,
  EvaluationWithStudent,
} from '../../services/evaluationService';
import { calculateProgress } from '../../utils/progressUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AppUser, Internship, DailyLog } from '../../types';

interface StudentRow {
  internship: Internship;
  student: AppUser | null;
  logs: DailyLog[];
  approved: number;
  pending: number;
  revision: number;
  progress: number | null;
}

const SupervisorReportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { appUser } = useAuth();
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const [ints, evals] = await Promise.all([
        listInternshipsBySupervisor(appUser.uid),
        listEvaluationsBySupervisor(appUser.uid),
      ]);
      setEvaluations(evals);

      const result: StudentRow[] = [];
      for (const i of ints) {
        const [student, logs] = await Promise.all([
          fetchAppUser(i.studentId),
          listLogsByInternship(i.id),
        ]);
        result.push({
          internship: i,
          student,
          logs,
          approved: logs.filter((l) => l.reviewStatus === 'approved').length,
          pending: logs.filter((l) => l.reviewStatus === 'pending_review').length,
          revision: logs.filter((l) => l.reviewStatus === 'needs_revision').length,
          progress: calculateProgress(logs, i.targetDays),
        });
      }
      setRows(result);
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const finalEvals = useMemo(
    () => evaluations.filter((e) => e.isFinal),
    [evaluations]
  );

  const averageScore = useMemo(() => {
    if (finalEvals.length === 0) return null;
    const sum = finalEvals.reduce((acc, e) => acc + e.finalScore, 0);
    return Math.round((sum / finalEvals.length) * 100) / 100;
  }, [finalEvals]);

  const totalPending = rows.reduce((a, r) => a + r.pending, 0);
  const totalRevision = rows.reduce((a, r) => a + r.revision, 0);
  const totalApproved = rows.reduce((a, r) => a + r.approved, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Laporan Bimbingan" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Laporan Bimbingan" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionLabel}>Ringkasan</Text>
        <View style={styles.rowWrap}>
          <StatCard
            label="Mahasiswa"
            value={rows.length}
            icon="people"
            color={COLORS.primary}
          />
          <StatCard
            label="Nilai Rata-rata"
            value={averageScore === null ? 'â€”' : averageScore.toFixed(1)}
            icon="ribbon"
            color={COLORS.green}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Jurnal Menunggu"
            value={totalPending}
            icon="hourglass"
            color={COLORS.orange}
          />
          <StatCard
            label="Perlu Revisi"
            value={totalRevision}
            icon="refresh"
            color={COLORS.red}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Jurnal Disetujui"
            value={totalApproved}
            icon="checkmark-done"
            color={COLORS.green}
          />
          <StatCard
            label="Penilaian Final"
            value={finalEvals.length}
            icon="trophy"
            color={COLORS.purple}
          />
        </View>

        <Text style={styles.sectionLabel}>Progress per Mahasiswa</Text>
        {rows.length === 0 ? (
          <EmptyState icon="people-outline" title="Belum ada mahasiswa bimbingan" />
        ) : (
          rows.map((r) => (
            <TouchableOpacity
              key={r.internship.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('InternshipDetail', {
                  internshipId: r.internship.id,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1}>
                  {r.student?.name ?? 'Mahasiswa'}
                </Text>
                <Text style={styles.pct}>
                  {r.progress === null ? 'â€”' : `${r.progress.toFixed(0)}%`}
                </Text>
              </View>
              <Text style={styles.meta}>
                {r.student?.nim ?? '-'} â€¢ {r.student?.studyProgram ?? '-'}
              </Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(100, r.progress ?? 0)}%`,
                      backgroundColor:
                        (r.progress ?? 0) >= 100 ? COLORS.green
                          : (r.progress ?? 0) >= 50 ? COLORS.accent
                          : COLORS.orange,
                    },
                  ]}
                />
              </View>
              <View style={styles.chipRow}>
                <Chip label={`${r.approved} disetujui`} color={COLORS.green} />
                <Chip label={`${r.pending} menunggu`} color={COLORS.orange} />
                <Chip label={`${r.revision} revisi`} color={COLORS.red} />
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionLabel}>
          Penilaian Final ({finalEvals.length})
        </Text>
        {finalEvals.length === 0 ? (
          <EmptyState
            icon="ribbon-outline"
            title="Belum ada penilaian final"
            message="Penilaian yang difinalisasi akan tampil di sini."
          />
        ) : (
          finalEvals.map((e) => (
            <EvaluationCard
              key={e.id}
              evaluation={e}
              studentName={e.studentName}
              compact
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <View style={[styles.chip, { backgroundColor: `${color}15` }]}>
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700',
    textTransform: 'uppercase', marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  card: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  name: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  pct: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  barBg: {
    height: 6, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  chipRow: {
    flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  chip: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.full },
  chipText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
});

export default SupervisorReportScreen;
```

## `src/types/index.ts`

```tsx
// Semua tipe data utama aplikasi
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'student' | 'supervisor';
export type UserStatus = 'active' | 'inactive';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  nim?: string;              // Khusus mahasiswa
  studyProgram?: string;
  semester?: number;
  phone?: string;
  photoUrl?: string;
  nidn?: string;             // Khusus pembimbing
  createdAt: Timestamp;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  description?: string;
  createdAt: Timestamp;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface InternshipApplication {
  id: string;
  studentId: string;
  companyId: string;
  supervisorId?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  topic: string;
  description: string;
  proposalUrl?: string;
  status: ApplicationStatus;
  decisionNotes?: string;
  decidedBy?: string;
  decidedAt?: Timestamp;
  createdAt: Timestamp;
}

export type InternshipStatus = 'ongoing' | 'completed';

export interface Internship {
  id: string;
  applicationId: string;
  studentId: string;
  companyId: string;
  supervisorId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  topic: string;
  status: InternshipStatus;
  targetDays: number;
  createdAt: Timestamp;
}

export type ActivityType =
  | 'Pengembangan Aplikasi'
  | 'Analisis Sistem'
  | 'Instalasi dan Konfigurasi'
  | 'Administrasi'
  | 'Pengujian Sistem'
  | 'Kegiatan Lainnya';

export type ReviewStatus = 'pending_review' | 'approved' | 'needs_revision';

export interface DailyLog {
  id: string;
  internshipId: string;
  studentId: string;
  date: Timestamp;
  activityType: ActivityType;
  description: string;
  result: string;
  obstacles: string;
  photoUrl?: string;
  reviewStatus: ReviewStatus;
  supervisorComment?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Evaluation {
  id: string;
  internshipId: string;
  studentId: string;
  supervisorId: string;
  discipline: number;
  responsibility: number;
  communication: number;
  teamwork: number;
  technicalSkill: number;
  finalScore: number;
  notes?: string;
  isFinal: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
}
```

## `src/utils/dateUtils.ts`

```tsx
import { Timestamp } from 'firebase/firestore';

export const toDateString = (ts: Timestamp): string => {
  const d = ts.toDate();
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`;
};

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const isSameDay = (a: Date, b: Date): boolean => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
```

## `src/utils/progressUtils.ts`

```tsx
import { DailyLog } from '../types';

// Progress = (jumlah tanggal unik dengan jurnal DISETUJUI / target hari) Ã— 100
// Batasi 0â€“100. Jika target 0, kembalikan null (belum tersedia).
export const calculateProgress = (logs: DailyLog[], targetDays: number): number | null => {
  if (!targetDays || targetDays <= 0) return null;

  const approvedUniqueDates = new Set<string>();
  logs.forEach((log) => {
    if (log.reviewStatus === 'approved') {
      // Gunakan string tanggal (YYYY-MM-DD) sebagai kunci unik
      const d = log.date.toDate();
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      approvedUniqueDates.add(key);
    }
  });

  const progress = (approvedUniqueDates.size / targetDays) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
};
```

## `src/utils/scoreUtils.ts`

```tsx
// Perhitungan nilai akhir sesuai bobot yang ditentukan
export const calculateFinalScore = (
  discipline: number,
  responsibility: number,
  communication: number,
  teamwork: number,
  technicalSkill: number
): number => {
  const final =
    discipline * 0.20 +
    responsibility * 0.20 +
    communication * 0.15 +
    teamwork * 0.15 +
    technicalSkill * 0.30;
  return Math.round(final * 100) / 100; // dua desimal
};
```

## `src/utils/validation.ts`

```tsx
export const isNonEmpty = (value: string): boolean => value.trim().length > 0;

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPassword = (value: string): boolean => value.length >= 6;

export const isValidScore = (value: number): boolean =>
  Number.isFinite(value) && value >= 0 && value <= 100;

```

## `src/utils/workflowUtils.ts`

```tsx
// Util bisnis proses: label, transisi status, dan predikat workflow
import {
  ApplicationStatus,
  InternshipStatus,
  ReviewStatus,
} from '../types';

// ---- Label ----
export const applicationStatusLabel = (s: ApplicationStatus): string => {
  switch (s) {
    case 'pending': return 'Menunggu';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    default: return s;
  }
};

export const reviewStatusLabel = (s: ReviewStatus): string => {
  switch (s) {
    case 'pending_review': return 'Menunggu Review';
    case 'approved': return 'Disetujui';
    case 'needs_revision': return 'Perlu Revisi';
    default: return s;
  }
};

export const internshipStatusLabel = (s: InternshipStatus): string => {
  switch (s) {
    case 'ongoing': return 'Berlangsung';
    case 'completed': return 'Selesai';
    default: return s;
  }
};

// ---- Predikat workflow ----
// Mahasiswa boleh mengedit jurnal selama belum disetujui
export const canStudentEditLog = (status: ReviewStatus): boolean =>
  status !== 'approved';

// Mahasiswa boleh menghapus jurnal selama belum disetujui
export const canStudentDeleteLog = (status: ReviewStatus): boolean =>
  status !== 'approved';

// Mahasiswa boleh mengajukan jurnal baru jika magang aktif dan belum ada jurnal di tanggal tersebut.
// (Pengecekan duplikat dilakukan di service.)
export const canAddDailyLog = (hasActiveInternship: boolean): boolean =>
  hasActiveInternship;

// Pengajuan dapat direview jika masih berstatus pending
export const canReviewApplication = (status: ApplicationStatus): boolean =>
  status === 'pending';

// Transisi status review yang diizinkan
export const nextReviewStatus = (
  current: ReviewStatus,
  action: 'approve' | 'request_revision' | 'resubmit'
): ReviewStatus | null => {
  if (action === 'approve' && current === 'pending_review') return 'approved';
  if (action === 'request_revision' && current === 'pending_review') return 'needs_revision';
  if (action === 'resubmit' && current === 'needs_revision') return 'pending_review';
  return null;
};

// Transisi status pengajuan yang diizinkan
export const nextApplicationStatus = (
  current: ApplicationStatus,
  action: 'approve' | 'reject'
): ApplicationStatus | null => {
  if (current !== 'pending') return null;
  if (action === 'approve') return 'approved';
  if (action === 'reject') return 'rejected';
  return null;
};

// Predikat jurnal butuh perhatian mahasiswa
export const logNeedsStudentAction = (status: ReviewStatus): boolean =>
  status === 'needs_revision';

// Predikat jurnal butuh perhatian pembimbing
export const logNeedsSupervisorAction = (status: ReviewStatus): boolean =>
  status === 'pending_review';
```


