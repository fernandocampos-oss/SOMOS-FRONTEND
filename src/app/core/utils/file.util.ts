export class FileUtil {
  static openInNewTab(data: Blob) {
    data.arrayBuffer().then((response) => {
      const blob = new Blob([response], { type: data.type });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
  static download(data: Blob, fileName: string) {
    data.arrayBuffer().then((response) => {
      const blob = new Blob([response], { type: data.type });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = fileName;
      link.click();
    });
  }
}
