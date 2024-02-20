
//multer format allowed to use when enter the file in the postman 

export const multerFormatAllowed = {
    Text: ['doc', 'docx', 'odt', 'pages', 'rtf', 'txt', 'wpd', 'wps'],
    Spreadsheet: ['csv', 'numbers', 'ods', 'xls', 'xlsx'],
    Webrelated: ['asp', 'aspx', 'css', 'htm', 'html', 'jsp', 'php', 'xml'],
    Image: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'raw', 'tif', 'tiff'],
    Audio: ['aif', 'mov', 'mp3', 'mp4', 'mpg', 'wav', 'wma', 'wmv'],
    video: ['aif', 'mov', 'mp3', 'mp4', 'mpg', 'wav', 'wma', 'wmv'],
    application: ['pdf']
}