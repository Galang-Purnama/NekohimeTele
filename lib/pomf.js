import axios from 'axios';
import { Blob } from 'formdata-node';

async function Pomf2Uploader(buffer) {
  return new Promise(async (resolve, reject) => {
    // Ambil informasi tipe file dari buffer
    var tipe = await import('file-type');
	var {
		ext,
		mime
	} = await tipe.fileTypeFromBuffer(buffer)
    
    if (!ext || !mime) return reject("File type not supported!");

    let formData = new FormData();
    const blob = new Blob([buffer], { type: mime });
    formData.append("files[]", blob, "image." + ext);

    axios("https://pomf2.lain.la/upload.php", {
      method: "POST",
      data: formData,
      headers: {
        "orgin": "https://pomf2.lain.la",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
        "accept": "/",
        "content-type": `multipart/form-data; boundary=${formData._boundary}`,
      }
    })
    .then(({ data }) => {
      resolve(data.files[0].url);
    })
    .catch(reject);
  });
}

export { Pomf2Uploader };
