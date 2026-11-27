import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Eye, Sparkles } from 'lucide-react-native';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { VLibrasText as Text } from '../../../components/accessibility/VLibrasText';
import AccessibilitySettingsPanel from '../../../components/accessibility/AccessibilitySettingsPanel';
import { useAccessibility } from '../../../components/accessibility/AccessibilityContext';
import { useAuth } from '../../../components/context/AuthContext';
import { useTheme } from '../../../components/context/ThemeContext';

export default function ConfiguracoesScreen() {
  const { width } = useWindowDimensions();
  const { status } = useAuth();
  const { theme, isLightMode } = useTheme();
  const { highContrast } = useAccessibility();

  const showSidebar = status === 'authenticated' && width >= 900;
  const styles = getStyles(theme, width < 720);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={highContrast || isLightMode ? 'dark-content' : 'light-content'}
        backgroundColor={theme.headerBg}
      />

      <View style={styles.dashboardContainer}>
        {showSidebar ? <Sidebar /> : null}

        <View style={styles.mainContent}>
          <Header />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.settingsHero}>
                <View style={styles.settingsHeroOrb} accessible={false} />
                <View style={styles.settingsHeroEyebrowRow}>
                  <Sparkles size={15} color={theme.artGold || theme.accent} accessible={false} />
                  <Text style={styles.settingsHeroEyebrow}>SEU PORTAL, DO SEU JEITO</Text>
                </View>
                <Text style={styles.settingsHeroTitle} accessibilityRole="header">Conforto também faz parte da experiência.</Text>
                <Text style={styles.settingsHeroText}>
                  Ajuste leitura, contraste e acessibilidade sem perder a identidade visual do Portal da Arte.
                </Text>
              </View>

              <View style={styles.tabs} accessibilityRole="tablist">
                <View style={styles.activeTab} accessibilityRole="tab" accessibilityState={{ selected: true }}>
                  <Eye size={18} color={theme.accent} accessible={false} />
                  <Text style={styles.activeTabText}>Acessibilidade</Text>
                </View>
              </View>

              <AccessibilitySettingsPanel compact={width < 720} />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: any, compact: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBg,
      ...Platform.select({ web: { height: '100vh' as any, overflow: 'hidden' } }),
    },
    dashboardContainer: { flex: 1, flexDirection: 'row', backgroundColor: theme.mainBg },
    mainContent: { flex: 1, minWidth: 0, backgroundColor: theme.mainBg },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 36 },
    contentWrapper: {
      width: '100%', maxWidth: 960, alignSelf: 'center',
      paddingHorizontal: compact ? 18 : 32, paddingTop: compact ? 22 : 32,
    },
    settingsHero: {
      backgroundColor: theme.heroBg || theme.textPrimary,
      borderRadius: 26,
      padding: compact ? 20 : 28,
      marginBottom: 22,
      overflow: 'hidden',
      position: 'relative',
      ...Platform.select({ web: { boxShadow: `0 18px 42px ${theme.shadowStrong || theme.shadowColor}` } }),
    },
    settingsHeroOrb: {
      position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -55, top: -75,
      backgroundColor: theme.accent, opacity: 0.16,
    },
    settingsHeroEyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    settingsHeroEyebrow: { color: theme.artGold || theme.accent, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
    settingsHeroTitle: {
      color: theme.heroText || '#FFFFFF',
      fontFamily: 'serif',
      fontSize: compact ? 27 : 31,
      lineHeight: compact ? 32 : 37,
      fontWeight: '900',
      letterSpacing: -0.6,
      maxWidth: 670,
    },
    settingsHeroText: { color: theme.heroMuted || '#E6D8CF', fontSize: 12.5, lineHeight: 19, marginTop: 10, maxWidth: 620 },
    tabs: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      backgroundColor: theme.surfaceMuted || theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 16,
      padding: 5,
      marginBottom: 22,
    },
    activeTab: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      ...Platform.select({ web: { boxShadow: `0 6px 16px ${theme.shadowColor}` } }),
    },
    activeTabText: { color: theme.accent, fontSize: 14, fontWeight: '700' },
  });
