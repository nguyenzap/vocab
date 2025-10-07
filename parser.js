import {
  collection,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { chunkArray, sanitizeTags, showToast } from './utils.js';

const SINGLE_QUOTE_RE = /'([^']*)'/g;
const TRAILING_COMMA_RE = /,\s*([}\]])/g;

function tryParseJson(line) {
  try {
    return JSON.parse(line);
  } catch (error) {
    return null;
  }
}

function tryNormalizePythonDict(line) {
  const replacedKeys = line.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:\s*)/g, '$1"$2"$3');
  const replacedQuotes = replacedKeys.replace(SINGLE_QUOTE_RE, (_, inner) => {
    return `"${inner.replace(/"/g, '\\"')}"`;
  });
  const cleanTrailing = replacedQuotes.replace(TRAILING_COMMA_RE, '$1');
  return tryParseJson(cleanTrailing);
}

function normalizeEntry(raw, lineNumber) {
  if (typeof raw !== 'object' || raw === null) {
    return { error: `Dòng ${lineNumber}: không phải một object.` };
  }
  const word = String(raw.word ?? '').trim();
  const type = String(raw.type ?? '').trim();
  const meaning = String(raw.meaning ?? '').trim();

  if (!word) return { error: `Dòng ${lineNumber}: "word" là bắt buộc.` };
  if (!type) return { error: `Dòng ${lineNumber}: "type" là bắt buộc.` };
  if (!meaning) return { error: `Dòng ${lineNumber}: "meaning" là bắt buộc.` };

  const tags = sanitizeTags(raw.tags);
  const example = raw.example ? String(raw.example).trim() : '';
  const note = raw.note ? String(raw.note).trim() : '';
  const phonetic = raw.phonetic ? String(raw.phonetic).trim() : '';
  let dueAt = null;
  if (raw.dueAt) {
    const parsed = Date.parse(String(raw.dueAt));
    if (!Number.isNaN(parsed)) {
      dueAt = Timestamp.fromDate(new Date(parsed));
    }
  }

  return {
    entry: {
      word,
      wordLower: word.toLowerCase(),
      type,
      meaning,
      tags,
      example,
      note,
      phonetic,
      dueAt: dueAt ?? null,
    },
  };
}

export function parseBulkInput(text) {
  const lines = text.split(/\r?\n/);
  const entriesMap = new Map();
  const errors = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const json = tryParseJson(trimmed) ?? tryNormalizePythonDict(trimmed);
    if (!json) {
      errors.push(`Dòng ${index + 1}: Không thể phân tích JSON hoặc từ điển Python.`);
      return;
    }
    const { entry, error } = normalizeEntry(json, index + 1);
    if (error) {
      errors.push(error);
      return;
    }
    entriesMap.set(entry.wordLower, entry);
  });

  return {
    entries: [...entriesMap.values()],
    errors,
  };
}

/**
 * Upsert bulk vocabulary entries using batched writes (max 500 operations).
 */
export async function upsertBulkVocabs(db, userId, listId, entries) {
  if (!entries.length) {
    return { inserted: 0, updated: 0 };
  }
  const vocabsRef = collection(db, 'users', userId, 'lists', listId, 'vocabs');
  const existingSnapshot = await getDocs(vocabsRef);
  const existingMap = new Map();

  existingSnapshot.forEach((snap) => {
    const data = snap.data();
    if (data.wordLower) {
      existingMap.set(String(data.wordLower), { id: snap.id, createdAt: data.createdAt ?? null });
    }
  });

  let inserted = 0;
  let updated = 0;
  const chunks = chunkArray(entries, 450);

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((entry) => {
      const existing = existingMap.get(entry.wordLower);
      const docId = existing ? existing.id : doc(vocabsRef).id;
      const docRef = doc(vocabsRef, docId);
      const payload = {
        word: entry.word,
        wordLower: entry.wordLower,
        type: entry.type,
        meaning: entry.meaning,
        tags: entry.tags,
        example: entry.example || null,
        note: entry.note || null,
        phonetic: entry.phonetic || null,
        dueAt: entry.dueAt || null,
        updatedAt: serverTimestamp(),
      };
      if (!existing) {
        payload.createdAt = serverTimestamp();
        inserted += 1;
      } else {
        updated += 1;
      }
      batch.set(docRef, payload, { merge: true });
    });
    await batch.commit();
  }

  showToast(`Thêm từ hoàn tất: ${inserted} mới, ${updated} đã cập nhật.`, 'success');
  return { inserted, updated };
}

export { normalizeEntry };
