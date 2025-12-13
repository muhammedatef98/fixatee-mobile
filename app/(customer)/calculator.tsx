import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { getColors, getShadows, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import BottomNav from '../../components/BottomNav';
import { BRANDS } from '../../constants/repairData';
import { BrandLogo } from '../../components/BrandLogo';

const { width } = Dimensions.get('window');

// Pricing Data
const getPricingData = (language: 'ar' | 'en', deviceType: string | null) => ({
  brands: BRANDS.filter(b => b.deviceType === deviceType).map(b => ({ id: b.id, name: b.name })),
  devices: [
    { id: 'phone', nameAr: 'جوال', nameEn: 'Phone', icon: 'cellphone' },
    { id: 'tablet', nameAr: 'تابلت', nameEn: 'Tablet', icon: 'tablet' },
    { id: 'laptop', nameAr: 'لابتوب', nameEn: 'Laptop', icon: 'laptop' },
  ],
  issues: [
    { id: 'screen', nameAr: 'كسر الشاشة', nameEn: 'Screen Crack', basePrice: 250 },
    { id: 'battery', nameAr: 'تغيير بطارية', nameEn: 'Battery Replacement', basePrice: 120 },
    { id: 'charging', nameAr: 'مدخل الشحن', nameEn: 'Charging Port', basePrice: 100 },
    { id: 'camera', nameAr: 'الكاميرا', nameEn: 'Camera', basePrice: 180 },
    { id: 'software', nameAr: 'سوفتوير', nameEn: 'Software', basePrice: 80 },
  ]
});

export default function PriceCalculatorScreen() {
  const router = useRouter();
  const { isDark, language } = useApp();
  const COLORS = getColors(isDark);
  const SHADOWS = getShadows(isDark);
  const isRTL = language === 'ar';
  
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const PRICING_DATA = getPricingData(language, selectedDevice);

  const calculatePrice = () => {
    if (!selectedIssue) return 0;
    const issue = PRICING_DATA.issues.find(i => i.id === selectedIssue);
    let price = issue?.basePrice || 0;

    // Price adjustments based on brand/device
    if (selectedBrand === 'apple') price *= 1.2;
    if (selectedDevice === 'laptop') price *= 1.5;
    if (selectedDevice === 'tablet') price *= 1.3;

    return Math.round(price);
  };

  const totalPrice = calculatePrice();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.surface }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: COLORS.background }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name={isRTL ? "arrow-forward" : "arrow-back"} size={20} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            {isRTL ? 'حاسبة الأسعار' : 'Price Calculator'}
          </Text>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Brand Selection */}
        <Text style={[styles.sectionTitle, { color: COLORS.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اختر الماركة' : 'Choose Brand'}
        </Text>
        <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {PRICING_DATA.brands.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={[
                styles.card,
                { backgroundColor: COLORS.surface },
                selectedBrand === brand.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }
              ]}
              onPress={() => setSelectedBrand(brand.id)}
            >
              <BrandLogo brandId={brand.id} size={40} />
              <Text style={[
                styles.cardText,
                { color: selectedBrand === brand.id ? COLORS.primary : COLORS.textSecondary }
              ]}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Device Selection */}
        <Text style={[styles.sectionTitle, { color: COLORS.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اختر نوع الجهاز' : 'Choose Device Type'}
        </Text>
        <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {PRICING_DATA.devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={[
                styles.card,
                { backgroundColor: COLORS.surface },
                selectedDevice === device.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }
              ]}
              onPress={() => setSelectedDevice(device.id)}
            >
              <MaterialCommunityIcons 
                name={device.icon as any} 
                size={32} 
                color={selectedDevice === device.id ? COLORS.primary : COLORS.textSecondary} 
              />
              <Text style={[
                styles.cardText,
                { color: selectedDevice === device.id ? COLORS.primary : COLORS.textSecondary }
              ]}>{isRTL ? device.nameAr : device.nameEn}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Issue Selection */}
        <Text style={[styles.sectionTitle, { color: COLORS.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اختر نوع العطل' : 'Choose Issue Type'}
        </Text>
        <View style={styles.list}>
          {PRICING_DATA.issues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.listItem,
                { backgroundColor: COLORS.surface, borderColor: COLORS.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
                selectedIssue === issue.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }
              ]}
              onPress={() => setSelectedIssue(issue.id)}
            >
              <Text style={[
                styles.listItemText,
                { color: selectedIssue === issue.id ? COLORS.primary : COLORS.text, textAlign: isRTL ? 'right' : 'left' }
              ]}>{isRTL ? issue.nameAr : issue.nameEn}</Text>
              {selectedIssue === issue.id && (
                <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Price Result Footer */}
      <View style={[styles.footer, { backgroundColor: COLORS.surface, borderTopColor: COLORS.border }]}>
        <View style={[styles.priceContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.priceLabel, { color: COLORS.text }]}>
            {isRTL ? 'السعر التقديري:' : 'Estimated Price:'}
          </Text>
          <Text style={[styles.priceValue, { color: COLORS.primary }]}>
            {totalPrice > 0 ? (isRTL ? `${totalPrice} ر.س` : `SAR ${totalPrice}`) : '--'}
          </Text>
        </View>
        <Text style={[styles.disclaimer, { color: COLORS.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL 
            ? '* السعر نهائي بعد الفحص وقد يختلف حسب الموديل الدقيق'
            : '* Final price after inspection, may vary by model'
          }
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.bookBtn,
            { backgroundColor: COLORS.primary, flexDirection: isRTL ? 'row-reverse' : 'row' },
            totalPrice === 0 && { backgroundColor: COLORS.textSecondary, opacity: 0.5 }
          ]}
          disabled={totalPrice === 0}
          onPress={() => router.push('/request')}
        >
          <Text style={styles.bookBtnText}>
            {isRTL ? 'احجز موعد صيانة الآن' : 'Book Service Now'}
          </Text>
          <MaterialIcons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 180,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  grid: {
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    gap: SPACING.sm,
  },
  listItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  listItemText: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
  priceContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  bookBtn: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
