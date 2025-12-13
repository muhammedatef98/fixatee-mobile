import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

interface BrandLogoProps {
  brandId: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandId, size = 60 }) => {
  const renderLogo = () => {
    switch (brandId) {
      case 'apple':
      case 'apple-tablet':
      case 'apple-laptop':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#000000', width: size, height: size, borderRadius: size / 2 }]}>
            <MaterialCommunityIcons name="apple" size={size * 0.6} color="#FFFFFF" />
          </View>
        );
      
      case 'samsung':
      case 'samsung-tablet':
      case 'samsung-printer':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#1428A0', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.18, color: '#FFFFFF', fontWeight: 'bold', letterSpacing: 0.5 }]}>SAMSUNG</Text>
          </View>
        );
      
      case 'huawei':
      case 'huawei-tablet':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FF0000', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.22, color: '#FFFFFF' }]}>HUAWEI</Text>
          </View>
        );
      
      case 'xiaomi':
      case 'xiaomi-tablet':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FF6900', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.35, color: '#FFFFFF', fontWeight: 'bold' }]}>MI</Text>
          </View>
        );
      
      case 'oppo':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#00A368', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF' }]}>OPPO</Text>
          </View>
        );
      
      case 'vivo':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#0066CC', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF' }]}>vivo</Text>
          </View>
        );
      
      case 'realme':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FFD700', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.22, color: '#000000' }]}>realme</Text>
          </View>
        );
      
      case 'oneplus':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FF0000', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.18, color: '#FFFFFF' }]}>OnePlus</Text>
          </View>
        );
      
      case 'nokia':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#124191', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF' }]}>NOKIA</Text>
          </View>
        );
      
      case 'motorola':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#000000', width: size, height: size, borderRadius: size / 2 }]}>
            <MaterialCommunityIcons name="alpha-m-circle" size={size * 0.7} color="#FFFFFF" />
          </View>
        );
      
      case 'sony':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#000000', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF' }]}>SONY</Text>
          </View>
        );
      
      case 'lg':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#A50034', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.35, color: '#FFFFFF', fontWeight: 'bold' }]}>LG</Text>
          </View>
        );
      
      case 'google':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#4285F4', width: size, height: size, borderRadius: size / 2 }]}>
            <MaterialCommunityIcons name="google" size={size * 0.6} color="#FFFFFF" />
          </View>
        );
      
      case 'honor':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#0066CC', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.23, color: '#FFFFFF' }]}>HONOR</Text>
          </View>
        );
      
      case 'infinix':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FF6B35', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.2, color: '#FFFFFF' }]}>Infinix</Text>
          </View>
        );
      
      case 'tecno':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#0066CC', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.23, color: '#FFFFFF' }]}>TECNO</Text>
          </View>
        );
      
      case 'lenovo':
      case 'lenovo-tablet':
      case 'lenovo-laptop':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#E2001A', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.22, color: '#FFFFFF', fontWeight: '600' }]}>Lenovo</Text>
          </View>
        );
      
      case 'hp':
      case 'hp-printer':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#0096D6', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.35, color: '#FFFFFF', fontWeight: 'bold' }]}>hp</Text>
          </View>
        );
      
      case 'dell':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#007DB8', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF', fontWeight: 'bold' }]}>DELL</Text>
          </View>
        );
      
      case 'asus':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#000000', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.25, color: '#FFFFFF', fontWeight: 'bold' }]}>ASUS</Text>
          </View>
        );
      
      case 'canon':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#CC0000', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.23, color: '#FFFFFF', fontWeight: 'bold' }]}>Canon</Text>
          </View>
        );
      
      case 'epson':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#003DA5', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.23, color: '#FFFFFF', fontWeight: 'bold' }]}>EPSON</Text>
          </View>
        );
      
      case 'brother':
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#FFD100', width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.brandText, { fontSize: size * 0.2, color: '#000000', fontWeight: 'bold' }]}>Brother</Text>
          </View>
        );
      
      default:
        return (
          <View style={[styles.logoContainer, { backgroundColor: '#666666', width: size, height: size, borderRadius: size / 2 }]}>
            <MaterialCommunityIcons name="cellphone" size={size * 0.5} color="#FFFFFF" />
          </View>
        );
    }
  };

  return renderLogo();
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
