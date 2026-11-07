
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';

import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';

import {
    createDailyLog,
    updateDailyLog,
    getDailyLog,
    resubmitDailyLog,
} from '../../services/dailyLogService';

import { toDateString } from '../../utils/dateUtils';
import { isNonEmpty } from '../../utils/validation';

import {
    COLORS,
    SPACING,
    FONT_SIZE,
    BORDER_RADIUS,
} from '../../constants/theme';

import { StudentStackParamList } from '../../navigation/types';
import { ActivityType, Internship, ReviewStatus } from '../../types';

type Props = NativeStackScreenProps<StudentStackParamList, 'DailyLogForm'>;

const ACTIVITY_TYPES: ActivityType[] = [
    'Pengembangan Aplikasi',
    'Analisis Sistem',
    'Instalasi dan Konfigurasi',
    'Administrasi',
    'Pengujian Sistem',
    'Kegiatan Lainnya',
];

const DailyLogFormScreen: React.FC<Props> = ({
    route,
    navigation,
}) => {
    const logId = route.params?.logId;
    const isEdit = !!logId;

    const { appUser } = useAuth();

    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // STATE FOTO DOKUMENTASI
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');

    const [date, setDate] = useState<Date>(new Date());

    const [activityType, setActivityType] =
        useState<ActivityType>('Pengembangan Aplikasi');

    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');
    const [obstacles, setObstacles] = useState('');

    const [existingStatus, setExistingStatus] =
        useState<ReviewStatus | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showActivityPicker, setShowActivityPicker] = useState(false);

    // ==========================================
    // LOAD DATA JURNAL
    // ==========================================

    useEffect(() => {
        (async () => {
            if (!appUser) return;

            try {
                if (isEdit && logId) {
                    const log = await getDailyLog(logId);

                    if (!log) {
                        Alert.alert(
                            'Tidak ditemukan',
                            'Jurnal tidak ditemukan'
                        );

                        navigation.goBack();
                        return;
                    }

                    if (log.studentId !== appUser.uid) {
                        Alert.alert(
                            'Ditolak',
                            'Anda tidak berhak mengubah jurnal ini'
                        );

                        navigation.goBack();
                        return;
                    }

                    if (log.reviewStatus === 'approved') {
                        Alert.alert(
                            'Tidak dapat diubah',
                            'Jurnal yang sudah disetujui terkunci.'
                        );

                        navigation.goBack();
                        return;
                    }

                    setExistingStatus(log.reviewStatus);
                    setDate(log.date.toDate());
                    setActivityType(log.activityType);
                    setDescription(log.description);
                    setResult(log.result);
                    setObstacles(log.obstacles);

                    // Memuat foto yang sudah tersimpan
                    const savedPhoto = log.photoUrl ?? '';
                    setPhotoUrl(savedPhoto);
                    setPhotoPreview(savedPhoto || null);

                } else {
                    const active = await getActiveInternshipByStudent(
                        appUser.uid
                    );

                    if (!active) {
                        Alert.alert(
                            'Info',
                            'Anda belum memiliki magang aktif.'
                        );

                        navigation.goBack();
                        return;
                    }

                    setInternship(active);
                }

            } catch (e: any) {
                Alert.alert(
                    'Gagal',
                    e?.message ?? 'Gagal memuat data jurnal.'
                );
            } finally {
                setLoading(false);
            }
        })();

    }, [appUser, isEdit, logId, navigation]);

    // ==========================================
    // UPLOAD FOTO DOKUMENTASI KE CLOUDINARY
    // ==========================================

    const pickAndUploadPhoto = async () => {
        try {
            // Minta izin akses galeri
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Izin ditolak',
                    'Akses galeri diperlukan untuk memilih foto.'
                );

                return;
            }

            // Membuka galeri
            const imageResult =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.7,
                    base64: true,
                    allowsEditing: true,
                    aspect: [4, 3],
                });

            if (
                imageResult.canceled ||
                imageResult.assets.length === 0
            ) {
                return;
            }

            const asset = imageResult.assets[0];

            // Menampilkan preview lokal
            setPhotoPreview(asset.uri);
            setUploadingPhoto(true);

            // Upload gambar ke Cloudinary
            const uploaded = await uploadImageToCloudinary(
                asset.uri,
                {
                    folder: 'ppnp-internship/daily-logs',
                    base64: asset.base64 ?? undefined,
                    mimeType: asset.mimeType ?? undefined,
                }
            );

            // Simpan URL hasil upload
            setPhotoUrl(uploaded.secure_url);

            Alert.alert(
                'Berhasil',
                'Foto berhasil diunggah ke Cloudinary.'
            );

        } catch (e: any) {
            Alert.alert(
                'Gagal upload',
                e?.message ?? 'Terjadi kesalahan saat mengunggah foto.'
            );

            setPhotoPreview(null);
            setPhotoUrl('');

        } finally {
            setUploadingPhoto(false);
        }
    };

    // ==========================================
    // VALIDASI FORM
    // ==========================================

    const validate = (): string | null => {
        if (!isNonEmpty(description)) {
            return 'Deskripsi kegiatan wajib diisi.';
        }

        if (!isNonEmpty(result)) {
            return 'Hasil kegiatan wajib diisi.';
        }

        if (!isNonEmpty(obstacles)) {
            return 'Kendala wajib diisi (isi "-" jika tidak ada).';
        }

        return null;
    };

    // ==========================================
    // SIMPAN JURNAL
    // ==========================================

    const onSubmit = async () => {
        if (!appUser) return;

        if (uploadingPhoto) {
            Alert.alert(
                'Upload berlangsung',
                'Tunggu sampai foto selesai diunggah.'
            );

            return;
        }

        const err = validate();

        if (err) {
            Alert.alert('Validasi', err);
            return;
        }

        if (submitting) return;

        setSubmitting(true);

        try {
            if (isEdit && logId) {
                await updateDailyLog(logId, {
                    activityType,
                    description: description.trim(),
                    result: result.trim(),
                    obstacles: obstacles.trim(),

                    // URL foto Cloudinary
                    photoUrl: photoUrl.trim() || undefined,

                    date: Timestamp.fromDate(date),
                });

                if (existingStatus === 'needs_revision') {
                    await resubmitDailyLog(logId);
                }

                Alert.alert(
                    'Berhasil',
                    'Jurnal diperbarui.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );

            } else {
                if (!internship) {
                    Alert.alert(
                        'Error',
                        'Data magang tidak tersedia'
                    );

                    return;
                }

                await createDailyLog({
                    internshipId: internship.id,
                    studentId: appUser.uid,
                    date: Timestamp.fromDate(date),
                    activityType,
                    description: description.trim(),
                    result: result.trim(),
                    obstacles: obstacles.trim(),

                    // URL foto Cloudinary
                    photoUrl: photoUrl.trim() || undefined,
                });

                Alert.alert(
                    'Berhasil',
                    'Jurnal ditambahkan.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }

        } catch (e: any) {
            Alert.alert(
                'Gagal',
                e?.message ?? 'Terjadi kesalahan'
            );

        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {
        return (
            <SafeAreaView
                style={styles.flex}
                edges={['bottom']}
            >
                <AppHeader
                    title={isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
                    onBack={() => navigation.goBack()}
                />

                <View style={styles.center}>
                    <ActivityIndicator
                        color={COLORS.primary}
                        size="large"
                    />
                </View>
            </SafeAreaView>
        );
    }

    // ==========================================
    // TAMPILAN FORM
    // ==========================================

    return (
        <SafeAreaView
            style={styles.flex}
            edges={['bottom']}
        >
            <AppHeader
                title={isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
                onBack={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* NOTIFIKASI REVISI */}

                    {existingStatus === 'needs_revision' ? (
                        <View style={styles.warnBox}>
                            <Ionicons
                                name="alert-circle"
                                size={16}
                                color={COLORS.orange}
                            />

                            <Text style={styles.warnText}>
                                Jurnal perlu revisi. Simpan perubahan
                                untuk mengirim ulang.
                            </Text>
                        </View>
                    ) : null}

                    {/* TANGGAL KEGIATAN */}

                    <Text style={styles.label}>
                        Tanggal Kegiatan *
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.selector,
                            isEdit && { opacity: 0.7 },
                        ]}
                        onPress={() =>
                            !isEdit && setShowDatePicker(true)
                        }
                        disabled={isEdit}
                    >
                        <Text style={styles.selectorText}>
                            {toDateString(Timestamp.fromDate(date))}
                        </Text>

                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>

                    {/* JENIS KEGIATAN */}

                    <Text style={styles.label}>
                        Jenis Kegiatan *
                    </Text>

                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setShowActivityPicker(true)}
                    >
                        <Text style={styles.selectorText}>
                            {activityType}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>

                    {/* DESKRIPSI */}

                    <Text style={styles.label}>
                        Deskripsi Kegiatan *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 90,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Ceritakan kegiatan hari ini..."
                        placeholderTextColor={COLORS.disabled}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!submitting}
                    />

                    {/* HASIL KEGIATAN */}

                    <Text style={styles.label}>
                        Hasil Kegiatan *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 70,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Hasil yang dicapai..."
                        placeholderTextColor={COLORS.disabled}
                        value={result}
                        onChangeText={setResult}
                        multiline
                        editable={!submitting}
                    />

                    {/* KENDALA */}

                    <Text style={styles.label}>
                        Kendala yang Dihadapi *
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                height: 70,
                                textAlignVertical: 'top',
                            },
                        ]}
                        placeholder="Tulis '-' jika tidak ada kendala"
                        placeholderTextColor={COLORS.disabled}
                        value={obstacles}
                        onChangeText={setObstacles}
                        multiline
                        editable={!submitting}
                    />

                    {/* FOTO DOKUMENTASI */}

                    <Text style={styles.label}>
                        Foto Dokumentasi (Opsional)
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.uploadBox,
                            uploadingPhoto && { opacity: 0.7 },
                        ]}
                        onPress={pickAndUploadPhoto}
                        disabled={uploadingPhoto || submitting}
                    >
                        {uploadingPhoto ? (
                            <>
                                <ActivityIndicator
                                    color={COLORS.primary}
                                />

                                <Text style={styles.uploadText}>
                                    Mengunggah foto...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons
                                    name="camera-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />

                                <Text style={styles.uploadText}>
                                    {photoUrl
                                        ? 'Ganti Foto'
                                        : 'Pilih dari Galeri'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* STATUS FOTO */}

                    {photoPreview ? (
                        <View style={styles.photoInfo}>
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color={COLORS.primary}
                            />

                            <Text
                                style={styles.meta}
                                numberOfLines={2}
                            >
                                {photoUrl
                                    ? 'Foto berhasil diunggah ke Cloudinary.'
                                    : 'Mengunggah foto...'}
                            </Text>
                        </View>
                    ) : null}

                    {/* SIMPAN JURNAL */}

                    <TouchableOpacity
                        style={[
                            styles.submit,
                            (submitting || uploadingPhoto) && {
                                opacity: 0.6,
                            },
                        ]}
                        onPress={onSubmit}
                        disabled={submitting || uploadingPhoto}
                    >
                        {submitting ? (
                            <ActivityIndicator
                                color={COLORS.surface}
                            />
                        ) : (
                            <>
                                <Ionicons
                                    name="save-outline"
                                    size={18}
                                    color={COLORS.surface}
                                />

                                <Text style={styles.submitText}>
                                    Simpan
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* DATE PICKER */}

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(_, d) => {
                        setShowDatePicker(false);

                        if (d) {
                            setDate(d);
                        }
                    }}
                />
            )}

            {/* ACTIVITY PICKER */}

            <Modal
                visible={showActivityPicker}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setShowActivityPicker(false)
                }
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            Pilih Jenis Kegiatan
                        </Text>

                        {ACTIVITY_TYPES.map((a) => (
                            <TouchableOpacity
                                key={a}
                                style={styles.activityRow}
                                onPress={() => {
                                    setActivityType(a);
                                    setShowActivityPicker(false);
                                }}
                            >
                                <Text style={styles.activityText}>
                                    {a}
                                </Text>

                                {activityType === a && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={COLORS.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

// ==========================================
// STYLING
// ==========================================

const styles = StyleSheet.create({

    flex: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },

    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xs,
    },

    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        height: 44,
    },

    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        height: 44,
    },

    selectorText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },

    // STYLE UPLOAD FOTO

    uploadBox: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.md,
        minHeight: 85,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.xs,
    },

    uploadText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
    },

    meta: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.xs,
        flex: 1,
    },

    photoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.xs,
    },

    // TOMBOL SIMPAN

    submit: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        height: 48,
        borderRadius: BORDER_RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },

    submitText: {
        color: COLORS.surface,
        fontWeight: '700',
        fontSize: FONT_SIZE.md,
    },

    // NOTIFIKASI REVISI

    warnBox: {
        flexDirection: 'row',
        gap: SPACING.xs,
        backgroundColor: `${COLORS.orange}15`,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.sm,
    },

    warnText: {
        flex: 1,
        color: COLORS.orange,
        fontSize: FONT_SIZE.xs,
    },

    // MODAL JENIS KEGIATAN

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },

    modalCard: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.lg,
        borderTopRightRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },

    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    activityRow: {
        paddingVertical: SPACING.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },

    activityText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },

});

export default DailyLogFormScreen;
