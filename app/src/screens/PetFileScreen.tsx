/**
 * simplyPet: Tierakte (v0.1.4 – E-75/E-76 Fix)
 *
 * Kopfbereich: Passkarte (Foto, Signalement, Chipnummer, besondere Merkmale).
 * Darunter dynamische Reiter je Tierart:
 *  - Gesundheit: Impfungen & Medikamente
 *  - Verlauf: chronologisches Tagebuch (Gewicht, Symptome, Notizen)
 *  - Dokumente: Galerie der Fotos/Scans
 *
 * E-76: Jeder Eintrag ist antippbar → Optionen: Bearbeiten / Löschen.
 * E-29: Bearbeiten zeigt vorausgefülltes Formular + "Bearbeitet am"-Vermerk.
 * E-30: Löschen mit Bestätigungs-Dialog (doppelt bei Impfungen/Medikamenten).
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getDb, uuid } from '../db/database';
import { getSpeciesConfig } from '../config/species';
import { formatDate, isBackdated, compareDateKeysDesc, todayKey, nowUtcIso } from '../time/timeModule';
import { colors, typography, spacing, minTouchTarget } from '../theme/theme';
import EditEntryModal from '../components/EditEntryModal';
import type { EditableField } from '../components/EditEntryModal';

interface PetRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  chip_number: string | null;
  special_features: string | null;
  color_theme: string | null;
  photo_uri: string | null;
  // E-86: Aquarium-spezifisch
  aquarium_type: string | null;
  aquarium_volume_liters: number | null;
  setup_date: string | null;
}

interface HealthRecordRow {
  id: string;
  record_type: string;
  date: string;
  value: number | null;
  unit: string | null;
  notes: string | null;
  photo_uri: string | null;
  created_at: string;
  updated_at?: string;
}

interface VaccinationRow {
  id: string;
  type: string;
  disease: string | null;
  product_name: string | null;
  date_given: string;
  valid_until: string | null;
  created_at: string;
  updated_at?: string;
}

interface MedicationRow {
  id: string;
  name: string;
  type: string;
  dosage: string | null;
  times_per_day: number | null;
  dose_times: string | null;
  is_active: number;
}

interface DocumentRow {
  id: string;
  title: string | null;
  doc_type: string;
  file_uri: string;
  upload_date: string;
}

type TabKey = 'gesundheit' | 'verlauf' | 'dokumente';

const RECORD_TYPE_LABELS: Record<string, string> = {
  Gewicht: 'Gewicht',
  gewicht: 'Gewicht',
  Symptom: 'Beobachtung',
  symptom: 'Beobachtung',
  Notiz: 'Notiz',
  notiz: 'Notiz',
  Wasserwert: 'Wasserwert',
  Vorfall: 'Vorfall',
  Medikamentengabe: 'Medikament gegeben',
};

/** Vorfall-Eintraege speichern strukturierte Angaben als JSON im notes-Feld. */
function parseIncidentNotes(notes: string | null): { text: string; detail: string | null } {
  if (!notes) return { text: '', detail: null };
  try {
    const j = JSON.parse(notes) as {
      text?: string;
      art?: string | null;
      verursacher?: string | null;
      verursacher_detail?: string | null;
      koerperstelle?: string | null;
      tierarzt_aufgesucht?: boolean | null;
    };
    const parts: string[] = [];
    if (j.art) parts.push(j.art);
    if (j.verursacher && j.verursacher !== 'Entfällt') {
      parts.push(`Verursacher: ${j.verursacher_detail ?? j.verursacher}`);
    }
    if (j.koerperstelle) parts.push(`Stelle: ${j.koerperstelle}`);
    if (j.tierarzt_aufgesucht === true) parts.push('Tierarzt aufgesucht');
    if (j.tierarzt_aufgesucht === false) parts.push('Kein Tierarzt nötig');
    return { text: j.text ?? '', detail: parts.length > 0 ? parts.join(' · ') : null };
  } catch {
    return { text: notes, detail: null };
  }
}

