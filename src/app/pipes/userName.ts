import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'userName',
    standalone: true
})
export class UserNamePipe implements PipeTransform{
    transform (value: string): string {
        
        if(value === null || value === undefined) return '';
    
        return value.slice(0, value.indexOf('@')); 
    }
}