import { GlobalConfig } from 'ngx-toastr';
export class AppConfig {
  static readonly RETRY: number = 0;
  static readonly NAME = 'Marcación';
  static readonly DELAY_BETWEEN_SCAN_SUCCESS_IN_MILLISECONDS = 1500;
  static readonly MAX_FECHA_NACIMIENTO = new Date();
  static TOAST_CONFIG: Partial<GlobalConfig> = {
    countDuplicates: true,
    preventDuplicates: true,
    resetTimeoutOnDuplicate: true,
    tapToDismiss: true,
    progressBar: true,
  };
}
