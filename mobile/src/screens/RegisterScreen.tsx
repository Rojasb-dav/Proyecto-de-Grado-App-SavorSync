import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.phone && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await register({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
      });
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>🍕</Text>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a la comunidad SavorSync</Text>
        </View>

        {/* Formulario */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Email */}
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              error={!!errors.email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Username */}
            <TextInput
              label="Nombre de usuario"
              value={formData.username}
              onChangeText={(text) => updateFormData('username', text)}
              error={!!errors.username}
              style={styles.input}
              autoCapitalize="none"
              disabled={isLoading}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Full Name */}
            <TextInput
              label="Nombre completo"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              error={!!errors.fullName}
              style={styles.input}
              disabled={isLoading}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

            {/* Phone */}
            <TextInput
              label="Teléfono (opcional)"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              error={!!errors.phone}
              style={styles.input}
              keyboardType="phone-pad"
              disabled={isLoading}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            {/* Password */}
            <TextInput
              label="Contraseña"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              error={!!errors.password}
              style={styles.input}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              disabled={isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <TextInput
              label="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              error={!!errors.confirmPassword}
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                labelStyle={styles.loginLink}
                disabled={isLoading}
              >
                Inicia sesión
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: theme.roundness * 2,
  },
  cardContent: {
    padding: 20,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  registerButton: {
    marginTop: 16,
    borderRadius: theme.roundness,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
