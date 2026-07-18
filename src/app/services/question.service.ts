import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question, QuestionVo } from '../model/question.model';
import { ImportError } from '../model/import-errors.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getAllQuestion(): Observable<Question[]> {
    return this.http.get<Question[]>(environment.apiUrl + '/questions');
  }

  insertQuestion(newQuestion: QuestionVo, musicFile: File | null): Observable<Question[]> {
    const formData = new FormData();
    formData.append('question', JSON.stringify(newQuestion));
    if (musicFile) {
      formData.append('musicFile', musicFile);
    }
    return this.http.post<Question[]>(environment.apiUrl + '/questions', formData);
  }

  editQuestion(
    idQuestion: number,
    editedQuestion: QuestionVo,
    musicFile: File | null,
  ): Observable<Question[]> {
    const formData = new FormData();
    formData.append('question', JSON.stringify(editedQuestion));
    if (musicFile) {
      formData.append('musicFile', musicFile);
    }
    return this.http.put<Question[]>(environment.apiUrl + `/questions/${idQuestion}`, formData);
  }

  checkImportQuestions(
    csvFileContent: any,
  ): Observable<{ erreurs: ImportError[]; questions: Question[] }> {
    return this.http.post<{ erreurs: ImportError[]; questions: Question[] }>(
      environment.apiUrl + `/questions/import`,
      {
        csvFileContent,
        doImport: false,
      },
    );
  }

  importQuestions(
    csvFileContent: any,
  ): Observable<{ erreurs: ImportError[]; questions: Question[] }> {
    return this.http.post<{ erreurs: ImportError[]; questions: Question[] }>(
      environment.apiUrl + `/questions/import`,
      {
        csvFileContent,
        doImport: true,
      },
    );
  }
}
