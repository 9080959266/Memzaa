import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

export const CustomButton: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#334155';
    switch (variant) {
      case 'primary':
        return '#f59e0b';
      case 'secondary':
        return '#1e293b';
      case 'danger':
        return '#e11d48';
      case 'ghost':
        return 'transparent';
      default:
        return '#f59e0b';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#64748b';
    switch (variant) {
      case 'primary':
        return '#0f172a';
      case 'secondary':
      case 'danger':
        return '#ffffff';
      case 'ghost':
        return '#94a3b8';
      default:
        return '#0f172a';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: '#334155',
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
