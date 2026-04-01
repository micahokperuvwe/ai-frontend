<template>
  <div class="mx-auto max-w-4xl p-6">
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-3xl font-bold text-slate-900">Agent AI</h1>
      <p class="mt-2 text-sm text-slate-600">
        This agent can use browser-safe permissions: microphone access and files you explicitly choose.
        Websites cannot silently control installed apps or your full computer storage.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Give The Agent Context</h2>

        <div class="mt-4 space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Task</label>
            <textarea
              v-model="task"
              rows="5"
              placeholder="Example: Summarize the attached file and create action points."
              class="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Voice Notes</label>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                @click="requestMicrophoneAccess"
                class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                {{ microphoneGranted ? 'Microphone Ready' : 'Allow Microphone' }}
              </button>
              <button
                v-if="speechRecognitionSupported"
                type="button"
                @click="toggleListening"
                :disabled="!microphoneGranted"
                class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                {{ isListening ? 'Stop Listening' : 'Start Voice Input' }}
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              {{ microphoneStatus }}
            </p>
            <textarea
              v-model="voiceTranscript"
              rows="4"
              placeholder="Voice transcript will appear here."
              class="mt-3 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Files</label>
            <div class="flex flex-wrap gap-3">
              <input
                type="file"
                multiple
                accept=".txt,.md,.json,.csv,.log,.pdf,.docx,image/*"
                @change="handleFiles"
                class="block w-full max-w-xl text-sm text-slate-700"
              />
              <button
                v-if="desktopBridgeAvailable"
                type="button"
                @click="pickDesktopFiles"
                class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Pick Files From Desktop
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              For security, websites can only access files you explicitly pick. The agent can read text, images, PDF, and DOCX files.
            </p>
            <div v-if="selectedFiles.length" class="mt-3 space-y-2">
              <div
                v-for="file in selectedFiles"
                :key="file.name"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div class="text-sm font-medium text-slate-800">{{ file.name }}</div>
                <div class="mt-1 text-xs text-slate-500">{{ file.preview }}</div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Camera</label>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                @click="toggleCamera"
                class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white"
              >
                {{ cameraActive ? 'Stop Camera' : 'Allow Camera' }}
              </button>
              <button
                type="button"
                @click="captureImage"
                :disabled="!cameraActive"
                class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                Capture Image
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-500">{{ cameraStatus }}</p>

            <div v-if="cameraActive" class="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
              <video ref="videoRef" autoplay playsinline muted class="h-64 w-full object-cover"></video>
            </div>

            <div v-if="imageAttachments.length" class="mt-3 grid gap-3 sm:grid-cols-2">
              <div
                v-for="image in imageAttachments"
                :key="image.id"
                class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img :src="image.dataUrl" :alt="image.name" class="h-40 w-full object-cover" />
                <div class="p-3">
                  <div class="text-sm font-medium text-slate-800">{{ image.name }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ image.mediaType }}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="runAgentTask"
            :disabled="loading || !canSubmit"
            class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {{ loading ? 'Agent working...' : 'Run Agent Task' }}
          </button>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Permission Status</h2>

        <div class="mt-4 space-y-3 text-sm">
          <div class="rounded-xl border border-slate-200 px-4 py-3">
            <div class="font-medium text-slate-800">Microphone</div>
            <div class="mt-1 text-slate-600">{{ microphoneGranted ? 'Granted' : 'Not granted' }}</div>
          </div>
          <div class="rounded-xl border border-slate-200 px-4 py-3">
            <div class="font-medium text-slate-800">Selected Files</div>
            <div class="mt-1 text-slate-600">{{ selectedFiles.length }} file(s) attached</div>
          </div>
          <div class="rounded-xl border border-slate-200 px-4 py-3">
            <div class="font-medium text-slate-800">Images</div>
            <div class="mt-1 text-slate-600">{{ imageAttachments.length }} image(s) attached</div>
          </div>
          <div class="rounded-xl border border-slate-200 px-4 py-3">
            <div class="font-medium text-slate-800">Desktop Bridge</div>
            <div class="mt-1 text-slate-600">{{ desktopBridgeAvailable ? 'Available' : 'Browser mode only' }}</div>
          </div>
          <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
            Installed apps and unrestricted storage access are not available from a normal website.
            If you want true system-level agent access, we should convert this to a desktop app like Electron or Tauri.
          </div>
        </div>
      </section>
    </div>

    <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Agent Output</h2>
      <div class="mt-4 space-y-4">
        <div v-for="(entry, index) in logs" :key="index" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="text-sm font-semibold text-slate-700">Task</div>
          <div class="mt-1 whitespace-pre-wrap text-slate-800">{{ entry.task }}</div>

          <div class="mt-4 text-sm font-semibold text-slate-700">Response</div>
          <div class="mt-1 whitespace-pre-wrap text-slate-800">{{ entry.output }}</div>

          <div v-if="entry.source" class="mt-3 text-xs text-slate-500">
            Source: {{ entry.source }}
          </div>
        </div>

        <div v-if="!logs.length" class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Run a task and the result will appear here.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, onBeforeUnmount, ref } from 'vue';
