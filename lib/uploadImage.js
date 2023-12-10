import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';

/**
 * Upload image to telegra.ph
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
export default async buffer => {
  var tipe = await import('file-type');
	var {
		ext,
		mime
	} = await tipe.fileTypeFromBuffer(buffer)
  let form = new FormData()
  const blob = new Blob([Buffer.from(buffer)], { type: mime });
  form.append('file', blob, 'tmp.' + ext)
  let res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })
  let img = await res.json()
  if (img.error) throw img.error
  return 'https://telegra.ph' + img[0].src
}
