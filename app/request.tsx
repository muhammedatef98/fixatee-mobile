import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, TextInput, Animated, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRequests } from '../context/RequestContext';
import { orders as supabaseOrders, storage } from '../lib/supabase';
import { BrandLogo } from '../components/BrandLogo';
import { BRANDS, ISSUES, searchBrands, searchModels, searchIssues, Brand, Issue } from '../constants/repairData';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

const DEVICE_TYPES = [
  { id: 'phone', name: 'جوال', nameEn: 'Phone', icon: 'cellphone' },
  { id: 'tablet', name: 'تابلت', nameEn: 'Tablet', icon: 'tablet' },
  { id: 'laptop', name: 'لابتوب', nameEn: 'Laptop', icon: 'laptop' },
  { id: 'watch', name: 'ساعة ذكية', nameEn: 'Smart Watch', icon: 'watch' },
];

export default function RequestScreen() {
  const router = useRouter();
  const { addRequest } = useRequests();
  const { language } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Selection State
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('phone'); // Default to phone
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  
  // Search State
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  
  // Filtered Data
  const [filteredBrands, setFilteredBrands] = useState(BRANDS);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const [filteredIssues, setFilteredIssues] = useState(ISSUES);
  
  // Location State
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const STEPS = language === 'ar' 
    ? ['الماركة', 'النوع', 'الموديل', 'العطل', 'التفاصيل', 'الموقع']
    : ['Brand', 'Type', 'Model', 'Issue', 'Details', 'Location'];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  // Search Effects
  useEffect(() => {
    const allBrands = searchBrands(brandSearch);
    // Filter brands by selected device type
    const filtered = selectedDeviceType 
      ? allBrands.filter(b => b.deviceType === selectedDeviceType)
      : allBrands.filter(b => b.deviceType === 'phone'); // Default to phone
    setFilteredBrands(filtered);
  }, [brandSearch, selectedDeviceType]);

  useEffect(() => {
    if (selectedBrand) {
      setFilteredModels(searchModels(selectedBrand.id, modelSearch));
    }
  }, [modelSearch, selectedBrand]);

  useEffect(() => {
    setFilteredIssues(searchIssues(issueSearch, language));
  }, [issueSearch, language]);

  useEffect(() => {
    getLocation();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'ar' ? 'تنبيه' : 'Alert',
          language === 'ar' ? 'نحتاج إذن الوصول للمعرض' : 'We need gallery access permission'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setMediaFiles([...mediaFiles, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'ar' ? 'تنبيه' : 'Alert',
          language === 'ar' ? 'نحتاج إذن الكاميرا' : 'We need camera permission'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setMediaFiles([...mediaFiles, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const removeMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'ar' ? 'تنبيه' : 'Alert',
          language === 'ar' ? 'نحتاج إذن الموقع لتحديد موقعك' : 'We need location permission to determine your location'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const addresses = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        setAddress(`${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedBrand) {
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Alert', language === 'ar' ? 'الرجاء اختيار الماركة' : 'Please select a brand');
      return;
    }
    if (currentStep === 1 && !selectedType) {
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Alert', language === 'ar' ? 'الرجاء اختيار النوع' : 'Please select a type');
      return;
    }
    if (currentStep === 2 && !selectedModel) {
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Alert', language === 'ar' ? 'الرجاء اختيار الموديل' : 'Please select a model');
      return;
    }
    if (currentStep === 3 && !selectedIssue) {
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Alert', language === 'ar' ? 'الرجاء اختيار العطل' : 'Please select an issue');
      return;
    }

    if (currentStep < STEPS.length - 1) {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const submitRequest = async () => {
    if (!location) {
      Alert.alert(language === 'ar' ? 'تنبيه' : 'Alert', language === 'ar' ? 'الرجاء تحديد الموقع' : 'Please select a location');
      return;
    }

    try {
      const user = await auth.getCurrentUser();
      
      if (user) {
        // Upload media files if any
        let uploadedUrls: string[] = [];
        if (mediaFiles.length > 0) {
          Alert.alert(
            language === 'ar' ? 'جاري الرفع...' : 'Uploading...',
            language === 'ar' ? 'يتم رفع الملفات' : 'Uploading files'
          );

          for (let i = 0; i < mediaFiles.length; i++) {
            try {
              const uri = mediaFiles[i];
              const fileName = `order-${Date.now()}-${i}.jpg`;
              const url = await storage.uploadImageFromUri('orders', uri, fileName);
              uploadedUrls.push(url);
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
            }
          }
        }

        // Save to Supabase
        const order = await supabaseOrders.create({
          user_id: user.id,
          service_id: selectedIssue?.id || 'unknown',
          device_brand: selectedBrand?.name || '',
          device_model: selectedModel || '',
          issue_description: `${selectedIssue?.name}: ${issueDescription}`,
          estimated_price: selectedIssue?.estimatedPrice || 0,
          location: address,
          latitude: location.latitude,
          longitude: location.longitude,
          media_urls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        });

        if (order) {
          Alert.alert(
            language === 'ar' ? 'نجح!' : 'Success!',
            language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Your request has been submitted successfully',
            [
              {
                text: language === 'ar' ? 'حسناً' : 'OK',
                onPress: () => router.replace('/(customer)'),
              },
            ]
          );
        }
      } else {
        // Fallback to local storage
        const newRequest = {
          id: Date.now().toString(),
          brand: selectedBrand?.name || '',
          type: selectedType || '',
          model: selectedModel || '',
          issue: selectedIssue?.name || '',
          description: issueDescription,
          location: address,
          status: 'pending',
          date: new Date().toISOString(),
          price: selectedIssue?.estimatedPrice || 0,
        };

        addRequest(newRequest);
        
        Alert.alert(
          language === 'ar' ? 'نجح!' : 'Success!',
          language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Your request has been submitted successfully',
          [
            {
              text: language === 'ar' ? 'حسناً' : 'OK',
              onPress: () => router.replace('/(customer)'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert(language === 'ar' ? 'خطأ' : 'Error', language === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'An error occurred while submitting the request');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              index <= currentStep && styles.stepCircleActive,
            ]}
          >
            {index < currentStep ? (
              <MaterialIcons name="check" size={16} color="#FFF" />
            ) : (
              <Text style={styles.stepNumber}>{index + 1}</Text>
            )}
          </View>
          <Text style={styles.stepLabel}>{step}</Text>
          {index < STEPS.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderSearchBar = (placeholder: string, value: string, onChangeText: (text: string) => void) => (
    <View style={styles.searchContainer}>
      <MaterialIcons name="search" size={20} color={COLORS.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderBrandSelection = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'اختر الماركة' : 'Select Brand'}
      </Text>
      
      {renderSearchBar(
        language === 'ar' ? 'ابحث عن الماركة...' : 'Search for brand...',
        brandSearch,
        setBrandSearch
      )}

      <ScrollView
        style={styles.optionsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsGrid}>
          {filteredBrands.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={[
                styles.brandCard,
                selectedBrand?.id === brand.id && styles.optionActive,
              ]}
              onPress={() => {
                setSelectedBrand(brand);
                setSelectedModel(null);
                setFilteredModels(brand.models);
              }}
            >
              <BrandLogo brandId={brand.id} size={60} />
              <Text style={styles.brandName}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderTypeSelection = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'اختر نوع الجهاز' : 'Select Device Type'}
      </Text>
      <View style={styles.optionsGrid}>
        {DEVICE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.optionCard,
              selectedType === type.id && styles.optionActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <MaterialCommunityIcons
              name={type.icon as any}
              size={40}
              color={selectedType === type.id ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={styles.optionText}>
              {language === 'ar' ? type.name : type.nameEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderModelSelection = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'اختر الموديل' : 'Select Model'}
      </Text>
      
      {renderSearchBar(
        language === 'ar' ? 'ابحث عن الموديل...' : 'Search for model...',
        modelSearch,
        setModelSearch
      )}

      <ScrollView
        style={styles.optionsScroll}
        showsVerticalScrollIndicator={false}
      >
        {filteredModels.map((model, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.listOption,
              selectedModel === model && styles.listOptionActive,
            ]}
            onPress={() => setSelectedModel(model)}
          >
            <Text
              style={[
                styles.listOptionText,
                selectedModel === model && styles.listOptionTextActive,
              ]}
            >
              {model}
            </Text>
            {selectedModel === model && (
              <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderIssueSelection = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'ما هي المشكلة؟' : 'What is the issue?'}
      </Text>
      
      {renderSearchBar(
        language === 'ar' ? 'ابحث عن المشكلة...' : 'Search for issue...',
        issueSearch,
        setIssueSearch
      )}

      <ScrollView
        style={styles.optionsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.issuesGrid}>
          {filteredIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueCard,
                selectedIssue?.id === issue.id && styles.optionActive,
              ]}
              onPress={() => setSelectedIssue(issue)}
            >
              <MaterialCommunityIcons
                name={issue.icon as any}
                size={32}
                color={selectedIssue?.id === issue.id ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.issueText}>
                {language === 'ar' ? issue.nameAr : issue.name}
              </Text>
              <Text style={styles.issuePrice}>
                {issue.estimatedPrice} {language === 'ar' ? 'ر.س' : 'SAR'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderDetailsStep = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'وصف المشكلة' : 'Describe the Issue'}
      </Text>
      <TextInput
        style={styles.textArea}
        placeholder={language === 'ar' ? 'اكتب تفاصيل المشكلة هنا...' : 'Write issue details here...'}
        placeholderTextColor={COLORS.textSecondary}
        multiline
        numberOfLines={6}
        value={issueDescription}
        onChangeText={setIssueDescription}
        textAlignVertical="top"
      />

      <Text style={styles.mediaLabel}>
        {language === 'ar' ? 'إضافة صور أو فيديو (اختياري)' : 'Add Photos or Video (Optional)'}
      </Text>
      
      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={24} color={COLORS.primary} />
          <Text style={styles.mediaButtonText}>
            {language === 'ar' ? 'التقاط صورة' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={24} color={COLORS.primary} />
          <Text style={styles.mediaButtonText}>
            {language === 'ar' ? 'من المعرض' : 'From Gallery'}
          </Text>
        </TouchableOpacity>
      </View>

      {mediaFiles.length > 0 && (
        <ScrollView horizontal style={styles.mediaPreview} showsHorizontalScrollIndicator={false}>
          {mediaFiles.map((uri, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri }} style={styles.mediaImage} />
              <TouchableOpacity
                style={styles.mediaRemove}
                onPress={() => removeMedia(index)}
              >
                <MaterialIcons name="close" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          {language === 'ar' ? 'ملخص الطلب' : 'Request Summary'}
        </Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{language === 'ar' ? 'الماركة:' : 'Brand:'}</Text>
          <Text style={styles.summaryValue}>{selectedBrand?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{language === 'ar' ? 'النوع:' : 'Type:'}</Text>
          <Text style={styles.summaryValue}>{selectedType}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{language === 'ar' ? 'الموديل:' : 'Model:'}</Text>
          <Text style={styles.summaryValue}>{selectedModel}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{language === 'ar' ? 'المشكلة:' : 'Issue:'}</Text>
          <Text style={styles.summaryValue}>
            {language === 'ar' ? selectedIssue?.nameAr : selectedIssue?.name}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>
            {language === 'ar' ? 'السعر التقديري:' : 'Estimated Price:'}
          </Text>
          <Text style={styles.summaryTotalValue}>
            {selectedIssue?.estimatedPrice} {language === 'ar' ? 'ر.س' : 'SAR'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderLocationStep = () => (
    <Animated.View
      style={[
        styles.stepContent,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.stepTitle}>
        {language === 'ar' ? 'حدد موقعك' : 'Select Your Location'}
      </Text>
      
      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={getLocation}
      >
        <MaterialIcons name="my-location" size={24} color="#FFF" />
        <Text style={styles.currentLocationText}>
          {language === 'ar' ? 'موقعي الحالي' : 'My Current Location'}
        </Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{language === 'ar' ? 'أو' : 'OR'}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Address Search Input */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'ar' ? 'ابحث عن عنوان...' : 'Search for address...'}
          placeholderTextColor={COLORS.textSecondary}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Map Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setShowMap(true)}
      >
        <MaterialIcons name="location-on" size={24} color={COLORS.primary} />
        <Text style={styles.locationButtonText}>
          {language === 'ar' ? 'اختر على الخريطة' : 'Choose on Map'}
        </Text>
      </TouchableOpacity>

      {location && (
        <View style={styles.mapPreview}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={location}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={location} />
          </MapView>
        </View>
      )}

      <Modal visible={showMap} animationType="slide">
        <SafeAreaView style={styles.mapModal}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <MaterialIcons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.mapHeaderTitle}>
              {language === 'ar' ? 'اختر الموقع' : 'Choose Location'}
            </Text>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <Text style={styles.mapHeaderDone}>
                {language === 'ar' ? 'تم' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
          {location && (
            <MapView
              style={styles.fullMap}
              provider={PROVIDER_GOOGLE}
              region={location}
              onRegionChangeComplete={async (region) => {
                setLocation(region);
                const addresses = await Location.reverseGeocodeAsync({
                  latitude: region.latitude,
                  longitude: region.longitude,
                });
                if (addresses.length > 0) {
                  const addr = addresses[0];
                  setAddress(`${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`);
                }
              }}
            >
              <Marker coordinate={location} />
            </MapView>
          )}
        </SafeAreaView>
      </Modal>
    </Animated.View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBrandSelection();
      case 1:
        return renderTypeSelection();
      case 2:
        return renderModelSelection();
      case 3:
        return renderIssueSelection();
      case 4:
        return renderDetailsStep();
      case 5:
        return renderLocationStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'طلب صيانة' : 'Repair Request'}
          </Text>
          <View style={styles.backButton} />
        </View>

        {renderStepIndicator()}

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep < STEPS.length - 1 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {language === 'ar' ? 'التالي' : 'Next'}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitRequest}
            >
              <Text style={styles.submitButtonText}>
                {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: COLORS.border,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: SPACING.lg,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
  },
  optionsScroll: {
    maxHeight: 500,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  brandCard: {
    width: (width - SPACING.lg * 2 - SPACING.xs * 4) / 3,
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  optionActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  brandLogoContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  brandLogo: {
    width: '80%',
    height: '100%',
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  optionCard: {
    width: (width - SPACING.lg * 2 - SPACING.xs * 2) / 2,
    aspectRatio: 1.2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    margin: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  listOptionActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  listOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  listOptionTextActive: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  issuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  issueCard: {
    width: (width - SPACING.lg * 2 - SPACING.xs * 4) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  issueText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  issuePrice: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 120,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryTotal: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    borderBottomWidth: 0,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  currentLocationText: {
    marginLeft: SPACING.md,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  locationButtonText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  mapPreview: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  map: {
    flex: 1,
  },
  mapModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  mapHeaderDone: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fullMap: {
    flex: 1,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginRight: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  mediaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  mediaPreview: {
    marginBottom: SPACING.md,
  },
  mediaItem: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
  },
  mediaRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