export default function PetFileScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const petId = (route.params as { petId: string }).petId;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [pet, setPet] = useState<PetRow | null>(null);
  const [records, setRecords] = useState<HealthRecordRow[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationRow[]>([]);
  const [medications, setMedications] = useState<MedicationRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [tab, setTab] = useState<TabKey>('gesundheit');
  const [fullscreenDoc, setFullscreenDoc] = useState<DocumentRow | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // E-29: Inline-Bearbeitung
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalTitle, setEditModalTitle] = useState('');
  const [editModalFields, setEditModalFields] = useState<EditableField[]>([]);
  const [editModalMeta, setEditModalMeta] = useState<{ type: 'record' | 'vaccination'; id: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const db = await getDb();
        const row = await db.getFirstAsync<PetRow>(
          `SELECT id, name, species, breed, gender, birth_date, chip_number,
                  special_features, color_theme, photo_uri,
                  aquarium_type, aquarium_volume_liters, setup_date
           FROM pets WHERE id = ?`,
          [petId]
        );
        const recs = await db.getAllAsync<HealthRecordRow>(
          `SELECT id, record_type, date, value, unit, notes, photo_uri, created_at, updated_at
           FROM health_records WHERE pet_id = ? AND deleted_at IS NULL`,
          [petId]
        );
        const vaccs = await db.getAllAsync<VaccinationRow>(
          `SELECT id, type, disease, product_name, date_given, valid_until, created_at, updated_at
           FROM vaccinations WHERE pet_id = ? AND deleted_at IS NULL`,
          [petId]
        );
        const meds = await db.getAllAsync<MedicationRow>(
          `SELECT id, name, type, dosage, times_per_day, dose_times, is_active
           FROM medications WHERE pet_id = ? AND deleted_at IS NULL AND is_active = 1`,
          [petId]
        );
        const docs = await db.getAllAsync<DocumentRow>(
          `SELECT id, title, doc_type, file_uri, upload_date
           FROM documents WHERE pet_id = ? AND deleted_at IS NULL`,
          [petId]
        );
        if (active) {
          setPet(row ?? null);
          setRecords(
            [...recs].sort((a, b) => compareDateKeysDesc(a.date.slice(0, 10), b.date.slice(0, 10)))
          );
          setVaccinations(
            [...vaccs].sort((a, b) =>
              compareDateKeysDesc(a.date_given.slice(0, 10), b.date_given.slice(0, 10))
            )
          );
          setMedications(meds);
          setDocuments(
            [...docs].sort((a, b) =>
              compareDateKeysDesc(a.upload_date.slice(0, 10), b.upload_date.slice(0, 10))
            )
          );
        }
      })();
      return () => {
        active = false;
      };
    }, [petId, reloadToken])
  );

  /** "Gabe protokollieren": traegt die heutige Gabe in den Verlauf ein. */
  async function logDose(med: MedicationRow) {
    try {
      const db = await getDb();
      const ts = nowUtcIso();
      await db.runAsync(
        `INSERT INTO health_records (id, pet_id, record_type, date, notes, medication_id, created_at, updated_at, is_synced)
         VALUES (?, ?, 'Medikamentengabe', ?, ?, ?, ?, ?, 0)`,
        [uuid(), petId, todayKey(), `${med.name}${med.dosage ? ` (${med.dosage})` : ''}`, med.id, ts, ts]
      );
      setReloadToken((t) => t + 1);
      Alert.alert('Gabe festgehalten', `${med.name} ist für heute im Verlauf protokolliert.`);
    } catch {
      Alert.alert('Nicht möglich', 'Die Gabe konnte nicht protokolliert werden. Bitte versuche es erneut.');
    }
  }

  // ─── E-76: Bearbeiten / Löschen für Tierakte-Einträge ───

  /** Soft-Delete eines health_record (E-30). */
  async function deleteRecord(id: string, label: string) {
    Alert.alert(
      'Eintrag löschen?',
      `Möchtest du "${label}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDb();
              await db.runAsync(
                `UPDATE health_records SET deleted_at = ? WHERE id = ?`,
                [nowUtcIso(), id]
              );
              setReloadToken((t) => t + 1);
            } catch {
              Alert.alert('Fehler', 'Der Eintrag konnte nicht gelöscht werden.');
            }
          },
        },
      ]
    );
  }

  /** Soft-Delete einer Impfung (E-30 – doppelte Bestätigung). */
  async function deleteVaccination(id: string, label: string) {
    Alert.alert(
      'Impfung löschen?',
      `Möchtest du die Impfung "${label}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Ja, löschen',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Sicher?',
              'Impfeinträge sind wichtige Gesundheitsdaten. Wirklich unwiderruflich löschen?',
              [
                { text: 'Abbrechen', style: 'cancel' },
                {
                  text: 'Endgültig löschen',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      const db = await getDb();
                      await db.runAsync(
                        `UPDATE vaccinations SET deleted_at = ? WHERE id = ?`,
                        [nowUtcIso(), id]
                      );
                      setReloadToken((t) => t + 1);
                    } catch {
                      Alert.alert('Fehler', 'Die Impfung konnte nicht gelöscht werden.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }

  /** Öffnet das Bearbeitungs-Modal mit allen Feldern des Eintrags (E-29). */
  function openEditModal(type: 'record' | 'vaccination', id: string) {
    if (type === 'record') {
      const rec = records.find((r) => r.id === id);
      if (!rec) return;
      const fields: EditableField[] = [];
      const rt = rec.record_type;
      fields.push({ key: 'date', label: 'Datum', value: rec.date.slice(0, 10), type: 'date' });
      if (rec.value != null) {
        fields.push({ key: 'value', label: 'Wert', value: String(rec.value).replace('.', ','), type: 'number' });
      }
      if (rec.unit) {
        fields.push({ key: 'unit', label: 'Einheit', value: rec.unit, type: 'text' });
      }
      fields.push({ key: 'notes', label: 'Notiz', value: rec.notes ?? '', type: 'multiline' });
      setEditModalTitle(`${RECORD_TYPE_LABELS[rt] ?? rt} bearbeiten`);
      setEditModalFields(fields);
      setEditModalMeta({ type: 'record', id });
      setEditModalVisible(true);
    } else {
      const vacc = vaccinations.find((v) => v.id === id);
      if (!vacc) return;
      const fields: EditableField[] = [
        { key: 'disease', label: 'Krankheit', value: vacc.disease ?? '', type: 'text' },
        { key: 'product_name', label: 'Produkt', value: vacc.product_name ?? '', type: 'text' },
        { key: 'date_given', label: 'Geimpft am', value: vacc.date_given.slice(0, 10), type: 'date' },
        { key: 'valid_until', label: 'Gültig bis', value: vacc.valid_until?.slice(0, 10) ?? '', type: 'date' },
      ];
      setEditModalTitle(`${vacc.disease ?? vacc.type} bearbeiten`);
      setEditModalFields(fields);
      setEditModalMeta({ type: 'vaccination', id });
      setEditModalVisible(true);
    }
  }

  /** Speichert die bearbeiteten Felder in die DB (E-29). */
  async function handleEditSave(updatedFields: Record<string, string>) {
    if (!editModalMeta) return;
    const { type, id } = editModalMeta;
    const ts = nowUtcIso();
    try {
      const db = await getDb();
      if (type === 'record') {
        const sets: string[] = ['updated_at = ?'];
        const params: any[] = [ts];
        if ('date' in updatedFields) { sets.push('date = ?'); params.push(updatedFields.date); }
        if ('value' in updatedFields) {
          const numVal = parseFloat(updatedFields.value.replace(',', '.'));
          sets.push('value = ?'); params.push(isNaN(numVal) ? null : numVal);
        }
        if ('unit' in updatedFields) { sets.push('unit = ?'); params.push(updatedFields.unit || null); }
        if ('notes' in updatedFields) { sets.push('notes = ?'); params.push(updatedFields.notes || null); }
        params.push(id);
        await db.runAsync(`UPDATE health_records SET ${sets.join(', ')} WHERE id = ?`, params);
      } else {
        const sets: string[] = ['updated_at = ?'];
        const params: any[] = [ts];
        if ('disease' in updatedFields) { sets.push('disease = ?'); params.push(updatedFields.disease || null); }
        if ('product_name' in updatedFields) { sets.push('product_name = ?'); params.push(updatedFields.product_name || null); }
        if ('date_given' in updatedFields) { sets.push('date_given = ?'); params.push(updatedFields.date_given); }
        if ('valid_until' in updatedFields) { sets.push('valid_until = ?'); params.push(updatedFields.valid_until || null); }
        params.push(id);
        await db.runAsync(`UPDATE vaccinations SET ${sets.join(', ')} WHERE id = ?`, params);
      }
      setReloadToken((t) => t + 1);
      setEditModalVisible(false);
    } catch {
      Alert.alert('Fehler', 'Die Änderungen konnten nicht gespeichert werden.');
    }
  }

  /** Zeigt Optionen-Dialog für einen Eintrag (E-76). */
  function showEntryOptions(
    type: 'record' | 'vaccination',
    id: string,
    label: string
  ) {
    Alert.alert(
      label,
      'Was möchtest du tun?',
      [
        {
          text: 'Bearbeiten',
          onPress: () => openEditModal(type, id),
        },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            if (type === 'vaccination') {
              deleteVaccination(id, label);
            } else {
              deleteRecord(id, label);
            }
          },
        },
        { text: 'Abbrechen', style: 'cancel' },
      ]
    );
  }

  if (!pet) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.empty}>Tierakte wird geladen …</Text>
      </View>
    );
  }

  const cfg = getSpeciesConfig(pet.species);
  const modules = cfg?.modules ?? [];
  const hasHealthTab = modules.includes('vaccinations') || modules.includes('weight');
  const hasDiaryTab = modules.includes('diary') || modules.includes('water_values');
  const hasDocsTab = modules.includes('documents');

  const tabs: { key: TabKey; label: string }[] = [];
  if (hasHealthTab) tabs.push({ key: 'gesundheit', label: 'Gesundheit' });
  if (hasDiaryTab)
    tabs.push({ key: 'verlauf', label: cfg?.key === 'aquarium' ? 'Wasserwerte' : 'Verlauf' });
  if (hasDocsTab) tabs.push({ key: 'dokumente', label: 'Dokumente' });
  const activeTab = tabs.some((t) => t.key === tab) ? tab : tabs[0]?.key ?? 'dokumente';

  function onEditPress() {
    navigation.navigate('StammdatenBearbeiten', { petId });
  }

  const passCard = (
    <View style={[styles.passCard, { borderTopColor: pet.color_theme ?? colors.primary }]}>
      <View style={styles.passHeader}>
        {pet.photo_uri ? (
          <Image source={{ uri: pet.photo_uri }} style={styles.passPhoto} />
        ) : (
          <View style={[styles.passPhoto, styles.passPhotoPlaceholder]}>
            <Text style={styles.passPhotoInitial}>{pet.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.passHeaderText}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petMeta}>
            {cfg?.label ?? pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
            {pet.gender ? ` · ${pet.gender}` : ''}
          </Text>
        </View>
        <Pressable
          style={styles.editButton}
          onPress={onEditPress}
          accessibilityLabel="Stammdaten bearbeiten"
        >
          <Text style={styles.editButtonText}>✎</Text>
        </Pressable>
      </View>
      <View style={styles.passRows}>
        {/* E-86/E-87: Artspezifische Felder */}
        {cfg?.isHabitat ? (
          <>
            <PassRow label="Eingerichtet am" value={pet.setup_date ? formatDate(pet.setup_date) : 'Nicht angegeben'} />
            <PassRow label="Beckentyp" value={pet.aquarium_type ?? 'Nicht angegeben'} />
            {pet.aquarium_volume_liters ? (
              <PassRow label="Volumen" value={`${pet.aquarium_volume_liters} Liter`} />
            ) : null}
          </>
        ) : (
          <>
            <PassRow label="Geboren" value={pet.birth_date ? formatDate(pet.birth_date) : 'Nicht angegeben'} />
            {/* E-87: Chip/Ring nur bei relevanten Tierarten */}
            {!['meerschweinchen', 'chinchilla', 'ratte', 'maus', 'degu', 'hamster'].includes(pet.species) ? (
              <PassRow
                label={pet.species === 'vogel' ? 'Ring-/Chip-Nr.' : 'Chip-Nummer'}
                value={pet.chip_number ?? 'Nicht angegeben'}
              />
            ) : null}
            <PassRow label="Merkmale" value={pet.special_features ?? 'Keine besonderen Merkmale'} />
          </>
        )}
      </View>
    </View>
  );

  const tabContent = (
    <View style={styles.tabContentWrap}>
      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.tabButton, activeTab === t.key && styles.tabButtonActive]}
            onPress={() => setTab(t.key)}
            accessibilityLabel={`Reiter ${t.label}`}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'gesundheit' ? (
        <View>
          {modules.includes('vaccinations') ? (
            <>
              <Text style={styles.subTitle}>Impfungen</Text>
              {vaccinations.length === 0 ? (
                <Text style={styles.emptyHint}>
                  Noch keine Impfungen eingetragen. Über „Erfassen" kannst du die erste festhalten.
                </Text>
              ) : (
                vaccinations.map((v) => (
                  <Pressable
                    key={v.id}
                    style={styles.entryCard}
                    onPress={() =>
                      showEntryOptions('vaccination', v.id, v.disease ?? v.type)
                    }
                    accessibilityLabel={`${v.disease ?? v.type} – antippen für Optionen`}
                  >
                    <Text style={styles.entryTitle}>
                      {v.disease ?? v.type}
                      {v.product_name ? ` (${v.product_name})` : ''}
                    </Text>
                    <Text style={styles.entryMeta}>
                      Geimpft am {formatDate(v.date_given)}
                      {v.valid_until ? ` · gültig bis ${formatDate(v.valid_until)}` : ''}
                    </Text>
                    {isBackdated(v.date_given.slice(0, 10), v.created_at) ? (
                      <Text style={styles.backdatedNote}>
                        Nachgetragen am {formatDate(v.created_at)}
                      </Text>
                    ) : null}
                    {v.updated_at && v.updated_at !== v.created_at ? (
                      <Text style={styles.backdatedNote}>
                        Bearbeitet am {formatDate(v.updated_at)}
                      </Text>
                    ) : null}
                  </Pressable>
                ))
              )}
            </>
          ) : null}
          <Text style={styles.subTitle}>Aktuelle Medikamente & Pflege</Text>
          {medications.length === 0 ? (
            <Text style={styles.emptyHint}>
              Keine aktiven Einträge. Über „Erfassen → Medikament oder Pflege" legst du den ersten an.
            </Text>
          ) : (
            medications.map((m) => {
              const times: string[] = m.dose_times ? (JSON.parse(m.dose_times) as string[]) : [];
              const isGivable = m.type === 'Medikament' || m.type === 'Pflege';
              return (
                <View key={m.id} style={styles.entryCard}>
                  <Text style={styles.entryTitle}>
                    {m.name}
                    {m.type !== 'Medikament' ? ` (${m.type})` : ''}
                  </Text>
                  {m.dosage || times.length > 0 ? (
                    <Text style={styles.entryMeta}>
                      {[m.dosage, times.length > 0 ? `Uhrzeiten: ${times.join(', ')}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  ) : null}
                  {isGivable ? (
                    <Pressable
                      style={styles.doseButton}
                      onPress={() => logDose(m)}
                      accessibilityLabel={`Gabe von ${m.name} protokollieren`}
                    >
                      <Text style={styles.doseButtonText}>✓ Heute gegeben – protokollieren</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      ) : null}

      {activeTab === 'verlauf' ? (
        <View>
          {records.length === 0 ? (
            <Text style={styles.emptyHint}>
              Noch keine Einträge im Verlauf. Über „Erfassen" hältst du Gewicht und Beobachtungen
              fest – Neuestes steht dann immer oben.
            </Text>
          ) : (
            records.map((r) => {
              const isIncident = r.record_type === 'Vorfall';
              const incident = isIncident ? parseIncidentNotes(r.notes) : null;
              const label = `${RECORD_TYPE_LABELS[r.record_type] ?? r.record_type}${r.value != null ? `: ${String(r.value).replace('.', ',')} ${r.unit ?? ''}`.trimEnd() : ''}`;
              return (
                <Pressable
                  key={r.id}
                  style={styles.entryCard}
                  onPress={() => showEntryOptions('record', r.id, label)}
                  accessibilityLabel={`${label} – antippen für Optionen`}
                >
                  <Text style={styles.entryTitle}>{label}</Text>
                  {isIncident && incident ? (
                    <>
                      {incident.text ? <Text style={styles.entryNotes}>{incident.text}</Text> : null}
                      {incident.detail ? <Text style={styles.entryMeta}>{incident.detail}</Text> : null}
                    </>
                  ) : r.notes ? (
                    <Text style={styles.entryNotes}>{r.notes}</Text>
                  ) : null}
                  {r.photo_uri ? <Image source={{ uri: r.photo_uri }} style={styles.entryPhoto} /> : null}
                  <Text style={styles.entryMeta}>{formatDate(r.date)}</Text>
                  {isBackdated(r.date.slice(0, 10), r.created_at) ? (
                    <Text style={styles.backdatedNote}>Nachgetragen am {formatDate(r.created_at)}</Text>
                  ) : null}
                  {r.updated_at && r.updated_at !== r.created_at ? (
                    <Text style={styles.backdatedNote}>Bearbeitet am {formatDate(r.updated_at)}</Text>
                  ) : null}
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}

      {activeTab === 'dokumente' ? (
        <View>
          {documents.length === 0 ? (
            <Text style={styles.emptyHint}>
              Noch keine Dokumente abgelegt. Über „Erfassen → Dokument fotografieren" legst du das
              erste Foto sicher in dieser Akte ab.
            </Text>
          ) : (
            <View style={styles.docGrid}>
              {documents.map((d) => (
                <Pressable
                  key={d.id}
                  style={styles.docCard}
                  onPress={() => setFullscreenDoc(d)}
                  accessibilityLabel={`Dokument ${d.title ?? d.doc_type} im Vollbild öffnen`}
                >
                  <Image source={{ uri: d.file_uri }} style={styles.docThumb} />
                  <Text style={styles.docTitle} numberOfLines={1}>
                    {d.title ?? d.doc_type}
                  </Text>
                  <Text style={styles.entryMeta}>{formatDate(d.upload_date)}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}>
      {isLandscape ? (
        <View style={styles.landscapeRow}>
          <View style={styles.landscapeLeft}>{passCard}</View>
          <View style={styles.landscapeRight}>{tabContent}</View>
        </View>
      ) : (
        <>
          {passCard}
          {tabContent}
        </>
      )}

      <Modal
        visible={fullscreenDoc !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenDoc(null)}
      >
        <Pressable
          style={styles.fullscreenBackdrop}
          onPress={() => setFullscreenDoc(null)}
          accessibilityLabel="Vollbild schließen"
        >
          {fullscreenDoc ? (
            <>
              <Image
                source={{ uri: fullscreenDoc.file_uri }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
              <Text style={styles.fullscreenCaption}>
                {fullscreenDoc.title ?? fullscreenDoc.doc_type} · {formatDate(fullscreenDoc.upload_date)} – zum Schließen tippen
              </Text>
            </>
          ) : null}
        </Pressable>
      </Modal>
    </ScrollView>

      <EditEntryModal
        visible={editModalVisible}
        title={editModalTitle}
        fields={editModalFields}
        onSave={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
      />
    </View>
  );
}

function PassRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.passRow}>
      <Text style={styles.passRowLabel}>{label}</Text>
      <Text style={styles.passRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  containerCentered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: spacing.m, paddingBottom: spacing.xl },
  landscapeRow: { flexDirection: 'row', gap: spacing.l, alignItems: 'flex-start' },
  landscapeLeft: { flex: 2 },
  landscapeRight: { flex: 3 },
  passCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderTopWidth: 6,
    padding: spacing.m,
    marginBottom: spacing.l,
  },
  passHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  passPhoto: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.border },
  passPhotoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  passPhotoInitial: { fontSize: typography.headline, fontWeight: '700', color: colors.textSecondary },
  passHeaderText: { flex: 1 },
  petName: { fontSize: typography.headline, fontWeight: '700', color: colors.textPrimary },
  petMeta: { fontSize: typography.bodySmall, color: colors.textSecondary },
  editButton: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: { fontSize: typography.title, color: colors.textPrimary },
  passRows: { marginTop: spacing.m, gap: spacing.s },
  passRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.m },
  passRowLabel: { fontSize: typography.bodySmall, color: colors.textSecondary },
  passRowValue: {
    fontSize: typography.bodySmall,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
  tabContentWrap: {},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
    marginBottom: spacing.m,
    gap: spacing.xs,
  },
  tabButton: {
    flex: 1,
    minHeight: minTouchTarget - 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabButtonActive: { backgroundColor: colors.primary },
  tabText: { fontSize: typography.bodySmall, color: colors.textPrimary },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  subTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  entryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  entryTitle: { fontSize: typography.body, fontWeight: '600', color: colors.textPrimary },
  entryNotes: {
    fontSize: typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    lineHeight: 24,
  },
  entryMeta: { fontSize: typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  backdatedNote: {
    fontSize: typography.bodySmall - 2,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  emptyHint: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.s,
  },
  doseButton: {
    marginTop: spacing.s,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    minHeight: minTouchTarget - 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
  },
  doseButtonText: { fontSize: typography.bodySmall, color: colors.primary, fontWeight: '600' },
  entryPhoto: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginTop: spacing.s,
    backgroundColor: colors.border,
  },
  docGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  docCard: { width: 120 },
  docThumb: { width: 120, height: 120, borderRadius: 12, backgroundColor: colors.border },
  docTitle: { fontSize: typography.bodySmall, color: colors.textPrimary, marginTop: spacing.xs },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
  },
  fullscreenImage: { width: '100%', height: '85%' },
  fullscreenCaption: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  empty: { fontSize: typography.body, color: colors.textSecondary },
});
