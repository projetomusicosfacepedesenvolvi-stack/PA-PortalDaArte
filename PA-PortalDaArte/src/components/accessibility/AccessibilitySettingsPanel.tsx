import React from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { Accessibility, AlignLeft, Eye, RotateCcw, Type } from 'lucide-react-native';
import { VLibrasText as Text } from './VLibrasText';
import {
  FONT_SCALE_OPTIONS,
  useAccessibility,
  type FontScale,
} from './AccessibilityContext';
import { useTheme } from '../context/ThemeContext';

const FONT_LABELS: Record<FontScale, string> = {
  1: '100%',
  1.25: '125%',
  1.5: '150%',
  1.75: '175%',
  2: '200%',
};

/**
 * Conteúdo de acessibilidade compartilhado entre a tela de configurações e o
 * painel aberto pelo botão "Acessibilidade" do cabeçalho.
 */
export default function AccessibilitySettingsPanel({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  const {
    fontScale,
    highContrast,
    readingSpacing,
    screenReaderEnabled,
    setFontScale,
    setHighContrast,
    setReadingSpacing,
    resetAccessibility,
  } = useAccessibility();
  const styles = getStyles(theme, compact);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} accessible={false}>
            <Type size={20} color={theme.accent} accessible={false} />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle} accessibilityRole="header">Tamanho da fonte</Text>
            <Text style={styles.sectionDescription}>
              Aumente o texto para facilitar a leitura. A alteração é aplicada ao sistema inteiro.
            </Text>
          </View>
        </View>

        <View style={styles.fontOptions} accessibilityRole="radiogroup">
          {FONT_SCALE_OPTIONS.map((scale) => {
            const selected = fontScale === scale;
            return (
              <TouchableOpacity
                key={scale}
                style={[styles.fontOption, selected && styles.fontOptionSelected]}
                onPress={() => setFontScale(scale)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`Tamanho da fonte ${FONT_LABELS[scale]}`}
                accessibilityHint="Toque duas vezes para aplicar este tamanho de fonte"
              >
                <Text style={[styles.fontOptionText, selected && styles.fontOptionTextSelected]}>
                  {FONT_LABELS[scale]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.helperText}>
          100% é o tamanho original. O ajuste pode chegar a 200% para apoiar pessoas com baixa visão.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.sectionHeaderInline}>
            <View style={styles.sectionIcon} accessible={false}>
              <Eye size={20} color={theme.accent} accessible={false} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle} accessibilityRole="header">Alto contraste</Text>
              <Text style={styles.sectionDescription}>
                Usa fundo branco, textos escuros, bordas fortes e cores de ação com contraste elevado.
              </Text>
            </View>
          </View>

          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: theme.borderColor, true: theme.accent }}
            thumbColor={highContrast ? '#FFFFFF' : '#F4F4F4'}
            ios_backgroundColor={theme.borderColor}
            accessibilityRole="switch"
            accessibilityLabel="Alto contraste"
            accessibilityHint="Ativa uma paleta com contraste visual reforçado"
            accessibilityState={{ checked: highContrast }}
          />
        </View>

        {highContrast ? (
          <Text style={styles.helperText}>
            Enquanto o alto contraste estiver ativo, ele substitui temporariamente as cores dos modos claro e escuro.
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.sectionHeaderInline}>
            <View style={styles.sectionIcon} accessible={false}>
              <AlignLeft size={20} color={theme.accent} accessible={false} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle} accessibilityRole="header">Espaçamento de leitura ampliado</Text>
              <Text style={styles.sectionDescription}>
                Aumenta a entrelinha e o espaçamento entre caracteres para deixar blocos de texto mais fáceis de acompanhar.
              </Text>
            </View>
          </View>

          <Switch
            value={readingSpacing}
            onValueChange={setReadingSpacing}
            trackColor={{ false: theme.borderColor, true: theme.accent }}
            thumbColor={readingSpacing ? '#FFFFFF' : '#F4F4F4'}
            ios_backgroundColor={theme.borderColor}
            accessibilityRole="switch"
            accessibilityLabel="Espaçamento de leitura ampliado"
            accessibilityHint="Aumenta a entrelinha e o espaçamento entre caracteres"
            accessibilityState={{ checked: readingSpacing }}
          />
        </View>
        <Text style={styles.helperText}>
          A opção é aplicada aos textos do sistema e também aos campos de texto compatíveis, sem alterar o conteúdo.
        </Text>
      </View>

      <View style={styles.card} accessible={false}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} accessible={false}>
            <Accessibility size={20} color={theme.accent} accessible={false} />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle} accessibilityRole="header">Leitores de tela</Text>
            <Text style={styles.sectionDescription}>
              O Portal da Arte usa rótulos, funções e estados de acessibilidade nos controles globais para melhorar a navegação com TalkBack e VoiceOver.
            </Text>
            <Text
              style={styles.screenReaderStatus}
              accessibilityLiveRegion="polite"
              accessibilityLabel={`Leitor de tela ${screenReaderEnabled ? 'detectado' : 'não detectado'}`}
            >
              {screenReaderEnabled ? 'Leitor de tela detectado neste dispositivo.' : 'Leitor de tela não detectado no momento.'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>Pré-visualização</Text>
        <Text style={styles.previewTitle}>Portal da Arte</Text>
        <Text style={styles.previewText}>
          Este texto mostra como a leitura ficará com as preferências selecionadas. Uma leitura confortável deve continuar clara mesmo quando a fonte e os espaçamentos forem ampliados.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetAccessibility}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Restaurar configurações de acessibilidade para o padrão"
        accessibilityHint="Restaura fonte para 100 por cento e desativa alto contraste e espaçamento ampliado"
      >
        <RotateCcw size={17} color={theme.textPrimary} accessible={false} />
        <Text style={styles.resetButtonText}>Restaurar padrão</Text>
      </TouchableOpacity>
    </>
  );
}

