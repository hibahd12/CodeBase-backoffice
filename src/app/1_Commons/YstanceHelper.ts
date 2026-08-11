import Swal from 'sweetalert2';

export class YstanceHelper {

    static getDistinctArrayObjects(arrayObjects: any, distinctProperty: string) {
        let distinctArray = arrayObjects.filter((obj : any, i : any, arr : any) => arr.findIndex((t: { [x: string]: any; }) => t[distinctProperty] === obj[distinctProperty]) === i);
        return distinctArray;
    }

    static getPropertyValues(arrayObjects: any, property: string) {
        let arrayData = arrayObjects.map(function (obj : any) { return obj[property]; });
        return arrayData;
    }

    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static notify(title: string, text: string, icon: any, timer: number, showLoading?: boolean) {
        if (timer) {
            Swal.fire({ title: title, text: text, icon: icon, timer: timer, position: 'top',  showConfirmButton: false , toast: true});
        } else {
            Swal.fire({ title: title, text: text, icon: icon , position: 'top', showConfirmButton: false});
        }
        if (showLoading) {
            // Swal.showLoading();
        }
    }

    static onErrorResponse = (error: any) => {
        console.log(error);
        Swal.fire({ icon: 'error', text: 'An error occurred. Please check the log for more details.' });
    }
}