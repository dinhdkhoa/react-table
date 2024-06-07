export interface FileRequestModel {
    fileName: string,
    fileType: string,
    efileClassCode: string,
    content?: string,
  }

export const prepareFileData = (file: File, query: any): Promise<FileRequestModel> => {
    return new Promise((resolve, reject) => {
      //convert file data to base64
      const fileData: FileRequestModel = {
        fileName: file.name,
        efileClassCode: query.efileClassCode,
        fileType: file.name.split('.').pop() || '',
      };
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        //remove data url
        fileData.content = String(reader.result).split(',').pop()
        resolve(fileData);
      };
  
      reader.onerror = function (error) {
        reject(error);
      };
    });
  };
  