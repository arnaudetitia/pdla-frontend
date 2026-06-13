import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { Question } from '../model/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getAllQuestion(): Observable<Question[]> {
    return this.http.get<Question[]>(environment.apiUrl + '/questions');
  }
}
