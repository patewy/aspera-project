// src/services/noteService.ts

import { getHeaders } from './folderService'; 

const API_BASE_URL = 'http://localhost:8085/api/notes';

// Интерфейс для конспекта (должен соответствовать NoteResponseDTO)
export interface Note {
    id: string;
    title: string;
    content: string;
    folderIds: string[]; 
    description?: string;
    isPublic: boolean;
    tagIds: string[]; 
    lastAccessed?: number; // Добавлено для фронтенда
}

// Интерфейс для DTO (должен соответствовать NoteRequestDTO)
export interface NoteRequestDTO {
    title: string;
    content: string;
    folderIds: string[]; 
    isPublic: boolean;
    tagIds: string[]; 
    userId: string; 
}


// ------------------------------------------------
// 1. ЗАГРУЗКА ВСЕХ КОНСПЕКТОВ (GET /api/notes)
// ------------------------------------------------
export async function fetchAllNotes(userId: string): Promise<Note[]> {
    const API_BASE_URL = 'http://localhost:8085/api/notes';
    const url = `${API_BASE_URL}/user/${userId}`; 
    
    console.log(`Запрос конспектов: GET ${url} - noteService.ts:37`);
    
    const response = await fetch(url, {
        method: 'GET', 
        headers: getHeaders(),
    });

    if (!response.ok) {
        // Улучшенная обработка ошибок (401, 403, 500)
        let errorMessage = `Ошибка при загрузке конспектов: ${response.status} ${response.statusText}`;
        try {
            const errorBody = await response.text();
            errorMessage += `\nТело ответа сервера: ${errorBody.substring(0, 300)}...`;
        } catch (e) {
            errorMessage += "\nНе удалось прочитать тело ответа сервера.";
        }
        throw new Error(errorMessage);
    }
    
    const notesData = await response.json();
    
    // 🛑 КРИТИЧЕСКИЙ ВЫВОД: Что вернул бэкенд?
    console.log("Полученные конспекты от бэкенда (notesData): - noteService.ts:59", notesData); 
    
    if (!Array.isArray(notesData)) {
        console.error("Бэкенд вернул не массив, а: - noteService.ts:62", notesData);
        // Возвращаем пустой массив, чтобы не сломать фронтенд
        return []; 
    }
    
    // Если notesData - это пустой массив [], то отображаться ничего не будет.
    // Если notesData - это массив, он будет преобразован и отображен.

    return notesData.map((note: any) => ({
        ...note,
        lastAccessed: note.lastAccessed || Date.now(), 
    }));
}


// ------------------------------------------------
// 2. СОЗДАНИЕ КОНСПЕКТА (POST /api/notes)
// ------------------------------------------------
export async function createNoteAPI(dto: NoteRequestDTO): Promise<Note> {
    const response = await fetch(API_BASE_URL, {
        method: 'POST', 
        headers: getHeaders(), 
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        // Улучшенная диагностика 500 ошибки
        let errorMessage = `Ошибка при создании конспекта: ${response.status} ${response.statusText}`;
        try {
            const errorBody = await response.text();
            errorMessage += `\nТело ответа сервера: ${errorBody.substring(0, 300)}...`;
        } catch (e) {
            errorMessage += "\nНе удалось прочитать тело ответа сервера.";
        }
        throw new Error(errorMessage); 
    }
    
    return response.json(); 
}

// ------------------------------------------------
// 3. ОБНОВЛЕНИЕ КОНСПЕКТА (PUT /api/notes/{id})
// ------------------------------------------------
export async function updateNoteAPI(noteId: string, dto: NoteRequestDTO): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
        method: 'PUT', 
        headers: getHeaders(), 
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error(`Ошибка при обновлении конспекта: ${response.status} ${response.statusText}`);
    }
    return response.json(); 
}

// ------------------------------------------------
// 4. УДАЛЕНИЕ КОНСПЕКТА (DELETE /api/notes/{id})
// ------------------------------------------------
export async function deleteNoteAPI(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Ошибка при удалении конспекта ${id}: ${response.status} ${response.statusText}`);
    }
}