import { parseDocxFile, parsePdfFile } from '../../utils/documentParsers';

type AgentLog = {
  task: string;
  output: string;
  source?: string;
};

type SelectedFile = {
  name: string;
  content: string;
  preview: string;
};

type ImageAttachment = {
  id: string;
  name: string;
  mediaType: string;
  dataUrl: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type DesktopPickedFile = {
  path: string;
  name: string;
  extension: string;
  dataBase64: string;
};

type DesktopBridge = {
  isDesktop: boolean;
  pickFiles: () => Promise<DesktopPickedFile[]>;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    agentDesktop?: DesktopBridge;
  }
}

const task = ref('');
const voiceTranscript = ref('');
const logs = ref<AgentLog[]>([]);
const loading = ref(false);
const microphoneGranted = ref(false);
const microphoneStatus = ref('Microphone permission has not been requested yet.');
const selectedFiles = ref<SelectedFile[]>([]);
const imageAttachments = ref<ImageAttachment[]>([]);
const isListening = ref(false);
const cameraActive = ref(false);
const cameraStatus = ref('Camera permission has not been requested yet.');
const videoRef = ref<HTMLVideoElement | null>(null);
let cameraStream: MediaStream | null = null;
const desktopBridgeAvailable = Boolean(window.agentDesktop?.isDesktop);

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognitionSupported = !!SpeechRecognitionCtor;
let recognition: BrowserSpeechRecognition | null = null;

const canSubmit = computed(() =>
  Boolean(task.value.trim() || voiceTranscript.value.trim() || selectedFiles.value.length || imageAttachments.value.length)
);

const requestMicrophoneAccess = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    microphoneStatus.value = 'This browser does not support microphone access.';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphoneGranted.value = true;
    microphoneStatus.value = 'Microphone permission granted.';
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    microphoneGranted.value = false;
    microphoneStatus.value = 'Microphone permission was denied.';
  }
};

const createRecognition = () => {
  if (!SpeechRecognitionCtor) return null;

  const instance = new SpeechRecognitionCtor();
  instance.continuous = true;
  instance.interimResults = true;
  instance.lang = 'en-US';

  instance.onresult = (event: any) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript;
    }
    voiceTranscript.value = transcript.trim();
  };

  instance.onerror = () => {
    microphoneStatus.value = 'Voice recognition ran into an error.';
    isListening.value = false;
  };

  instance.onend = () => {
    isListening.value = false;
  };

  return instance;
};

const toggleListening = async () => {
  if (!speechRecognitionSupported) {
    microphoneStatus.value = 'Speech recognition is not supported in this browser.';
    return;
  }

  if (!microphoneGranted.value) {
    await requestMicrophoneAccess();
    if (!microphoneGranted.value) return;
  }

  if (!recognition) {
    recognition = createRecognition();
  }

  if (!recognition) return;

  if (isListening.value) {
    recognition.stop();
    isListening.value = false;
    return;
  }

  recognition.start();
  isListening.value = true;
  microphoneStatus.value = 'Listening for voice input...';
};

const handleFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  const textFiles = files.filter((file) => !file.type.startsWith('image/'));
  const imageFiles = files.filter((file) => file.type.startsWith('image/'));

  selectedFiles.value = await Promise.all(
    textFiles.map(async (file) => {
      const content = await readDocumentFile(file);
      return {
        name: file.name,
        content,
        preview: content.slice(0, 180) + (content.length > 180 ? '...' : '')
      };
    })
  );

  const uploadedImages = await Promise.all(
    imageFiles.map(async (file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      mediaType: file.type || 'image/png',
      dataUrl: await readFileAsDataUrl(file)
    }))
  );

  imageAttachments.value = [...imageAttachments.value, ...uploadedImages];
};

