import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColors, getShadows, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { translations } from '../constants/translations';

const CONTACT_INFO = {
  phone: '0548940042',
  email: 'fixate01@gmail.com',
  whatsapp: '966548940042', // Saudi format
};

export default function ContactScreen() {
  const router = useRouter();
  const { language, isDark } = useApp();
  const COLORS = getColors(isDark);
  const SHADOWS = getShadows(isDark);
  const t = translations[language];
  const isRTL = language === 'ar';

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.email}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${CONTACT_INFO.whatsapp}`);
  };

  const handleChatBot = () => {
    router.push('/chatbot');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.contact.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Methods */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: COLORS.card }, SHADOWS.neuSmall]}
            onPress={handleCall}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="call" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: COLORS.textSecondary }]}>
                {t.contact.phone}
              </Text>
              <Text style={[styles.contactValue, { color: COLORS.text }]}>
                {CONTACT_INFO.phone}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: COLORS.card }, SHADOWS.neuSmall]}
            onPress={handleEmail}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="mail" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: COLORS.textSecondary }]}>
                {t.contact.email}
              </Text>
              <Text style={[styles.contactValue, { color: COLORS.text }]}>
                {CONTACT_INFO.email}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: COLORS.card }, SHADOWS.neuSmall]}
            onPress={handleWhatsApp}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#25D366' + '20' }]}>
              <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: COLORS.textSecondary }]}>
                WhatsApp
              </Text>
              <Text style={[styles.contactValue, { color: COLORS.text }]}>
                {CONTACT_INFO.phone}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Chatbot */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.chatbotCard, { backgroundColor: COLORS.primary }, SHADOWS.primaryGlow]}
            onPress={handleChatBot}
          >
            <Ionicons name="chatbubbles" size={32} color="#fff" />
            <View style={styles.chatbotContent}>
              <Text style={styles.chatbotTitle}>{t.contact.chatBot}</Text>
              <Text style={styles.chatbotSubtitle}>
                {t.contact.workingHoursValue}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: COLORS.card }, SHADOWS.neuSmall]}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={[styles.infoLabel, { color: COLORS.textSecondary }]}>
                {t.contact.workingHours}
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: COLORS.text }]}>
              {t.contact.workingHoursValue}
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: COLORS.card }, SHADOWS.neuSmall]}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={[styles.infoLabel, { color: COLORS.textSecondary }]}>
                {t.contact.location}
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: COLORS.text }]}>
              {t.contact.locationValue}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  contactInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatbotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  chatbotContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  chatbotSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 28,
  },
});