const getStyles = (theme: any, compact: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderLeftWidth: 4,
      borderLeftColor: theme.accent,
      borderRadius: 20,
      padding: compact ? 14 : 22,
      marginBottom: 14,
      ...Platform.select({ web: { boxShadow: `0 10px 28px ${theme.shadowColor || 'rgba(0,0,0,0.05)'}` } }),
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
    sectionHeaderInline: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingRight: 16 },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.accentSoft || theme.menuActiveBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    sectionCopy: { flex: 1, minWidth: 0 },
    sectionTitle: { color: theme.textPrimary, fontSize: 15, fontWeight: '700' },
    sectionDescription: { color: theme.textSecondary, fontSize: 11.5, lineHeight: 17, marginTop: 4 },
    settingRow: { flexDirection: compact ? 'column' : 'row', alignItems: compact ? 'flex-start' : 'center', justifyContent: 'space-between', gap: compact ? 14 : 18 },
    fontOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    fontOption: {
      minWidth: 66,
      height: 42,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: theme.borderColor,
      backgroundColor: theme.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    fontOptionSelected: { borderColor: theme.accent, backgroundColor: theme.menuActiveBg, borderWidth: 2 },
    fontOptionText: { color: theme.textPrimary, fontSize: 12.5, fontWeight: '600' },
    fontOptionTextSelected: { color: theme.accent, fontWeight: '800' },
    helperText: { color: theme.textSecondary, fontSize: 10.5, lineHeight: 16, marginTop: 12 },
    screenReaderStatus: { color: theme.textPrimary, fontSize: 11.5, fontWeight: '700', marginTop: 9 },
    previewCard: {
      backgroundColor: theme.surfaceMuted || theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 20,
      padding: compact ? 14 : 24,
      marginBottom: 14,
    },
    previewLabel: { color: theme.textSecondary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 7 },
    previewTitle: { color: theme.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 5 },
    previewText: { color: theme.textSecondary, fontSize: 12, lineHeight: 18 },
    resetButton: {
      minHeight: 42,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      paddingVertical: 9,
      paddingHorizontal: 14,
      backgroundColor: theme.cardBg,
    },
    resetButtonText: { color: theme.textPrimary, fontSize: 12, fontWeight: '700' },
  });