const convertDesktopFile = async (file: DesktopPickedFile) => {
  const extension = file.extension.toLowerCase();
  const mimeType = getMimeTypeFromExtension(extension);
  const dataUrl = `data:${mimeType};base64,${file.dataBase64}`;

  if (mimeType.startsWith('image/')) {
    imageAttachments.value = [
      ...imageAttachments.value,
      {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        mediaType: mimeType,
        dataUrl
      }
    ];
    return;
  }

  const browserFile = dataUrlToFile(dataUrl, file.name, mimeType);
  const content = await readDocumentFile(browserFile);
  selectedFiles.value = [
    ...selectedFiles.value,
    {
      name: file.name,
      content,
      preview: content.slice(0, 180) + (content.length > 180 ? '...' : '')
    }
  ];
};

const pickDesktopFiles = async () => {
  if (!window.agentDesktop) return;

  const files = await window.agentDesktop.pickFiles();
  for (const file of files) {
    await convertDesktopFile(file);
  }
};

const dataUrlToFile = (dataUrl: string, fileName: string, mimeType: string) => {
  const base64 = dataUrl.split(',')[1] || '';
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new File([bytes], fileName, { type: mimeType });
};

const getMimeTypeFromExtension = (extension: string) => {
  const map: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    csv: 'text/csv',
    log: 'text/plain',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
  };

  return map[extension] || 'application/octet-stream';
};

const readDocumentFile = async (file: File): Promise<string> => {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.pdf')) {
    return parsePdfFile(file);
  }

  if (lowerName.endsWith('.docx')) {
    return parseDocxFile(file);
  }

  return file.text();
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });

const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraActive.value = false;
};

const toggleCamera = async () => {
  if (cameraActive.value) {
    stopCamera();
    cameraStatus.value = 'Camera stopped.';
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatus.value = 'This browser does not support camera access.';
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraActive.value = true;
    cameraStatus.value = 'Camera permission granted.';
    if (videoRef.value) {
      videoRef.value.srcObject = cameraStream;
    }
  } catch (error) {
    cameraStatus.value = 'Camera permission was denied.';
    cameraActive.value = false;
  }
};

const captureImage = () => {
  if (!videoRef.value) return;

  const video = videoRef.value;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/png');
  imageAttachments.value.unshift({
    id: `camera-${Date.now()}`,
    name: `camera-capture-${new Date().toISOString()}.png`,
    mediaType: 'image/png',
    dataUrl
  });
  cameraStatus.value = 'Image captured from camera.';
};

const buildPrompt = () => {
  const sections = [];

  if (task.value.trim()) {
    sections.push(`User task:\n${task.value.trim()}`);
  }

  if (voiceTranscript.value.trim()) {
    sections.push(`Voice transcript:\n${voiceTranscript.value.trim()}`);
  }

  if (selectedFiles.value.length) {
    const fileBlock = selectedFiles.value
      .map((file) => `File: ${file.name}\n${file.content}`)
      .join('\n\n');
    sections.push(`Attached file contents:\n${fileBlock}`);
  }

  if (imageAttachments.value.length) {
    const imageBlock = imageAttachments.value
      .map((image) => `Image attached: ${image.name}`)
      .join('\n');
    sections.push(`Attached images:\n${imageBlock}`);
  }

  sections.push('Solve the user request using the provided context. If permissions are limited by the browser, explain the limitation clearly and continue with the available information.');

  return sections.join('\n\n');
};

const runAgentTask = async () => {
  const prompt = buildPrompt();
  logs.value.unshift({ task: prompt, output: 'Working...' });
  const entry = logs.value[0];
  if (!entry) {
    return;
  }
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/ai/chat',
      {
        message: prompt,
        attachments: imageAttachments.value.map((image) => ({
          type: 'image',
          name: image.name,
          mediaType: image.mediaType,
          dataUrl: image.dataUrl
        }))
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    entry.output = response.data.response;
    entry.source = response.data.source;
  } catch (error: any) {
    entry.output = error.response?.data?.msg || 'Agent request failed';
  } finally {
    loading.value = false;
  }
};

onBeforeUnmount(() => {
  if (recognition && isListening.value) {
    recognition.stop();
  }
  stopCamera();
});
</script>
