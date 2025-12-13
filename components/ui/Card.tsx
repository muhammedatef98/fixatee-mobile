import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  onPress,
  variant = 'elevated' 
}) => {
  const Container = onPress ? TouchableOpacity : View;

  const getStyle = () => {
    switch (variant) {
      case 'elevated': return [styles.container, SHADOWS.small];
      case 'outlined': return [styles.container, styles.outlined];
      case 'flat': return [styles.container, styles.flat];
      default: return [styles.container, SHADOWS.small];
    }
  };

  return (
    <Container 
      style={[getStyle(), style]} 
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'transparent',
  },
  flat: {
    backgroundColor: COLORS.background,
  },
});
