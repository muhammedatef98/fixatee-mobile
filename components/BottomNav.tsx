import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getColors, getShadows, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { translations } from '../constants/translations';

interface NavItem {
  path: string;
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  labelKey: string;
  iconSet: 'MaterialIcons' | 'MaterialCommunityIcons';
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: 'home', labelKey: 'home', iconSet: 'MaterialIcons' },
  { path: '/services', icon: 'wrench', labelKey: 'services', iconSet: 'MaterialCommunityIcons' },
  { path: '/calculator', icon: 'calculate', labelKey: 'calculator', iconSet: 'MaterialIcons' },
  { path: '/profile', icon: 'person', labelKey: 'profile', iconSet: 'MaterialIcons' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, isDark } = useApp();
  const COLORS = getColors(isDark);
  const SHADOWS = getShadows(isDark);
  const isRTL = language === 'ar';
  const t = translations[language];
  
  const navItems = isRTL ? NAV_ITEMS : [...NAV_ITEMS].reverse();
  
  const styles = createStyles(COLORS, SHADOWS);
  
  return (
    <View style={styles.container}>
      <View style={[styles.navBar, isRTL && styles.navBarRTL]}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || 
            (item.path === '/' && pathname === '/index');
          
          return (
            <NavButton
              key={item.path}
              item={item}
              label={t[item.labelKey as keyof typeof t] as string}
              isActive={isActive}
              onPress={() => router.push(item.path as any)}
              colors={COLORS}
              shadows={SHADOWS}
            />
          );
        })}
      </View>
      
      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

interface NavButtonProps {
  item: NavItem;
  label: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
  shadows: any;
}

function NavButton({ item, label, isActive, onPress, colors, shadows }: NavButtonProps) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const translateYAnim = useRef(new Animated.Value(isActive ? -10 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(translateYAnim, {
        toValue: isActive ? -10 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [isActive]);

  const IconComponent = item.iconSet === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;

  return (
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          isActive && [styles.iconContainerActive, { backgroundColor: colors.primary, ...shadows.primaryGlow }],
          {
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <IconComponent
          name={item.icon as any}
          size={24}
          color={isActive ? colors.white : colors.textSecondary}
        />
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: scaleAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const createStyles = (COLORS: any, SHADOWS: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background + 'E6', // 90% opacity
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    height: 80,
  },
  navBarRTL: {
    flexDirection: 'row-reverse',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    // Dynamic styles applied inline
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -64,
    width: 128,
    height: 4,
    backgroundColor: COLORS.textLight,
    borderRadius: BORDER_RADIUS.full,
  },
});

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
