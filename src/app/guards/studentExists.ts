import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { StudentService } from "../services/student";

export const studentExists: CanActivateFn = async () => {

    const studentService = inject(StudentService);
    const router = inject(Router);

    if (studentService.studentData() !== null) {
        return true;
    }

    await studentService.loadStudent();

    if(studentService.studentData() !== null) {
        return true;
    }

    router.navigate(['/']);
    return false;

}