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
            {company.industry} • {company.location}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {company.contactPerson} • {company.phone}
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