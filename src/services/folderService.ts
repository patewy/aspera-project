// src/services/folderService.ts

const API_BASE_URL = 'http://localhost:8085';

// ------------------------------------------------
// Функции для получения токена и userId из localStorage
// ------------------------------------------------
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const getCurrentUserId = (): string | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    const user = JSON.parse(userJson);
    // Предполагаем, что в ответе от /auth/login приходит поле id
    // Если у тебя там другое поле (например, userId, uuid и т.д.) — подправь ниже
    return user.id || user.userId || user.uuid || null;
  } catch (e) {
    console.error("Ошибка парсинга пользователя из localStorage - folderService.ts:22", e);
    return null;
  }
};

// ------------------------------------------------
// Формирование заголовков с актуальным токеном
// ------------------------------------------------
export const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Нет JWT токена. Пользователь не авторизован.");
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`, // на всякий случай убираем префикс, если он уже есть
  };
};

// Интерфейс папки с бэкенда
export interface BackendFolder {
  id: string;
  name: string;
  icon?: string;
  isPublic: boolean;
  userId: string;
}

// Преобразование в формат дерева (если используешь)
export const transformToNode = (folder: BackendFolder, defaultIcon: string = "📁") => ({
  id: folder.id,
  name: folder.name,
  notes: 0,
  icon: folder.icon || defaultIcon,
});

// ------------------------------------------------
// API для папок — теперь работает с текущим пользователем
// ------------------------------------------------
export async function fetchAllFolders(): Promise<BackendFolder[]> {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Не удалось определить ID пользователя. Возможно, вы не вошли в систему.");
  }

  const url = `${API_BASE_URL}/api/folders/user/${userId}`;
  
  console.log(`Запрос папок для пользователя ${userId}: GET ${url} - folderService.ts:70`);

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка загрузки папок: ${response.status} ${response.statusText}. ${errorText}`);
  }

  return response.json();
}

export async function createFolder(name: string): Promise<BackendFolder> {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Не удалось определить ID пользователя для создания папки.");
  }

  // Убедись, что userId передается бэкенду
  const dto = { 
    name, 
    userId, // Передаем ID текущего юзера
    icon: "📁" // Можно добавить иконку по умолчанию
  };

  const response = await fetch(`${API_BASE_URL}/api/folders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка создания папки: ${response.status}. ${errorText}`);
  }

  return response.json();
}

export async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка удаления папки: ${response.status}. ${errorText}`);
  }
}