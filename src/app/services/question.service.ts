import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { Question, QuestionVo } from '../model/question.model';

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
    return this.http.post<Question[]>(environment.apiUrl + `/questions/${idQuestion}`, formData);
  }
}
