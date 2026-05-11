import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student';
@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private studentService = inject(StudentService);

  student = this.studentService.studentData;

  async ngOnInit(): Promise<void> {
    this.studentService.loadStudent();
  }
}